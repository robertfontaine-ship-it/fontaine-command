const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

const departments = [
  { file: "pricing-strategy-hub.js", html: "pricing-strategy-hub.html", id: "pricing", title: "Pricing Strategy", prefix: "PS" },
  { file: "distribution-hub.js", html: "distribution-hub.html", id: "distribution", title: "Distribution", prefix: "DS" },
  { file: "selling-customer-service-hub.js", html: "selling-customer-service-hub.html", id: "service", title: "Selling & Customer Service", prefix: "SC" }
];

function configFor(file) {
  const window = {};
  vm.runInNewContext(read(file), { window });
  return window.HUB_CONFIG;
}

test("Pricing, Distribution, and Customer Experience launch as complete ten-mission departments", () => {
  departments.forEach(department => {
    const config = configFor(department.file);
    assert.equal(config.id, department.id);
    assert.equal(config.title, department.title);
    assert.equal(config.missions.length, 10);
    assert.deepEqual(
      Array.from(config.missions.reduce((counts, mission) => counts.set(mission.level, (counts.get(mission.level) || 0) + 1), new Map()).entries()),
      [["Quick", 3], ["Skill", 4], ["Boss", 3]],
      `${department.title} uses the 3/4/3 mission ladder`
    );
    assert.equal(new Set(config.missions.map(mission => mission.id)).size, 10);
    config.missions.forEach(mission => {
      assert.match(mission.id, new RegExp(`^${department.prefix}-\\d{2}$`));
      assert.ok(mission.prompts.length >= 3, `${mission.id} includes a complete decision workflow`);
      assert.ok(mission.outcomes.length >= 2, `${mission.id} names measurable outcomes`);
      assert.ok([1, 2, 4].includes(mission.entries), `${mission.id} uses the network reward scale`);
      assert.ok(mission.minutes >= 8, `${mission.id} includes a realistic time estimate`);
    });
  });
});

test("Pricing missions cover economics, customer value, market strategy, and adjustment decisions", () => {
  const source = read("pricing-strategy-hub.js");
  [
    /fixed cost/i,
    /variable cost/i,
    /contribution/i,
    /break-even/i,
    /customer value/i,
    /competitor/i,
    /penetration/i,
    /skimming/i,
    /discount/i,
    /profit/i,
    /adjustment rule|stop rule/i
  ].forEach(pattern => assert.match(source, pattern));
  assert.match(read("pricing-strategy-hub.html"), /Break-even units = fixed costs/);
});

test("Distribution missions cover the full channel, inventory, fulfillment, and recovery system", () => {
  const source = read("distribution-hub.js");
  [
    /direct, indirect, or hybrid/i,
    /intermediar/i,
    /intensive, selective, or exclusive/i,
    /reorder point/i,
    /safety stock/i,
    /lead time/i,
    /fulfillment/i,
    /omnichannel/i,
    /returns/i,
    /service standard|service standards/i
  ].forEach(pattern => assert.match(source, pattern));
  assert.match(read("distribution-hub.html"), /Move Value, Not Just Boxes/);
});

test("Selling and Customer Service missions cover the NRF-aligned customer cycle", () => {
  const source = read("selling-customer-service-hub.js");
  [
    /product knowledge/i,
    /features/i,
    /benefits/i,
    /needs-discovery|needs discovery/i,
    /objection/i,
    /close/i,
    /return/i,
    /service recovery|recovery/i,
    /follow-up/i,
    /loyalty|retention/i,
    /policy/i
  ].forEach(pattern => assert.match(source, pattern));
  assert.match(read("selling-customer-service-hub.html"), /Serve the Need, Earn the Relationship/);
});

test("all three departments inherit identity, autosave, accessibility, review, and Periods 1–7", () => {
  departments.forEach(({ html, file }) => {
    const source = read(html);
    const scripts = [
      "mission-data-store.js",
      "mission-autosave.js",
      "mission-accessibility.js",
      file,
      "mission-hub-engine.js",
      "student-review-packet.js"
    ];
    let lastIndex = -1;
    scripts.forEach(script => {
      const index = source.indexOf(`src="${script}"`);
      assert.ok(index > lastIndex, `${html} loads ${script} in the protected order`);
      lastIndex = index;
    });
    for (let period = 1; period <= 7; period += 1) {
      assert.match(source, new RegExp(`<option>${period}</option>`), `${html} includes Period ${period}`);
    }
    assert.match(source, /id="missionGrid"/);
    assert.match(source, /id="missionModal"/);
    assert.match(source, /teacher review packet/i);
  });
});

test("the expanded network exposes nine departments and 89 missions everywhere students and teachers enter", () => {
  const linkIntegrations = [
    "topic-hubs.js",
    "mission-control.js",
    "business-world.js",
    "mission-accessibility.js",
    "mission-classroom-kit.html",
    "mission-classroom-kit.js"
  ];
  const required = ["pricing-strategy-hub.html", "distribution-hub.html", "selling-customer-service-hub.html"];
  linkIntegrations.forEach(file => {
    const source = read(file);
    required.forEach(href => assert.match(source, new RegExp(href.replaceAll(".", "\\.")), `${file} connects ${href}`));
  });
  ["student-mission-id.js", "topic-hubs-admin.js"].forEach(file => {
    const source = read(file);
    [/Pricing Strategy/i, /Distribution/i, /Selling & Customer Service|Customer Experience/i].forEach(pattern => assert.match(source, pattern, file));
  });
  assert.match(read("topic-hubs.html"), /Nine live departments/);
  assert.match(read("topic-hubs.html"), /89 optional missions/);
  assert.match(read("topic-hubs-admin.js"), /Nine permanent marketing departments, 89 independent missions/);
  assert.match(read("business-world.js"), /10 Locations Live/);
  assert.match(read("business-world.js"), /Nine departments plus Wolverine Agency/);
});

test("Marketing Functions and Promotional Mix history uses the same canonical IDs as their mission pages", () => {
  assert.match(read("marketing-functions-hub.js"), /id:"marketing-functions"/);
  assert.match(read("promotional-mix-hub.js"), /id:"promotional-mix"/);
  ["mission-control.js", "student-mission-id.js", "business-world.js"].forEach(file => {
    const source = read(file);
    assert.match(source, /marketing-functions/);
    assert.match(source, /promotional-mix/);
    assert.match(source, /TOPIC_ALIASES/);
  });
});

test("teacher review packets carry the exact student prompt with each response", () => {
  const source = read("student-review-packet.js");
  assert.match(source, /field\.closest\("label"\)/);
  assert.match(source, /return \{ step: index \+ 1, prompt, response:/);
  assert.match(read("topic-hubs-review-queue.js"), /row\.prompt/);
});
