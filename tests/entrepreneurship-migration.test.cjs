const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const sourceData=fs.readFileSync(path.join(root,'entrepreneurship-source-data.js'),'utf8');
const packages=fs.readFileSync(path.join(root,'entrepreneurship-lesson-packages.js'),'utf8');
const audit=fs.readFileSync(path.join(root,'entrepreneurship-migration-audit.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');

const data={courses:[{id:'course-sem',code:'8175',slug:'sem',title:'SEM'},{id:'course-fashion',code:'8140',slug:'fashion',title:'Fashion'}],units:{},lessonTitles:{sem:[],fashion:[]},resources:[]};
const lessons=[];
const resources=[];
const state={page:'Dashboard',search:'',course:'All',status:'All'};
const context={
 console,data,lessons,resources,state,
 window:null,
 shell(content){return `<div>SEM 8175 + Fashion Marketing 8140${content}</div>`;},
 lessonList(){return '';},courses(){return '';},badge(status){return status;},render(){},openLesson(){},
 FONTaineStandards:{courseStandards:[],wrsMappings:{}},
 FONTaineDriveInventory:{files:[]}
};
context.window=context;
vm.createContext(context);

let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('migration JavaScript parses',()=>{
 new vm.Script(sourceData,{filename:'entrepreneurship-source-data.js'});
 new vm.Script(packages,{filename:'entrepreneurship-lesson-packages.js'});
 new vm.Script(audit,{filename:'entrepreneurship-migration-audit.js'});
});
test('index loads Entrepreneurship sources before packages and audit',()=>{
 const source=index.indexOf('entrepreneurship-source-data.js');
 const app=index.indexOf('app.js');
 const packageIndex=index.indexOf('entrepreneurship-lesson-packages.js');
 const auditIndex=index.indexOf('entrepreneurship-migration-audit.js');
 assert.ok(source>=0&&app>=0&&packageIndex>=0&&auditIndex>=0);
 assert.ok(source<app&&app<packageIndex&&packageIndex<auditIndex);
});

vm.runInContext(sourceData,context,{filename:'entrepreneurship-source-data.js'});
vm.runInContext(packages,context,{filename:'entrepreneurship-lesson-packages.js'});
vm.runInContext(audit,context,{filename:'entrepreneurship-migration-audit.js'});

test('adds Entrepreneurship as the third course',()=>{
 assert.ok(data.courses.some(course=>course.code==='9093'));
 assert.equal(data.courses.length,3);
});
test('creates exactly 20 Entrepreneurship lessons',()=>{
 const entrepreneurship=lessons.filter(lesson=>lesson.course==='Entrepreneurship');
 assert.equal(entrepreneurship.length,20);
 assert.equal(entrepreneurship[0].id,'ENT-001');
 assert.equal(entrepreneurship.at(-1).id,'ENT-020');
});
test('every lesson passes required-field migration audit',()=>{
 assert.equal(context.FONTaineEntrepreneurshipAudit.total,20);
 assert.equal(context.FONTaineEntrepreneurshipAudit.complete,20);
 assert.deepEqual(context.FONTaineEntrepreneurshipAudit.issues,[]);
 assert.ok(lessons.every(lesson=>lesson.status==='Complete'));
});
test('learning targets follow course format and 80 percent success criteria',()=>{
 lessons.forEach(lesson=>{
  assert.match(lesson.target,/^I will /);
  assert.doesNotMatch(lesson.target,/Today/i);
  assert.match(lesson.success,/80% accuracy/);
 });
});
test('adds source-backed resources and Drive mappings',()=>{
 assert.ok(resources.length>=8);
 assert.ok(resources.some(resource=>resource.title.includes('Surveys')));
 assert.ok(context.FONTaineDriveInventory.files.some(file=>file.lessonIds.includes('ENT-017')));
});
test('adds Entrepreneurship standards and WRS mappings',()=>{
 assert.equal(context.FONTaineStandards.courseStandards.filter(record=>record.course==='Entrepreneurship').length,8);
 assert.ok(context.FONTaineStandards.wrsMappings['WRS-09'].includes('ENT-013'));
});
test('course and lesson views include Entrepreneurship',()=>{
 assert.match(context.courses(),/Entrepreneurship/);
 assert.match(context.lessonList(),/Entrepreneurship/);
 assert.match(context.shell('content'),/Entrepreneurship 9093/);
});
test('source registry records official pacing guide and 20 authored packages',()=>{
 const registry=context.FONTaineEntrepreneurshipSources;
 assert.equal(registry.migrationStatus.sourceBackedPackages,20);
 assert.equal(registry.masterSources[0].fileId,'167sf-6IO-USFmmyn77U-54gcvJtv_YZY');
 assert.equal(Object.keys(registry.lessons).length,20);
});

console.log(`\n${passed} Entrepreneurship migration QA checks passed.`);
