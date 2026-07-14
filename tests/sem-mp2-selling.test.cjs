const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const sourceCode=fs.readFileSync(path.join(root,'mp2-source-data.js'),'utf8');
const mapCode=fs.readFileSync(path.join(root,'mp2-curriculum-map.js'),'utf8');
const promotionCode=fs.readFileSync(path.join(root,'sem-mp2-promotion-packages.js'),'utf8');
const sellingCode=fs.readFileSync(path.join(root,'sem-mp2-selling-packages.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');

const courseRows=[['SEM','8175','SEM'],['Fashion','8140','FASH'],['Entrepreneurship','9093','ENT']];
const lessons=courseRows.flatMap(([course,courseCode,prefix])=>Array.from({length:20},(_,index)=>({id:`${prefix}-${String(index+1).padStart(3,'0')}`,course,courseCode,title:`${course} MP1 ${index+1}`,unit:'MP1 Unit',unitId:'mp1',day:index+1,status:'Complete',standards:'MP1',duration:'45–60 minutes',components:['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions'],overview:'Complete',target:'I will learn.',success:'80% accuracy',agenda:[],bellRinger:'',miniLesson:'',activity:'',exitTicket:'',materials:[],differentiation:[],canvas:'',notes:'',version:'Version 1'})));
const data={courses:courseRows.map(([title,code])=>({title,code})),units:{},lessonTitles:{},resources:[]};
const resources=[];
const state={page:'Dashboard',selected:lessons[0],lessonTab:'Overview',search:'',course:'All',status:'All'};
const context={
 console,data,lessons,resources,state,CURRENT_DAY:8,window:null,
 FONTaineStandards:{courseStandards:[],wrsMappings:{}},FONTaineDriveInventory:{files:[]},
 shell(content){return `<main>${content}</main>`;},badge(status){return status;},openLesson(){},go(){},render(){},
 lessonView(){return '<span class="pill">SEM</span><strong>WRS aligned</strong>Lesson added to the MP1 curriculum map.';},lessonList(){return '';},courses(){return '';},buildQueue(){return '';},dashboard(){return '';}
};
context.window=context;
vm.createContext(context);
let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('selling package JavaScript parses',()=>new vm.Script(sellingCode,{filename:'sem-mp2-selling-packages.js'}));
test('index loads selling packages after the MP2 map and before compatibility',()=>{
 const map=index.indexOf('mp2-curriculum-map.js');
 const promotion=index.indexOf('sem-mp2-promotion-packages.js');
 const selling=index.indexOf('sem-mp2-selling-packages.js');
 const compatibility=index.indexOf('mp2-compatibility.js');
 assert.ok(map>=0&&promotion>=0&&selling>=0&&compatibility>=0);
 assert.ok(map<promotion&&promotion<selling&&selling<compatibility);
});

vm.runInContext(sourceCode,context,{filename:'mp2-source-data.js'});
vm.runInContext(mapCode,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(promotionCode,context,{filename:'sem-mp2-promotion-packages.js'});
vm.runInContext(sellingCode,context,{filename:'sem-mp2-selling-packages.js'});

const selling=lessons.filter(lesson=>/^SEM-03[0-5]$/.test(lesson.id)||lesson.id==='SEM-029');
const required=['overview','target','success','agenda','bellRinger','miniLesson','activity','exitTicket','materials','differentiation','canvas','standards','notes','version'];

test('builds exactly seven SEM Selling packages',()=>{
 assert.equal(selling.length,7);
 assert.equal(context.FONTaineSEMMP2SellingPackages.count,7);
 assert.deepEqual(Array.from(context.FONTaineSEMMP2SellingPackages.lessonIds),['SEM-029','SEM-030','SEM-031','SEM-032','SEM-033','SEM-034','SEM-035']);
});
test('all seven lessons are complete built MP2 packages',()=>{
 selling.forEach(lesson=>{
  assert.equal(lesson.markingPeriod,'MP2');
  assert.equal(lesson.status,'Complete');
  assert.equal(lesson.mapStatus,'Built');
  assert.deepEqual(Array.from(lesson.components),['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions']);
  required.forEach(field=>assert.ok(Array.isArray(lesson[field])?lesson[field].length>0:String(lesson[field]||'').trim().length>0,`${lesson.id} missing ${field}`));
 });
});
test('targets and success criteria follow Fontaine format',()=>{
 selling.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
 });
});
test('verified selling resources remain linked to the correct lessons',()=>{
 for(const id of ['SEM-029','SEM-030','SEM-031','SEM-032','SEM-033','SEM-034'])assert.ok(lessons.find(lesson=>lesson.id===id).sourceIds.includes('sem-selling-notes'));
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-035').sourceIds.includes('sem-role-play'));
 assert.match(lessons.find(lesson=>lesson.id==='SEM-035').notes,/1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk/);
});
test('the role-play package integrates the full selling process',()=>{
 const rolePlay=lessons.find(lesson=>lesson.id==='SEM-035');
 assert.match(rolePlay.activity,/needs discovery|feature-benefit|objection|closing|follow-up/i);
 assert.match(rolePlay.activity,/80%-mastery scorecard/i);
});
test('MP2 progress is fifteen complete and forty-five planned lessons',()=>{
 const mp2=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 assert.equal(mp2.filter(lesson=>lesson.status==='Complete').length,15);
 assert.equal(mp2.filter(lesson=>lesson.status==='Planned').length,45);
 assert.equal(mp2.filter(lesson=>lesson.course==='SEM'&&lesson.status==='Complete').length,15);
});

console.log(`\n${passed} SEM MP2 Selling package QA checks passed.`);