const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

class MemoryStorage {
  constructor(seed = {}) {
    this.values = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)]));
  }

  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

class EventNode {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, handler) {
    const handlers = this.listeners.get(type) || new Set();
    handlers.add(handler);
    this.listeners.set(type, handlers);
  }
  removeEventListener(type, handler) { this.listeners.get(type)?.delete(handler); }
  dispatch(type) { [...(this.listeners.get(type) || [])].forEach(handler => handler({ type })); }
}

function loadStore(seed = {}) {
  const localStorage = new MemoryStorage(seed);
  const window = {};
  vm.runInNewContext(read("mission-data-store.js"), {
    window,
    localStorage,
    Date,
    JSON,
    Object,
    String,
    Number,
    Boolean,
    Math,
    Map,
    Array,
    Error
  });
  return { store: window.FontaineMissionStore, localStorage };
}

test("mission JavaScript parses", () => {
  [
    "mission-data-store.js",
    "mission-autosave.js",
    "mission-hub-engine.js",
    "topic-hubs.js",
    "mission-control.js",
    "student-mission-id.js",
    "student-review-packet.js",
    "wolverine-agency.js",
    "target-market-hub.js",
    "four-ps-hub.js",
    "marketing-functions-hub.js",
    "promotional-mix-hub.js"
  ].forEach(file => assert.doesNotThrow(() => new Function(read(file)), file));
});

test("every student experience loads the shared store before page logic", () => {
  const pages = {
    "mission-control.html": "mission-control.js",
    "student-mission-id.html": "student-mission-id.js",
    "topic-hubs.html": "topic-hubs.js",
    "branding-hub.html": "topic-hubs.js",
    "target-market-hub.html": "mission-hub-engine.js",
    "four-ps-hub.html": "mission-hub-engine.js",
    "marketing-functions-hub.html": "mission-hub-engine.js",
    "promotional-mix-hub.html": "mission-hub-engine.js",
    "wolverine-agency.html": "wolverine-agency.js"
  };

  Object.entries(pages).forEach(([page, logic]) => {
    const html = read(page);
    const storeIndex = html.indexOf('src="mission-data-store.js"');
    const logicIndex = html.indexOf(`src="${logic}"`);
    assert.ok(storeIndex >= 0, `${page} loads the shared store`);
    assert.ok(logicIndex > storeIndex, `${page} loads ${logic} after the shared store`);
  });
});

test("every long-form mission page loads autosave before its form logic", () => {
  const pages = {
    "branding-hub.html": "topic-hubs.js",
    "target-market-hub.html": "mission-hub-engine.js",
    "four-ps-hub.html": "mission-hub-engine.js",
    "marketing-functions-hub.html": "mission-hub-engine.js",
    "promotional-mix-hub.html": "mission-hub-engine.js",
    "wolverine-agency.html": "wolverine-agency.js"
  };

  Object.entries(pages).forEach(([page, logic]) => {
    const html = read(page);
    const storeIndex = html.indexOf('src="mission-data-store.js"');
    const autosaveIndex = html.indexOf('src="mission-autosave.js"');
    const logicIndex = html.indexOf(`src="${logic}"`);
    assert.ok(autosaveIndex > storeIndex, `${page} loads autosave after the shared store`);
    assert.ok(logicIndex > autosaveIndex, `${page} loads form logic after autosave`);
  });
});

test("all mission forms support Periods 1 through 7", () => {
  [
    "branding-hub.html",
    "target-market-hub.html",
    "four-ps-hub.html",
    "marketing-functions-hub.html",
    "promotional-mix-hub.html",
    "student-mission-id.html",
    "wolverine-agency.html"
  ].forEach(page => {
    const html = read(page);
    for (let period = 1; period <= 7; period += 1) {
      assert.match(html, new RegExp(`<option[^>]*>${period}</option>`), `${page} includes Period ${period}`);
    }
  });
});

