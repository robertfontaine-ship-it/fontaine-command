const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const files={
 source:fs.readFileSync('mp2-source-data.js','utf8'),
 map:fs.readFileSync('mp2-curriculum-map.js','utf8'),
 semPromotion:fs.readFileSync('sem-mp2-promotion-packages.js','utf8'),
 semPromotionPatch:fs.readFileSync('sem-mp2-promotion-quality-patch.js','utf8'),
 semSelling:fs.readFileSync('sem-mp2-selling-packages.js','utf8'),
 semProfessional:fs.readFileSync('sem-mp2-professional-skills-packages.js','utf8'),
 fashionPromotion:fs.readFileSync('fashion-mp2-promotion-packages.js','utf8'),
 fashionPatch:fs.readFileSync('fashion-mp2-promotion-quality-patch.js','utf8'),
 index:fs.readFileSync('index.html','utf8')
};
const courseRows=[['SEM','8175','SEM'],['Fashion','8140','FASH'],['Entrepreneurship','9093','ENT']];
const lessons=courseRows.flatMap(([course,courseCode,prefix])=>Array.from({length:20},(_,index)=>({id:`${prefix}-${String(index+1).padStart(3,'0')}`,course,courseCode,title:`${course} MP1 ${index+1}`,unit:'MP1 Unit',unitId:'mp1',day:index+1,status:'Complete',markingPeriod:'MP1',standards:'MP1',duration:'45–60 minutes',components:['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions'],overview:'Complete',target:'I will learn.',success:'80% accuracy',agenda:[],bellRinger:'',miniLesson:'',activity:'',exitTicket:'',materials:[],differentiation:[],canvas:'',notes:'',version:'Version 1'})));
const data={courses:courseRows.map(([title,code])=>({title,code})),units:{},lessonTitles:{},resources:[]};
const resources=[];
const state={page:'Dashboard',selected:lessons[0],lessonTab:'Overview',search:'',course:'All',status:'All'};
const context={console,data,lessons,resources,state,CURRENT_DAY:8,window:null,FONTaineStandards:{courseStandards:[],wrsMappings:{}},FONTaineDriveInventory:{files:[]},shell(value){return value;},badge(value){return value;},openLesson(){},go(){},render(){},lessonView(){return '';},lessonList(){return '';},courses(){return '';},buildQueue(){return '';},dashboard(){return '';}};
context.window=context;
vm.createContext(context);
let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('Fashion promotion package and quality patch JavaScript parse',()=>{
 new vm.Script(files.fashionPromotion,{filename:'fashion-mp2-promotion-packages.js'});
 new vm.Script(files.fashionPatch,{filename:'fashion-mp2-promotion-quality-patch.js'});
});
test('index loads Fashion promotion package and patch after the MP2 map and before companion progress layers',()=>{
 const map=files.index.indexOf('mp2-curriculum-map.js');
 const professional=files.index.indexOf('sem-mp2-professional-skills-packages.js');
 const fashion=files.index.indexOf('fashion-mp2-promotion-packages.js');
 const patch=files.index.indexOf('fashion-mp2-promotion-quality-patch.js');
 const companions=files.index.indexOf('sem-mp2-companion-resources.js');
 const progress=files.index.indexOf('mp2-build-progress.js');
 assert.ok([map,professional,fashion,patch,companions,progress].every(value=>value>=0));
 assert.ok(map<professional&&professional<fashion&&fashion<patch&&patch<companions&&companions<progress);
});

