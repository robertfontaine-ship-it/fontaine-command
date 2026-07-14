const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'curriculum-health-dashboard.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');

const lessons=[
 {id:'SEM-001',course:'SEM',title:'Marketing Launch',status:'Complete',readinessScore:100,componentDetails:[
  {key:'lesson-plan',label:'Lesson Plan',required:true,status:'complete'},
  {key:'learning-target',label:'Learning Target',required:true,status:'complete'},
  {key:'agenda',label:'Agenda',required:true,status:'complete'},
  {key:'activity',label:'Activity',required:true,status:'complete'},
  {key:'exit-ticket',label:'Exit Ticket',required:true,status:'complete'},
  {key:'canvas-directions',label:'Canvas Directions',required:true,status:'complete'}
 ],missingComponents:[],draftComponents:[],buildTasks:[]},
 {id:'FASH-001',course:'Fashion',title:'Fashion Launch',status:'Needs Materials',readinessScore:83,componentDetails:[
  {key:'lesson-plan',label:'Lesson Plan',required:true,status:'complete'},
  {key:'learning-target',label:'Learning Target',required:true,status:'complete'},
  {key:'agenda',label:'Agenda',required:true,status:'complete'},
  {key:'activity',label:'Activity',required:true,status:'missing'},
  {key:'exit-ticket',label:'Exit Ticket',required:true,status:'complete'},
  {key:'canvas-directions',label:'Canvas Directions',required:true,status:'complete'}
 ],missingComponents:[{key:'activity',label:'Activity'}],draftComponents:[],buildTasks:[{id:'FASH-001-activity',lessonId:'FASH-001'}]}
];
const resources=[
 {title:'SEM Launch Kit',course:'SEM',health:95,status:'Ready',companions:['Rubric']},
 {title:'Fashion Launch Kit',course:'Fashion',health:65,status:'Needs Review',companions:['Worksheet missing']}
];
const driveFiles=[
 {title:'SEM Launch Slides',course:'SEM',type:'Slides',match:{confidence:100},duplicateGroup:null},
 {title:'Unmatched Fashion File',course:'Fashion',type:'Document',match:{confidence:0},duplicateGroup:'fashion-copy'}
];
const reflectionData={
 'SEM-001':[{ratings:{engagement:4,understanding:4,timing:4,behavior:4},tags:['Students struggled']}]
};
const courseStandards=[
 {code:'SEM 8175.1',title:'SEM competency',course:'SEM',score:40,level:'Weak',evidence:[]},
 {code:'FASH 8140.1',title:'Fashion competency',course:'Fashion',score:90,level:'Strong',evidence:[]}
];
const wrs=[{id:'wrs-1',code:'WRS 1',title:'Professionalism',course:'WRS',score:60,level:'Developing',evidence:[{lesson:lessons[0]}]}];

let copied='';
const appNode={outerHTML:''};
const context={
 console,
 lessons,
 resources,
 driveFiles,
 READINESS_COMPONENTS:[
  {key:'lesson-plan',label:'Lesson Plan',required:true},
  {key:'learning-target',label:'Learning Target',required:true},
  {key:'agenda',label:'Agenda',required:true},
  {key:'activity',label:'Activity',required:true},
  {key:'exit-ticket',label:'Exit Ticket',required:true},
  {key:'canvas-directions',label:'Canvas Directions',required:true}
 ],
 state:{page:'Dashboard'},
 pages:['Dashboard','Build Queue','Standards','Resource Library','Google Drive','Reflections','AI Teacher Assistant'],
 navigator:{clipboard:{writeText:async value=>{copied=value;}}},
 document:{getElementById(id){return id==='app'?appNode:null;}},
 render(){},
 shell(html){return html;},
 go(page){context.state.page=page;},
 openLesson(){},
 toast(){},
 coverageRecord(record){return record;},
 wrsRecord(record){return record;},
 reflectionsFor(id){return reflectionData[id]||[];},
 averageRatings(entry){const values=Object.values(entry.ratings);return values.reduce((sum,value)=>sum+value,0)/values.length;},
 revisionPriority(entry){return entry.tags.includes('Students struggled')?'High':'Low';},
 aiTeacherSuggestion(){},
 FONTaineStandards:{courseStandards,wrs}
};
context.window=context;
vm.createContext(context);

