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
 fashionPromotionPatch:fs.readFileSync('fashion-mp2-promotion-quality-patch.js','utf8'),
 fashionSelling:fs.readFileSync('fashion-mp2-selling-packages.js','utf8'),
 fashionSellingPatch:fs.readFileSync('fashion-mp2-selling-quality-patch.js','utf8'),
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

test('Fashion selling package and quality patch JavaScript parse',()=>{
 new vm.Script(files.fashionSelling,{filename:'fashion-mp2-selling-packages.js'});
 new vm.Script(files.fashionSellingPatch,{filename:'fashion-mp2-selling-quality-patch.js'});
});
test('index loads Fashion selling package and patch after Fashion promotion and before companion progress layers',()=>{
 const map=files.index.indexOf('mp2-curriculum-map.js');
 const promotion=files.index.indexOf('fashion-mp2-promotion-packages.js');
 const selling=files.index.indexOf('fashion-mp2-selling-packages.js');
 const patch=files.index.indexOf('fashion-mp2-selling-quality-patch.js');
 const companions=files.index.indexOf('sem-mp2-companion-resources.js');
 const progress=files.index.indexOf('mp2-build-progress.js');
 assert.ok([map,promotion,selling,patch,companions,progress].every(value=>value>=0));
 assert.ok(map<promotion&&promotion<selling&&selling<patch&&patch<companions&&companions<progress);
});

vm.runInContext(files.source,context,{filename:'mp2-source-data.js'});
vm.runInContext(files.map,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(files.semPromotion,context,{filename:'sem-mp2-promotion-packages.js'});
vm.runInContext(files.semPromotionPatch,context,{filename:'sem-mp2-promotion-quality-patch.js'});
vm.runInContext(files.semSelling,context,{filename:'sem-mp2-selling-packages.js'});
vm.runInContext(files.semProfessional,context,{filename:'sem-mp2-professional-skills-packages.js'});
vm.runInContext(files.fashionPromotion,context,{filename:'fashion-mp2-promotion-packages.js'});
vm.runInContext(files.fashionPromotionPatch,context,{filename:'fashion-mp2-promotion-quality-patch.js'});
vm.runInContext(files.fashionSelling,context,{filename:'fashion-mp2-selling-packages.js'});
vm.runInContext(files.fashionSellingPatch,context,{filename:'fashion-mp2-selling-quality-patch.js'});

const selling=lessons.filter(lesson=>/^FASH-0(26|27|28|29|30|31|32|33)$/.test(lesson.id));
const required=['overview','target','success','agenda','bellRinger','miniLesson','activity','exitTicket','materials','differentiation','canvas','standards','notes','version'];

test('builds exactly eight Fashion MP2 Selling packages',()=>{
 assert.equal(selling.length,8);
 assert.equal(context.FONTaineFashionMP2SellingPackages.count,8);
 assert.deepEqual(Array.from(context.FONTaineFashionMP2SellingPackages.lessonIds),['FASH-026','FASH-027','FASH-028','FASH-029','FASH-030','FASH-031','FASH-032','FASH-033']);
});
test('all eight lessons are complete built packages with every required field',()=>{
 selling.forEach(lesson=>{
  assert.equal(lesson.markingPeriod,'MP2');
  assert.equal(lesson.status,'Complete');
  assert.equal(lesson.mapStatus,'Built');
  assert.deepEqual(Array.from(lesson.components),['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions']);
  required.forEach(field=>assert.ok(Array.isArray(lesson[field])?lesson[field].length>0:String(lesson[field]||'').trim().length>0,`${lesson.id} missing ${field}`));
 });
});
test('targets, success criteria, standards, and Canvas directions follow Fontaine requirements',()=>{
 selling.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/with at least 80% accuracy\.$/);
  assert.match(lesson.standards,/8140\.111-\.113/);
  assert.match(lesson.canvas,/Canvas/);
  assert.match(lesson.canvas,/80% mastery/);
 });
});
test('verified Fashion selling and pop-up sources are mapped to the correct lessons',()=>{
 ['FASH-026','FASH-027','FASH-028','FASH-029','FASH-030'].forEach(id=>{
  const lesson=lessons.find(item=>item.id===id);
  assert.ok(lesson.sourceIds.includes('fashion-selling-scenarios'),`${id} missing selling scenarios`);
  assert.ok(lesson.sourceIds.includes('fashion-mp2-plan'),`${id} missing MP2 plan`);
 });
 ['FASH-031','FASH-032','FASH-033'].forEach(id=>{
  const lesson=lessons.find(item=>item.id===id);
  assert.ok(lesson.sourceIds.includes('fashion-pop-up-brief'),`${id} missing pop-up brief`);
  assert.ok(lesson.sourceIds.includes('fashion-mp2-plan'),`${id} missing MP2 plan`);
 });
 assert.ok(lessons.find(item=>item.id==='FASH-033').sourceIds.includes('fashion-selling-scenarios'));
 assert.match(lessons.find(item=>item.id==='FASH-026').notes,/1VlnJ9zSB988NjPtpWvETus6FSdhWzukYSumR1NY__R8/);
 assert.match(lessons.find(item=>item.id==='FASH-031').notes,/1Oreyofn9kRzknk-2eSOqglaTbr4EgEH1/);
});
test('the selling-process sequence covers motives, discovery, presentation, objections, and closing',()=>{
 assert.match(lessons.find(item=>item.id==='FASH-026').miniLesson,/buying motives/i);
 assert.match(lessons.find(item=>item.id==='FASH-026').miniLesson,/approach, needs discovery, presentation, objection handling, closing, and follow-up/i);
 assert.match(lessons.find(item=>item.id==='FASH-027').activity,/four purposeful questions/i);
 assert.match(lessons.find(item=>item.id==='FASH-028').activity,/three feature-benefit-evidence statements/i);
 assert.match(lessons.find(item=>item.id==='FASH-029').activity,/two ethical alternatives/i);
 assert.match(lessons.find(item=>item.id==='FASH-030').activity,/buying signals/i);
 assert.match(lessons.find(item=>item.id==='FASH-030').activity,/clienteling/i);
});
test('the Holiday Pop-Up Boutique sequence includes concept, product mix, budget, and sales performance',()=>{
 const concept=lessons.find(item=>item.id==='FASH-031');
 const mix=lessons.find(item=>item.id==='FASH-032');
 const rolePlay=lessons.find(item=>item.id==='FASH-033');
 assert.match(concept.activity,/boutique name, tagline, target-customer profile/i);
 assert.match(concept.activity,/value proposition/i);
 assert.match(mix.activity,/hero product, core products, seasonal or limited products/i);
 assert.match(mix.activity,/inventory budget/i);
 assert.match(mix.activity,/projected sales value/i);
 assert.match(rolePlay.activity,/four discovery questions/i);
 assert.match(rolePlay.activity,/three feature-benefit-evidence connections/i);
 assert.match(rolePlay.activity,/80%-mastery scorecard/i);
});
test('33 MP2 lessons are complete and 27 remain planned',()=>{
 const mp2=lessons.filter(lesson=>lesson.markingPeriod==='MP2');
 assert.equal(mp2.filter(lesson=>lesson.status==='Complete').length,33);
 assert.equal(mp2.filter(lesson=>lesson.status==='Planned').length,27);
 assert.equal(mp2.filter(lesson=>lesson.course==='Fashion'&&lesson.status==='Complete').length,13);
});

console.log(`\n${passed} Fashion MP2 Selling package QA checks passed.`);