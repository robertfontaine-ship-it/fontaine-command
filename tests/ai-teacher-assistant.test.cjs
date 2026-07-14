const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const assistantSource = fs.readFileSync(path.join(root, 'ai-teacher-assistant.js'), 'utf8');
const bridgeSource = fs.readFileSync(path.join(root, 'ai-teacher-bridge.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const storage = new Map();
let forwardedAskCalls = 0;
let askInputValue = '';
let prevented = false;
const appNode = { outerHTML: '' };

const lessons = [
  {
    id: 'SEM-008', course: 'SEM', day: 1, title: 'SEM Industries Overview',
    unit: 'Importance of SEM Industries', duration: '45–60 minutes',
    target: 'I will identify major SEM industry segments.',
    success: 'I will classify industry examples with at least 80% accuracy.',
    agenda: ['Bell ringer', 'Mini lesson', 'Application', 'Exit ticket'],
    activity: 'Classify sports and entertainment businesses.',
    exitTicket: 'Explain one overlooked SEM business.',
    materials: ['SEM Industries slides', 'Industry examples'],
    standards: 'SEM 8175.044–046', status: 'Complete', readinessScore: 100,
    missingComponents: []
  },
  {
    id: 'FASH-009', course: 'Fashion', day: 2, title: 'Color Theory in Fashion',
    unit: 'Fashion Marketing Concept', duration: '45–60 minutes',
    target: 'I will apply color theory to a target customer.',
    success: 'I will build and justify a color palette with at least 80% accuracy.',
    agenda: ['Bell ringer', 'Color theory model', 'Palette activity', 'Exit ticket'],
    activity: 'Create a target-customer color story.',
    exitTicket: 'Defend the most important color choice.',
    materials: ['Color in Fashion slides'], standards: 'Fashion 8140 design competencies',
    status: 'Needs Materials', readinessScore: 82, missingComponents: ['worksheet']
  },
  {
    id: 'SEM-014', course: 'SEM', day: 2, title: 'Sponsorships and Endorsements',
    unit: 'Sponsorships and Endorsements', duration: '45–60 minutes',
    target: 'I will evaluate endorsement partnerships.',
    success: 'I will defend a partnership decision with at least 80% accuracy.',
    agenda: ['Hook', 'Case study', 'Recommendation', 'Exit ticket'],
    activity: 'Analyze endorsement case studies.',
    exitTicket: 'Identify the strongest brand fit.',
    materials: ['Endorsement case studies'], standards: 'SEM 8175.087+',
    status: 'Complete', readinessScore: 100, missingComponents: []
  },
  {
    id: 'FASH-015', course: 'Fashion', day: 3, title: 'Fashion Designers and Branding',
    unit: 'Fashion Designers & Branding', duration: '45–60 minutes',
    target: 'I will explain how designer signatures strengthen brands.',
    success: 'I will support a brand-signature claim with at least 80% accuracy.',
    agenda: ['Hook', 'Designer model', 'Brand card', 'Exit ticket'],
    activity: 'Create a designer brand card.',
    exitTicket: 'Identify the strongest signature element.',
    materials: ['Designer examples'], standards: 'Fashion 8140 branding competencies',
    status: 'Complete', readinessScore: 100, missingComponents: []
  }
];

const context = {
  console,
  state: { page: 'Dashboard' },
  pages: ['Dashboard', 'Ask Fontaine', 'Lesson Builder', 'Lesson Builder 2.0'],
  lessons,
  instructionalDay: 1,
  driveFiles: [
    { title: 'SEM Industries', type: 'Google Slides', match: { confidence: 97, lessons: [{ id: 'SEM-008' }] } },
    { title: 'Color in Fashion', type: 'Google Slides', match: { confidence: 95, lessons: [{ id: 'FASH-009' }] } }
  ],
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  },
  navigator: { clipboard: { writeText: async () => {} } },
  document: {
    getElementById(id) {
      if (id === 'askInput') return { value: askInputValue };
      if (id === 'app') return appNode;
      return null;
    }
  },
  render() {},
  resetLocalData() {},
  shell(html) { return html; },
  toast() {},
  go() {},
  openLesson() {},
  openCanvasPackage() {},
  ask() { forwardedAskCalls += 1; },
  lessonsForDay(day) { return lessons.filter(lesson => lesson.day === day); },
  searchableLessonText(lesson) {
    return [lesson.id, lesson.title, lesson.course, lesson.unit, lesson.target, lesson.activity, lesson.standards]
      .join(' ').toLowerCase();
  },
  reflectionsFor(id) {
    return id === 'SEM-008'
      ? [{ worked: 'Industry examples worked well.', struggled: 'Students confused support businesses with core properties.', change: 'Add a clearer sorting model.', ratings: [4, 3, 4] }]
      : [];
  },
  averageRatings(entry) { return entry.ratings.reduce((sum, score) => sum + score, 0) / entry.ratings.length; },
  revisionPriority(entry) { return /confused/i.test(entry.struggled || '') ? 'Medium' : 'Low'; }
};

vm.createContext(context);

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

// Syntax and integration load-order checks.
test('assistant JavaScript parses', () => new vm.Script(assistantSource, { filename: 'ai-teacher-assistant.js' }));
test('bridge JavaScript parses', () => new vm.Script(bridgeSource, { filename: 'ai-teacher-bridge.js' }));
test('index loads dependencies in safe order', () => {
  const builder = indexSource.indexOf('lesson-builder-2.js');
  const ask = indexSource.indexOf('ask-fontaine.js');
  const assistant = indexSource.indexOf('ai-teacher-assistant.js');
  const bridge = indexSource.indexOf('ai-teacher-bridge.js');
  assert.ok(builder >= 0 && ask >= 0 && assistant >= 0 && bridge >= 0);
  assert.ok(builder < assistant, 'Lesson Builder 2.0 must load before the assistant');
  assert.ok(ask < assistant, 'Ask Fontaine must load before the assistant');
  assert.ok(assistant < bridge, 'Assistant must load before its command bridge');
});

vm.runInContext(assistantSource, context, { filename: 'ai-teacher-assistant.js' });

test('assistant page is registered', () => assert.ok(context.pages.includes('AI Teacher Assistant')));
test('current-day brief returns mapped lessons', () => {
  const response = context.aiTeacherRespond("Give me today's teaching brief");
  assert.equal(response.title, 'Current day teaching brief');
  assert.match(response.summary, /1 mapped lesson/);
});
test('tomorrow brief returns both mapped courses', () => {
  const response = context.aiTeacherRespond('What should I teach tomorrow?');
  assert.equal(response.title, 'Tomorrow teaching brief');
  assert.match(response.summary, /2 mapped lessons/);
});
test('exact lesson command returns lesson brief', () => {
  const response = context.aiTeacherRespond('Brief me on SEM-008');
  assert.equal(response.title, 'SEM-008 teaching brief');
  assert.ok(response.sections.some(section => section.title === 'Resources'));
});
test('substitute command creates independent no-group-work plan', () => {
  const response = context.aiTeacherRespond('Create a substitute plan for SEM-008');
  assert.equal(response.title, 'SEM-008 independent substitute plan');
  assert.match(response.summary, /no-group-work/);
  assert.ok(response.sections.some(section => /independent/i.test(section.title)));
});
test('reteach command uses saved classroom evidence', () => {
  const response = context.aiTeacherRespond('Reteach SEM-008 because students struggled');
  assert.equal(response.title, 'SEM-008 reteach plan');
  assert.match(response.sections[0].body, /confused support businesses/i);
});
test('differentiation command returns supports and extension', () => {
  const response = context.aiTeacherRespond('Differentiate FASH-009');
  assert.equal(response.title, 'FASH-009 differentiation plan');
  assert.ok(response.sections.some(section => section.title === 'Advanced extension'));
});
test('condensed command returns a 30-minute sequence', () => {
  const response = context.aiTeacherRespond('Create a 30 minute version of FASH-015');
  assert.equal(response.title, 'FASH-015 30-minute version');
  assert.equal(response.sections[0].items.length, 5);
});
test('engagement command returns active-learning rounds', () => {
  const response = context.aiTeacherRespond('Make SEM-014 more engaging');
  assert.equal(response.title, 'SEM-014 engagement upgrade');
  assert.equal(response.sections[1].items.length, 3);
});
test('curriculum health respects course filter', () => {
  context.state.aiTeacher.course = 'Fashion';
  const response = context.aiTeacherRespond('Show curriculum health priorities');
  assert.match(response.summary, /2 lessons analyzed/);
  context.state.aiTeacher.course = 'All';
});
test('topic search recommends relevant curriculum', () => {
  const response = context.aiTeacherRespond('Find fashion color theory resources');
  assert.equal(response.title, 'Curriculum recommendations');
  assert.ok(response.sections[0].items.some(item => item.includes('FASH-009')));
});
test('selected lesson context works without an ID in the command', () => {
  context.state.aiTeacher.lessonId = 'FASH-009';
  const response = context.aiTeacherRespond('Create a reteach plan');
  assert.equal(response.title, 'FASH-009 reteach plan');
  context.state.aiTeacher.lessonId = '';
});
test('builder handoff carries lesson context and requested variant', () => {
  context.aiSendToBuilder('SEM-014', 'Engagement');
  assert.equal(context.state.page, 'Lesson Builder 2.0');
  assert.equal(context.state.lb2.course, 'SEM');
  assert.equal(context.state.lb2.style, 'Competitive');
  assert.match(context.state.lb2.topic, /Engagement Version/);
  context.state.page = 'Dashboard';
});
test('assistant response exports useful plain text', () => {
  context.state.aiTeacher.response = context.aiTeacherRespond('Create a sub plan for SEM-008');
  const text = context.aiResponsePlainText();
  assert.match(text, /SEM-008 independent substitute plan/);
  assert.match(text, /Substitute overview/);
});
test('request history is persisted', () => {
  context.aiTeacherSuggestion('Show curriculum health priorities');
  const saved = JSON.parse(storage.get('fontaine-command-ai-teacher-history'));
  assert.equal(saved[0].query, 'Show curriculum health priorities');
});

// Main search-bar bridge routing.
vm.runInContext(bridgeSource, context, { filename: 'ai-teacher-bridge.js' });
test('bridge routes assistant workflow commands', () => {
  askInputValue = 'Create a sub plan for SEM-008';
  prevented = false;
  const before = forwardedAskCalls;
  context.ask({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(forwardedAskCalls, before);
  assert.equal(context.state.page, 'AI Teacher Assistant');
  assert.equal(context.state.aiTeacher.response.title, 'SEM-008 independent substitute plan');
});
test('bridge preserves normal Ask Fontaine searches', () => {
  askInputValue = 'Find pricing lessons';
  const before = forwardedAskCalls;
  context.ask({ preventDefault() {} });
  assert.equal(forwardedAskCalls, before + 1);
});

console.log(`\n${passed} AI Teacher Assistant QA checks passed.`);
