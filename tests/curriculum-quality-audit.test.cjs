const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=name=>fs.readFileSync(name,'utf8');

const scripts=[
  'sem-lesson-packages.js','sem-target-market-packages.js','sem-promotion-partnership-packages.js','sem-customer-service-selling-packages.js',
  'fashion-lesson-packages.js','entrepreneurship-lesson-packages.js',
  'companion-resources.js','mp2-source-data.js','fashion-mp2-customer-service-sources.js','entrepreneurship-mp2-marketing-sources.js','entrepreneurship-mp2-ownership-sources.js','entrepreneurship-mp2-financial-sources.js','mp2-curriculum-map.js',
  'sem-mp2-promotion-packages.js','sem-mp2-promotion-quality-patch.js','sem-mp2-selling-packages.js','sem-mp2-professional-skills-packages.js',
  'fashion-mp2-promotion-packages.js','fashion-mp2-promotion-quality-patch.js','fashion-mp2-selling-packages.js','fashion-mp2-selling-quality-patch.js','fashion-mp2-customer-service-packages.js','fashion-mp2-customer-service-quality-patch.js',
  'entrepreneurship-mp2-marketing-packages-a.js','entrepreneurship-mp2-marketing-packages-b.js','entrepreneurship-mp2-ownership-packages-a.js','entrepreneurship-mp2-ownership-packages-b.js','entrepreneurship-mp2-financial-packages-a.js','entrepreneurship-mp2-financial-packages-b.js',
  'sem-mp2-companion-resources.js','fashion-mp2-companion-resources.js','entrepreneurship-mp2-companion-resources.js',
  'mp3-source-data.js','sem-mp3-distribution-sources.js','sem-mp3-pricing-sources.js','sem-mp3-event-revenue-sources.js','fashion-mp3-retail-sources.js','fashion-mp3-textile-sources.js','fashion-mp3-sustainability-sources.js','mp3-curriculum-map.js',
  'sem-mp3-distribution-packages-a.js','sem-mp3-distribution-packages-b.js','sem-mp3-distribution-packages-c.js','sem-mp3-pricing-packages-a.js','sem-mp3-pricing-packages-b.js','sem-mp3-pricing-packages-c.js','sem-mp3-event-revenue-packages-a.js','sem-mp3-event-revenue-packages-b.js','sem-mp3-companion-resources.js',
  'fashion-mp3-retail-packages-a.js','fashion-mp3-retail-packages-b.js','fashion-mp3-textile-packages-a.js','fashion-mp3-textile-packages-b.js','fashion-mp3-textile-packages-c.js','fashion-mp3-sustainability-packages-a.js','fashion-mp3-sustainability-packages-b.js','fashion-mp3-companion-resources.js',
  'entrepreneurship-mp3-activation-packages-a.js','entrepreneurship-mp3-activation-packages-b.js','entrepreneurship-mp3-grand-opening-packages.js','entrepreneurship-mp3-simulator-packages-a.js','entrepreneurship-mp3-simulator-packages-b.js','entrepreneurship-mp3-companion-resources.js',
  'curriculum-quality-audit.js'
];
const rows=[['SEM','8175','SEM'],['Fashion','8140','FASH'],['Entrepreneurship','9093','ENT']];
const lessons=rows.filter(([course])=>course!=='Entrepreneurship').flatMap(([course,courseCode,prefix])=>Array.from({length:20},(_,i)=>({
  id:`${prefix}-${String(i+1).padStart(3,'0')}`,course,courseCode,title:'MP1',unit:'MP1',unitId:'mp1',day:i+1,status:'Complete',mapStatus:'Built',markingPeriod:'MP1',standards:`${courseCode} MP1`,duration:'45–60 minutes',components:['Lesson Plan'],overview:'Complete lesson package.',target:'I will learn.',success:'I will complete the lesson with at least 80% accuracy.',agenda:['Bell ringer','Mini lesson','Student activity','Exit ticket'],bellRinger:'Respond to the prompt.',miniLesson:'Review the lesson concept and model an example for students.',activity:'Students complete a structured application task and submit an organizer.',exitTicket:'Explain one idea from the lesson.',materials:['Teacher notes','Student organizer','Exit ticket'],differentiation:['Provide vocabulary support','Allow partner work','Challenge early finishers'],canvas:'📘 Review the directions.\n✅ Complete the task.\n📤 Submit the work in Canvas.\n🎯 Earn at least 80% mastery.',notes:'Source',version:'Version 1'
})));
const data={courses:rows.map(([title,code])=>({title,code})),units:{},lessonTitles:{},resources:[]};
const state={page:'Dashboard',search:'',course:'All',status:'All',markingPeriod:'All',buildCourse:'All',buildPeriod:'MP3'};
const appNode={outerHTML:''};
const context={
  console,data,lessons,resources:[],state,pages:['Dashboard','Lessons','Annual Review'],window:null,
  FONTaineStandards:{courseStandards:[],wrsMappings:{}},FONTaineDriveInventory:{files:[]},
  shell:value=>value,badge:value=>value,openLesson(){},go(){},toast(){},render(){},
  lessonView(){return'';},lessonList(){return'';},courses(){return'';},buildQueue(){return'';},dashboard(){return'';},
  resourceLibrary(){return'';},simple(){return'';},settings(){return'';},componentChecklist(){return'';},
  document:{getElementById(){return appNode;},querySelector(){return null;}},navigator:{clipboard:{writeText(){return Promise.resolve();}}},
  setTimeout,clearTimeout
};
context.window=context;
vm.createContext(context);

