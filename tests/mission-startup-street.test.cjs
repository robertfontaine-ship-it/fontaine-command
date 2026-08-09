const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

function startupConfig() {
  const window = {};
  vm.runInNewContext(read("startup-street.js"), { window });
  return window.HUB_CONFIG;
}

test("Startup Street launches as a complete twelve-mission entrepreneurship district", () => {
  const config = startupConfig();
  assert.equal(config.id, "startup-street");
  assert.equal(config.title, "Startup Street");
  assert.equal(config.missions.length, 12);
  assert.deepEqual(
    Array.from(config.missions.reduce((counts, mission) => counts.set(mission.level, (counts.get(mission.level) || 0) + 1), new Map()).entries()),
    [["Quick", 4], ["Skill", 5], ["Boss", 3]]
  );
  assert.equal(new Set(config.missions.map(mission => mission.id)).size, 12);
  config.missions.forEach((mission, index) => {
    assert.equal(mission.id, `SS-${String(index + 1).padStart(2, "0")}`);
    assert.ok(mission.prompts.length >= 3, `${mission.id} includes a complete venture decision workflow`);
    assert.ok(mission.outcomes.length >= 2, `${mission.id} names measurable outcomes`);
    assert.equal(mission.entries, mission.level === "Quick" ? 1 : mission.level === "Skill" ? 2 : 4);
    assert.ok(mission.minutes >= 8, `${mission.id} includes a realistic time estimate`);
  });
});

test("Startup Street covers the opportunity-to-launch entrepreneurship cycle", () => {
  const source = read("startup-street.js");
  [
    /problem statement/i,
    /customer interview/i,
    /value proposition/i,
    /trend, fad, or noise/i,
    /minimum viable/i,
    /business model/i,
    /startup cost/i,
    /contribution per sale/i,
    /ownership structure/i,
    /grand opening/i,
    /investor/i,
    /30-day venture launch/i,
    /break-even/i,
    /cash forecast/i
  ].forEach(pattern => assert.match(source, pattern));
});

test("Startup Street inherits the protected Mission Network workflow and all seven periods", () => {
  const source = read("startup-street.html");
  const scripts = [
    "mission-data-store.js",
    "mission-autosave.js",
    "mission-accessibility.js",
    "startup-street.js",
    "mission-hub-engine.js",
    "student-review-packet.js"
  ];
  let lastIndex = -1;
  scripts.forEach(script => {
    const index = source.indexOf(`src=\"${script}\"`);
    assert.ok(index > lastIndex, `Startup Street loads ${script} in the protected order`);
    lastIndex = index;
  });
  for (let period = 1; period <= 7; period += 1) {
    assert.match(source, new RegExp(`<option>${period}</option>`), `Startup Street includes Period ${period}`);
  }
  assert.match(source, /id="missionGrid"/);
  assert.match(source, /id="missionModal"/);
  assert.match(source, /id="integrityCheck"/);
  assert.match(source, /Problem Alley/);
  assert.match(source, /Grand Opening Square/);
});

test("Startup Street is connected to City Hall, Mission Control, the directory, and Mission ID", () => {
  assert.match(read("business-world.html"), /startup-street-expansion\.js/);
  const expansion = read("startup-street-expansion.js");
  assert.match(expansion, /startup-street\.html/);
  assert.match(expansion, /passport-grid/);
  assert.match(expansion, /Founder/);
  assert.match(expansion, /Launch Ready/);
  assert.match(read("mission-control.js"), /"startup-street"/);
  assert.match(read("mission-control.html"), /Enter Startup Street/);
  assert.match(read("topic-hubs.html"), /href="startup-street\.html"/);
  assert.match(read("student-mission-id.js"), /"startup-street":"Startup Street"/);
  assert.match(read("student-mission-id.js"), /name:"Founder"/);
});

test("Startup Street remains responsive and avoids repeated City Hall patching", () => {
  const css = read("startup-street.css");
  assert.match(css, /@media\(max-width:980px\)/);
  assert.match(css, /@media\(max-width:620px\)/);
  const expansion = read("startup-street-expansion.js");
  assert.match(expansion, /data-startup-street-card/);
  assert.match(expansion, /dataset\.startupPatched/);
  assert.match(expansion, /dataset\.startupCounted/);
});
