const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4181;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/course-pathways.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Course Pathways QA server did not start.");
}

async function answerCheck(page, correctCount) {
  const questions = await page.evaluate(() => window.FontaineCoursePathways.COURSES.sem.stages[0].questions.map(item => ({ id: item.id, answer: item.answer })));
  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const choice = index < correctCount ? question.answer : (question.answer + 1) % 4;
    await page.locator(`input[name="${question.id}"][value="${choice}"]`).check();
  }
}

async function runPathwayFlow(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

  await page.goto(`${BASE}/course-pathways.html?course=sem`, { waitUntil: "load" });
  await page.evaluate(() => {
    localStorage.clear();
    const profile = window.FontaineMissionStore.setActiveProfile({ first: "Alex", last: "A", period: "1" });
    window.FontaineMissionStore.saveCompletion({
      topic: "target-market",
      missionId: "TM-04",
      profile,
      requestedEntries: 2,
      item: { title: "Persona Builder", responses: ["Fan evidence"] }
    });
  });
  await page.reload({ waitUntil: "load" });

  assert.equal(await page.locator('.mission-nav a[aria-current="page"]').innerText(), "Pathways");
  assert.equal(await page.locator(".mission-nav a").count(), 6);
  assert.match(await page.locator("#pathwayIdentity").innerText(), /Alex A\..*Period 1/);
  assert.equal(await page.locator("#stage-sem-fan-intelligence .stage-status").innerText(), "CHECK READY");
  assert.equal(await page.locator("#stage-sem-event-mix .stage-status").innerText(), "LOCKED");

  await page.locator('#stage-sem-fan-intelligence [data-check-stage="sem-fan-intelligence"]').click();
  await answerCheck(page, 3);
  await page.locator("#submitMastery").click();
  await page.locator("#masteryResult").waitFor({ state: "visible" });
  assert.match(await page.locator("#masteryResult").innerText(), /3\/5/);
  assert.match(await page.locator("#masteryResult").innerText(), /need 4\/5 \(80%\)/i);
  assert.equal(await page.locator("#masteryResult .remediation-list li").count(), 2);
  assert.equal(await page.locator("#stage-sem-event-mix .stage-status").innerText(), "LOCKED");
  const failedRecord = await page.evaluate(() => window.FontaineMissionStore.getPathwayProgress().courses.sem.stages["sem-fan-intelligence"]);
  assert.equal(failedRecord.latestPercent, 60);
  assert.equal(failedRecord.passed, false);

  await page.locator('[data-action="retry-check"]').click();
  await answerCheck(page, 4);
  await page.locator("#submitMastery").click();
  assert.match(await page.locator("#masteryResult").innerText(), /4\/5/);
  assert.match(await page.locator("#masteryResult").innerText(), /Gate cleared/i);
  assert.equal(await page.locator("#stage-sem-fan-intelligence .stage-status").innerText(), "MASTERED");
  assert.equal(await page.locator("#stage-sem-event-mix .stage-status").innerText(), "MISSION NEEDED");
  assert.equal(await page.locator("#pathwayProgressText").innerText(), "1 of 6 gates mastered");

  await page.evaluate(() => {
    window.FontaineMissionStore.saveCompletion({
      topic: "four-ps",
      missionId: "4P-07",
      requestedEntries: 2,
      item: { title: "Promotion Mix Builder", responses: ["Integrated event mix"] }
    });
    window.dispatchEvent(new Event("pageshow"));
  });
  assert.equal(await page.locator("#stage-sem-event-mix .stage-status").innerText(), "CHECK READY");

  await page.goto(`${BASE}/mission-control.html`, { waitUntil: "load" });
  assert.equal(await page.locator("#mcPathwayTitle").innerText(), "SEM Pathway");
  assert.match(await page.locator("#mcPathwayMeta").innerText(), /1 of 6 gates mastered/);
  assert.match(await page.locator("#mcPathwayLink").getAttribute("href"), /course-pathways\.html\?course=sem/);

  await page.goto(`${BASE}/student-mission-id.html`, { waitUntil: "load" });
  const semRecord = page.locator(".course-pathway-record").filter({ hasText: "Sports & Entertainment Marketing" });
  assert.match(await semRecord.innerText(), /1\/6 gates/);
  assert.match(await page.locator("#pathwayRecordSummary").innerText(), /1 of 18/);
  assert.equal(await page.locator(".badge-card").filter({ hasText: "Gate Breaker" }).evaluate(element => element.classList.contains("locked")), false);

  await page.evaluate(() => window.FontaineMissionStore.setActiveProfile({ first: "Bob", last: "B", period: "1" }));
  await page.goto(`${BASE}/course-pathways.html?course=sem`, { waitUntil: "load" });
  assert.equal(await page.locator("#pathwayProgressText").innerText(), "0 of 6 gates mastered");
  assert.equal(await page.locator("#stage-sem-fan-intelligence .stage-status").innerText(), "MISSION NEEDED");

  await page.evaluate(() => window.FontaineMissionStore.setActiveProfile({ first: "Alex", last: "A", period: "1" }));
  await page.reload({ waitUntil: "load" });
  assert.equal(await page.locator("#pathwayProgressText").innerText(), "1 of 6 gates mastered");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#stage-sem-fan-intelligence [data-check-stage="sem-fan-intelligence"]').click();
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `mobile overflow ${dimensions.scrollWidth} > ${dimensions.clientWidth}`);
  const shortTargets = await page.locator(".mission-button, .mission-nav a, .mission-subnav a, .question-choice").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none")
    .map(element => ({ text: element.textContent.trim(), height: element.getBoundingClientRect().height }))
    .filter(item => item.height > 0 && item.height < 43));
  assert.deepEqual(shortTargets, []);
  assert.deepEqual(errors, [], `Course pathway flow emitted browser errors:\n${errors.join("\n")}`);
  await context.close();
  console.log("PASS Course Pathways gating, remediation, persistence, isolation, integration, and mobile QA");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath, args: ["--no-sandbox", "--disable-gpu"] } : {}) });
    await runPathwayFlow(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
})().catch(error => { console.error(error); process.exit(1); });
