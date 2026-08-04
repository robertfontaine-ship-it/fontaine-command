const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4178;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/business-world.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Accessibility QA server did not start.");
}

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  return errors;
}

async function assertCurrentNavigation(page, label) {
  assert.equal(await page.locator(".mission-nav").getAttribute("aria-label"), "Primary navigation");
  assert.equal(await page.locator(".mission-nav a").count(), 5);
  assert.equal((await page.locator('.mission-nav a[aria-current="page"]').innerText()).trim(), label);
  assert.equal((await page.locator(".mission-brand strong").innerText()).trim(), "Woodside Business World");
  assert.match(await page.locator(".mission-brand").getAttribute("href"), /business-world\.html$/);
}

async function runShellConsistency(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  const errors = collectErrors(page);
  const routes = [
    ["mission-control.html", "Mission Control", false],
    ["topic-hubs.html", "Departments", true],
    ["branding-hub.html", "Departments", true],
    ["target-market-hub.html", "Departments", true],
    ["four-ps-hub.html", "Departments", true],
    ["marketing-functions-hub.html", "Departments", true],
    ["promotional-mix-hub.html", "Departments", true],
    ["market-research-hub.html", "Departments", true],
    ["wolverine-agency.html", "Agency", true],
    ["student-mission-id.html", "My Mission ID", false]
  ];

  for (const [route, current, hasSubnav] of routes) {
    await page.goto(`${BASE}/${route}`, { waitUntil: "load" });
    assert.equal(await page.locator('.skip-link[href="#main-content"]').count(), 1, `${route} has a skip link`);
    assert.equal(await page.locator('main#main-content[tabindex="-1"]').count(), 1, `${route} has a focusable main landmark`);
    await assertCurrentNavigation(page, current);
    assert.equal(await page.locator('.mission-subnav[aria-label="On this page"]').count(), hasSubnav ? 1 : 0, `${route} contextual navigation`);
  }
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS canonical navigation, skip links, landmarks, and current-page state");
}

