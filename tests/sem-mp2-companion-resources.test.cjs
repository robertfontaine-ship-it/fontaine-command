const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const files={
 companion:fs.readFileSync('companion-resources.js','utf8'),
 source:fs.readFileSync('mp2-source-data.js','utf8'),
 map:fs.readFileSync('mp2-curriculum-map.js','utf8'),
 promotion:fs.readFileSync('sem-mp2-promotion-packages.js','utf8'),
 promotionPatch:fs.readFileSync('sem-mp2-promotion-quality-patch.js','utf8'),
 selling:fs.readFileSync('sem-mp2-selling-packages.js','utf8'),
 professional:fs.readFileSync('sem-mp2-professional-skills-packages.js','utf8'),
 extension:fs.readFileSync('sem-mp2-companion-resources.js','utf8'),
 index:fs.readFileSync('index.html','utf8')
};
const courseRows=[['SEM','8175','SEM'],['Fashion','8140','FASH'],['Entrepreneurship','9093','ENT']];
const lessons=courseRows.flatMap(([course,courseCode,prefix])=>Array.from({length:20},(_,index)=>({
 id:`${prefix}-${String(index+1).padStart(3,'0')}`,course,courseCode,title:`${course} MP1 ${index+1}`,unit:'MP1 Unit',unitId:'mp1',day:index+1,status:'Complete',markingPeriod:'MP1',standards:'MP1',duration:'45–60 minutes',components:['Lesson Plan','Learning Target','Agenda','Activity','Exit Ticket','Canvas Directions'],overview:'Complete',target:'I will apply the lesson concept.',success:'I will complete the task with at least 80% accuracy.',agenda:['Review'],bellRinger:'Analyze an opening scenario.',miniLesson:'Review the concept and model the decision.',activity:'Complete the application using evidence.',exitTicket:'Explain one decision with evidence.',materials:['Student organizer','Scoring rubric','Exit ticket'],differentiation:['Provide support.'],canvas:'Submit the assignment.',notes:'Source-backed.',version:'Version 1'
})));
const data={courses:courseRows.map(([title,code])=>({title,code})),units:{},lessonTitles:{},resources:[]};
const resources=[];
const state={page:'Dashboard',selected:lessons[0],lessonTab:'Overview',search:'',course:'All',status:'All'};
const context={
 console,data,lessons,resources,state,pages:['Dashboard','Resource Library'],CURRENT_DAY:8,window:null,
 FONTaineStandards:{courseStandards:[],wrsMappings:{}},FONTaineDriveInventory:{files:[]},
 shell(value){return value;},badge(value){return value;},openLesson(){},go(){},toast(){},render(){},lessonView(){return '';},lessonList(){return '';},courses(){return '';},buildQueue(){return '';},dashboard(){return '';},
 navigator:{clipboard:{writeText(){return Promise.resolve();}}},
 document:{getElementById(){return {outerHTML:''};},querySelector(){return null;}},setTimeout
};
context.window=context;
vm.createContext(context);
let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('extension JavaScript parses',()=>new vm.Script(files.extension,{filename:'sem-mp2-companion-resources.js'}));
test('index loads companion base before MP2 map and extension after all SEM packages',()=>{
 const companion=files.index.indexOf('companion-resources.js');
 const map=files.index.indexOf('mp2-curriculum-map.js');
 const promotion=files.index.indexOf('sem-mp2-promotion-packages.js');
 const selling=files.index.indexOf('sem-mp2-selling-packages.js');
 const professional=files.index.indexOf('sem-mp2-professional-skills-packages.js');
 const extension=files.index.indexOf('sem-mp2-companion-resources.js');
 const progress=files.index.indexOf('mp2-build-progress.js');
 assert.ok([companion,map,promotion,selling,professional,extension,progress].every(value=>value>=0));
 assert.ok(companion<map&&map<promotion&&promotion<selling&&selling<professional&&professional<extension&&extension<progress);
});

