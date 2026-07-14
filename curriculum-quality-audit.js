state.qualityAuditCourse=state.qualityAuditCourse||"All";
state.qualityAuditBand=state.qualityAuditBand||"All";
state.qualityAuditQuery=state.qualityAuditQuery||"";

const qualityRequiredFields=["overview","target","success","agenda","bellRinger","miniLesson","activity","exitTicket","materials","differentiation","canvas","standards"];
const qualityActionVerbs=/\b(analy[sz]e|apply|build|calculate|classify|compare|complete|create|defend|demonstrate|design|develop|evaluate|explain|identify|justify|map|plan|present|produce|recommend|revise|solve|write)\b/i;
const qualityReasoningVerbs=/\b(analy[sz]e|apply|compare|defend|evaluate|explain|justify|predict|recommend|support|use evidence)\b/i;
const qualityDeliverables=/\b(analysis|brief|campaign|chart|checklist|code|comparison|concept|decision|design|diagram|document|draft|evidence|flyer|map|matrix|organizer|pitch|plan|presentation|proposal|recommendation|reflection|report|response|role-play|scenario|scorecard|script|slides?|strategy|survey|table|timeline|video|worksheet)\b/i;
const qualitySupportLanguage=/\b(allow|chunk|choice|completed example|guided|model|pair|provide|sentence frame|support|template|vocabulary|word bank)\b/i;
const qualityExtensionLanguage=/\b(advanced|challenge|early finisher|enrichment|extension|independent research|require.*additional)\b/i;
const qualityPlaceholder=/\b(pending|placeholder|to be determined|tbd|add later|awaiting full|not yet built)\b/i;

function qualityText(value){return Array.isArray(value)?value.join(" "):String(value||"")}
function qualityNormalize(value){return qualityText(value).toLowerCase().replace(/[^a-z0-9%]+/g," ").replace(/\s+/g," ").trim()}
function qualityWords(value){return new Set(qualityNormalize(value).split(" ").filter(word=>word.length>3))}
function qualitySimilarity(a,b){const left=qualityWords(a),right=qualityWords(b);if(!left.size||!right.size)return 0;let overlap=0;left.forEach(word=>{if(right.has(word))overlap++});return overlap/(left.size+right.size-overlap)}
function qualityIssue(severity,code,field,message,penalty){return{severity,code,field,message,penalty}}
function qualityBand(score){return score>=90?"Strong":score>=80?"Minor Polish":score>=65?"Needs Revision":"High Priority"}
function qualitySeverityRank(severity){return{Critical:4,High:3,Medium:2,Low:1}[severity]||0}