async function runMissionDialog(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  const errors = collectErrors(page);
  await page.goto(`${BASE}/branding-hub.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });

  const trigger = page.locator("[data-mission-id]").first();
  await trigger.focus();
  await trigger.click();
  const modal = page.locator("#missionModal");
  await modal.waitFor({ state: "visible" });
  assert.equal(await page.getByRole("dialog").getAttribute("aria-modal"), "true");
  assert.ok(await page.getByRole("dialog").getAttribute("aria-labelledby"));
  assert.ok(await page.getByRole("dialog").getAttribute("aria-describedby"));
  assert.equal(await page.evaluate(() => document.querySelector("main").inert), true);
  assert.equal(await page.evaluate(() => document.querySelector("#missionModal").contains(document.activeElement)), true);

  await page.evaluate(() => {
    const selector = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const modalRoot = document.getElementById("missionModal");
    const items = [...modalRoot.querySelectorAll(selector)].filter(element => getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden" && element.getClientRects().length);
    items.forEach((item, index) => { item.dataset.qaFocus = String(index); });
    items.at(-1).focus();
  });
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.dataset.qaFocus), "0", "Tab wraps inside the dialog");

  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.getElementById("missionModal").hidden);
  await page.waitForTimeout(30);
  assert.equal(await page.evaluate(() => document.querySelector("main").inert), false);
  assert.ok(await page.evaluate(() => document.activeElement.hasAttribute("data-mission-id")), "focus returns to the mission trigger");

  await trigger.click();
  await page.locator("#studentFirst").fill("Alex");
  await page.locator("#studentLast").fill("A");
  await page.locator("#studentPeriod").selectOption("1");
  const responses = page.locator("[data-prompt-index]");
  for (let index = 0; index < await responses.count(); index += 1) {
    await responses.nth(index).fill(`Specific evidence and reasoning for branding response ${index + 1}.`);
  }
  await page.locator("#integrityCheck").check();
  await page.locator("#missionForm").getByRole("button", { name: "Create mission receipt" }).click();
  await page.locator("#receiptView").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement === document.querySelector("#receiptView h2"));
  assert.equal(await page.locator("#receiptView").getAttribute("role"), "region");
  assert.equal(await page.locator("#receiptView").getAttribute("aria-live"), "polite");
  await page.goto(`${BASE}/business-world.html`, { waitUntil: "load" });
  assert.equal(await page.getByRole("dialog").count(), 0, "City Hall recognizes the shared Mission ID");
  assert.equal((await page.locator("[data-profile-name]").innerText()).trim(), "Alex A.");
  assert.equal((await page.locator(".stat-card").first().locator("strong").innerText()).trim(), "10");
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS mission dialog semantics, focus trap, Escape close, focus return, and receipt announcement");
}

async function runProfileDialogs(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  const errors = collectErrors(page);

  await page.goto(`${BASE}/student-mission-id.html`, { waitUntil: "load" });
  await page.locator("#editIdentity").click();
  assert.equal(await page.locator("#identityModal .modal-panel").getAttribute("role"), "dialog");
  assert.equal(await page.locator("#identityModal .modal-panel").getAttribute("aria-modal"), "true");
  await page.waitForFunction(() => document.activeElement.id === "idFirst");
  assert.equal(await page.evaluate(() => document.activeElement.id), "idFirst");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.getElementById("identityModal").hidden);
  await page.waitForFunction(() => document.activeElement.id === "editIdentity");
  assert.equal(await page.evaluate(() => document.activeElement.id), "editIdentity");

  await page.goto(`${BASE}/wolverine-agency.html`, { waitUntil: "load" });
  await page.locator("#editAgencyProfile").click();
  assert.equal(await page.locator("#agencyProfileModal .modal-panel").getAttribute("role"), "dialog");
  await page.waitForFunction(() => document.querySelector("#agencyProfileModal").contains(document.activeElement));
  assert.equal(await page.evaluate(() => document.querySelector("#agencyProfileModal").contains(document.activeElement)), true);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.getElementById("agencyProfileModal").hidden);
  await page.waitForFunction(() => document.activeElement.id === "editAgencyProfile");
  assert.equal(await page.evaluate(() => document.activeElement.id), "editAgencyProfile");
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS Mission ID and Agency dialogs share keyboard and focus behavior");
}

async function runBusinessWorld(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const errors = collectErrors(page);
  await page.goto(`${BASE}/business-world.html`, { waitUntil: "load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });

  await page.getByRole("dialog").waitFor({ state: "visible" });
  assert.equal(await page.getByRole("dialog").getAttribute("aria-describedby"), "profile-description");
  assert.equal(await page.evaluate(() => document.getElementById("app").inert), true);
  await page.waitForFunction(() => document.activeElement.getAttribute("name") === "first");
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("name")), "first");
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 1, "required orientation cannot be dismissed before setup");

  await page.locator('input[name="first"]').fill("Alex");
  await page.locator('input[name="last"]').fill("A");
  await page.locator('select[name="period"]').selectOption("1");
  await page.getByRole("button", { name: "CLOCK IN" }).click();
  await page.waitForFunction(() => !document.getElementById("modal-root").innerHTML);
  assert.equal(await page.evaluate(() => document.getElementById("app").inert), false);
  assert.equal((await page.locator('.bottom-nav [aria-current="page"]').innerText()).replace(/\s+/g, " ").trim(), "🏛️ City Hall");

  await page.locator('[data-nav="missions"]').click();
  assert.equal((await page.locator('.bottom-nav [aria-current="page"]').innerText()).replace(/\s+/g, " ").trim(), "📋 Missions");
  await page.waitForFunction(() => document.activeElement.id === "screen");
  assert.equal(await page.evaluate(() => document.activeElement.id), "screen");
  assert.match(await page.title(), /^Missions \| Woodside Business World$/);

  const profileButton = page.locator('[data-action="open-profile"]').first();
  await profileButton.click();
  assert.equal(await page.evaluate(() => document.getElementById("app").inert), true);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.getElementById("modal-root").innerHTML);
  await page.waitForTimeout(30);
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains("profile-chip")), true);

  const sound = page.locator('[data-action="toggle-sound"]');
  assert.equal(await sound.getAttribute("aria-pressed"), "true");
  await sound.click();
  assert.equal(await sound.getAttribute("aria-pressed"), "false");
  assert.equal(await sound.getAttribute("aria-label"), "Turn sound effects on");

  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.id), "screen");
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `Business World mobile overflow ${dimensions.scrollWidth} > ${dimensions.clientWidth}`);
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS Business World orientation, navigation state, modal isolation, sound state, skip link, and mobile width");
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio: "ignore" });
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    await runShellConsistency(browser);
    await runMissionDialog(browser);
    await runProfileDialogs(browser);
    await runBusinessWorld(browser);
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Mission Network accessibility browser QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
