const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('companion-resources.js','utf8');
const lessons=Array.from({length:60},(_,index)=>{
 const course=index<20?'SEM':index<40?'Fashion':'Entrepreneurship';
 const prefix=course==='SEM'?'SEM':course==='Fashion'?'FASH':'ENT';
 const number=(index%20)+1;
 return {
  id:`${prefix}-${String(number).padStart(3,'0')}`,
  course,
  courseCode:course==='SEM'?'8175':course==='Fashion'?'8140':'9093',
  title:`Lesson ${number}`,
  target:'I will apply the lesson concept.',
  success:'I will complete the task with at least 80% accuracy.',
  bellRinger:'Analyze a short opening scenario.',
  miniLesson:'Review vocabulary and model the business decision.',
  activity:'Complete the application task using evidence.',
  exitTicket:'Explain one decision and support it with evidence.',
  materials:['Student organizer','Scoring rubric','Exit ticket']
 };
});
const context={
 console,
 lessons,
 state:{page:'Dashboard'},
 pages:['Dashboard','Resource Library'],
 render(){},
 shell(value){return value;},
 toast(){},
 navigator:{clipboard:{writeText(){return Promise.resolve();}}},
 document:{getElementById(){return {outerHTML:''};}},
 setTimeout,
 window:null
};
context.window=context;
vm.createContext(context);
vm.runInContext(source,context,{filename:'companion-resources.js'});

assert.equal(context.FONTaineCompanionAudit.totalLessons,60,'All 60 lessons should be audited.');
assert.equal(context.FONTaineCompanionAudit.generatedResources,300,'Five generated companion resources should exist for every lesson.');
assert.equal(context.FONTaineCompanionAudit.verifiedResources,12,'Verified Drive source count changed unexpectedly.');
assert.equal(context.FONTaineCompanionAudit.verifiedAnswerKeys,3,'Only source-verified answer keys should be counted as answer keys.');
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Student Organizer').length,60);
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Scoring Rubric').length,60);
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Exit Ticket').length,60);
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Quick Check').length,60);
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Teacher Scoring Guide').length,60);
assert.equal(context.FONTaineCompanionResources.filter(item=>item.status==='Generated'&&item.type==='Answer Key').length,0,'Generated guides must never be labeled as verified answer keys.');
assert.ok(context.pages.includes('Companion Resources'),'Navigation page was not registered.');
assert.match(source,/Teacher review required\. This is a generated scoring guide, not a verified answer key\./);
console.log('Companion resource calculation QA passed.');