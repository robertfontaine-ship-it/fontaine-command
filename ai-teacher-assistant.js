const AI_TEACHER_HISTORY_KEY="fontaine-command-ai-teacher-history";
state.aiTeacher=state.aiTeacher||{query:"",course:"All",lessonId:"",response:null};
let aiTeacherHistory=[];
try{aiTeacherHistory=JSON.parse(localStorage.getItem(AI_TEACHER_HISTORY_KEY)||"[]");if(!Array.isArray(aiTeacherHistory))aiTeacherHistory=[];}catch{aiTeacherHistory=[];}

function aiEscape(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));}
function aiCourseLessons(){return lessons.filter(lesson=>state.aiTeacher.course==="All"||lesson.course===state.aiTeacher.course);}
function aiLessonFromQuery(query){
 const match=String(query||"").match(/\b(SEM|FASH|FASHION)[- ]?(\d{1,3})\b/i);
 const id=match?`${match[1].toUpperCase().startsWith("F")?"FASH":"SEM"}-${String(match[2]).padStart(3,"0")}`:state.aiTeacher.lessonId;
 return lessons.find(lesson=>lesson.id===id)||null;
}
function aiLessonResources(lesson){return typeof driveFiles!=="undefined"?driveFiles.filter(file=>file.match?.lessons?.some(item=>item.id===lesson.id)).sort((a,b)=>(b.match?.confidence||0)-(a.match?.confidence||0)):[];}
function aiLessonReflections(lesson){
 const entries=typeof reflectionsFor==="function"?reflectionsFor(lesson.id):[];
 if(!entries.length)return {count:0,average:0,priority:"None",notes:[]};
 const scores=typeof averageRatings==="function"?entries.map(averageRatings).filter(Boolean):[];
 const priority=typeof revisionPriority==="function"?(entries.some(x=>revisionPriority(x)==="High")?"High":entries.some(x=>revisionPriority(x)==="Medium")?"Medium":"Low"):"Recorded";
 const notes=entries.flatMap(entry=>[entry.worked,entry.struggled,entry.change]).filter(Boolean).slice(-4);
 return {count:entries.length,average:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0,priority,notes};
}
function aiAction(label,action,kind="secondary"){return {label,action,kind};}
function aiLessonActions(lesson){return [aiAction("Open lesson",`openLesson('${lesson.id}')`,"primary"),aiAction("Canvas package",`openCanvasPackage('${lesson.id}')`),aiAction("Open reflections",`state.reflectionLessonId='${lesson.id}';go('Reflections')`)];}
function aiSection(title,body,items=[]){return {title,body,items};}
function aiResponse(title,summary,sections=[],actions=[]){return {title,summary,sections,actions,createdAt:new Date().toISOString()};}
function aiMappedLessons(day){return typeof lessonsForDay==="function"?lessonsForDay(day):lessons.filter(lesson=>lesson.day===day);}
function aiTopicWords(query){return String(query||"").toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(word=>word.length>3&&!['lesson','teach','teacher','assistant','create','build','show','about','with','from','that','this','what','should','please'].includes(word));}

