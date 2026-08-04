const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

function marketResearchConfig() {
  const window = {};
  vm.runInNewContext(read("market-research-hub.js"), { window });
  return window.HUB_CONFIG;
}

test("Market Research launches as a complete ten-mission department", () => {
  const config = marketResearchConfig();
  assert.equal(config.id, "market-research");
  assert.equal(config.title, "Market Research");
  assert.equal(config.missions.length, 10);
  assert.deepEqual(
    Array.from(config.missions.reduce((counts, mission) => counts.set(mission.level, (counts.get(mission.level) || 0) + 1), new Map()).entries()),
    [["Quick", 3], ["Skill", 4], ["Boss", 3]]
  );
  assert.equal(new Set(config.missions.map(mission => mission.id)).size, 10);
  config.missions.forEach(mission => {
    assert.match(mission.id, /^MR-\d{2}$/);
    assert.ok(mission.prompts.length >= 3, `${mission.id} includes a complete evidence workflow`);
    assert.ok(mission.outcomes.length >= 2, `${mission.id} names measurable outcomes`);
    assert.ok([1, 2, 4].includes(mission.entries), `${mission.id} uses the network reward scale`);
  });
});

test("Market Research covers the complete question-to-decision process", () => {
  const source = read("market-research-hub.js");
  [
    /research objective/i,
    /secondary/i,
    /primary/i,
    /sampling|sample/i,
    /survey/i,
    /interview|focus-group/i,
    /finding/i,
    /insight/i,
    /limitation|evidence gap/i,
    /recommend/i
  ].forEach(pattern => assert.match(source, pattern));
  assert.match(read("market-research-hub.html"), /Finding → Insight → Action/);
  assert.match(read("market-research-hub.html"), /Never invent missing data/);
});

test("the new department is connected to every student network surface", () => {
  const files = [
    "topic-hubs.js",
    "mission-control.html",
    "mission-control.js",
    "business-world.js",
    "mission-accessibility.js",
    "topic-hubs-admin.js"
  ];
  files.forEach(file => assert.match(read(file), /market-research-hub\.html|Market Research Lab/, file));
  assert.match(read("topic-hubs.html"), /Nine live departments/);
  assert.match(read("topic-hubs.html"), /89 optional missions/);
  assert.match(read("business-world.js"), /10 Locations Live/);
});

test("classroom kit supports all seven periods and privacy-conscious roster cards", () => {
  const html = read("mission-classroom-kit.html");
  const script = read("mission-classroom-kit.js");
  for (let period = 1; period <= 7; period += 1) assert.match(html, new RegExp(`<option>${period}</option>`));
  assert.match(script, /const PERIODS = \["1", "2", "3", "4", "5", "6", "7"\]/);
  assert.match(script, /slice\(0, 1\)\.toUpperCase\(\)/);
  assert.match(`${html}\n${script}`, /not saved/i);
  assert.doesNotMatch(script.match(/function formSettings\(\)[\s\S]*?\n  }/)[0], /cardRoster/);
  assert.match(html, /First Last/);
  assert.match(html, /Last, First/);
});

test("print layouts enforce six cards per letter sheet and a one-page substitute guide", () => {
  const css = read("mission-classroom-kit.css");
  const script = read("mission-classroom-kit.js");
  assert.match(css, /@page\{size:letter portrait/);
  assert.match(css, /grid-template-columns:repeat\(2,1fr\)/);
  assert.match(css, /grid-auto-rows:3\.22in/);
  assert.match(css, /height:10\.25in/);
  assert.match(script, /Math\.ceil\(students\.length \/ 6\)/);
  assert.match(script, /Independent Substitute Plan/);
  assert.match(script, /NO GROUP WORK/);
});

test("substitute mode protects the official workflow and teacher-only controls", () => {
  const script = read("mission-classroom-kit.js");
  assert.match(script, /Canvas is the official assignment and submission location/);
  assert.match(script, /Do not approve mission entries, grade mission packets, run the drawing, reset student profiles, or change Agency rosters/);
  assert.match(script, /Periods 1–7/);
  assert.match(script, /If Technology Fails/);
  assert.match(script, /Required work first/);
});

test("City Hall retains its complete visual system while adding the new district", () => {
  const css = read("business-world.css");
  assert.ok(css.length > 10000, "City Hall stylesheet includes the full layout and theme");
  assert.match(css, /\.hero-card/);
  assert.match(css, /\.business-city-grid/);
  assert.match(css, /\.city-building/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /\.skip-link/);
});