function scoreLessonQuality(lesson){
  const issues=[];
  qualityRequiredFields.forEach(field=>{
    const value=lesson[field];
    const empty=Array.isArray(value)?value.length===0:!qualityText(value).trim();
    if(empty)issues.push(qualityIssue("Critical",`missing-${field}`,field,`Missing ${field.replace(/([A-Z])/g," $1").toLowerCase()}.`,14));
    else if(qualityPlaceholder.test(qualityText(value)))issues.push(qualityIssue("Critical",`placeholder-${field}`,field,`${field.replace(/([A-Z])/g," $1")} still contains placeholder language.`,12));
  });

  const target=qualityText(lesson.target);
  if(target&&!/^I will\b/i.test(target))issues.push(qualityIssue("High","target-format","target","Learning target does not begin with “I will.”",4));
  if(/\b(understand|learn about|learn|know about|demonstrate understanding)\b/i.test(target))issues.push(qualityIssue("High","generic-target","target","Learning target relies on a vague or difficult-to-measure verb.",7));
  if(target&&!qualityActionVerbs.test(target))issues.push(qualityIssue("High","target-action","target","Learning target needs a clearer observable student action.",5));
  if(target.length&&target.length<55)issues.push(qualityIssue("Medium","thin-target","target","Learning target may be too broad or thin for the lesson.",3));

  const success=qualityText(lesson.success);
  if(success&&!/80\s*%|at least 80/i.test(success))issues.push(qualityIssue("High","success-mastery","success","Success criteria does not state the 80% mastery threshold.",5));
  if(success&&!qualityActionVerbs.test(success))issues.push(qualityIssue("High","success-evidence","success","Success criteria needs observable evidence of learning.",5));
  if(success&&success.length<65)issues.push(qualityIssue("Medium","thin-success","success","Success criteria may not define enough measurable evidence.",3));

  const agenda=Array.isArray(lesson.agenda)?lesson.agenda:[];
  if(agenda.length&&agenda.length<4)issues.push(qualityIssue("Medium","short-agenda","agenda","Agenda has fewer than four instructional phases.",3));

  const mini=qualityText(lesson.miniLesson);
  if(mini&&mini.length<140)issues.push(qualityIssue("Medium","thin-mini-lesson","miniLesson","Mini lesson needs more explicit teaching content, examples, or modeling.",5));

  const activity=qualityText(lesson.activity);
  if(activity&&activity.length<120)issues.push(qualityIssue("High","thin-activity","activity","Student activity directions are too brief for reliable classroom use.",8));
  if(activity&&!qualityActionVerbs.test(activity))issues.push(qualityIssue("High","activity-action","activity","Activity needs clearer student actions.",6));
  if(activity&&!qualityDeliverables.test(activity))issues.push(qualityIssue("High","activity-product","activity","Activity does not clearly name the student product or evidence to submit.",6));
  if(activity&&!/\b(at least|each|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/i.test(activity))issues.push(qualityIssue("Medium","activity-criteria","activity","Activity directions need a quantity, checklist, or completion criterion.",3));

  const exit=qualityText(lesson.exitTicket);
  if(exit&&exit.length<55)issues.push(qualityIssue("High","thin-exit-ticket","exitTicket","Exit ticket may not collect enough evidence of mastery.",6));
  if(exit&&!qualityReasoningVerbs.test(exit))issues.push(qualityIssue("High","low-rigor-exit-ticket","exitTicket","Exit ticket needs explanation, application, justification, or evidence.",6));

  const materials=Array.isArray(lesson.materials)?lesson.materials:[];
  if(materials.length&&materials.length<3)issues.push(qualityIssue("Medium","thin-materials","materials","Materials list may be incomplete for classroom setup.",3));

  const differentiation=Array.isArray(lesson.differentiation)?lesson.differentiation:[];
  if(differentiation.length&&differentiation.length<3)issues.push(qualityIssue("High","thin-differentiation","differentiation","Differentiation includes fewer than three usable supports or extensions.",6));
  const differentiationText=qualityText(differentiation);
  if(differentiation.length&&!qualitySupportLanguage.test(differentiationText))issues.push(qualityIssue("Medium","missing-support","differentiation","Differentiation needs a concrete scaffold for students who need support.",3));
  if(differentiation.length&&!qualityExtensionLanguage.test(differentiationText))issues.push(qualityIssue("Low","missing-extension","differentiation","Differentiation lacks a meaningful extension or early-finisher challenge.",2));
  if(differentiation.length&&new Set(differentiation.map(qualityNormalize)).size<differentiation.length)issues.push(qualityIssue("Medium","duplicate-differentiation","differentiation","Differentiation contains repeated strategies.",3));

  const canvas=qualityText(lesson.canvas);
  if(canvas&&canvas.split("\n").filter(Boolean).length<4)issues.push(qualityIssue("Medium","short-canvas","canvas","Canvas directions need clearer step-by-step instructions.",4));
  if(canvas&&!/submit|turn in|upload/i.test(canvas))issues.push(qualityIssue("Medium","canvas-submission","canvas","Canvas directions do not clearly state what students submit.",3));
  if(canvas&&!/80\s*%|80 percent|mastery/i.test(canvas))issues.push(qualityIssue("Medium","canvas-mastery","canvas","Canvas directions do not reinforce the mastery expectation.",3));
  if(canvas&&!/[\u{1F300}-\u{1FAFF}]/u.test(canvas))issues.push(qualityIssue("Low","canvas-emojis","canvas","Canvas directions do not use the preferred visual step markers.",1));

  const duration=qualityText(lesson.duration);
  if(duration&&!/minute|block|class period/i.test(duration))issues.push(qualityIssue("Medium","duration-clarity","duration","Duration is not stated in classroom-ready terms.",2));
  const standards=qualityText(lesson.standards);
  if(standards&&standards.length<12)issues.push(qualityIssue("High","thin-standards","standards","Standards alignment is too thin to verify.",6));

  const penalty=Math.min(100,issues.reduce((sum,item)=>sum+item.penalty,0));
  const score=Math.max(0,100-penalty);
  return{lesson,lessonId:lesson.id,course:lesson.course,title:lesson.title,markingPeriod:lesson.markingPeriod||"MP1",score,band:qualityBand(score),issues};
}

function addQualityRepetitionFlags(results,field,label){
  const candidates=results.filter(result=>qualityText(result.lesson[field]).length>=80);
  candidates.forEach((result,index)=>{
    if(result.issues.some(issue=>issue.code===`repeated-${field}`))return;
    let best=null;
    for(let i=0;i<candidates.length;i++){
      if(i===index||candidates[i].course!==result.course)continue;
      const similarity=qualitySimilarity(result.lesson[field],candidates[i].lesson[field]);
      if(similarity>=0.86&&(!best||similarity>best.similarity))best={other:candidates[i],similarity};
    }
    if(best){
      const penalty=4;
      result.issues.push(qualityIssue("Medium",`repeated-${field}`,field,`${label} is ${Math.round(best.similarity*100)}% similar to ${best.other.lessonId}.`,penalty));
      result.score=Math.max(0,result.score-penalty);
      result.band=qualityBand(result.score);
    }
  });
}

function buildCurriculumQualityAudit(){
  const results=lessons.map(scoreLessonQuality);
  addQualityRepetitionFlags(results,"activity","Activity language");
  addQualityRepetitionFlags(results,"exitTicket","Exit-ticket language");
  results.forEach(result=>{
    result.issues.sort((a,b)=>qualitySeverityRank(b.severity)-qualitySeverityRank(a.severity)||b.penalty-a.penalty||a.code.localeCompare(b.code));
    result.lesson.qualityScore=result.score;
    result.lesson.qualityBand=result.band;
    result.lesson.qualityIssues=result.issues;
  });
  const average=results.length?Math.round(results.reduce((sum,result)=>sum+result.score,0)/results.length):0;
  const issueCounts=results.flatMap(result=>result.issues).reduce((out,issue)=>{out[issue.code]=(out[issue.code]||0)+1;return out},{});
  const severityCounts=results.flatMap(result=>result.issues).reduce((out,issue)=>{out[issue.severity]=(out[issue.severity]||0)+1;return out},{Critical:0,High:0,Medium:0,Low:0});
  const courseSummary=["SEM","Fashion","Entrepreneurship"].map(course=>{
    const scoped=results.filter(result=>result.course===course);
    return{course,total:scoped.length,average:scoped.length?Math.round(scoped.reduce((sum,result)=>sum+result.score,0)/scoped.length):0,strong:scoped.filter(result=>result.band==="Strong").length,minor:scoped.filter(result=>result.band==="Minor Polish").length,revision:scoped.filter(result=>result.band==="Needs Revision").length,priority:scoped.filter(result=>result.band==="High Priority").length};
  });
  return{version:"1.0",totalLessons:results.length,average,strong:results.filter(result=>result.band==="Strong").length,minor:results.filter(result=>result.band==="Minor Polish").length,revision:results.filter(result=>result.band==="Needs Revision").length,priority:results.filter(result=>result.band==="High Priority").length,severityCounts,issueCounts,courseSummary,results};
}

window.FONTaineQualityAudit=buildCurriculumQualityAudit();

function qualityAuditFiltered(){
  const query=state.qualityAuditQuery.toLowerCase();
  return window.FONTaineQualityAudit.results.filter(result=>
    (state.qualityAuditCourse==="All"||result.course===state.qualityAuditCourse)&&
    (state.qualityAuditBand==="All"||result.band===state.qualityAuditBand)&&
    (!query||[result.lessonId,result.title,result.course,result.markingPeriod,...result.issues.map(issue=>`${issue.code} ${issue.message}`)].join(" ").toLowerCase().includes(query))
  ).sort((a,b)=>a.score-b.score||b.issues.length-a.issues.length||a.lessonId.localeCompare(b.lessonId));
}
function qualityAuditBadge(band){const key=band.toLowerCase().replace(/\s+/g,"-");return `<span class="quality-band ${key}">${band}</span>`}
function qualityAuditCourseCard(row){return `<section class="card span-4 quality-course"><div class="row"><h3>${row.course}</h3><strong>${row.average}/100</strong></div><div class="progress"><i style="width:${row.average}%"></i></div><div class="quality-course-counts"><span><strong>${row.strong}</strong> strong</span><span><strong>${row.minor}</strong> minor</span><span><strong>${row.revision}</strong> revise</span><span><strong>${row.priority}</strong> priority</span></div></section>`}
function qualityAuditLessonRow(result){
  const topIssues=result.issues.slice(0,3);
  return `<article class="card quality-lesson-row"><div class="quality-score">${result.score}</div><div class="quality-lesson-main"><div class="row"><div><strong>${result.lessonId} — ${result.title}</strong><div class="muted">${result.course} • ${result.markingPeriod} • ${result.issues.length} flag${result.issues.length===1?"":"s"}</div></div>${qualityAuditBadge(result.band)}</div><div class="quality-issue-list">${topIssues.length?topIssues.map(issue=>`<span class="quality-issue ${issue.severity.toLowerCase()}"><strong>${issue.field}:</strong> ${issue.message}</span>`).join(""):`<span class="quality-clear">No automated quality flags.</span>`}</div></div><button class="btn secondary" onclick="openLesson('${result.lessonId}')">Open</button></article>`;
}
function qualityAuditTopIssues(){
  const labels={"generic-target":"Vague learning targets","thin-activity":"Thin activity directions","activity-product":"Unclear student product","activity-criteria":"Missing completion criteria","thin-mini-lesson":"Thin mini lessons","thin-exit-ticket":"Thin exit tickets","low-rigor-exit-ticket":"Low-rigor exit tickets","thin-differentiation":"Thin differentiation","missing-extension":"Missing extension","repeated-activity":"Repeated activity language","repeated-exitTicket":"Repeated exit-ticket language"};
  return Object.entries(window.FONTaineQualityAudit.issueCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([code,count])=>`<div class="quality-issue-summary"><span>${labels[code]||code.replace(/-/g," ")}</span><strong>${count}</strong></div>`).join("");
}
function curriculumQualityAuditView(){
  const audit=window.FONTaineQualityAudit,filtered=qualityAuditFiltered();
  return shell(`<div class="card quality-audit-toolbar"><div><h2>Curriculum Quality Audit</h2><p class="muted">Automated first-pass review of clarity, rigor, assessment evidence, differentiation, repetition, and classroom usability.</p></div><button class="btn" onclick="state.qualityAuditBand='High Priority';render()">Open Priority Queue</button></div><div class="grid quality-metrics"><section class="card span-3"><div class="metric">${audit.average}</div><div class="muted">Average quality score</div></section><section class="card span-3"><div class="metric">${audit.strong}</div><div class="muted">Strong lessons</div></section><section class="card span-3"><div class="metric">${audit.revision}</div><div class="muted">Need revision</div></section><section class="card span-3"><div class="metric">${audit.priority}</div><div class="muted">High priority</div></section></div><div class="grid">${audit.courseSummary.map(qualityAuditCourseCard).join("")}</div><div class="quality-audit-layout"><section><div class="card quality-filters"><input placeholder="Search lessons or quality flags" value="${state.qualityAuditQuery}" oninput="state.qualityAuditQuery=this.value;render()"/><select onchange="state.qualityAuditCourse=this.value;render()">${["All","SEM","Fashion","Entrepreneurship"].map(value=>`<option ${state.qualityAuditCourse===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.qualityAuditBand=this.value;render()">${["All","High Priority","Needs Revision","Minor Polish","Strong"].map(value=>`<option ${state.qualityAuditBand===value?"selected":""}>${value}</option>`).join("")}</select><span class="muted">${filtered.length} lesson${filtered.length===1?"":"s"}</span></div><div class="quality-lesson-list">${filtered.map(qualityAuditLessonRow).join("")||'<div class="card empty">No lessons match these filters.</div>'}</div></section><aside class="card quality-sidebar"><h3>Most Common Flags</h3>${qualityAuditTopIssues()}<hr/><h3>Audit Rules</h3><p class="muted">Scores identify where teacher review should begin. They do not replace professional judgment, standards verification, or post-instruction reflection.</p></aside></div>`);
}

if(!pages.includes("Quality Audit")){
  const annualIndex=pages.indexOf("Annual Review");
  if(annualIndex>=0)pages.splice(annualIndex,0,"Quality Audit");
  else pages.push("Quality Audit");
}
const renderBeforeQualityAudit=render;
render=function(){
  if(state.page==="Quality Audit"){
    document.getElementById("app").outerHTML=`<div id="app">${curriculumQualityAuditView()}</div>`;
    return;
  }
  renderBeforeQualityAudit();
};
render();
