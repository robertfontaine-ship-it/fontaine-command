const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/branding-hub.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Mission review QA server did not start.");
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
}

function encodedPacket(overrides = {}) {
  const packet = {
    version: 1,
    student: "Bob B.",
    first: "Bob",
    last: "B",
    period: "2",
    topic: "Brand Studio",
    mission: "BR-02 — Slogan Surgery",
    receiptCode: "BR-02-BROWSER-BOB",
    provisionalEntries: 2,
    responses: [
      { step: 1, response: "The current slogan is vague and does not promise a clear customer benefit." },
      { step: 2, response: "The revised slogan gives active teens a specific performance-focused reason to care." }
    ],
    submittedAt: new Date().toISOString(),
    ...overrides
  };
  return `FMN-REVIEW:${Buffer.from(JSON.stringify(packet), "utf8").toString("base64")}`;
}

async function openTeacherQueue(page) {
  await page.goto(BASE, { waitUntil: "load" });
  await page.locator(".nav button", { hasText: "Topic Hubs" }).click();
  await page.locator(".mission-review-queue").waitFor({ state: "visible" });
}

async function applyFilters(page, { period = "All", status = "Pending", search = "", sort = "Newest" } = {}) {
  await page.locator("#missionReviewPeriod").selectOption(period);
  await page.locator("#missionReviewStatus").selectOption({ label: status === "All" ? "All statuses" : status });
  await page.locator("#missionReviewSearch").fill(search);
  await page.locator("#missionReviewSort").selectOption({ label: sort });
  await page.getByRole("button", { name: "Apply filters" }).click();
}

async function runTeacherWorkflow(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    permissions: ["clipboard-read", "clipboard-write"]
  });
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
  const firstDraft = [
    "Nike uses its swoosh, athlete photography, and short motivational headlines.",
    "The brand feels competitive and energetic because its messages focus on action.",
    "The customer is an active teen who connects sports performance with identity."
  ];
  for (let index = 0; index < firstDraft.length; index += 1) {
    await page.locator(`[data-prompt-index="${index}"]`).fill(firstDraft[index]);
  }
  await page.locator("#integrityCheck").check();
  await page.locator("#missionForm").getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  await page.locator("#copyReviewPacket").click();
  await page.waitForFunction(() => document.getElementById("copyReviewPacket")?.textContent.includes("copied"));
  const originalPacket = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(originalPacket, /^FMN-REVIEW:/);

  await openTeacherQueue(page);
  assert.match(await page.locator(".mission-review-queue").innerText(), /0 pending/i);
  await page.locator("#missionReviewPacket").fill(originalPacket);
  await page.getByRole("button", { name: "Import submission" }).click();
  assert.match(await page.locator(".mission-review-queue").innerText(), /1 pending/i);
  assert.match(await page.locator(".mission-review-worklist").innerText(), /Showing 1 of 1 submissions/i);
  await page.locator(".mission-review-evidence").first().click();
  assert.match(await page.locator(".mission-review-responses").innerText(), /active teen/i);
  page.once("dialog", dialog => dialog.accept("Use a named example and explain how the evidence changes the recommendation."));
  await page.getByRole("button", { name: "Return for revision" }).click();
  assert.match(await page.locator(".mission-review-summary").innerText(), /1 returned/i);

  await applyFilters(page, { status: "Revision Requested" });
  assert.match(await page.locator(".mission-review-item").innerText(), /Use a named example/i);
  assert.equal(await page.getByRole("button", { name: "Copy feedback" }).count(), 1);

  await page.goto(`${BASE}/branding-hub.html`, { waitUntil: "load" });
  await page.locator('[data-mission-id="BR-01"]').click();
  const revised = "Nike's Serena Williams campaign is a named example showing how athlete credibility strengthens the recommendation for competitive teens.";
  await page.locator('[data-prompt-index="0"]').fill(revised);
  await page.locator("#integrityCheck").check();
  await page.locator("#missionForm").getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#copyReviewPacket").click();
  await page.waitForFunction(() => document.getElementById("copyReviewPacket")?.textContent.includes("copied"));
  const revisedPacket = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(revisedPacket, /^FMN-REVIEW:/);
  assert.notEqual(revisedPacket, originalPacket);

  await openTeacherQueue(page);
  await page.locator("#missionReviewPacket").fill(revisedPacket);
  await page.getByRole("button", { name: "Import submission" }).click();
  assert.match(await page.locator(".mission-review-item").innerText(), /Revision 1/i);
  await page.locator("#missionReviewPacket").fill(encodedPacket());
  await page.getByRole("button", { name: "Import submission" }).click();
  assert.match(await page.locator(".mission-review-worklist").innerText(), /Showing 2 of 2 submissions/i);

  await applyFilters(page, { period: "1", status: "Pending" });
  assert.match(await page.locator(".mission-review-worklist").innerText(), /Showing 1 of 2 submissions/i);
  assert.match(await page.locator(".mission-review-item").innerText(), /Alex A\./);
  await applyFilters(page, { period: "All", status: "Pending", sort: "Student A–Z" });
  await page.getByRole("button", { name: "Select visible pending" }).click();
  assert.equal(await page.locator(".mission-review-select input:checked").count(), 2);
  assert.match(await page.locator("#missionReviewSelectedCount").innerText(), /2 selected/i);
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Approve selected" }).click();
  assert.match(await page.locator(".mission-review-summary").innerText(), /2 approved/i);
  assert.match(await page.locator(".mission-review-summary").innerText(), /0 pending/i);

  await applyFilters(page, { period: "All", status: "Approved" });
  assert.equal(await page.locator(".mission-review-item").count(), 2);
  const weeklyText = await page.locator(".mission-weekly-report").innerText();
  assert.match(weeklyText, /2\s+participating students/i);
  assert.match(weeklyText, /2\s+mission submissions/i);
  assert.match(weeklyText, /3\s+entries awarded/i);
  assert.match(weeklyText, /Revision cycles/i);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export weekly report" }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /^fontaine-mission-weekly-report-\d{4}-\d{2}-\d{2}\.csv$/);

  await page.getByRole("button", { name: "Draw weighted winner" }).click();
  assert.match(await page.locator(".topic-winner").innerText(), /Current winner:/i);
  await assertNoOverflow(page, "desktop teacher queue");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "load" });
  await page.locator(".nav button", { hasText: "Topic Hubs" }).click();
  await page.locator(".mission-review-queue").waitFor({ state: "visible" });
  await assertNoOverflow(page, "iPhone teacher queue");
  const shortControls = await page.locator(".mission-review-queue button, .mission-review-queue select, .mission-review-queue input:not([type=checkbox]), .mission-review-select").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none" && !element.disabled)
    .map(element => ({ text: element.textContent?.trim() || element.getAttribute("aria-label") || element.tagName, height: element.getBoundingClientRect().height }))
    .filter(item => item.height > 0 && item.height < 43));
  assert.deepEqual(shortControls, [], "teacher queue touch controls remain at least 44px tall");
  assert.deepEqual(errors, [], `Mission review browser errors:\n${errors.join("\n")}`);
  await context.close();
  console.log("PASS copy, return, revision, filters, batch approval, report, drawing, and responsive teacher review");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    const executablePath = [
      chromium.executablePath(),
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      path.resolve(__dirname, "../../browser-runtime-tmp/chromium"),
      "/tmp/chromium"
    ].find(candidate => candidate && fs.existsSync(candidate) && fs.statSync(candidate).size > 0);
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    await runTeacherWorkflow(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Mission review workflow browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