let passed=0;
const test=(name,fn)=>{fn();passed++;console.log(`PASS ${name}`);};
scripts.forEach(file=>{
  try{vm.runInContext(read(file),context,{filename:file});}
  catch(error){console.error(`SCRIPT_FAILURE ${file}`);throw error;}
});
const audit=context.FONTaineQualityAudit;

test('audit covers all 180 released lessons',()=>{
  assert.equal(audit.totalLessons,180);
  rows.forEach(([course])=>assert.equal(audit.results.filter(result=>result.course===course).length,60,course));
});
test('every lesson receives bounded score, band, and issue metadata',()=>{
  audit.results.forEach(result=>{
    assert.ok(Number.isInteger(result.score)&&result.score>=0&&result.score<=100,result.lessonId);
    assert.ok(['Strong','Minor Polish','Needs Revision','High Priority'].includes(result.band),result.lessonId);
    assert.ok(Array.isArray(result.issues),result.lessonId);
    assert.equal(result.lesson.qualityScore,result.score,result.lessonId);
    assert.equal(result.lesson.qualityBand,result.band,result.lessonId);
  });
});
test('released lessons have no missing core instructional fields',()=>{
  const missing=audit.results.flatMap(result=>result.issues.filter(issue=>issue.code.startsWith('missing-')).map(issue=>`${result.lessonId}:${issue.code}`));
  assert.deepEqual(missing,[]);
});
test('course summary reconciles to the full release',()=>{
  assert.equal(audit.courseSummary.length,3);
  audit.courseSummary.forEach(row=>{
    assert.equal(row.total,60,row.course);
    assert.equal(row.strong+row.minor+row.revision+row.priority,60,row.course);
  });
  assert.equal(audit.strong+audit.minor+audit.revision+audit.priority,180);
});
test('audit score is a useful nonzero baseline',()=>{
  assert.ok(audit.average>=40&&audit.average<=100,`average ${audit.average}`);
  assert.ok(Object.values(audit.issueCounts).reduce((sum,count)=>sum+count,0)>0,'expected revision flags');
});
test('quality dashboard loads after all curriculum packages and before usability wrapper',()=>{
  const html=read('index.html');
  const position=value=>html.indexOf(value);
  assert.ok(position('entrepreneurship-mp3-simulator-packages-b.js')<position('curriculum-quality-audit.js'));
  assert.ok(position('annual-review.js')<position('curriculum-quality-audit.js'));
  assert.ok(position('curriculum-quality-audit.js')<position('classroom-usability.js'));
  assert.ok(html.includes('curriculum-quality-audit.css'));
});
test('audit page is registered in the application navigation',()=>{
  assert.ok(context.pages.includes('Quality Audit'));
});

fs.mkdirSync('artifacts',{recursive:true});
const report={
  generatedAt:new Date().toISOString(),
  totalLessons:audit.totalLessons,
  average:audit.average,
  bands:{strong:audit.strong,minorPolish:audit.minor,needsRevision:audit.revision,highPriority:audit.priority},
  severityCounts:audit.severityCounts,
  courseSummary:audit.courseSummary,
  topIssues:Object.entries(audit.issueCounts).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([code,count])=>({code,count})),
  priorityLessons:audit.results.slice().sort((a,b)=>a.score-b.score||a.lessonId.localeCompare(b.lessonId)).slice(0,30).map(result=>({lessonId:result.lessonId,course:result.course,title:result.title,score:result.score,band:result.band,issues:result.issues.slice(0,5)}))
};
fs.writeFileSync('artifacts/curriculum-quality-audit.json',JSON.stringify(report,null,2));
console.log(`QUALITY_AUDIT_SUMMARY=${JSON.stringify(report)}`);
console.log(`\n${passed} curriculum quality audit QA checks passed.`);
