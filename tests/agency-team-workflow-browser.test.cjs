const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const PORT = 4181;
const BASE = `http://127.0.0.1:${PORT}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      if ((await fetch(`${BASE}/wolverine-agency.html`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error("Agency team workflow server did not start.");
}

function watchErrors(page, label, errors) {
  page.on("pageerror", error => errors.push(`${label} pageerror: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") errors.push(`${label} console: ${message.text()}`); });
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1, `${label}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
}

async function openTeacherAgencyDesk(page) {
  await page.goto(BASE, { waitUntil:"load" });
  await page.locator(".nav button", { hasText:"Topic Hubs" }).click();
  await page.locator(".agency-project-launcher").waitFor({ state:"visible" });
}

async function createTeacherLaunch(browser, errors) {
  const context = await browser.newContext({
    viewport:{ width:1440, height:960 },
    permissions:["clipboard-read", "clipboard-write"]
  });
  await context.route("**/favicon.ico", route => route.fulfill({ status:204, body:"" }));
  const page = await context.newPage();
  watchErrors(page, "teacher", errors);
  await page.goto(BASE, { waitUntil:"load" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil:"load" });
  await page.locator(".nav button", { hasText:"Topic Hubs" }).click();
  await page.locator(".agency-project-launcher").waitFor({ state:"visible" });

  await page.locator("#agencyLaunchTemplate").selectOption("WA-03");
  await page.locator("#agencyLaunchPeriod").selectOption("3");
  await page.locator("#agencyLaunchDueDate").fill("2026-09-18");
  await page.locator("#agencyLaunchTeamName").fill("A202 Launch Lab");
  await page.locator("#agencyLaunchRosterPaste").fill("Mia, M\nLeo, L");
  await page.getByRole("button", { name:"Build roster and balance roles" }).click();
  const members = page.locator("[data-agency-member-row]");
  assert.equal(await members.count(), 2);
  assert.equal(await members.nth(0).locator("[data-member-first]").inputValue(), "Mia");
  assert.equal(await members.nth(1).locator("[data-member-first]").inputValue(), "Leo");
  await members.nth(0).locator("[data-member-role]").selectOption("research");
  await members.nth(1).locator("[data-member-role]").selectOption("creative");
  await page.getByRole("button", { name:"Create project link" }).click();
  const card = page.locator(".agency-saved-launch.just-created");
  await card.waitFor({ state:"visible" });
  assert.match(await card.innerText(), /A202 Launch Lab/);
  assert.match(await card.innerText(), /Mia M\. — Market Research Analyst/);
  assert.match(await card.innerText(), /Leo L\. — Creative Director/);
  const launchId = (await card.locator(".topic-admin-status").innerText()).trim();
  assert.match(launchId, /^WMA-/);

  await card.getByRole("button", { name:"Copy student link" }).click();
  await page.waitForFunction(() => navigator.clipboard.readText().then(value => value.includes("#agency-launch=")));
  const link = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(link, /wolverine-agency\.html#agency-launch=/);

  await page.locator("#agencyLaunchMode").selectOption("solo");
  await page.getByRole("button", { name:"Create project link" }).click();
  const soloCard = page.locator(".agency-saved-launch.just-created");
  await soloCard.waitFor({ state:"visible" });
  assert.match(await soloCard.innerText(), /Individual project/);
  assert.equal(await page.locator(".agency-saved-launch").count(), 2, "team and individual launch formats both save");
  await assertNoOverflow(page, "desktop Agency launcher");
  return { context, page, link, launchId };
}

async function completeStudentRole(browser, { link, memberLabel, expectedRole, first }, errors) {
  const context = await browser.newContext({
    viewport:{ width:390, height:844 },
    hasTouch:true,
    isMobile:true,
    permissions:["clipboard-read", "clipboard-write"]
  });
  await context.route("**/favicon.ico", route => route.fulfill({ status:204, body:"" }));
  const page = await context.newPage();
  watchErrors(page, first, errors);
  await page.goto(link, { waitUntil:"load" });
  const join = page.locator("#agencyJoinModal");
  await join.waitFor({ state:"visible" });
  assert.match(await page.locator("#agencyJoinPreview").innerText(), /School Store Rebrand/);
  await page.locator("#agencyTeamMemberSelect").selectOption({ label:memberLabel });
  await page.getByRole("button", { name:"Join project and open my work order" }).click();

  const project = page.locator("#agencyProjectModal");
  await project.waitFor({ state:"visible" });
  assert.match(await page.locator("#agencyRoleBanner").innerText(), new RegExp(expectedRole));
  const answers = page.locator("[data-agency-answer]");
  assert.equal(await answers.count(), 9, "five client prompts, one role order, and three accountability checks");
  for (let index = 0; index < await answers.count(); index += 1) {
    await answers.nth(index).fill(`${first} provides specific client evidence, marketing reasoning, and an accountable team contribution for response ${index + 1}.`);
  }
  await page.locator("#agencyIntegrity").check();
  await page.locator("#agencyProjectForm").getByRole("button", { name:"Create client review packet" }).click();
  await page.locator("#agencyReceiptView").waitFor({ state:"visible" });
  await page.getByRole("button", { name:"Copy teacher submission" }).click();
  await page.waitForFunction(() => document.getElementById("copyAgencyTeacherPacket")?.textContent.includes("copied"));
  const packet = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(packet, /^FMN-REVIEW:/);
  const stored = await page.evaluate(() => ({
    profile:window.FontaineMissionStore.getActiveProfile(),
    launches:window.FontaineMissionStore.getAgencyLaunches(),
    history:window.FontaineMissionStore.getTopicHistory("agency")
  }));
  assert.equal(stored.profile.first, first);
  assert.equal(stored.launches[0].joinedRole, expectedRole === "Market Research Analyst" ? "research" : "creative");
  assert.equal(stored.history.length, 1);
  await assertNoOverflow(page, `${first} mobile Agency project`);
  const shortTargets = await page.locator(".mission-button, .mission-nav a, .mission-subnav a, .modal-close, #agencyTeamMemberSelect").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none" && !element.disabled)
    .map(element => ({ text:element.textContent?.trim() || element.tagName, height:element.getBoundingClientRect().height }))
    .filter(item => item.height > 0 && item.height < 43));
  assert.deepEqual(shortTargets, [], `${first} student controls remain at least 44px tall`);
  await context.close();
  return packet;
}

async function reviewTeamPackets(teacher, packets, launchId, errors) {
  const { page } = teacher;
  await openTeacherAgencyDesk(page);
  for (const packet of packets) {
    await page.locator("#missionReviewPacket").fill(packet);
    await page.getByRole("button", { name:"Import submission" }).click();
  }
  assert.equal(await page.locator(".mission-review-item").count(), 2);
  const queueText = await page.locator(".mission-review-list").innerText();
  assert.match(queueText, new RegExp(launchId));
  assert.match(queueText, /A202 Launch Lab/);
  assert.match(queueText, /Market Research Analyst/);
  assert.match(queueText, /Creative Director/);
  const teamReport = page.locator(".mission-agency-team-report");
  assert.match(await teamReport.innerText(), /Agency team accountability/i);
  assert.match(await teamReport.innerText(), /2 of 2 individual role packets submitted/i);
  assert.match(await teamReport.innerText(), /Mia M\./);
  assert.match(await teamReport.innerText(), /Leo L\./);
  await page.locator(".mission-review-evidence").first().click();
  assert.match(await page.locator(".mission-review-responses").first().innerText(), /INDIVIDUAL EVIDENCE/);
  assert.match(await page.locator(".mission-review-responses").first().innerText(), /TEAM HANDOFF/);

  await page.getByRole("button", { name:"Select visible pending" }).click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name:"Approve selected" }).click();
  assert.match(await page.locator(".mission-review-summary").innerText(), /2 approved/i);
  assert.match(await page.locator(".mission-agency-team-report").innerText(), /2 approved/i);
  assert.match(await page.locator(".mission-weekly-report").innerText(), /2\s+participating students/i);
  assert.match(await page.locator(".mission-weekly-report").innerText(), /8\s+entries awarded/i);

  await page.setViewportSize({ width:390, height:844 });
  await page.reload({ waitUntil:"load" });
  await page.locator(".nav button", { hasText:"Topic Hubs" }).click();
  await page.locator(".agency-project-launcher").waitFor({ state:"visible" });
  await assertNoOverflow(page, "phone-width teacher Agency launcher and queue");
  const shortTargets = await page.locator(".agency-project-launcher button, .agency-project-launcher input, .agency-project-launcher select, .agency-project-launcher textarea, .agency-project-launcher a.btn").evaluateAll(elements => elements
    .filter(element => getComputedStyle(element).display !== "none" && !element.disabled)
    .map(element => ({ text:element.textContent?.trim() || element.tagName, height:element.getBoundingClientRect().height }))
    .filter(item => item.height > 0 && item.height < 43));
  assert.deepEqual(shortTargets, [], "teacher launcher controls remain at least 44px tall");
  assert.deepEqual(errors, [], `Agency team browser errors:\n${errors.join("\n")}`);
}

(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { stdio:"ignore" });
  let browser;
  let teacher;
  try {
    await waitForServer();
    const executablePath = [
      chromium.executablePath(),
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      path.resolve(__dirname, "../../browser-runtime-tmp/chromium"),
      "/tmp/chromium"
    ].find(candidate => candidate && fs.existsSync(candidate) && fs.statSync(candidate).size > 0);
    browser = await chromium.launch({ headless:true, ...(executablePath ? { executablePath } : {}) });
    const errors = [];
    teacher = await createTeacherLaunch(browser, errors);
    const miaPacket = await completeStudentRole(browser, {
      link:teacher.link,
      memberLabel:"Mia M. • Market Research Analyst",
      expectedRole:"Market Research Analyst",
      first:"Mia"
    }, errors);
    const leoPacket = await completeStudentRole(browser, {
      link:teacher.link,
      memberLabel:"Leo L. • Creative Director",
      expectedRole:"Creative Director",
      first:"Leo"
    }, errors);
    await reviewTeamPackets(teacher, [miaPacket, leoPacket], teacher.launchId, errors);
  } finally {
    if (teacher?.context) await teacher.context.close();
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
  console.log("Agency launcher, team roster, role packet, accountability, review, and responsive QA passed.");
})().catch(error => { console.error(error); process.exit(1); });
