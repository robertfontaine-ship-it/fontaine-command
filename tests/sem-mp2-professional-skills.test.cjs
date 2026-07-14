const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const sourceCode=fs.readFileSync(path.join(root,'mp2-source-data.js'),'utf8');
const mapCode=fs.readFileSync(path.join(root,'mp2-curriculum-map.js'),'utf8');
const promotionCode=fs.readFileSync(path.join(root,'sem-mp2-promotion-packages.js'),'utf8');
const promotionPatchCode=fs.readFileSync(path.join(root,'sem-mp2-promotion-quality-patch.js'),'utf8');
const sellingCode=fs.readFileSync(path.join(root,'sem-mp2-selling-packages.js'),'utf8');
const packageCode=fs.readFileSync(path.join(root,'sem-mp2-professional-skills-packages.js'),'utf8');
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

test('package JavaScript parses',()=>new vm.Script(packageCode,{filename:'sem-mp2-professional-skills-packages.js'}));
test('index loads all SEM MP2 packages before build progress and compatibility',()=>{
 const map=index.indexOf('mp2-curriculum-map.js');
 const promotion=index.indexOf('sem-mp2-promotion-packages.js');
 const selling=index.indexOf('sem-mp2-selling-packages.js');
 const professional=index.indexOf('sem-mp2-professional-skills-packages.js');
 const progress=index.indexOf('mp2-build-progress.js');
 const compatibility=index.indexOf('mp2-compatibility.js');
 assert.ok([map,promotion,selling,professional,progress,compatibility].every(value=>value>=0));
 assert.ok(map<promotion&&promotion<selling&&selling<professional&&professional<progress&&progress<compatibility);
});

vm.runInContext(sourceCode,context,{filename:'mp2-source-data.js'});
vm.runInContext(mapCode,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(promotionCode,context,{filename:'sem-mp2-promotion-packages.js'});
vm.runInContext(promotionPatchCode,context,{filename:'sem-mp2-promotion-quality-patch.js'});
vm.runInContext(sellingCode,context,{filename:'sem-mp2-selling-packages.js'});
vm.runInContext(packageCode,context,{filename:'sem-mp2-professional-skills-packages.js'});

const professional=lessons.filter(lesson=>/^SEM-0(36|37|38|39|40)$/.test(lesson.id));
const required=['overview','target','success','agenda','bellRinger','miniLesson','activity','exitTicket','materials','differentiation','canvas','standards','notes','version'];

test('builds exactly five SEM Professional Skills packages',()=>{
 assert.equal(professional.length,5);
 assert.equal(context.FONTaineSEMMP2ProfessionalSkillsPackages.count,5);
 assert.deepEqual(Array.from(context.FONTaineSEMMP2ProfessionalSkillsPackages.lessonIds),['SEM-036','SEM-037','SEM-038','SEM-039','SEM-040']);
});
test('all five lessons are complete built MP2 packages',()=>{
 professional.forEach(lesson=>{
  assert.equal(lesson.markingPeriod,'MP2');
  assert.equal(lesson.status,'Complete');
  assert.equal(lesson.mapStatus,'Built');
  assert.deepEqual(Array.from(lesson.components),['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions']);
  required.forEach(field=>assert.ok(Array.isArray(lesson[field])?lesson[field].length>0:String(lesson[field]||'').trim().length>0,`${lesson.id} missing ${field}`));
 });
});
test('targets and success criteria follow Fontaine format',()=>{
 professional.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
 });
});
test('professional skills sequence covers communication, resources, customer service, case analysis, and cumulative review',()=>{
 assert.match(lessons.find(lesson=>lesson.id==='SEM-036').activity,/active-listening|communication stations/i);
 assert.match(lessons.find(lesson=>lesson.id==='SEM-037').activity,/resource allocation|work-back schedule/i);
 assert.match(lessons.find(lesson=>lesson.id==='SEM-038').activity,/customer journey|service-recovery/i);
 assert.match(lessons.find(lesson=>lesson.id==='SEM-039').activity,/case|role-play|evaluator/i);
 assert.match(lessons.find(lesson=>lesson.id==='SEM-040').activity,/performance check|error analysis/i);
});
test('verified case and review resources remain linked',()=>{
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-039').sourceIds.includes('sem-role-play'));
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-039').sourceIds.includes('sem-case-review'));
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-039').sourceIds.includes('sem-case-analysis'));
 assert.ok(lessons.find(lesson=>lesson.id==='SEM-040').sourceIds.includes('sem-semester-review'));
 assert.match(lessons.find(lesson=>lesson.id==='SEM-040').notes,/1mPlPuqQ6x05BaABvWKCsm2brMxFNt5HsIZbl5pVzpnA/);
});
test('all 20 SEM MP2 packages are complete while 40 other MP2 lessons remain planned',()=>{
 const mp2=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 const semMp2=mp2.filter(lesson=>lesson.course==='SEM');
 assert.equal(semMp2.filter(lesson=>lesson.status==='Complete').length,20);
 assert.equal(mp2.filter(lesson=>lesson.status==='Complete').length,20);
 assert.equal(mp2.filter(lesson=>lesson.status==='Planned').length,40);
});

console.log(`\n${passed} SEM MP2 Professional Skills package QA checks passed.`);