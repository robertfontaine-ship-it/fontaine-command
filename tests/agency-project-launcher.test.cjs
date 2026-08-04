const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");
const btoa = value => Buffer.from(value, "binary").toString("base64");
const atob = value => Buffer.from(value, "base64").toString("binary");

class MemoryStorage {
  constructor(seed = {}) { this.values = new Map(Object.entries(seed)); }
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.has(String(key)) ? this.values.get(String(key)) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(String(key)); }
  clear() { this.values.clear(); }
}

function loadKit() {
  const window = {};
  vm.runInNewContext(read("agency-project-kit.js"), {
    window,
    Date,
    JSON,
    Object,
    String,
    Number,
    Boolean,
    Math,
    Array,
    Error,
    Set,
    URL,
    btoa,
    atob,
    escape,
    unescape,
    encodeURIComponent,
    decodeURIComponent
  });
  return window.FontaineAgencyKit;
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
  return { store:window.FontaineMissionStore, localStorage };
}

function sampleLaunch(kit) {
  return kit.validateLaunch({
    launchId: "WMA-QA123",
    templateId: "WA-03",
    period: "3",
    dueDate: "2026-09-18",
    mode: "team",
    teamName: "A202 Launch Lab",
    brief: kit.briefById("WA-03"),
    members: [
      { first:"Mia", last:"M", period:"3", role:"research" },
      { first:"Leo", last:"L", period:"3", role:"creative" }
    ]
  });
}

test("Agency project scripts parse and load in the required order", () => {
  ["agency-project-kit.js", "agency-project-launcher.js", "wolverine-agency.js", "mission-data-store.js", "topic-hubs-review-queue.js"]
    .forEach(file => assert.doesNotThrow(() => new Function(read(file)), file));

  const teacher = read("index.html");
  assert.ok(teacher.indexOf('src="agency-project-kit.js"') < teacher.indexOf('src="mission-data-store.js"'));
  assert.ok(teacher.indexOf('src="topic-hubs-review-queue.js"') < teacher.indexOf('src="agency-project-launcher.js"'));
  assert.match(teacher, /agency-project-launcher\.css/);

  const student = read("wolverine-agency.html");
  assert.ok(student.indexOf('src="agency-project-kit.js"') < student.indexOf('src="mission-data-store.js"'));
  assert.ok(student.indexOf('src="mission-data-store.js"') < student.indexOf('src="wolverine-agency.js"'));
});

test("launch packets preserve edited briefs, team rosters, and distinct role assignments", () => {
  const kit = loadKit();
  assert.equal(kit.roles.length, 6);
  assert.equal(kit.briefs.length, 6);
  const launch = sampleLaunch(kit);
  const code = kit.encodeLaunch(launch);
  assert.match(code, /^FMN-AGENCY-LAUNCH:/);

  const restored = kit.decodeLaunch(code);
  assert.equal(restored.launchId, "WMA-QA123");
  assert.equal(restored.brief.title, "School Store Rebrand");
  assert.equal(restored.members.length, 2);
  assert.equal(restored.members[0].role, "research");
  assert.equal(kit.memberForProfile(restored, { first:"mia", last:"m", period:"3" }).role, "research");

  const prompts = kit.projectPrompts(restored, kit.roleById("research"));
  assert.equal(prompts.length, restored.brief.prompts.length + 4, "team work adds one role order and three accountability checks");
  assert.equal(prompts.filter(prompt => prompt.kind === "accountability").length, 3);

  assert.throws(() => kit.validateLaunch({ ...launch, members:[launch.members[0], { ...launch.members[1], role:"research" }] }), /different Agency role/i);
  assert.throws(() => kit.decodeLaunch("FMN-AGENCY-LAUNCH:damaged"), /incomplete or damaged/i);
});

test("assigned Agency launches remain profile-isolated and travel inside profile backups", () => {
  const kit = loadKit();
  const launch = JSON.parse(JSON.stringify(sampleLaunch(kit)));
  const source = loadStore();
  const mia = source.store.setActiveProfile({ first:"Mia", last:"M", period:"3" });
  source.store.saveAgencyLaunch({ ...launch, joinedRole:"research", joinedAt:"2026-08-03T18:00:00Z" }, { profile:mia });
  source.store.setAgencyRole("research", { profile:mia });

  const leo = source.store.setActiveProfile({ first:"Leo", last:"L", period:"3" });
  assert.equal(source.store.getAgencyLaunches({ profile:leo }).length, 0, "another student cannot see Mia's assignment");
  source.store.saveAgencyLaunch({ ...launch, joinedRole:"creative", joinedAt:"2026-08-03T18:05:00Z" }, { profile:leo });
  assert.equal(source.store.getAgencyLaunch("WMA-QA123", { profile:mia }).joinedRole, "research");
  assert.equal(source.store.getAgencyLaunch("WMA-QA123", { profile:leo }).joinedRole, "creative");

  const backup = source.store.exportProfile({ profile:mia });
  assert.equal(Object.keys(backup.missionData.agencyLaunches).length, 1);
  const destination = loadStore();
  const result = destination.store.importProfile(JSON.parse(JSON.stringify(backup)));
  assert.equal(result.agencyLaunches, 1);
  assert.equal(destination.store.getAgencyLaunch("WMA-QA123").joinedRole, "research");
});

test("teacher launcher provides editable templates, Periods 1–7, rosters, and portable student links", () => {
  const script = read("agency-project-launcher.js");
  const styles = read("agency-project-launcher.css");
  assert.match(script, /Save edited brief as template/);
  assert.match(script, /fontaineAgencyTeacherLaunches:v1/);
  assert.match(script, /Copy student link/);
  assert.match(script, /Team Roster and Role Assignments/);
  assert.match(script, /Array\.from\(\{ length:7 \}/);
  assert.match(script, /Assign a different Agency role|kit\.validateLaunch/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /@media \(max-width: 700px\)/);
});

test("student Agency floor exposes direct joining, assigned projects, and individual accountability packets", () => {
  const html = read("wolverine-agency.html");
  const script = read("wolverine-agency.js");
  const styles = read("wolverine-agency.css");
  const review = read("topic-hubs-review-queue.js");
  ["agencyJoinModal", "agencyLaunchCode", "agencyTeamMemberSelect", "agencyAssignedGrid", "acceptAgencyLaunch"]
    .forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  for (let period = 1; period <= 7; period += 1) assert.match(html, new RegExp(`<option>${period}</option>`));
  assert.match(script, /location\.hash\.includes\("agency-launch="\)/);
  assert.match(script, /individualAccountability/);
  assert.match(script, /teamMembers/);
  assert.match(script, /missionStore\.saveAgencyLaunch/);
  assert.match(styles, /body\.agency-site\s*\{/);
  assert.match(styles, /body\.agency-site \.modal-panel/);
  assert.match(review, /Agency accountability/);
  assert.match(review, /review-response-prompt/);
  assert.match(review, /item\.teamName/);
});
