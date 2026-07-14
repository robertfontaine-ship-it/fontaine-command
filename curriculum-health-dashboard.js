const HEALTH_WEIGHTS={readiness:40,standards:25,resources:20,reflections:15};
state.healthCourse=state.healthCourse||"All";
state.healthCategory=state.healthCategory||"All";
state.healthSeverity=state.healthSeverity||"All";

function healthCourses(){return ["All",...new Set(lessons.map(lesson=>lesson.course))]}
function healthLessonPool(course=state.healthCourse){return lessons.filter(lesson=>course==="All"||lesson.course===course)}
function healthScoreLabel(score){return score>=90?"Excellent":score>=80?"Strong":score>=70?"Developing":score>=60?"At Risk":"Critical"}
function healthScoreClass(score){return score>=90?"health-score-excellent":score>=80?"health-score-strong":score>=70?"health-score-developing":score>=60?"health-score-risk":"health-score-critical"}
function healthSeverityRank(value){return {Critical:0,High:1,Medium:2,Low:3}[value]??4}
function healthPercent(value,total){return total?Math.round(value/total*100):0}
function healthRequiredComponents(lesson){return (lesson.componentDetails||[]).filter(component=>component.required)}
function healthReflectionEntries(lesson){return typeof reflectionsFor==="function"?reflectionsFor(lesson.id):[]}
function healthReflectionPriority(lesson){const entries=healthReflectionEntries(lesson);if(!entries.length)return "None";if(typeof revisionPriority!=="function")return "Recorded";if(entries.some(entry=>revisionPriority(entry)==="High"))return "High";if(entries.some(entry=>revisionPriority(entry)==="Medium"))return "Medium";return "Low"}

function healthReadinessMetrics(pool){
 const required=pool.flatMap(healthRequiredComponents);
 const completeComponents=required.filter(component=>component.status==="complete").length;
 const missingComponents=required.filter(component=>component.status==="missing").length;
 const draftComponents=required.filter(component=>component.status==="draft").length;
 return {score:healthPercent(completeComponents,required.length),completeLessons:pool.filter(lesson=>lesson.status==="Complete").length,missingComponents,draftComponents,openTasks:pool.reduce((sum,lesson)=>sum+(lesson.buildTasks||[]).length,0)};
}

function healthStandardRecords(course=state.healthCourse){
 const courseRecords=(window.FONTaineStandards?.courseStandards||[]).map(record=>coverageRecord(record)).filter(record=>course==="All"||record.course===course);
 const wrsRecords=(window.FONTaineStandards?.wrs||[]).map(record=>wrsRecord(record)).filter(record=>course==="All"||record.evidence.some(item=>item.lesson.course===course));
 return [...courseRecords,...wrsRecords];
}
function healthStandardsMetrics(course=state.healthCourse){
 const records=healthStandardRecords(course);
 return {score:records.length?Math.round(records.reduce((sum,record)=>sum+record.score,0)/records.length):0,strong:records.filter(record=>record.level==="Strong").length,developing:records.filter(record=>record.level==="Developing").length,weak:records.filter(record=>record.level==="Weak").length,total:records.length,records};
}

function healthResourcePool(course=state.healthCourse){return (typeof resources!=="undefined"?resources:[]).filter(resource=>course==="All"||resource.course===course||resource.course==="Shared")}
function healthDrivePool(course=state.healthCourse){return (typeof driveFiles!=="undefined"?driveFiles:[]).filter(file=>course==="All"||file.course===course||file.course==="Shared")}
function healthResourcesMetrics(course=state.healthCourse){
 const library=healthResourcePool(course),drive=healthDrivePool(course);
 const average=library.length?Math.round(library.reduce((sum,resource)=>sum+(Number(resource.health)||0),0)/library.length):0;
 const needsReview=library.filter(resource=>resource.status!=="Ready"||Number(resource.health)<80).length;
 const missingCompanions=library.filter(resource=>(resource.companions||[]).some(item=>/missing/i.test(item))).length;
 const unmatched=drive.filter(file=>(file.match?.confidence||0)<35).length;
 const duplicateFamilies=new Set(drive.filter(file=>file.duplicateGroup).map(file=>file.duplicateGroup)).size;
 const matchPenalty=drive.length?Math.round(unmatched/drive.length*25):0;
 const companionPenalty=library.length?Math.round(missingCompanions/library.length*20):0;
 return {score:Math.max(0,Math.min(100,average-matchPenalty-companionPenalty)),average,needsReview,missingCompanions,unmatched,duplicateFamilies,library,drive};
}