vm.runInContext(files.source,context,{filename:'mp2-source-data.js'});
vm.runInContext(files.map,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(files.semPromotion,context,{filename:'sem-mp2-promotion-packages.js'});
vm.runInContext(files.semPromotionPatch,context,{filename:'sem-mp2-promotion-quality-patch.js'});
vm.runInContext(files.semSelling,context,{filename:'sem-mp2-selling-packages.js'});
vm.runInContext(files.semProfessional,context,{filename:'sem-mp2-professional-skills-packages.js'});
vm.runInContext(files.fashionPromotion,context,{filename:'fashion-mp2-promotion-packages.js'});
vm.runInContext(files.fashionPatch,context,{filename:'fashion-mp2-promotion-quality-patch.js'});

const promotion=lessons.filter(lesson=>/^FASH-02[1-5]$/.test(lesson.id));
const required=['overview','target','success','agenda','bellRinger','miniLesson','activity','exitTicket','materials','differentiation','canvas','standards','notes','version'];

test('builds exactly five Fashion MP2 Promotional Mix packages',()=>{
 assert.equal(promotion.length,5);
 assert.equal(context.FONTaineFashionMP2PromotionPackages.count,5);
 assert.deepEqual(Array.from(context.FONTaineFashionMP2PromotionPackages.lessonIds),['FASH-021','FASH-022','FASH-023','FASH-024','FASH-025']);
});
test('all five lessons are complete built packages with every required field',()=>{
 promotion.forEach(lesson=>{
  assert.equal(lesson.markingPeriod,'MP2');
  assert.equal(lesson.status,'Complete');
  assert.equal(lesson.mapStatus,'Built');
  assert.deepEqual(Array.from(lesson.components),['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions']);
  required.forEach(field=>assert.ok(Array.isArray(lesson[field])?lesson[field].length>0:String(lesson[field]||'').trim().length>0,`${lesson.id} missing ${field}`));
 });
});
test('targets and success criteria follow Fontaine format',()=>{
 promotion.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
  assert.match(lesson.standards,/8140\.082-\.084/);
 });
});
test('verified Fashion Promotional Mix sources remain linked',()=>{
 assert.ok(lessons.find(lesson=>lesson.id==='FASH-023').sourceIds.includes('fashion-promo-slides'));
 assert.ok(lessons.find(lesson=>lesson.id==='FASH-024').sourceIds.includes('fashion-promo-slides'));
 assert.ok(lessons.find(lesson=>lesson.id==='FASH-024').sourceIds.includes('fashion-promo-sort'));
 assert.ok(lessons.find(lesson=>lesson.id==='FASH-025').sourceIds.includes('fashion-promo-slides'));
 assert.match(lessons.find(lesson=>lesson.id==='FASH-023').notes,/1Y7Yc7Son347JvsHuRzH73fwnNcWPQc0OC53jRQoP18s/);
 assert.match(lessons.find(lesson=>lesson.id==='FASH-024').notes,/1C-t8M7Og-46eOGT5_XMcjIHagOckE6-kQCgOtYM8BtY/);
});
test('sorting lesson preserves the verified 20-card five-category design',()=>{
 const lesson=lessons.find(item=>item.id==='FASH-024');
 assert.match(lesson.activity,/20 business-logo scenario cards/i);
 assert.match(lesson.activity,/four examples assigned to each category/i);
 assert.match(lesson.activity,/advertising, sales promotion, public relations, direct marketing, and personal selling/i);
});
test('Fashion Drop 360 performance task coordinates brand visuals and promotional decisions',()=>{
 const lesson=lessons.find(item=>item.id==='FASH-025');
 assert.match(lesson.activity,/Fashion Drop 360° promotional pack/i);
 assert.match(lesson.activity,/decision matrix/i);
 assert.match(lesson.activity,/budget allocation/i);
 assert.match(lesson.activity,/tone, colors, logo use, value proposition, and call to action/i);
});
test('25 MP2 lessons are complete and 35 remain planned',()=>{
 const mp2=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 assert.equal(mp2.filter(lesson=>lesson.status==='Complete').length,25);
 assert.equal(mp2.filter(lesson=>lesson.status==='Planned').length,35);
 assert.equal(mp2.filter(lesson=>lesson.course==='Fashion'&&lesson.status==='Complete').length,5);
});

console.log(`\n${passed} Fashion MP2 Promotional Mix package QA checks passed.`);