test("student scripts only reference elements present on their pages", () => {
  const assertIds = (scriptFile, pageFiles) => {
    const script = read(scriptFile);
    const html = pageFiles.map(read).join("\n");
    const ids = new Set([...script.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(match => match[1]));
    ids.forEach(id => assert.match(html, new RegExp(`id=["']${id}["']`), `${scriptFile} requires #${id}`));
  };

  assertIds("mission-control.js", ["mission-control.html"]);
  assertIds("student-mission-id.js", ["student-mission-id.html"]);
  assertIds("wolverine-agency.js", ["wolverine-agency.html"]);
  assertIds("topic-hubs.js", ["topic-hubs.html", "branding-hub.html"]);
  ["target-market-hub.html", "four-ps-hub.html", "marketing-functions-hub.html", "promotional-mix-hub.html"]
    .forEach(page => assertIds("mission-hub-engine.js", [page]));
});

test("the five departments contain 49 unique missions", () => {
  const inventory = [
    ["topic-hubs.js", "BR", 10],
    ["target-market-hub.js", "TM", 9],
    ["four-ps-hub.js", "4P", 10],
    ["marketing-functions-hub.js", "MF", 10],
    ["promotional-mix-hub.js", "PM", 10]
  ];
  const allIds = [];

  inventory.forEach(([file, prefix, expected]) => {
    const ids = [...read(file).matchAll(new RegExp(`id:\\s*["'](${prefix}-\\d{2})["']`, "g"))].map(match => match[1]);
    assert.equal(new Set(ids).size, expected, `${file} has ${expected} unique missions`);
    allIds.push(...ids);
  });

  assert.equal(allIds.length, 49);
  assert.equal(new Set(allIds).size, 49);
});

test("live departments are declared directly without render-time patch layers", () => {
  const source = read("topic-hubs.js");
  assert.equal((source.match(/status:\s*"Live"/g) || []).length, 5);
  assert.doesNotMatch(read("topic-hubs.html"), /topic-hubs-live-expansion/);
  assert.doesNotMatch(read("index.html"), /topic-hubs-admin-expansion/);
  assert.equal(fs.existsSync(path.join(ROOT, "topic-hubs-live-expansion.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "topic-hubs-admin-expansion.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "topic-hubs-profile-store.js")), false);
});

test("shared browser profiles remain isolated", () => {
  const { store } = loadStore();
  const alice = store.setActiveProfile({ first: "Alice", last: "A", period: "1" });
  store.saveCompletion({ topic: "branding", missionId: "BR-01", profile: alice, requestedEntries: 2, item: { title: "Brand Snapshot" } });

  const bob = store.setActiveProfile({ first: "Bob", last: "B", period: "1" });
  assert.equal(store.getAllHistory({ profile: bob }).length, 0);
  store.saveCompletion({ topic: "target-market", missionId: "TM-01", profile: bob, requestedEntries: 1, item: { title: "Audience Evidence" } });

  assert.deepEqual(store.getAllHistory({ profile: alice }).map(item => item.missionId), ["BR-01"]);
  assert.deepEqual(store.getAllHistory({ profile: bob }).map(item => item.missionId), ["TM-01"]);
});

test("autosaved drafts recover by student and clear after submission", () => {
  const { store } = loadStore();
  const alice = store.setActiveProfile({ first: "Alice", last: "A", period: "1" });
  const aliceDraft = store.saveDraft({
    topic: "branding",
    missionId: "BR-04",
    profile: alice,
    title: "Color Code",
    values: { responses: ["Purple and gold", "A detailed audience explanation"] }
  });
  assert.equal(aliceDraft.values.responses[0], "Purple and gold");

  const bob = store.setActiveProfile({ first: "Bob", last: "B", period: "1" });
  assert.equal(store.getDraft("branding", "BR-04", { profile: bob }), null);
  store.saveDraft({ topic: "branding", missionId: "BR-04", profile: bob, values: { responses: ["Blue"] } });

  assert.equal(store.getDraft("branding", "BR-04", { profile: alice }).values.responses[0], "Purple and gold");
  assert.equal(store.getDrafts({ profile: alice }).length, 1);
  assert.equal(store.deleteDraft("branding", "BR-04", { profile: alice }), true);
  assert.equal(store.getDraft("branding", "BR-04", { profile: alice }), null);
  assert.equal(store.getDraft("branding", "BR-04", { profile: bob }).values.responses[0], "Blue");
});

test("autosave writes changed work on interruption but does not create drafts from untouched forms", () => {
  const { store } = loadStore();
  const profile = store.setActiveProfile({ first: "Jordan", last: "J", period: "5" });
  const windowNode = new EventNode();
  const documentNode = new EventNode();
  documentNode.visibilityState = "visible";
  const window = Object.assign(windowNode, { FontaineMissionStore: store });
  const form = new EventNode();
  const status = { textContent: "", dataset: {} };
  let response = "";
  vm.runInNewContext(read("mission-autosave.js"), {
    window,
    document: documentNode,
    Date,
    Object,
    String,
    Boolean,
    Array,
    Number,
    JSON,
    setTimeout,
    clearTimeout
  });

  const untouched = window.FontaineMissionAutosave.create({
    form,
    status,
    topic: "branding",
    missionId: "BR-02",
    title: "Slogan Surgery",
    getProfile: () => profile,
    readValues: () => ({ responses: [response] })
  });
  untouched.dispose();
  assert.equal(store.getDraft("branding", "BR-02", { profile }), null);

  const interrupted = window.FontaineMissionAutosave.create({
    form,
    status,
    topic: "branding",
    missionId: "BR-02",
    title: "Slogan Surgery",
    getProfile: () => profile,
    readValues: () => ({ responses: [response] })
  });
  response = "A specific revised slogan with supporting reasoning.";
  form.dispatch("input");
  window.dispatch("pagehide");
  assert.equal(store.getDraft("branding", "BR-02", { profile }).values.responses[0], response);
  interrupted.clear();
  interrupted.dispose({ save: false });
  assert.equal(store.getDraft("branding", "BR-02", { profile }), null);
});

test("profile backups move completions, roles, and drafts without importing other students", () => {
  const source = loadStore().store;
  const alice = source.setActiveProfile({ first: "Alice", last: "A", period: "3" });
  source.saveCompletion({ topic: "four-ps", missionId: "4P-02", profile: alice, requestedEntries: 2, item: { title: "Mix Match" } });
  source.setAgencyRole("analytics", { profile: alice });
  source.saveDraft({ topic: "agency", missionId: "WA-03:analytics", profile: alice, values: { answers: ["Audience evidence"] } });
  const bob = source.setActiveProfile({ first: "Bob", last: "B", period: "4" });
  source.saveCompletion({ topic: "branding", missionId: "BR-01", profile: bob, requestedEntries: 1, item: {} });

  const backup = source.exportProfile({ profile: alice });
  assert.equal(backup.format, "fontaine-mission-profile");
  assert.equal(backup.profile.first, "Alice");

  const destination = loadStore().store;
  const result = destination.importProfile(JSON.parse(JSON.stringify(backup)));
  assert.equal(result.profile.first, "Alice");
  assert.equal(result.missions, 1);
  assert.equal(result.drafts, 1);
  assert.deepEqual(destination.getAllHistory().map(item => item.missionId), ["4P-02"]);
  assert.equal(destination.getAgencyRole(), "analytics");
  assert.equal(destination.getDraft("agency", "WA-03:analytics").values.answers[0], "Audience evidence");
  assert.equal(destination.listProfiles().length, 1, "Bob's source-device profile is excluded");
});

test("profile import merges newer work and shared-device reset preserves teacher records", () => {
  const { store, localStorage } = loadStore({
    "fontaineTopicHubAdmin:v1": JSON.stringify({ ledgers: { test: [{ name: "Alice" }] } }),
    "fontaineMissionReviewQueue:v1": JSON.stringify([{ receiptCode: "KEEP-ME" }])
  });
  const alice = store.setActiveProfile({ first: "Alice", last: "A", period: "2" });
  store.saveCompletion({
    topic: "branding",
    missionId: "BR-01",
    profile: alice,
    requestedEntries: 1,
    item: { responses: ["Local newer answer"], submittedAt: "2026-08-03T15:00:00Z" }
  });
  const backup = {
    format: "fontaine-mission-profile",
    version: 1,
    profile: alice,
    missionData: {
      topics: { branding: { weeks: { "2026-07-27": { completions: { "BR-01": { responses: ["Imported older answer"], submittedAt: "2026-08-03T14:00:00Z" } } } } } },
      drafts: {},
      agencyRole: ""
    }
  };
  store.importProfile(backup);
  assert.equal(store.getTopicHistory("branding", { profile: alice })[0].responses[0], "Local newer answer");

  const bob = store.setActiveProfile({ first: "Bob", last: "B", period: "6" });
  assert.equal(store.clearProfile({ profile: bob }), true);
  assert.equal(store.listProfiles().length, 1);
  assert.equal(store.getActiveProfile().first, "");

  store.clearAllProfiles();
  assert.equal(store.listProfiles().length, 0);
  assert.ok(localStorage.getItem("fontaineTopicHubAdmin:v1"), "teacher ledger remains");
  assert.ok(localStorage.getItem("fontaineMissionReviewQueue:v1"), "teacher review queue remains");
});

test("Mission ID exposes portable backup controls and teacher command owns device reset", () => {
  const missionId = read("student-mission-id.html");
  const command = read("topic-hubs-admin.js");
  const index = read("index.html");
  assert.match(missionId, /id="exportMissionProfile"/);
  assert.match(missionId, /id="importMissionProfile"/);
  assert.match(missionId, /id="profileTransferStatus"/);
  assert.match(command, /clearSelectedMissionProfile/);
  assert.match(command, /RESET STUDENT DEVICE/);
  assert.match(command, /clearAllProfiles/);
  assert.ok(index.indexOf('src="mission-data-store.js"') < index.indexOf('src="topic-hubs-admin.js"'));
});

test("the weekly entry cap is enforced across departments and agency work", () => {
  const { store } = loadStore();
  const profile = store.setActiveProfile({ first: "Jordan", last: "J", period: "5" });
  const first = store.saveCompletion({ topic: "branding", missionId: "BR-08", profile, requestedEntries: 4, item: {} }).item;
  const second = store.saveCompletion({ topic: "four-ps", missionId: "4P-08", profile, requestedEntries: 4, item: {} }).item;
  const third = store.saveCompletion({ topic: "agency", missionId: "WA-01", profile, requestedEntries: 4, xp: 50, item: {} }).item;

  assert.equal(first.entries, 4);
  assert.equal(second.entries, 4);
  assert.equal(third.entries, 2);
  assert.equal(third.xp, 50, "XP is not reduced when the entry cap is reached");
  assert.deepEqual(JSON.parse(JSON.stringify(store.weeklyEntrySummary({ profile }))), {
    total: 10,
    rawTotal: 10,
    remaining: 0,
    cap: 10
  });

  const revised = store.saveCompletion({ topic: "branding", missionId: "BR-08", profile, requestedEntries: 4, item: { responses: ["Improved"] } }).item;
  assert.equal(revised.entries, 4, "revising a mission does not consume duplicate entries");
  assert.equal(store.weeklyEntrySummary({ profile }).total, 10);
});

test("legacy student data migrates into the correct profiles", () => {
  const week = "2026-07-27";
  const seed = {
    "fontaineMissionIdentity:v1": JSON.stringify({ first: "Alice", last: "A", period: "1" }),
    "fontaineMissionNetwork:profiles:v1": JSON.stringify({
      activeProfileKey: "alice|a|1",
      profiles: {
        "alice|a|1": {
          profile: { first: "Alice", last: "A", period: "1" },
          completions: { [week]: { "BR-01": { entries: 1, submittedAt: "2026-07-28T10:00:00Z" } } }
        }
      }
    }),
    "fontaineHub:target-market:v1": JSON.stringify({
      [week]: {
        profile: { first: "Bob", last: "B", period: "2" },
        completions: { "TM-01": { entries: 2, submittedAt: "2026-07-28T11:00:00Z" } }
      }
    }),
    "fontaineAgency:v1": JSON.stringify({
      profile: { first: "Bob", last: "B", period: "2", role: "creative" },
      completions: { "WA-01": { entries: 4, completedAt: "2026-07-29T12:00:00Z" } }
    })
  };

  const { store } = loadStore(seed);
  const alice = { first: "Alice", last: "A", period: "1" };
  const bob = { first: "Bob", last: "B", period: "2" };

  assert.deepEqual(store.getAllHistory({ profile: alice }).map(item => item.missionId), ["BR-01"]);
  assert.deepEqual(store.getAllHistory({ profile: bob }).map(item => item.missionId).sort(), ["TM-01", "WA-01"]);
  assert.equal(store.getAgencyRole({ profile: bob }), "creative");
  assert.equal(store.getActiveProfile().first, "Alice");
});

test("agency projects produce review-queue submissions", () => {
  const html = read("wolverine-agency.html");
  const script = read("wolverine-agency.js");
  assert.match(html, /id="copyAgencyTeacherPacket"/);
  assert.match(script, /FMN-REVIEW:/);
  assert.match(script, /receiptCode:\s*saved\.code/);
  assert.match(script, /responses:\s*answers\.map/);
});

test("returned work can be resubmitted and approved after the entry cap", () => {
  const localStorage = new MemoryStorage();
  const field = { value: "" };
  const notices = [];
  const window = {
    prompt: () => "Add more specific evidence.",
    confirm: () => true
  };
  const document = {
    getElementById: id => id === "missionReviewPacket" ? field : null,
    querySelector: () => null
  };
  const state = { page: "Other" };
  let render = () => {};
  const context = {
    window,
    document,
    localStorage,
    state,
    render,
    toast: message => notices.push(message),
    Date,
    JSON,
    Object,
    String,
    Number,
    Boolean,
    Math,
    Array,
    Error,
    Blob,
    URL,
    atob,
    escape,
    decodeURIComponent
  };
  vm.runInNewContext(read("topic-hubs-review-queue.js"), context);

  const submittedAt = "2026-07-28T10:00:00Z";
  const packet = response => `FMN-REVIEW:${Buffer.from(JSON.stringify({
    version: 1,
    student: "Jordan J.",
    first: "Jordan",
    last: "J",
    period: "5",
    topic: "Brand Studio",
    mission: "BR-01 — Brand Snapshot",
    receiptCode: "BR-01-0727-ABCDE",
    provisionalEntries: 4,
    responses: [{ step: 1, response }],
    submittedAt
  }), "utf8").toString("base64")}`;

  field.value = packet("First response");
  window.importMissionReview();
  window.returnMissionReview(0);
  field.value = packet("Revised response with stronger evidence");
  window.importMissionReview();

  let queue = JSON.parse(localStorage.getItem("fontaineMissionReviewQueue:v1"));
  assert.equal(queue.length, 1);
  assert.equal(queue[0].status, "Pending");
  assert.equal(queue[0].revisionCount, 1);
  assert.equal(queue[0].responses[0].response, "Revised response with stronger evidence");

  localStorage.setItem("fontaineTopicHubAdmin:v1", JSON.stringify({
    settings: { entryCap: 10 },
    ledgers: {
      "2026-07-27": [{ name: "Jordan J.", period: "5", source: "Prior work", entries: 10 }]
    },
    winners: {}
  }));
  window.approveMissionReview(0);

  queue = JSON.parse(localStorage.getItem("fontaineMissionReviewQueue:v1"));
  assert.equal(queue[0].status, "Approved");
  assert.equal(queue[0].approvedEntries, 0);
  assert.match(queue[0].teacherNote, /weekly cap/i);
});

console.log("\nMission Network QA checks registered.");
