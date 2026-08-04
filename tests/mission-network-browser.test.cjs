const assert = require("node:assert/strict");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4176;
const BASE = `http://127.0.0.1:${PORT}`;
const PROFILE_KEY = "fontaineMissionData:v2";

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/branding-hub.html`);
      if (response.ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Mission Network test server did not start.");
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
}

async function runRecoveryAndTransfer(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

  await page.goto(`${BASE}/branding-hub.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.locator('[data-mission-id="BR-01"]').click();
  await page.locator("#studentFirst").fill("Alex");
  await page.locator("#studentLast").fill("A");
  await page.locator("#studentPeriod").selectOption("1");
  const responses = [
    "Nike uses its swoosh, bold athlete photography, and short motivational headlines.",
    "The brand feels confident, competitive, and energetic because its messages focus on action and achievement.",
    "The primary customer is an active teen or adult who connects sports performance with personal identity."
  ];
  await page.locator("[data-prompt-index=\"0\"]").fill(responses[0]);
  await page.waitForTimeout(550);
  assert.match(await page.locator("[data-draft-status]").innerText(), /All changes saved/i);
  await page.locator(".modal-close").click();

  await page.locator('[data-mission-id="BR-01"]').click();
  assert.equal(await page.locator("[data-prompt-index=\"0\"]").inputValue(), responses[0]);
  assert.match(await page.locator("[data-draft-status]").innerText(), /Recovered autosaved work/i);
  await page.locator("[data-prompt-index=\"1\"]").fill(responses[1]);
  await page.locator("[data-prompt-index=\"2\"]").fill(responses[2]);
  await page.locator("#integrityCheck").check();
  await page.locator("#missionForm").getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  const storedAfterSubmit = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), PROFILE_KEY);
  const alexRecord = storedAfterSubmit.profiles[storedAfterSubmit.activeProfileKey];
  assert.equal(Object.keys(alexRecord.drafts || {}).length, 0, "submitted mission clears its draft");
  assert.equal(alexRecord.topics.branding.weeks[Object.keys(alexRecord.topics.branding.weeks)[0]].completions["BR-01"].responses[0], responses[0]);

  await page.goto(`${BASE}/student-mission-id.html`, { waitUntil: "load" });
  assert.match(await page.locator("#studentName").innerText(), /Alex A\./);
  assert.equal(await page.locator("#missionsTotal").innerText(), "1");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#exportMissionProfile").click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  assert.ok(backupPath && fs.existsSync(backupPath), "profile backup downloads");
  const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  assert.equal(backup.format, "fontaine-mission-profile");
  assert.equal(backup.profile.first, "Alex");
  assert.equal(Object.keys(backup.missionData.topics).length, 1);

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await page.locator("#importMissionProfile").setInputFiles(backupPath);
  await page.locator("#profileTransferStatus").waitFor({ state: "visible" });
  assert.match(await page.locator("#profileTransferStatus").innerText(), /Progress restored for Alex A\./i);
  assert.match(await page.locator("#studentName").innerText(), /Alex A\./);
  assert.equal(await page.locator("#missionsTotal").innerText(), "1");

  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(() => {
    localStorage.setItem("fontaineTopicHubAdmin:v1", JSON.stringify({ ledgers: { keep: [{ name: "Alex" }] } }));
    localStorage.setItem("fontaineMissionReviewQueue:v1", JSON.stringify([{ receiptCode: "KEEP-ME" }]));
  });
  await page.locator(".nav button", { hasText: "Topic Hubs" }).click();
  assert.match(await page.locator(".topic-device-manager").innerText(), /1 saved profile/i);
  page.once("dialog", dialog => dialog.accept("RESET STUDENT DEVICE"));
  await page.getByRole("button", { name: "Reset all student data" }).click();
  assert.match(await page.locator(".topic-device-manager").innerText(), /0 saved profiles/i);
  const preserved = await page.evaluate(() => ({
    profiles: window.FontaineMissionStore.listProfiles().length,
    admin: Boolean(localStorage.getItem("fontaineTopicHubAdmin:v1")),
    queue: Boolean(localStorage.getItem("fontaineMissionReviewQueue:v1"))
  }));
  assert.deepEqual(preserved, { profiles: 0, admin: true, queue: true });
  assert.deepEqual(errors, [], `Mission recovery flow emitted browser errors:\n${errors.join("\n")}`);
  await context.close();
  console.log("PASS Mission autosave, recovery, backup, restore, and teacher reset");
}

async function runResponsiveQA(browser) {
  const viewports = [
    { name: "Desktop", width: 1440, height: 900, touch: false },
    { name: "iPhone", width: 390, height: 844, touch: true },
    { name: "iPad", width: 768, height: 1024, touch: true }
  ];
  const pages = [
    "mission-control.html",
    "topic-hubs.html",
    "branding-hub.html",
    "target-market-hub.html",
    "market-research-hub.html",
    "wolverine-agency.html",
    "student-mission-id.html"
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.width < 600,
      hasTouch: viewport.touch
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
    page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    for (const route of pages) {
      await page.goto(`${BASE}/${route}`, { waitUntil: "load" });
      await assertNoOverflow(page, `${viewport.name} ${route}`);
      if (viewport.touch) {
        const shortTargets = await page.locator(".mission-button, .filter-button, .mission-nav a, .mission-subnav a, .modal-close").evaluateAll(elements => elements
          .filter(element => getComputedStyle(element).display !== "none")
          .map(element => ({ text: element.textContent.trim(), height: element.getBoundingClientRect().height }))
          .filter(item => item.height > 0 && item.height < 43));
        assert.deepEqual(shortTargets, [], `${viewport.name} ${route}: touch targets below 44px`);
      }
    }
    assert.deepEqual(errors, [], `${viewport.name}: browser errors\n${errors.join("\n")}`);
    await context.close();
    console.log(`PASS ${viewport.name}: Mission Network responsive layout and touch controls`);
  }
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    await runRecoveryAndTransfer(browser);
    await runResponsiveQA(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Mission Network browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
