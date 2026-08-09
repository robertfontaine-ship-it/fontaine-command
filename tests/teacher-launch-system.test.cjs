const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("Teacher Launch and student orientation JavaScript parse", () => {
  ["teacher-launch.js", "teacher-launch-entry.js", "student-orientation.js"].forEach(file => {
    assert.doesNotThrow(() => new Function(read(file)), file);
  });
});

test("Teacher Launch contains every classroom rollout workflow", () => {
  const html = read("teacher-launch.html");
  [
    "Six checks before students enter",
    "Set the starting lane for Periods 1–7",
    "First Five Meetings",
    "Student Orientation",
    "Canvas Handoff",
    "Shared Devices &amp; Recovery"
  ].forEach(label => assert.match(html, new RegExp(label), label));
  assert.ok(html.indexOf('src="mission-data-store.js"') < html.indexOf('src="teacher-launch.js"'), "shared store loads before launch logic");
  assert.match(html, /business-world\.html/);
  assert.match(html, /course-pathways\.html/);
  assert.match(html, /student-mission-id\.html#profileTransfer/);
  assert.match(html, /index\.html\?launch=reviews#mission-review-queue/);
  assert.match(html, /index\.html\?launch=reviews#shared-device-manager/);
});

test("period setup, Canvas handoffs, and mastery rules cover the full launch", () => {
  const source = read("teacher-launch.js");
  assert.match(source, /const PERIODS = \["1", "2", "3", "4", "5", "6", "7"\]/);
  ["SEM", "Fashion", "Entrepreneurship"].forEach(course => assert.match(source, new RegExp(`\\["${course}"`)));
  ["orientation", "mission", "pathway", "early-finisher"].forEach(type => assert.match(source, new RegExp(type)));
  assert.match(source, /4 of 5 correct \(80%\)/);
  assert.match(source, /Attempts are unlimited/);
  assert.match(source, /Canvas is the official submission location/);
  assert.match(source, /fontaineTeacherLaunch:v1/);
});

test("orientation is a six-step accessible, keyboard-controlled student flow", () => {
  const html = read("student-orientation.html");
  const source = read("student-orientation.js");
  assert.equal((html.match(/class="orientation-step/g) || []).length, 6);
  assert.match(html, /80% mastery/);
  assert.match(html, /Canvas is still the official assignment/);
  assert.match(html, /Switch Profile/);
  assert.match(source, /ArrowRight/);
  assert.match(source, /ArrowLeft/);
  assert.match(source, /aria-current/);
  assert.match(source, /heading\.focus/);
});

test("Teacher Command, review queue, device manager, and print kit link into launch", () => {
  const index = read("index.html");
  const entry = read("teacher-launch-entry.js");
  const kit = read("mission-classroom-kit.html");
  assert.match(index, /teacher-launch-entry\.css/);
  assert.match(index, /teacher-launch-entry\.js/);
  assert.ok(index.lastIndexOf('src="teacher-launch-entry.js"') > index.lastIndexOf('src="agency-project-launcher.js"'));
  assert.match(entry, /Teacher Launch/);
  assert.match(entry, /requested === "reviews"/);
  assert.match(read("topic-hubs-review-queue.js"), /id="mission-review-queue"/);
  assert.match(read("topic-hubs-admin.js"), /id="shared-device-manager"/);
  assert.match(kit, /href="teacher-launch\.html"/);
  assert.match(kit, /value="student-orientation\.html"/);
  assert.match(kit, /value="course-pathways\.html"/);
});

test("Mission Network workflow validates the Teacher Launch release", () => {
  const workflow = read(".github/workflows/mission-network-qa.yml");
  assert.match(workflow, /teacher-launch\*/);
  assert.match(workflow, /student-orientation\*/);
  assert.match(workflow, /tests\/teacher-launch-system\.test\.cjs/);
  assert.match(workflow, /tests\/teacher-launch-system-browser\.test\.cjs/);
});
