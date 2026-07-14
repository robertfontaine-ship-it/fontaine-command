const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const sourceCode=fs.readFileSync(path.join(root,'mp2-source-data.js'),'utf8');
const mapCode=fs.readFileSync(path.join(root,'mp2-curriculum-map.js'),'utf8');
const packageCode=fs.readFileSync(path.join(root,'sem-mp2-promotion-packages.js'),'utf8');
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
 lessonView(){return '<span class="pill">SEM</span><strong>WRS aligned</strong>Lesson added to the MP1 curriculum map.';},lessonList(){return '';},courses(){return '';},buildQueue(){return '';},dashboard(){return ''}
};
context.window=context;
vm.createContext(context);
let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('package JavaScript parses',()=>new vm.Script(packageCode,{filename:'sem-mp2-promotion-packages.js'}));
test('index loads MP2 map before promotion packages and compatibility after them',()=>{
 const map=index.indexOf('mp2-curriculum-map.js');
 const packages=index.indexOf('sem-mp2-promotion-packages.js');
 const compatibility=index.indexOf('mp2-compatibility.js');
 assert.ok(map>=0&&packages>=0&&compatibility>=0);
 assert.ok(map<packages&&packages<compatibility);
});

vm.runInContext(sourceCode,context,{filename:'mp2-source-data.js'});
vm.runInContext(mapCode,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(packageCode,context,{filename:'sem-mp2-promotion-packages.js'});

const promotion=lessons.filter(lesson=>/^SEM-02[1-8]$/.test(lesson.id));
const required=['overview','target','success','agenda','bellRinger','miniLesson','activity','exitTicket','materials','differentiation','canvas','standards','notes','version'];

test('builds exactly eight SEM Promotion packages',()=>{
 assert.equal(promotion.length,8);
 assert.equal(context.FONTaineSEMMP2PromotionPackages.count,8);
 assert.deepEqual(context.FONTaineSEMMP2PromotionPackages.lessonIds,['SEM-021','SEM-022','SEM-023','SEM-024','SEM-025','SEM-026','SEM-027','SEM-028']);
});
test('all eight lessons are complete built MP2 packages',()=>{
 promotion.forEach(lesson=>{
  assert.equal(lesson.markingPeriod,'MP2');
  assert.equal(lesson.status,'Complete');
  assert.equal(lesson.mapStatus,'Built');
  assert.deepEqual(lesson.components,['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions']);
  required.forEach(field=>assert.ok(Array.isArray(lesson[field])?lesson[field].length>0:String(lesson[field]||'').trim().length>0,`${lesson.id} missing ${field}`));
 });
});
test('targets and success criteria follow Fontaine format',()=>{
 promotion.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
 });
});
test('verified promotional resources remain linked to the correct lessons',()=>{
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-021').sourceIds.includes('sem-promo-notes'));
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-026').sourceIds.includes('sem-promo-sort'));
 assert.match(lessons.find(lesson=>lesson.id==='SEM-026').notes,/1kkndbvugBfcMGsmf292kmzR5NAOof-0aN4HyA0QROpA/);
});
test('campaign planning and performance task include measurement and evidence',()=>{
 assert.match(lessons.find(lesson=>lesson.id==='SEM-027').activity,/budget|measurement dashboard/i);
 assert.match(lessons.find(lesson=>lesson.id==='SEM-028').activity,/pitch|scorecard|questions/i);
});
test('the remaining 52 MP2 lessons stay planned',()=>{
 const mp2=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 assert.equal(mp2.filter(lesson=>lesson.status==='Complete').length,8);
 assert.equal(mp2.filter(lesson=>lesson.status==='Planned').length,52);
});

console.log(`\n${passed} SEM MP2 Promotion package QA checks passed.`);