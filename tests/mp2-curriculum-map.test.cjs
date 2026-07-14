const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const sourceCode=fs.readFileSync(path.join(root,'mp2-source-data.js'),'utf8');
const mapCode=fs.readFileSync(path.join(root,'mp2-curriculum-map.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');

const courses=[['SEM','8175','SEM'],['Fashion','8140','FASH'],['Entrepreneurship','9093','ENT']];
const lessons=courses.flatMap(([course,courseCode,prefix])=>Array.from({length:20},(_,index)=>({id:`${prefix}-${String(index+1).padStart(3,'0')}`,course,courseCode,title:`${course} MP1 ${index+1}`,unit:'MP1 Unit',unitId:'mp1',day:index+1,status:'Complete',standards:'MP1',duration:'45–60 minutes',components:['Lesson Plan'],overview:'Complete',target:'I will learn.',success:'80% accuracy',agenda:[],bellRinger:'',miniLesson:'',activity:'',exitTicket:'',materials:[],differentiation:[],canvas:'',notes:'',version:'Version 1'})));
const data={courses:courses.map(([title,code])=>({title,code})),units:{},lessonTitles:{},resources:[]};
const resources=[];
const state={page:'Dashboard',selected:lessons[0],lessonTab:'Overview',search:'',course:'All',status:'All'};
const context={
 console,data,lessons,resources,state,CURRENT_DAY:8,window:null,
 FONTaineStandards:{courseStandards:[],wrsMappings:{}},
 FONTaineDriveInventory:{files:[]},
 shell(content){return `<main>${content}</main>`;},badge(status){return `<b>${status}</b>`;},openLesson(){},go(){},render(){},
 lessonView(){return '<span class="pill">SEM</span><strong>WRS aligned</strong>Lesson added to the MP1 curriculum map.';},
 lessonList(){return '';},courses(){return '';},buildQueue(){return '';},dashboard(){return ''}
};
context.window=context;
vm.createContext(context);

let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('MP2 JavaScript parses',()=>{
 new vm.Script(sourceCode,{filename:'mp2-source-data.js'});
 new vm.Script(mapCode,{filename:'mp2-curriculum-map.js'});
});
test('index loads MP2 source data before app and map after companion resources',()=>{
 const source=index.indexOf('mp2-source-data.js');
 const app=index.indexOf('app.js');
 const companion=index.indexOf('companion-resources.js');
 const map=index.indexOf('mp2-curriculum-map.js');
 assert.ok(source>=0&&app>=0&&companion>=0&&map>=0);
 assert.ok(source<app&&app<companion&&companion<map);
});

vm.runInContext(sourceCode,context,{filename:'mp2-source-data.js'});
vm.runInContext(mapCode,context,{filename:'mp2-curriculum-map.js'});

test('adds exactly 60 MP2 lessons without changing the 60 MP1 lessons',()=>{
 assert.equal(context.FONTaineMP2Audit.total,60);
 assert.equal(lessons.length,120);
 assert.equal(lessons.filter(lesson=>lesson.markingPeriod==='MP1').length,60);
});
test('maps 20 lessons for each course with continuous 021 through 040 IDs',()=>{
 for(const [course,,prefix] of courses){
  const mapped=lessons.filter(lesson=>lesson.course===course&&lesson.markingPeriod==='MP2');
  assert.equal(mapped.length,20);
  assert.equal(mapped[0].id,`${prefix}-021`);
  assert.equal(mapped.at(-1).id,`${prefix}-040`);
 }
});
test('every MP2 lesson is source-backed, planned, and formatted for later build',()=>{
 const mapped=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 mapped.forEach(lesson=>{
  assert.equal(lesson.status,'Planned');
  assert.equal(lesson.mapStatus,'Mapped');
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
  assert.ok(lesson.components.some(component=>component.startsWith('Missing full lesson plan')));
  assert.ok(lesson.standards.length>5);
 });
});
test('maps all nine pacing-guide units and nine MP2 standards records',()=>{
 assert.equal(context.FONTaineMP2Audit.units,9);
 assert.equal(context.FONTaineMP2Audit.standards,9);
 assert.equal(context.FONTaineStandards.courseStandards.filter(record=>record.id.includes('MP2')).length,9);
 assert.equal(data.units['sem-mp2-u01'],'Promotion');
 assert.equal(data.units['fash-mp2-u02'],'Selling Process');
 assert.equal(data.units['ent-mp2-u03'],'Financial Statements');
});
test('links verified classroom resources without duplicating existing records',()=>{
 assert.equal(context.FONTaineMP2Audit.resources,17);
 assert.ok(resources.some(resource=>resource.title.includes('SEM Promo Mix')));
 assert.ok(resources.some(resource=>resource.title.includes('Business Reboot')));
 assert.ok(context.FONTaineDriveInventory.files.some(file=>file.lessonIds.includes('FASH-040')));
});
test('lesson list supports MP2 and course filtering',()=>{
 state.markingPeriod='MP2';
 state.course='All';
 state.status='All';
 state.search='';
 let html=context.lessonList();
 assert.match(html,/60 lessons/);
 assert.match(html,/SEM-021/);
 assert.match(html,/FASH-040/);
 assert.match(html,/ENT-040/);
 state.course='SEM';
 html=context.lessonList();
 assert.match(html,/20 lessons/);
 assert.doesNotMatch(html,/FASH-021/);
});
test('course, dashboard, and build queue views expose the MP2 map',()=>{
 assert.match(context.courses(),/20<\/strong> MP2 mapped/);
 assert.match(context.dashboard(),/60<\/div><div class="muted">Source-backed lessons mapped/);
 state.buildCourse='All';
 state.buildPeriod='MP2';
 assert.match(context.buildQueue(),/60 mapped lessons awaiting full packages/);
});
test('source registry records the official guides and all 60 lesson mappings',()=>{
 assert.equal(context.FONTaineMP2Sources.masterSources.length,5);
 assert.equal(Object.keys(context.FONTaineMP2Sources.lessons).length,60);
 assert.equal(context.FONTaineMP2Sources.summary.lessons,60);
});
test('running the map twice does not duplicate lessons or standards',()=>{
 vm.runInContext(mapCode,context,{filename:'mp2-curriculum-map.js'});
 assert.equal(lessons.filter(lesson=>lesson.markingPeriod==='MP2').length,60);
 assert.equal(context.FONTaineStandards.courseStandards.filter(record=>record.id.includes('MP2')).length,9);
});

console.log(`\n${passed} MP2 curriculum map QA checks passed.`);