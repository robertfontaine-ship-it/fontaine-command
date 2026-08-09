const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4186;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/teacher-launch.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Teacher Launch QA server did not start.");
}

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
}

async function runTeacherLaunch(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

  await page.goto(`${BASE}/teacher-launch.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  assert.equal(await page.title(), "Teacher Launch Center | Fontaine Command");
  assert.equal(await page.locator("[data-launch-check]").count(), 6);
  assert.equal(await page.locator("[data-period-row]").count(), 7);
  assert.equal(await page.locator("#readinessPercent").innerText(), "0%");

  await page.locator('[data-launch-check="student-link"]').check();
  await page.locator('[data-launch-check="orientation"]').check();
  await page.locator('[data-launch-check="periods"]').check();
  assert.equal(await page.locator("#readinessPercent").innerText(), "50%");

  await page.locator('[data-period-course="1"]').selectOption("SEM");
  assert.equal(await page.locator('[data-period-mode="1"]').inputValue(), "orientation");
  await page.locator('[data-period-mode="1"]').selectOption("pathway");
  assert.match(await page.locator("#periodSaveStatus").innerText(), /Period 1 launch lane saved|1 period is configured/);

  await page.locator("#canvasPeriod").selectOption("1");
  await page.locator("#canvasCourse").selectOption("SEM");
  await page.locator("#canvasType").selectOption("pathway");
  const preview = await page.locator("#canvasPreview").innerText();
  assert.match(preview, /Period 1/);
  assert.match(preview, /4 of 5 correct \(80%\)/);
  assert.match(preview, /Attempts are unlimited/);
  assert.match(preview, /SUBMIT IN CANVAS/);
  await page.locator("#copyCanvasDirections").click();
  await page.locator("#launchToast.show").waitFor({ state: "visible" });
  assert.match(await page.locator("#launchToast").innerText(), /Canvas directions copied/);

  await page.reload({ waitUntil: "load" });
  assert.equal(await page.locator("#readinessPercent").innerText(), "50%");
  assert.equal(await page.locator('[data-period-course="1"]').inputValue(), "SEM");
  assert.equal(await page.locator('[data-period-mode="1"]').inputValue(), "pathway");
  assert.equal(await page.locator("#canvasType").inputValue(), "pathway");

  await page.evaluate(() => {
    window.FontaineMissionStore.setActiveProfile({ first: "Alex", last: "A", period: "1" });
    localStorage.setItem("fontaineMissionReviewQueue:v1", JSON.stringify([{ status: "Pending" }, { status: "Approved" }]));
    localStorage.setItem("fontaineTopicHubAdmin:v1", JSON.stringify({ ledgers: { week: [{ entries: 3 }, { entries: 2 }] } }));
  });
  await page.reload({ waitUntil: "load" });
  assert.equal(await page.locator("#savedProfiles").innerText(), "1");
  assert.equal(await page.locator("#pendingReviews").innerText(), "1");
  assert.equal(await page.locator("#approvedEntries").innerText(), "5");
  await noOverflow(page, "Teacher Launch desktop");

  await page.setViewportSize({ width: 390, height: 844 });
  await noOverflow(page, "Teacher Launch phone");
  const shortTargets = await page.locator("a, button, select").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none" && element.getBoundingClientRect().height > 0)
    .map(element => ({ text: element.textContent.trim(), height: element.getBoundingClientRect().height }))
    .filter(item => item.height < 43));
  assert.deepEqual(shortTargets, []);

  await page.goto(`${BASE}/student-orientation.html`, { waitUntil: "load" });
  assert.equal(await page.locator(".orientation-step:not([hidden])").count(), 1);
  assert.equal(await page.locator("#stepCounter").innerText(), "1 of 6");
  await page.locator("#nextStep").click();
  assert.equal(await page.locator("#stepCounter").innerText(), "2 of 6");
  await page.keyboard.press("End");
  assert.equal(await page.locator("#stepCounter").innerText(), "6 of 6");
  assert.equal(await page.getByRole("link", { name: "Create My Mission ID" }).count(), 1);
  assert.equal(await page.getByRole("link", { name: "Enter City Hall" }).count(), 1);
  await noOverflow(page, "Student Orientation phone");

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${BASE}/index.html?launch=reviews#shared-device-manager`, { waitUntil: "load" });
  await page.locator("#shared-device-manager").waitFor({ state: "visible" });
  assert.equal((await page.locator(".topbar h1").innerText()).trim(), "Topic Hubs");

  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  const launchLink = page.locator('[data-teacher-launch-link]');
  assert.equal(await launchLink.innerText(), "Teacher Launch");
  await launchLink.click();
  await page.waitForURL(/teacher-launch\.html$/);

  assert.deepEqual(errors, [], `Teacher Launch browser flow emitted errors:\n${errors.join("\n")}`);
  await context.close();
  console.log("PASS Teacher Launch persistence, Canvas handoff, browser metrics, orientation, mobile, and Teacher Command entry");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath, args: ["--no-sandbox", "--disable-gpu"] } : {}) });
    await runTeacherLaunch(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
})().catch(error => { console.error(error); process.exit(1); });