let passed=0;
function test(name,fn){try{fn();passed+=1;console.log(`PASS ${name}`);}catch(error){console.error(`FAIL ${name}`);throw error;}}

test('dashboard JavaScript parses',()=>new vm.Script(source,{filename:'curriculum-health-dashboard.js'}));
test('index loads dashboard after dependencies and before annual review',()=>{
 const reflections=index.indexOf('lesson-reflections.js');
 const standards=index.indexOf('standards-intelligence.js');
 const dashboard=index.indexOf('curriculum-health-dashboard.js');
 const annual=index.indexOf('annual-review.js');
 assert.ok(reflections>=0&&standards>=0&&dashboard>=0&&annual>=0);
 assert.ok(reflections<dashboard);
 assert.ok(standards<dashboard);
 assert.ok(dashboard<annual);
 assert.ok(index.includes('curriculum-health-dashboard.css'));
});

vm.runInContext(source,context,{filename:'curriculum-health-dashboard.js'});

test('curriculum health page is registered',()=>assert.ok(context.pages.includes('Curriculum Health')));
test('overall snapshot combines four health domains',()=>{
 const snapshot=context.healthSnapshot('All');
 assert.equal(snapshot.readiness.score,92);
 assert.equal(snapshot.standards.score,63);
 assert.equal(snapshot.resources.score,57);
 assert.equal(snapshot.reflections.score,59);
 assert.equal(snapshot.overall,73);
});
test('course filtering limits lessons and evidence',()=>{
 const snapshot=context.healthSnapshot('SEM');
 assert.equal(snapshot.pool.length,1);
 assert.equal(snapshot.readiness.score,100);
 assert.equal(snapshot.resources.unmatched,0);
 assert.equal(snapshot.reflections.coverage,100);
});
test('action queue includes readiness, standards, resources, Drive, and reflection issues',()=>{
 const issues=context.healthIssues(context.healthSnapshot('All'));
 assert.ok(issues.some(issue=>issue.category==='Readiness'&&/missing Activity/.test(issue.title)));
 assert.ok(issues.some(issue=>issue.category==='Standards'&&/SEM 8175.1/.test(issue.title)));
 assert.ok(issues.some(issue=>issue.category==='Resources'&&/Fashion Launch Kit needs review/.test(issue.title)));
 assert.ok(issues.some(issue=>issue.category==='Resources'&&/Unmatched Drive file/.test(issue.title)));
 assert.ok(issues.some(issue=>issue.category==='Reflections'&&/revision priority/.test(issue.title)));
});
test('category and severity filters work together',()=>{
 const issues=context.healthIssues(context.healthSnapshot('All'));
 context.state.healthCategory='Resources';
 context.state.healthSeverity='High';
 const filtered=context.healthFilteredIssues(issues);
 assert.ok(filtered.length>0);
 assert.ok(filtered.every(issue=>issue.category==='Resources'&&issue.severity==='High'));
 context.state.healthCategory='All';context.state.healthSeverity='All';
});
test('report text contains operational metrics',()=>{
 const snapshot=context.healthSnapshot('All');
 const text=context.healthReportText(snapshot,context.healthIssues(snapshot));
 assert.match(text,/Overall health: 73%/);
 assert.match(text,/Readiness: 92%/);
 assert.match(text,/Standards: 63%/);
 assert.match(text,/Resources: 57%/);
 assert.match(text,/Reflections: 59%/);
});
test('dashboard view renders course comparison and action queue',()=>{
 const html=context.curriculumHealthView();
 assert.match(html,/Curriculum Health Dashboard/);
 assert.match(html,/Course Comparison/);
 assert.match(html,/Priority Action Queue/);
 assert.match(html,/Required Components/);
});
test('render wrapper displays the dashboard page',()=>{
 context.state.page='Curriculum Health';
 context.render();
 assert.match(appNode.outerHTML,/Curriculum Health Dashboard/);
});
test('copy report exports the current health summary',()=>{
 context.copyHealthReport();
 assert.match(copied,/Fontaine Curriculum Health/);
});

console.log(`\n${passed} Curriculum Health Dashboard QA checks passed.`);