function aiMorningBrief(day,label){
 const mapped=aiMappedLessons(day).filter(lesson=>state.aiTeacher.course==="All"||lesson.course===state.aiTeacher.course);
 const items=mapped.map(lesson=>`${lesson.id} — ${lesson.title} • ${lesson.readinessScore||0}% ready • ${(lesson.materials||[]).length} listed materials`);
 const needs=mapped.filter(lesson=>lesson.status!=="Complete"||(lesson.missingComponents||[]).length);
 const prep=mapped.reduce((sum,lesson)=>sum+(lesson.status==="Complete"?2:8),0);
 return aiResponse(`${label} teaching brief`,`${mapped.length} mapped lesson${mapped.length===1?"":"s"} for instructional day ${day}.`,[
  aiSection("Schedule",mapped.length?"Open each lesson from the actions below.":"No lessons are mapped to this instructional day.",items),
  aiSection("Prep priorities",needs.length?`${needs.length} lesson(s) still have unresolved readiness items.`:"All mapped lessons currently pass the completeness audit.",needs.map(lesson=>`${lesson.id}: ${(lesson.missingComponents||[]).join(", ")||lesson.status}`)),
  aiSection("Estimated preparation",`Approximately ${prep} minutes based on current readiness status.`)
 ],mapped.flatMap(aiLessonActions).slice(0,6));
}
function aiLessonBrief(lesson){
 const resources=aiLessonResources(lesson),reflection=aiLessonReflections(lesson);
 return aiResponse(`${lesson.id} teaching brief`,lesson.title,[
  aiSection("Instructional target",lesson.target||"No learning target is stored."),
  aiSection("Success criteria",lesson.success||"No success criteria are stored."),
  aiSection("Lesson flow","Use the stored sequence below.",lesson.agenda||[]),
  aiSection("Resources",resources.length?`${resources.length} matched Drive resource(s).`:"No confident Drive resource match is stored.",resources.slice(0,5).map(file=>`${file.title} • ${file.type}`)),
  aiSection("Classroom evidence",reflection.count?`${reflection.count} reflection(s) • ${reflection.average.toFixed(1)}/5 average • ${reflection.priority} revision priority.`:"No classroom reflection has been recorded yet.",reflection.notes)
 ],aiLessonActions(lesson));
}
function aiSubPlan(lesson){
 const independentActivity=`Students independently complete the core ${lesson.title} task using the provided directions and materials. They must use course vocabulary, show evidence for each decision, and submit the exit ticket before leaving.`;
 return aiResponse(`${lesson.id} independent substitute plan`,`${lesson.title} converted into a self-contained, no-group-work lesson.`,[
  aiSection("Substitute overview",`Course: ${lesson.course}. Duration: ${lesson.duration||"45–60 minutes"}. Students should work independently. Attendance, device expectations, and Canvas submission should be checked at the start.`),
  aiSection("Student objective",lesson.target||`Apply ${lesson.title.toLowerCase()} concepts with at least 80% accuracy.`),
  aiSection("Timing","Suggested pacing.",["5 minutes — Read directions and complete the bell ringer","10 minutes — Review notes, slides, or teacher-provided examples","25–35 minutes — Complete the independent application task","5 minutes — Submit the exit ticket and all required work"]),
  aiSection("Independent assignment",independentActivity),
  aiSection("Accountability","Students submit the activity and exit ticket in Canvas. Incomplete work remains an individual missing assignment."),
  aiSection("Materials","Prepare only materials already tied to the lesson.",lesson.materials||[])
 ],[...aiLessonActions(lesson),aiAction("Copy plan",`aiCopyResponse()`) ]);
}
function aiReteachPlan(lesson){
 const reflection=aiLessonReflections(lesson);
 const struggle=reflection.notes.find(note=>/strug|confus|difficult|change/i.test(note))||"Students need another opportunity to identify the concept, see it modeled, and apply it independently.";
 return aiResponse(`${lesson.id} reteach plan`,`${lesson.title} rebuilt as a focused 45-minute intervention.`,[
  aiSection("Likely learning gap",struggle),
  aiSection("Reteach sequence","Use gradual release and immediate checks.",["5 minutes — Retrieval warm-up with three examples/non-examples","8 minutes — Teacher think-aloud using one clear model","10 minutes — Guided practice with immediate correction","15 minutes — Independent scenario application","5 minutes — Error analysis and revised response","2 minutes — One-question mastery check"]),
  aiSection("Teacher moves","Keep vocabulary visible, model the reasoning—not only the answer—and stop after each step for a quick confidence check."),
  aiSection("Mastery evidence",lesson.success||"Students demonstrate at least 80% accuracy on the final application."),
  aiSection("Extension","Students who demonstrate mastery compare two strategies and defend the stronger option using course evidence.")
 ],[...aiLessonActions(lesson),aiAction("Build revised lesson",`aiSendToBuilder('${lesson.id}','Reteach')`)]);
}
function aiDifferentiatePlan(lesson){
 return aiResponse(`${lesson.id} differentiation plan`,lesson.title,[
  aiSection("Access supports","Reduce barriers without reducing the learning target.",["Post a vocabulary bank with student-friendly definitions","Chunk the activity into numbered checkpoints","Provide one completed model and one partially completed example","Allow partner rehearsal before independent submission","Use sentence frames for claim, evidence, and reasoning"]),
  aiSection("Processing options","Students may annotate, discuss, sketch, or organize ideas before writing the final response."),
  aiSection("Advanced extension","Require comparison of two strategies, evaluation of tradeoffs, and defense of a recommendation using evidence."),
  aiSection("Mastery check",lesson.success||"Use the same 80% success criterion for all students while varying the support provided.")
 ],[...aiLessonActions(lesson),aiAction("Build differentiated version",`aiSendToBuilder('${lesson.id}','Differentiated')`)]);
}
function aiCondensedPlan(lesson){
 return aiResponse(`${lesson.id} 30-minute version`,lesson.title,[
  aiSection("Compressed sequence","Protect the target, application, and evidence of learning.",["3 minutes — Bell ringer","7 minutes — Essential mini lesson and one model","15 minutes — Individual or partner application","3 minutes — Share and correct one misconception","2 minutes — Exit ticket"]),
  aiSection("Keep",`Keep the learning target, one strong example, the core application task, and ${lesson.exitTicket?"the existing exit ticket":"a one-question exit ticket"}.`),
  aiSection("Cut or defer","Remove extended presentations, gallery walks, optional research, decorative formatting, and second-round extensions."),
  aiSection("Canvas adjustment","Post one submission item containing the application response and exit ticket.")
 ],[...aiLessonActions(lesson),aiAction("Build 30-minute version",`aiSendToBuilder('${lesson.id}','30-Minute')`)]);
}
function aiEngagementPlan(lesson){
 const courseExample=lesson.course==="SEM"?"teams, athletes, concerts, creators, and live events":"brands, designers, retailers, trends, and consumer style";
 return aiResponse(`${lesson.id} engagement upgrade`,lesson.title,[
  aiSection("Hook",`Open with a rapid choice using familiar ${courseExample}. Students choose an option, move or vote, then defend the choice in one sentence.`),
  aiSection("Active-learning structure","Use a three-round challenge.",["Round 1 — Identify the concept from visual examples","Round 2 — Apply the concept to a realistic scenario","Round 3 — Defend a decision against a competing recommendation"]),
  aiSection("Competition without chaos","Teams earn points for accuracy, evidence, and professional communication. Require one individual response before team points count."),
  aiSection("Exit evidence",lesson.exitTicket||"Each student explains one decision and predicts the result.")
 ],[...aiLessonActions(lesson),aiAction("Build engagement version",`aiSendToBuilder('${lesson.id}','Engagement')`)]);
}
function aiCurriculumHealth(){
 const pool=aiCourseLessons(),average=pool.length?Math.round(pool.reduce((sum,lesson)=>sum+(lesson.readinessScore||0),0)/pool.length):0;
 const incomplete=pool.filter(lesson=>lesson.status!=="Complete"||(lesson.missingComponents||[]).length);
 const noReflections=pool.filter(lesson=>aiLessonReflections(lesson).count===0);
 const priorities=pool.map(lesson=>({lesson,reflection:aiLessonReflections(lesson)})).filter(item=>item.reflection.priority==="High"||item.reflection.priority==="Medium");
 return aiResponse("Curriculum health briefing",`${pool.length} lessons analyzed • ${average}% average readiness.`,[
  aiSection("Readiness",incomplete.length?`${incomplete.length} lesson(s) need development.`:"Every lesson in this view currently passes the completeness audit.",incomplete.slice(0,10).map(lesson=>`${lesson.id} — ${lesson.status}`)),
  aiSection("Reflection coverage",`${noReflections.length} lesson(s) have no saved classroom reflection.`,noReflections.slice(0,10).map(lesson=>lesson.id)),
  aiSection("Revision priorities",priorities.length?`${priorities.length} lesson(s) have medium or high reflection-based revision priority.`:"No medium or high reflection priorities are recorded.",priorities.slice(0,10).map(item=>`${item.lesson.id} — ${item.reflection.priority}`))
 ],[aiAction("Open Build Queue","go('Build Queue')","primary"),aiAction("Open Reflections","go('Reflections')"),aiAction("Open Standards","go('Standards')")]);
}
function aiSearchResponse(query){
 const words=aiTopicWords(query),pool=aiCourseLessons();
 let found=pool.filter(lesson=>words.every(word=>searchableLessonText(lesson).includes(word)));
 if(!found.length)found=pool.filter(lesson=>words.some(word=>searchableLessonText(lesson).includes(word)));
 return aiResponse("Curriculum recommendations",found.length?`${found.length} relevant lesson(s) found for “${query}”.`:"No direct lesson match was found.",[
  aiSection("Matching lessons",found.length?"Open a lesson or ask for a reteach, sub plan, shortened version, or engagement upgrade.":"Try including a lesson ID, course, unit, or topic.",found.slice(0,12).map(lesson=>`${lesson.id} — ${lesson.title} • ${lesson.readinessScore||0}% ready`))
 ],found.slice(0,3).flatMap(aiLessonActions));
}
function aiTeacherRespond(query){
 const q=String(query||"").trim(),lower=q.toLowerCase(),lesson=aiLessonFromQuery(q);
 if(!q)return aiResponse("AI Teacher Assistant","Enter a teaching question or command.");
 if(/tomorrow|next school day/.test(lower))return aiMorningBrief(Math.min(20,(typeof instructionalDay!=="undefined"?instructionalDay:1)+1),"Tomorrow");
 if(/today|morning brief|daily brief/.test(lower))return aiMorningBrief(typeof instructionalDay!=="undefined"?instructionalDay:1,"Current day");
 if(/curriculum health|what needs attention|audit|priorities/.test(lower))return aiCurriculumHealth();
 if(/what should i teach next|next lesson/.test(lower))return aiMorningBrief(Math.min(20,(typeof instructionalDay!=="undefined"?instructionalDay:1)+1),"Next lesson");
 if(lesson&&/sub|substitute|absent|independent lesson/.test(lower))return aiSubPlan(lesson);
 if(lesson&&/reteach|remediate|struggled|confused|intervention/.test(lower))return aiReteachPlan(lesson);
 if(lesson&&/differentiat|accommodat|support learners|scaffold/.test(lower))return aiDifferentiatePlan(lesson);
 if(lesson&&/30 minute|shorten|condense|assembly|half day/.test(lower))return aiCondensedPlan(lesson);
 if(lesson&&/engag|competitive|game|active/.test(lower))return aiEngagementPlan(lesson);
 if(lesson)return aiLessonBrief(lesson);
 return aiSearchResponse(q);
}
function aiTeacherRun(event){event?.preventDefault();const input=document.getElementById("aiTeacherInput");const query=input?.value.trim()||state.aiTeacher.query.trim();if(!query)return;state.aiTeacher.query=query;state.aiTeacher.response=aiTeacherRespond(query);aiTeacherHistory.unshift({query,title:state.aiTeacher.response.title,createdAt:new Date().toISOString()});aiTeacherHistory=aiTeacherHistory.slice(0,25);localStorage.setItem(AI_TEACHER_HISTORY_KEY,JSON.stringify(aiTeacherHistory));render();}
function aiTeacherSuggestion(query){state.aiTeacher.query=query;state.aiTeacher.response=aiTeacherRespond(query);aiTeacherHistory.unshift({query,title:state.aiTeacher.response.title,createdAt:new Date().toISOString()});aiTeacherHistory=aiTeacherHistory.slice(0,25);localStorage.setItem(AI_TEACHER_HISTORY_KEY,JSON.stringify(aiTeacherHistory));render();}
function aiTeacherClear(){state.aiTeacher.query="";state.aiTeacher.response=null;render();}
function aiSendToBuilder(id,variant){const lesson=lessons.find(item=>item.id===id);if(!lesson)return;state.lb2=state.lb2||{};Object.assign(state.lb2,{course:lesson.course,topic:`${lesson.title} — ${variant} Version`,competency:lesson.standards||"",duration:variant==="30-Minute"?"30 minutes":"45–60 minutes",style:variant==="Engagement"?"Competitive":"Interactive",difficulty:"Medium",includeSlides:true,includeWorksheet:true,includeAssessment:true,preview:null});state.page="Lesson Builder 2.0";render();}
function aiResponsePlainText(){const response=state.aiTeacher.response;if(!response)return "";return [response.title,response.summary,...response.sections.flatMap(section=>[section.title,section.body,...(section.items||[]).map(item=>`- ${item}`)])].join("\n\n");}
function aiCopyResponse(){const text=aiResponsePlainText();if(!text)return;navigator.clipboard?.writeText(text).then(()=>toast("Assistant response copied."));}
function aiRenderSection(section){return `<section class="ai-section"><h3>${aiEscape(section.title)}</h3>${section.body?`<p>${aiEscape(section.body).replaceAll("\n","<br>")}</p>`:""}${section.items?.length?`<ul>${section.items.map(item=>`<li>${aiEscape(item)}</li>`).join("")}</ul>`:""}</section>`;}
function aiTeacherView(){
 const response=state.aiTeacher.response;
 const suggestions=["Give me today's teaching brief","Create a sub plan for SEM-008","Reteach FASH-009","Make SEM-014 more engaging","Create a 30 minute version of FASH-015","Show curriculum health priorities"];
 return shell(`<div class="ai-teacher-layout"><aside class="card ai-context-panel"><div class="row"><div><h2>AI Teacher Assistant</h2><p class="muted">Context-aware planning and curriculum coaching.</p></div><span class="pill">Local</span></div><label>Course context</label><select onchange="state.aiTeacher.course=this.value;render()">${["All","SEM","Fashion"].map(value=>`<option ${state.aiTeacher.course===value?"selected":""}>${value}</option>`).join("")}</select><label>Lesson context</label><select onchange="state.aiTeacher.lessonId=this.value"><option value="">Auto-detect from command</option>${aiCourseLessons().map(lesson=>`<option value="${lesson.id}" ${state.aiTeacher.lessonId===lesson.id?"selected":""}>${lesson.id} — ${aiEscape(lesson.title)}</option>`).join("")}</select><div class="ai-capabilities"><h3>Built-in workflows</h3><div class="muted">Daily brief • lesson coaching • substitute plans • reteach plans • differentiation • 30-minute versions • engagement upgrades • curriculum health</div></div><h3>Recent requests</h3><div class="ai-history">${aiTeacherHistory.slice(0,8).map(item=>`<button onclick="aiTeacherSuggestion('${aiEscape(item.query).replaceAll("&#039;","\\'")}')"><strong>${aiEscape(item.query)}</strong><span>${new Date(item.createdAt).toLocaleString()}</span></button>`).join("")||'<div class="muted">No requests yet.</div>'}</div></aside><main class="ai-teacher-main"><section class="card ai-prompt-card"><form onsubmit="aiTeacherRun(event)"><textarea id="aiTeacherInput" placeholder="Try: Create a reteach plan for SEM-011">${aiEscape(state.aiTeacher.query)}</textarea><div class="ai-prompt-actions"><button class="btn">Ask Fontaine</button><button type="button" class="btn secondary" onclick="aiTeacherClear()">Clear</button></div></form><div class="ai-suggestions">${suggestions.map(query=>`<button onclick="aiTeacherSuggestion('${query.replaceAll("'","\\'")}')">${aiEscape(query)}</button>`).join("")}</div></section>${response?`<section class="card ai-response-card"><div class="ai-response-heading"><div><span class="pill">Assistant response</span><h2>${aiEscape(response.title)}</h2><p>${aiEscape(response.summary)}</p></div><button class="btn secondary" onclick="aiCopyResponse()">Copy</button></div><div class="ai-response-sections">${response.sections.map(aiRenderSection).join("")}</div><div class="ai-response-actions">${(response.actions||[]).map(action=>`<button class="btn ${action.kind==="primary"?"":"secondary"}" onclick="${action.action}">${aiEscape(action.label)}</button>`).join("")}</div></section>`:`<section class="card ai-empty"><h2>What do you need for class?</h2><p>Ask for a daily brief, lesson recommendation, substitute plan, reteach sequence, differentiated version, shortened schedule, engagement upgrade, or curriculum audit.</p></section>`}</main></div>`);
}
if(!pages.includes("AI Teacher Assistant")){const index=pages.indexOf("Ask Fontaine");pages.splice(index>=0?index+1:1,0,"AI Teacher Assistant");}
const aiTeacherRenderBefore=render;render=function(){if(state.page==="AI Teacher Assistant"){document.getElementById("app").outerHTML=`<div id="app">${aiTeacherView()}</div>`;return;}aiTeacherRenderBefore();};
const aiTeacherResetBefore=resetLocalData;resetLocalData=function(){localStorage.removeItem(AI_TEACHER_HISTORY_KEY);aiTeacherResetBefore();};
render();