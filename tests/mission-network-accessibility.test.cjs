const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const studentPages = [
  "mission-control.html",
  "course-pathways.html",
  "topic-hubs.html",
  "branding-hub.html",
  "target-market-hub.html",
  "four-ps-hub.html",
  "marketing-functions-hub.html",
  "promotional-mix-hub.html",
  "market-research-hub.html",
  "pricing-strategy-hub.html",
  "distribution-hub.html",
  "selling-customer-service-hub.html",
  "wolverine-agency.html",
  "student-mission-id.html"
];

test("shared accessibility JavaScript parses", () => {
  assert.doesNotThrow(() => new Function(read("mission-accessibility.js")));
});

test("every Mission Network surface loads the shared accessibility layer", () => {
  studentPages.forEach(page => {
    const html = read(page);
    const storeIndex = html.indexOf('src="mission-data-store.js"');
    const accessibilityIndex = html.indexOf('src="mission-accessibility.js"');
    assert.ok(storeIndex >= 0, `${page} loads the shared student store`);
    assert.ok(accessibilityIndex > storeIndex, `${page} loads accessibility after the student store`);
  });
});

test("shared navigation defines the six canonical destinations", () => {
  const script = read("mission-accessibility.js");
  ["business-world.html", "mission-control.html", "topic-hubs.html", "course-pathways.html", "wolverine-agency.html", "student-mission-id.html"].forEach(href => {
    assert.match(script, new RegExp(href.replaceAll(".", "\\.")));
  });
  assert.match(script, /aria-current/);
  assert.match(script, /On this page/);
});

test("shared dialogs provide focus containment, focus return, and background isolation", () => {
  const script = read("mission-accessibility.js");
  assert.match(script, /aria-modal/);
  assert.match(script, /aria-labelledby/);
  assert.match(script, /aria-describedby/);
  assert.match(script, /event\.key !== "Tab"/);
  assert.match(script, /event\.key === "Escape"/);
  assert.match(script, /state\.trigger.*focus/);
  assert.match(script, /\.inert = true/);
});

test("Mission Network styles expose keyboard focus, skip links, and reduced-motion behavior", () => {
  const css = read("topic-hubs.css");
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.skip-link/);
  assert.match(css, /\.mission-subnav/);
  assert.match(css, /prefers-reduced-motion/);
});

test("Business World supports accessible single-page navigation and modal behavior", () => {
  const html = read("business-world.html");
  const script = read("business-world.js");
  assert.ok(html.indexOf('src="mission-data-store.js"') < html.indexOf('src="business-world.js"'));
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-current="page"/);
  assert.match(script, /setAttribute\('aria-current', 'page'\)/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /modalReturnFocus/);
  assert.match(script, /modalFocusableElements/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /missionStore\.getAllHistory/);
  assert.match(script, /missionStore\.setActiveProfile/);
});