function healthReflectionMetrics(pool){
 const reflected=pool.filter(lesson=>healthReflectionEntries(lesson).length);
 const entries=pool.flatMap(healthReflectionEntries);
 const ratings=typeof averageRatings==="function"?entries.map(averageRatings).filter(score=>Number.isFinite(score)&&score>0):[];
 const average=ratings.length?ratings.reduce((sum,score)=>sum+score,0)/ratings.length:0;
 const coverage=healthPercent(reflected.length,pool.length);
 const ratingScore=average?Math.round(average/5*100):0;
 return {score:Math.round(coverage*.7+ratingScore*.3),coverage,average,entries:entries.length,reflected:reflected.length,high:pool.filter(lesson=>healthReflectionPriority(lesson)==="High").length,medium:pool.filter(lesson=>healthReflectionPriority(lesson)==="Medium").length};
}

function healthSnapshot(course=state.healthCourse){
 const pool=healthLessonPool(course),readiness=healthReadinessMetrics(pool),standards=healthStandardsMetrics(course),resourcesHealth=healthResourcesMetrics(course),reflections=healthReflectionMetrics(pool);
 const overall=Math.round(readiness.score*HEALTH_WEIGHTS.readiness/100+standards.score*HEALTH_WEIGHTS.standards/100+resourcesHealth.score*HEALTH_WEIGHTS.resources/100+reflections.score*HEALTH_WEIGHTS.reflections/100);
 return {course,pool,readiness,standards,resources:resourcesHealth,reflections,overall};
}

function healthIssues(snapshot){
 const issues=[];
 snapshot.pool.forEach(lesson=>{
  (lesson.missingComponents||[]).forEach(component=>issues.push({severity:"Critical",category:"Readiness",title:`${lesson.id} is missing ${component.label||component.key||"a required component"}`,detail:lesson.title,action:`openLesson('${lesson.id}')`,actionLabel:"Open lesson"}));
  (lesson.draftComponents||[]).forEach(component=>issues.push({severity:"High",category:"Readiness",title:`${lesson.id} has a draft ${component.label||component.key||"component"}`,detail:lesson.title,action:`openLesson('${lesson.id}')`,actionLabel:"Finish lesson"}));
  const priority=healthReflectionPriority(lesson);
  if(priority==="High"||priority==="Medium")issues.push({severity:priority,category:"Reflections",title:`${lesson.id} has ${priority.toLowerCase()} revision priority`,detail:`${healthReflectionEntries(lesson).length} saved classroom reflection(s)`,action:`state.reflectionLessonId='${lesson.id}';go('Reflections')`,actionLabel:"Review evidence"});
 });
 snapshot.standards.records.filter(record=>record.level!=="Strong").forEach(record=>issues.push({severity:record.level==="Weak"?"High":"Medium",category:"Standards",title:`${record.code} is ${record.level.toLowerCase()}`,detail:`${record.score}% coverage • ${record.title}`,action:`state.standardFramework='${record.course==="WRS"?"WRS":"Course"}';state.standardCourse='${record.course==="WRS"?"All":record.course}';state.standardLevel='${record.level}';go('Standards')`,actionLabel:"Open standards"}));
 snapshot.resources.library.filter(resource=>resource.status!=="Ready"||Number(resource.health)<80).forEach(resource=>issues.push({severity:Number(resource.health)<70?"High":"Medium",category:"Resources",title:`${resource.title} needs review`,detail:`${resource.health}% health • ${resource.status}`,action:`state.resourceCourse='${resource.course}';state.search='${String(resource.title).replaceAll("'","\\'").toLowerCase()}';go('Resource Library')`,actionLabel:"Open resource"}));
 snapshot.resources.library.filter(resource=>(resource.companions||[]).some(item=>/missing/i.test(item))).forEach(resource=>issues.push({severity:"High",category:"Resources",title:`${resource.title} has missing companion materials`,detail:(resource.companions||[]).filter(item=>/missing/i.test(item)).join(" • "),action:`state.resourceCourse='${resource.course}';state.search='${String(resource.title).replaceAll("'","\\'").toLowerCase()}';go('Resource Library')`,actionLabel:"Review companions"}));
 snapshot.resources.drive.filter(file=>(file.match?.confidence||0)<35).forEach(file=>issues.push({severity:"Medium",category:"Resources",title:`Unmatched Drive file: ${file.title}`,detail:`${file.course} • ${file.type}`,action:`state.driveStatus='Unmatched';state.driveCourse='${file.course}';go('Google Drive')`,actionLabel:"Review match"}));
 if(snapshot.reflections.coverage<50)issues.push({severity:snapshot.reflections.coverage===0?"High":"Medium",category:"Reflections",title:"Reflection coverage is low",detail:`${snapshot.reflections.reflected}/${snapshot.pool.length} lessons have classroom evidence`,action:"go('Reflections')",actionLabel:"Add reflections"});
 return issues.sort((a,b)=>healthSeverityRank(a.severity)-healthSeverityRank(b.severity)||a.category.localeCompare(b.category)||a.title.localeCompare(b.title));
}

