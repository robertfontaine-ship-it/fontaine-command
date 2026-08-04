const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4186;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/startup-street.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Startup Street QA server did not start.");
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

async function runStartupStreetFlow(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    permissions: ["clipboard-read", "clipboard-write"]
  });
  await context.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
  const page = await context.newPage();
  const errors = collectErrors(page);

  await page.goto(`${BASE}/startup-street.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });

  assert.equal(await page.locator(".mission-card").count(), 12, "Startup Street shows twelve missions");
  assert.equal(await page.locator(".startup-map article").count(), 8, "Startup Street shows eight venture-building locations");
  assert.equal(await page.locator('[data-mission-id^="SS-"]').count(), 12);
  await assertNoOverflow(page, "Startup Street mobile");

  await page.locator('[data-mission-id="SS-01"]').click();
  await page.locator("#studentFirst").fill("Mia");
  await page.locator("#studentLast").fill("M");
  await page.locator("#studentPeriod").selectOption("3");
  const responses = page.locator("[data-response]");
  for (let index = 0; index < await responses.count(); index += 1) {
    await responses.nth(index).fill(`Specific customer, observed problem, evidence, measurable consequence, and next founder decision for Startup Street response ${index + 1}.`);
  }
  await page.locator("#integrityCheck").check();
  await page.getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  assert.match(await page.locator("#receiptCard").innerText(), /Problem Spotter/i);
  const saved = await page.evaluate(() => window.FontaineMissionStore.getTopicCompletions("startup-street")["SS-01"]);
  assert.equal(saved.title, "Problem Spotter");
  assert.equal(saved.entries, 1);

  await page.goto(`${BASE}/mission-control.html`, { waitUntil: "load" });
  assert.match(await page.locator("#currentMissionTitle").innerText(), /SS-01 • Startup Street/);
  assert.equal(await page.locator('#currentMissionLink[href="startup-street.html"]').count(), 1);

  await page.goto(`${BASE}/student-mission-id.html`, { waitUntil: "load" });
  assert.equal(await page.locator(".topic-progress-card").count(), 11, "Mission ID shows nine marketing departments, Startup Street, and Agency");
  const progress = await page.locator("#topicProgress").innerText();
  assert.match(progress, /Startup Street[\s\S]*1 mission completed/i);
  const badges = await page.locator("#badgeGrid").innerText();
  assert.match(badges, /Founder[\s\S]*Unlocked/i);

  await page.goto(`${BASE}/business-world.html`, { waitUntil: "load" });
  await page.locator('a[href="startup-street.html"]').first().waitFor({ state: "visible" });
  assert.match(await page.locator(".status-tag.open").first().innerText(), /11 locations live/i);
  assert.equal(await page.locator('a.city-building[href="startup-street.html"]').count(), 1);
  await page.locator('[data-nav="passport"]').click();
  await page.locator('[data-startup-street-card]').waitFor({ state: "visible" });
  assert.match(await page.locator('[data-startup-street-card]').innerText(), /1 mission completed[\s\S]*Stamped/i);
  await page.locator('[data-nav="achievements"]').click();
  await page.getByRole("heading", { name: "Founder" }).waitFor({ state: "visible" });
  const founderCard = page.getByRole("heading", { name: "Founder" }).locator("..");
  assert.match(await founderCard.innerText(), /Earned/i);
  await assertNoOverflow(page, "Business World with Startup Street mobile");

  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS Startup Street mission, receipt, Mission Control, Mission ID, Passport, achievements, and mobile City Hall integration");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    await runStartupStreetFlow(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Startup Street browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