vm.runInContext(files.companion,context,{filename:'companion-resources.js'});
assert.equal(context.FONTaineCompanionAudit.totalLessons,60);
assert.equal(context.FONTaineCompanionAudit.generatedResources,300);
vm.runInContext(files.source,context,{filename:'mp2-source-data.js'});
vm.runInContext(files.map,context,{filename:'mp2-curriculum-map.js'});
vm.runInContext(files.promotion,context,{filename:'sem-mp2-promotion-packages.js'});
vm.runInContext(files.promotionPatch,context,{filename:'sem-mp2-promotion-quality-patch.js'});
vm.runInContext(files.selling,context,{filename:'sem-mp2-selling-packages.js'});
vm.runInContext(files.professional,context,{filename:'sem-mp2-professional-skills-packages.js'});
vm.runInContext(files.extension,context,{filename:'sem-mp2-companion-resources.js'});

test('adds five generated resources for every completed SEM MP2 lesson',()=>{
 assert.deepEqual(context.FONTaineSEMMP2CompanionResources,{lessons:20,generated:100,verified:5,extendedVerified:1});
 assert.equal(context.FONTaineCompanionAudit.totalLessons,80);
 assert.equal(context.FONTaineCompanionAudit.generatedResources,400);
 assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&/^SEM-0(2[1-9]|3\d|40)$/.test(item.lessonIds[0])).length,100);
});
test('updates generated resource type counts without creating answer keys',()=>{
 ['Student Organizer','Scoring Rubric','Exit Ticket','Quick Check','Teacher Scoring Guide'].forEach(type=>assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type===type).length,80,`${type} count`));
 assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Answer Key').length,0);
 assert.equal(context.FONTaineCompanionAudit.verifiedAnswerKeys,3);
});
test('adds five unique verified SEM MP2 files and extends the existing role-play file',()=>{
 assert.equal(context.FONTaineCompanionAudit.verifiedResources,17);
 const rolePlay=context.FONTaineCompanionSources.verifiedSources.find(item=>item.fileId==='1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk');
 assert.ok(rolePlay);
 assert.ok(rolePlay.lessonIds.includes('SEM-016'));
 assert.ok(rolePlay.lessonIds.includes('SEM-035'));
 assert.ok(rolePlay.lessonIds.includes('SEM-039'));
 const fileIds=context.FONTaineCompanionSources.verifiedSources.map(item=>item.fileId);
 assert.equal(new Set(fileIds).size,fileIds.length,'Verified Drive files should remain unique.');
});
test('links source-verified notes, sorting, case analysis, and review to correct MP2 lessons',()=>{
 const verified=context.FONTaineCompanionSources.verifiedSources;
 assert.ok(verified.find(item=>item.id==='verified-sem-mp2-promo-notes').lessonIds.includes('SEM-025'));
 assert.deepEqual(Array.from(verified.find(item=>item.id==='verified-sem-mp2-promo-sort').lessonIds),['SEM-026']);
 assert.ok(verified.find(item=>item.id==='verified-sem-mp2-selling-notes').lessonIds.includes('SEM-034'));
 assert.deepEqual(Array.from(verified.find(item=>item.id==='verified-sem-mp2-case-analysis').lessonIds),['SEM-039']);
 assert.deepEqual(Array.from(verified.find(item=>item.id==='verified-sem-mp2-semester-review').lessonIds),['SEM-040']);
});
test('all SEM MP2 lessons are built before companion generation',()=>{
 const semMp2=lessons.filter(lesson=>lesson.course==='SEM'&&lesson.markingPeriod==='MP2');
 assert.equal(semMp2.length,20);
 assert.ok(semMp2.every(lesson=>lesson.status==='Complete'&&lesson.mapStatus==='Built'));
});

console.log(`\n${passed} SEM MP2 companion resource QA checks passed.`);