function healthFilteredIssues(issues){return issues.filter(issue=>(state.healthCategory==="All"||issue.category===state.healthCategory)&&(state.healthSeverity==="All"||issue.severity===state.healthSeverity))}
function healthMetricCard(label,score,detail,page){return `<button class="card health-metric-card" onclick="${page?`go('${page}')`:""}"><div class="health-metric-ring ${healthScoreClass(score)}"><strong>${score}%</strong></div><div><h3>${label}</h3><p>${detail}</p></div></button>`}
function healthCourseCard(course){const snapshot=healthSnapshot(course),issues=healthIssues(snapshot);return `<article class="card health-course-card"><div class="row"><div><span class="pill">${course}</span><h3>${snapshot.pool.length} lessons</h3></div><div class="health-course-score ${healthScoreClass(snapshot.overall)}">${snapshot.overall}%</div></div><div class="health-course-bars"><label>Readiness <span>${snapshot.readiness.score}%</span><i><b style="width:${snapshot.readiness.score}%"></b></i></label><label>Standards <span>${snapshot.standards.score}%</span><i><b style="width:${snapshot.standards.score}%"></b></i></label><label>Resources <span>${snapshot.resources.score}%</span><i><b style="width:${snapshot.resources.score}%"></b></i></label><label>Reflections <span>${snapshot.reflections.score}%</span><i><b style="width:${snapshot.reflections.score}%"></b></i></label></div><div class="health-course-footer"><span>${issues.filter(issue=>issue.severity==="Critical"||issue.severity==="High").length} priority issues</span><button class="btn secondary" onclick="state.healthCourse='${course}';render()">Inspect</button></div></article>`}
function healthIssueCard(issue){return `<article class="health-issue"><span class="health-severity severity-${issue.severity.toLowerCase()}">${issue.severity}</span><div><strong>${issue.title}</strong><p>${issue.detail}</p></div><button class="btn secondary" onclick="${issue.action}">${issue.actionLabel}</button></article>`}

function healthReportText(snapshot,issues){return [`Fontaine Curriculum Health — ${snapshot.course}`,`Overall health: ${snapshot.overall}% (${healthScoreLabel(snapshot.overall)})`,`Readiness: ${snapshot.readiness.score}% • ${snapshot.readiness.completeLessons}/${snapshot.pool.length} lessons complete • ${snapshot.readiness.openTasks} open tasks`,`Standards: ${snapshot.standards.score}% • ${snapshot.standards.weak} weak • ${snapshot.standards.developing} developing`,`Resources: ${snapshot.resources.score}% • ${snapshot.resources.needsReview} need review • ${snapshot.resources.unmatched} unmatched Drive files`,`Reflections: ${snapshot.reflections.score}% • ${snapshot.reflections.coverage}% lesson coverage • ${snapshot.reflections.high} high-priority revisions`,`Priority issues: ${issues.filter(issue=>issue.severity==="Critical"||issue.severity==="High").length}`].join("\n");}
function copyHealthReport(){const snapshot=healthSnapshot(),issues=healthIssues(snapshot),text=healthReportText(snapshot,issues);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>toast("Curriculum health report copied."));}
function clearHealthFilters(){state.healthCourse="All";state.healthCategory="All";state.healthSeverity="All";render()}

