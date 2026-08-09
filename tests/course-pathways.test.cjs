const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

class MemoryStorage {
  constructor(seed = {}) { this.values = new Map(Object.entries(seed).map(([key, value]) => [key, String(value)])); }
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(String(key), String(value)); }
  removeItem(key) { this.values.delete(key); }
}

function loadStore(seed = {}) {
  const localStorage = new MemoryStorage(seed);
  const window = {};
  vm.runInNewContext(read("mission-data-store.js"), { window, localStorage, Date, JSON, Object, String, Number, Boolean, Math, Map, Set, Array, Error });
  return { store: window.FontaineMissionStore, localStorage };
}

function loadPathways() {
  const window = {};
  vm.runInNewContext(read("course-pathways-data.js"), { window, Object, String, Number, Boolean, Array });
  return window.FontaineCoursePathways;
}

test("course pathway JavaScript parses and loads in dependency order", () => {
  ["course-pathways-data.js", "course-pathways.js", "course-pathways-expansion.js"].forEach(file => {
    assert.doesNotThrow(() => new Function(read(file)), file);
  });
  const html = read("course-pathways.html");
  const storeIndex = html.indexOf('src="mission-data-store.js"');
  const dataIndex = html.indexOf('src="course-pathways-data.js"');
  const accessibilityIndex = html.indexOf('src="mission-accessibility.js"');
  const logicIndex = html.indexOf('src="course-pathways.js"');
  assert.ok(storeIndex >= 0 && dataIndex > storeIndex && accessibilityIndex > dataIndex && logicIndex > accessibilityIndex);
});

test("SEM, Fashion, and Entrepreneurship each expose six five-question 80-percent gates", () => {
  const pathways = loadPathways();
  assert.equal(pathways.MASTERY_THRESHOLD, 80);
  assert.deepEqual(Object.keys(pathways.COURSES), ["sem", "fashion", "entrepreneurship"]);
  assert.deepEqual(pathways.courseList.map(course => course.code), ["8175", "8140", "9093"]);
  const stageIds = new Set();
  const questionIds = new Set();
  let questionCount = 0;
  pathways.courseList.forEach(course => {
    assert.equal(course.stages.length, 6, `${course.id} has six gates`);
    course.stages.forEach(stage => {
      assert.ok(!stageIds.has(stage.id), `unique stage ${stage.id}`);
      stageIds.add(stage.id);
      assert.equal(stage.questions.length, 5, `${stage.id} has five questions`);
      assert.ok(stage.evidence.options.length >= 1, `${stage.id} has applied evidence`);
      stage.questions.forEach(question => {
        questionCount += 1;
        assert.ok(!questionIds.has(question.id), `unique question ${question.id}`);
        questionIds.add(question.id);
        assert.equal(question.choices.length, 4, `${question.id} has four choices`);
        assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${question.id} has a valid answer`);
        assert.ok(question.feedback.length >= 30, `${question.id} includes targeted feedback`);
        assert.ok(fs.existsSync(path.join(ROOT, question.reviewHref)), `${question.id} remediation route exists`);
      });
    });
  });
  assert.equal(questionCount, 90);
});

test("every applied mission route points to a live page and declared mission", () => {
  const pathways = loadPathways();
  const missionSources = [
    "topic-hubs.js", "target-market-hub.js", "four-ps-hub.js", "promotional-mix-hub.js",
    "market-research-hub.js", "pricing-strategy-hub.js", "distribution-hub.js",
    "selling-customer-service-hub.js", "startup-street.js", "wolverine-agency.js"
  ].map(read).join("\n");
  pathways.courseList.forEach(course => course.stages.forEach(stage => stage.evidence.options.forEach(option => {
    assert.ok(fs.existsSync(path.join(ROOT, option.href)), `${option.href} exists`);
    option.missionIds.forEach(id => assert.match(missionSources, new RegExp(`(?:id|missionId):\\s*["']${id.replaceAll("-", "\\-")}["']`), `${id} is live`));
  })));
});

test("mastery attempts are isolated, retryable, and portable with the Mission ID", () => {
  const source = loadStore().store;
  const alex = source.setActiveProfile({ first: "Alex", last: "A", period: "1" });
  source.setActivePathway("sem", { profile: alex });
  const first = source.savePathwayAttempt({
    courseId: "sem", stageId: "sem-fan-intelligence", score: 3, total: 5,
    answers: { "sem-fi-1": 0 }, missedQuestionIds: ["sem-fi-1", "sem-fi-2"], profile: alex
  });
  assert.equal(first.latestPercent, 60);
  assert.equal(first.passed, false);
  assert.equal(first.attemptsCount, 1);

  const retry = source.savePathwayAttempt({
    courseId: "sem", stageId: "sem-fan-intelligence", score: 4, total: 5,
    answers: { "sem-fi-1": 2 }, missedQuestionIds: ["sem-fi-2"], profile: alex
  });
  assert.equal(retry.latestPercent, 80);
  assert.equal(retry.bestPercent, 80);
  assert.equal(retry.passed, true);
  assert.equal(retry.attemptsCount, 2);

  const bob = source.setActiveProfile({ first: "Bob", last: "B", period: "1" });
  assert.equal(source.getPathwayProgress({ profile: bob }).activeCourse, "");
  assert.equal(Object.keys(source.getPathwayProgress({ profile: bob }).courses).length, 0);

  const backup = source.exportProfile({ profile: alex });
  assert.equal(backup.missionData.pathways.activeCourse, "sem");
  const destination = loadStore().store;
  const imported = destination.importProfile(JSON.parse(JSON.stringify(backup)));
  assert.equal(imported.pathwayGates, 1);
  const restored = destination.getPathwayProgress();
  assert.equal(restored.courses.sem.stages["sem-fan-intelligence"].passed, true);
  assert.equal(restored.courses.sem.stages["sem-fan-intelligence"].attemptsCount, 2);
});

test("pathways are connected to City Hall, Mission Control, Mission ID, navigation, and backups", () => {
  assert.match(read("business-world.html"), /course-pathways-expansion\.js/);
  assert.match(read("mission-control.html"), /id="mcPathwayTitle"/);
  assert.match(read("student-mission-id.html"), /id="coursePathwayProgress"/);
  assert.match(read("mission-accessibility.js"), /course-pathways\.html/);
  assert.match(read("mission-data-store.js"), /pathways:\s*normalizePathways/);
  assert.match(read("course-pathways.html"), /4 of 5 correct \(80%\)/i);
  assert.match(read("course-pathways.html"), /Retries are unlimited/i);
});
