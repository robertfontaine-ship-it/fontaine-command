const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4183;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/mission-classroom-kit.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Mission expansion QA server did not start.");
}

function errorsFor(page) {
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  return errors;
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: horizontal overflow ${dimensions.scrollWidth} > ${dimensions.clientWidth}`);
}

async function runClassroomKit(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.goto(`${BASE}/mission-classroom-kit.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });

  await page.locator("#cardPeriod").selectOption("3");
  await page.locator("#cardDestination").selectOption("market-research-hub.html");
  await page.locator("#cardMissionCode").fill("MR-02");
  await page.locator("#cardRoster").fill("Mia Martinez\nLee, Jordan");
  await page.getByRole("button", { name: "Generate check-in cards" }).click();
  assert.equal(await page.locator(".checkin-card").count(), 2);
  assert.match(await page.locator(".checkin-card").nth(0).innerText(), /Mia M\./);
  assert.match(await page.locator(".checkin-card").nth(1).innerText(), /Jordan L\./);
  assert.match(await page.locator(".checkin-card").nth(0).innerText(), /Market Research Lab/);
  assert.match(await page.locator(".checkin-card").nth(0).innerText(), /MR-02/);
  assert.equal(await page.evaluate(() => localStorage.getItem("fontaineMissionClassroomKit:v1").includes("Mia Martinez")), false, "roster names are not persisted");

  await page.evaluate(() => { window.print = () => { window.__printedTarget = document.body.dataset.printTarget; }; });
  await page.getByRole("button", { name: "Print card sheets" }).click();
  assert.equal(await page.evaluate(() => window.__printedTarget), "cards");

  await page.locator('[data-period-course="3"]').fill("Entrepreneurship");
  await page.locator('[data-period-task="3"]').fill("Complete the customer survey analysis in Canvas.");
  await page.locator("#subMissionAccess").selectOption("assigned");
  await page.locator("#subMission").fill("Market Research Lab → MR-02 Question Repair Shop");
  await page.getByRole("button", { name: "Generate substitute guide" }).click();
  const guide = await page.locator(".sub-guide").innerText();
  assert.match(guide, /Independent Substitute Plan/);
  assert.match(guide, /NO GROUP WORK/);
  assert.match(guide, /Entrepreneurship/);
  assert.match(guide, /customer survey analysis/i);
  assert.match(guide, /Do not approve mission entries/i);
  assert.equal(await page.locator(".sub-guide tbody tr").count(), 7);
  await page.getByRole("button", { name: "Print one-page guide" }).click();
  assert.equal(await page.evaluate(() => window.__printedTarget), "guide");
  assert.deepEqual(errors, []);
  await context.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  const mobilePage = await mobile.newPage();
  const mobileErrors = errorsFor(mobilePage);
  await mobilePage.goto(`${BASE}/mission-classroom-kit.html`, { waitUntil: "load" });
  await assertNoOverflow(mobilePage, "Mission classroom kit mobile");
  const shortControls = await mobilePage.locator("button, .kit-topbar a, input, select").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none")
    .map(element => ({ text: element.textContent.trim() || element.id, height: element.getBoundingClientRect().height }))
    .filter(item => item.height > 0 && item.height < 43));
  assert.deepEqual(shortControls, []);
  assert.deepEqual(mobileErrors, []);
  await mobile.close();
  console.log("PASS printable check-in cards, one-page substitute guide, privacy, and mobile layout");
}

async function runMarketResearch(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, permissions: ["clipboard-read", "clipboard-write"] });
  await context.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  const page = await context.newPage();
  const errors = errorsFor(page);
  await page.goto(`${BASE}/market-research-hub.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });

  assert.equal(await page.locator(".mission-card").count(), 10);
  assert.equal(await page.locator(".mission-subnav").count(), 1);
  await assertNoOverflow(page, "Market Research Lab mobile");
  await page.locator('[data-mission-id="MR-01"]').click();
  await page.locator("#studentFirst").fill("Mia");
  await page.locator("#studentLast").fill("M");
  await page.locator("#studentPeriod").selectOption("3");
  const responses = page.locator("[data-response]");
  for (let index = 0; index < await responses.count(); index += 1) {
    await responses.nth(index).fill(`Specific market research evidence, target-customer reasoning, limitation, and recommendation for response ${index + 1}.`);
  }
  await page.locator("#integrityCheck").check();
  await page.getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  assert.match(await page.locator("#receiptCard").innerText(), /Market Research/);
  assert.equal(await page.locator("#copyReviewPacket").count(), 1);
  const saved = await page.evaluate(() => window.FontaineMissionStore.getTopicCompletions("market-research")["MR-01"]);
  assert.equal(saved.title, "Evidence Sort");
  assert.equal(saved.entries, 1);

  await page.goto(`${BASE}/mission-control.html`, { waitUntil: "load" });
  assert.match(await page.locator("#currentMissionTitle").innerText(), /MR-01 • Market Research Lab/);
  assert.equal(await page.locator('a[href="market-research-hub.html"]').count() > 0, true);
  await page.goto(`${BASE}/business-world.html`, { waitUntil: "load" });
  assert.equal(await page.locator('a[href="market-research-hub.html"]').count() > 0, true);
  assert.match(await page.locator(".status-tag.open").first().innerText(), /10 locations live/i);
  await assertNoOverflow(page, "Business World with Market Research mobile");
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS Market Research mission, receipt, shared progress, Mission Control, and City Hall integration");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    await runClassroomKit(browser);
    await runMarketResearch(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Mission expansion browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