function curriculumHealthView(){
 const snapshot=healthSnapshot(),issues=healthIssues(snapshot),filtered=healthFilteredIssues(issues),priority=issues.filter(issue=>issue.severity==="Critical"||issue.severity==="High").length;
 const components=READINESS_COMPONENTS.filter(component=>component.required).map(component=>({label:component.label,missing:snapshot.pool.filter(lesson=>lesson.componentDetails?.some(item=>item.key===component.key&&item.status!=="complete")).length}));
 const weakStandards=snapshot.standards.records.filter(record=>record.level!=="Strong").sort((a,b)=>a.score-b.score).slice(0,6);
 return shell(`<div class="health-dashboard"><section class="card health-hero"><div><span class="pill">${snapshot.course} curriculum</span><h2>Curriculum Health Dashboard</h2><p>Readiness, standards, resources, and classroom evidence in one action-focused view.</p></div><div class="health-overall ${healthScoreClass(snapshot.overall)}"><strong>${snapshot.overall}%</strong><span>${healthScoreLabel(snapshot.overall)}</span></div><div class="health-hero-actions"><select aria-label="Filter health dashboard by course" onchange="state.healthCourse=this.value;render()">${healthCourses().map(course=>`<option ${state.healthCourse===course?"selected":""}>${course}</option>`).join("")}</select><button class="btn secondary" onclick="copyHealthReport()">Copy report</button><button class="btn" onclick="state.aiTeacher=state.aiTeacher||{};state.aiTeacher.course=state.healthCourse;state.page='AI Teacher Assistant';if(typeof aiTeacherSuggestion==='function')aiTeacherSuggestion('Show curriculum health priorities');else render()">Ask Assistant</button></div></section><section class="health-metrics">${healthMetricCard("Lesson readiness",snapshot.readiness.score,`${snapshot.readiness.completeLessons}/${snapshot.pool.length} complete • ${snapshot.readiness.openTasks} open tasks`,"Build Queue")}${healthMetricCard("Standards coverage",snapshot.standards.score,`${snapshot.standards.weak} weak • ${snapshot.standards.developing} developing`,"Standards")}${healthMetricCard("Resource health",snapshot.resources.score,`${snapshot.resources.needsReview} need review • ${snapshot.resources.unmatched} unmatched`,"Resource Library")}${healthMetricCard("Classroom evidence",snapshot.reflections.score,`${snapshot.reflections.coverage}% lesson coverage • ${snapshot.reflections.entries} reflections`,"Reflections")}</section><section><div class="health-section-heading"><div><h2>Course Comparison</h2><p class="muted">Composite score: readiness 40%, standards 25%, resources 20%, reflections 15%.</p></div></div><div class="health-course-grid">${[...new Set(lessons.map(lesson=>lesson.course))].map(healthCourseCard).join("")}</div></section><section class="health-detail-grid"><div class="card"><div class="health-section-heading"><div><h2>Priority Action Queue</h2><p class="muted">${priority} critical or high-priority issues.</p></div><div class="health-filters"><select onchange="state.healthCategory=this.value;render()">${["All","Readiness","Standards","Resources","Reflections"].map(value=>`<option ${state.healthCategory===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.healthSeverity=this.value;render()">${["All","Critical","High","Medium","Low"].map(value=>`<option ${state.healthSeverity===value?"selected":""}>${value}</option>`).join("")}</select><button class="btn secondary" onclick="clearHealthFilters()">Clear</button></div></div><div class="health-issue-list">${filtered.slice(0,20).map(healthIssueCard).join("")||'<div class="empty">No issues match the current filters.</div>'}</div></div><aside class="health-side-stack"><div class="card"><h2>Required Components</h2><div class="health-component-list">${components.map(component=>`<button onclick="go('Build Queue')"><span>${component.label}</span><strong class="${component.missing?"health-count-bad":"health-count-good"}">${component.missing?`${component.missing} gaps`:"Complete"}</strong></button>`).join("")}</div></div><div class="card"><h2>Standards Needing Attention</h2><div class="health-standard-list">${weakStandards.map(record=>`<button onclick="state.standardFramework='${record.course==="WRS"?"WRS":"Course"}';state.standardCourse='${record.course==="WRS"?"All":record.course}';state.standardLevel='${record.level}';go('Standards')"><span><strong>${record.code}</strong><small>${record.title}</small></span><b>${record.score}%</b></button>`).join("")||'<div class="muted">All tracked standards are strong.</div>'}</div></div><div class="card health-quick-actions"><h2>Quick Actions</h2><button onclick="go('Build Queue')">Resolve lesson gaps <span>→</span></button><button onclick="go('Standards')">Review standards heatmap <span>→</span></button><button onclick="go('Google Drive')">Review Drive matches <span>→</span></button><button onclick="go('Reflections')">Add classroom evidence <span>→</span></button></div></aside></section></div>`);
}

if(!pages.includes("Curriculum Health"))pages.splice(pages.indexOf("Dashboard")+1,0,"Curriculum Health");
const healthRenderBefore=render;
render=function(){if(state.page==="Curriculum Health"){document.getElementById("app").outerHTML=`<div id="app">${curriculumHealthView()}</div>`;return;}healthRenderBefore();};
render();
