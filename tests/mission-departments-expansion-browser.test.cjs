const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4184;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const departments = [
  { route: "pricing-strategy-hub.html", topic: "pricing", mission: "PS-01", title: "Price Signal Scan" },
  { route: "distribution-hub.html", topic: "distribution", mission: "DS-01", title: "Channel Trail" },
  { route: "selling-customer-service-hub.html", topic: "service", mission: "SC-01", title: "Feature-to-Benefit Translator" }
];

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/pricing-strategy-hub.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Department expansion QA server did not start.");
}

function collectErrors(page) {
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

async function submitMission(page, department) {
  await page.locator(`[data-mission-id="${department.mission}"]`).click();
  await page.locator("#studentFirst").fill("Mia");
  await page.locator("#studentLast").fill("M");
  await page.locator("#studentPeriod").selectOption("3");
  const responses = page.locator("[data-response]");
  for (let index = 0; index < await responses.count(); index += 1) {
    await responses.nth(index).fill(`Specific target-customer evidence, business reasoning, measurable decision, and risk control for ${department.mission} response ${index + 1}.`);
  }
  await page.locator("#integrityCheck").check();
  await page.getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  assert.match(await page.locator("#receiptCard").innerText(), new RegExp(department.title, "i"));
  const saved = await page.evaluate(({ topic, mission }) => window.FontaineMissionStore.getTopicCompletions(topic)[mission], department);
  assert.equal(saved.title, department.title);
  assert.equal(saved.entries, 1);
}

async function runDepartmentFlow(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    permissions: ["clipboard-read", "clipboard-write"]
  });
  await context.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  const page = await context.newPage();
  const errors = collectErrors(page);

  await page.goto(`${BASE}/${departments[0].route}`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());

  for (const department of departments) {
    await page.goto(`${BASE}/${department.route}`, { waitUntil: "load" });
    assert.equal(await page.locator(".mission-card").count(), 10, `${department.route} has ten missions`);
    assert.equal(await page.locator('.mission-subnav[aria-label="On this page"]').count(), 1);
    await assertNoOverflow(page, department.route);
    const shortTargets = await page.locator(".mission-button, .filter-button, .mission-nav a, .mission-subnav a, .modal-close").evaluateAll(elements => elements
      .filter(element => getComputedStyle(element).display !== "none" && element.getClientRects().length)
      .map(element => ({ text: element.textContent.trim(), height: element.getBoundingClientRect().height }))
      .filter(item => item.height > 0 && item.height < 43));
    assert.deepEqual(shortTargets, [], `${department.route} touch targets meet the 44px standard`);
    await submitMission(page, department);
  }

  await page.getByRole("button", { name: "Copy teacher review packet" }).click();
  const encoded = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(encoded, /^FMN-REVIEW:/);
  const packet = JSON.parse(Buffer.from(encoded.slice("FMN-REVIEW:".length), "base64").toString("utf8"));
  assert.equal(packet.topic, "Selling & Customer Service");
  assert.match(packet.responses[0].prompt, /Step 1: Choose a product or service/i);
  assert.match(packet.responses[0].response, /target-customer evidence/i);

  await page.goto(`${BASE}/student-mission-id.html`, { waitUntil: "load" });
  assert.equal(await page.locator(".topic-progress-card").count(), 12, "Mission ID shows nine departments, Startup Street, WRS Career Center, and Agency");
  const progress = await page.locator("#topicProgress").innerText();
  assert.match(progress, /Pricing Strategy[\s\S]*1 mission completed/i);
  assert.match(progress, /Distribution[\s\S]*1 mission completed/i);
  assert.match(progress, /Selling & Customer Service[\s\S]*1 mission completed/i);

  await page.goto(`${BASE}/mission-control.html`, { waitUntil: "load" });
  assert.match(await page.locator("#currentMissionTitle").innerText(), /SC-01 • Customer Experience Center/);

  await page.goto(`${BASE}/topic-hubs.html`, { waitUntil: "load" });
  assert.equal(await page.locator("#topicGrid .topic-card.live").count(), 9);
  for (const department of departments) {
    assert.equal(await page.locator(`a[href="${department.route}"]`).count() > 0, true, `${department.route} is live in the directory`);
  }

  await page.goto(`${BASE}/business-world.html`, { waitUntil: "load" });
  assert.match(await page.locator(".status-tag.open").first().innerText(), /12 locations live/i);
  for (const department of departments) {
    assert.equal(await page.locator(`a[href="${department.route}"]`).count() > 0, true, `${department.route} is live in City Hall`);
  }
  assert.equal(await page.locator('a[href="wrs-career-center.html"]').count()>0,true,"WRS Career Center is live in City Hall");
  await assertNoOverflow(page, "Business World expanded city mobile");
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS Pricing, Distribution, Customer Experience, prompt-aware review, shared progress, and mobile integration");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    await runDepartmentFlow(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Mission department expansion browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
