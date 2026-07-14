(()=>{
 const verifiedSources=[
  {id:"verified-sem-016-role-play",title:"SEM Individual Role-Play Worksheet",course:"SEM",type:"Student Organizer",lessonIds:["SEM-016"],fileId:"1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk",url:"https://docs.google.com/document/d/1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk",status:"Verified in Drive"},
  {id:"verified-sem-020-quarterly-review",title:"SEM Quarterly Review",course:"SEM",type:"Assessment",lessonIds:["SEM-020"],fileId:"1jcglgN9xIY5FxoWzuVwCSV1fZX7PbRdyRRsEJj3f0xA",url:"https://docs.google.com/spreadsheets/d/1jcglgN9xIY5FxoWzuVwCSV1fZX7PbRdyRRsEJj3f0xA",status:"Verified in Drive"},
  {id:"verified-fashion-history-rubric",title:"Fashion History Project Rubric",course:"Fashion",type:"Scoring Rubric",lessonIds:["FASH-005","FASH-006","FASH-007","FASH-008"],fileId:"1YiN2XLDaQbPr4ork6boCTLNEqUObC5X3JJ-SPq36xKY",url:"https://docs.google.com/document/d/1YiN2XLDaQbPr4ork6boCTLNEqUObC5X3JJ-SPq36xKY",status:"Verified in Drive"},
  {id:"verified-fashion-gallery-walk",title:"History of Fashion Project Gallery Walk Worksheet",course:"Fashion",type:"Student Organizer",lessonIds:["FASH-008"],fileId:"1w9F5heVGDa2JR9Sb7D6k82pBokx18dvjbrI0P5dD-3M",url:"https://docs.google.com/document/d/1w9F5heVGDa2JR9Sb7D6k82pBokx18dvjbrI0P5dD-3M",status:"Verified in Drive"},
  {id:"verified-fashion-sem1-study-guide",title:"Fashion Marketing Semester 1 Fill-in-the-Blank Study Guide",course:"Fashion",type:"Assessment",lessonIds:["FASH-020"],fileId:"1W0icXY1Ehxm9vHGyQMG6bIS1k5X2yUA-nI64w6KXFfA",url:"https://docs.google.com/document/d/1W0icXY1Ehxm9vHGyQMG6bIS1k5X2yUA-nI64w6KXFfA",status:"Verified in Drive"},
  {id:"verified-fashion-sem1-key",title:"Fashion Marketing Semester 1 Study Guide Answer Key",course:"Fashion",type:"Answer Key",lessonIds:["FASH-020"],fileId:"1j_C8eHAVxN2WQaoLpY0GFM_Oi38xARUIf6YHetEkUzA",url:"https://docs.google.com/document/d/1j_C8eHAVxN2WQaoLpY0GFM_Oi38xARUIf6YHetEkUzA",status:"Verified in Drive"},
  {id:"verified-ent-survey-notes",title:"Entrepreneurship Surveys Fill-in-the-Blank Notes",course:"Entrepreneurship",type:"Student Organizer",lessonIds:["ENT-007","ENT-009"],fileId:"1zpsHO35H5cdWLSikN3qyNf0TyjpluScu2ldF4X4V8NQ",url:"https://docs.google.com/document/d/1zpsHO35H5cdWLSikN3qyNf0TyjpluScu2ldF4X4V8NQ",status:"Verified in Drive"},
  {id:"verified-ent-ownership-notes",title:"Business Ownership Structures Fill-in-the-Blank Notes",course:"Entrepreneurship",type:"Student Organizer",lessonIds:["ENT-015","ENT-016"],fileId:"1oV6uakhX3qtIcztTuEu3CxDpY7ffcvF3p6emlLlvZk0",url:"https://docs.google.com/document/d/1oV6uakhX3qtIcztTuEu3CxDpY7ffcvF3p6emlLlvZk0",status:"Verified in Drive"},
  {id:"verified-ent-promo-sorting",title:"Entrepreneurship Promo Mix Scenario Sorting",course:"Entrepreneurship",type:"Student Organizer",lessonIds:["ENT-017"],fileId:"1mnfGZhekTLegcr-VkntTw9n4zFPzTTOs0pDLuIjQITY",url:"https://docs.google.com/presentation/d/1mnfGZhekTLegcr-VkntTw9n4zFPzTTOs0pDLuIjQITY",status:"Verified in Drive"},
  {id:"verified-ent-quarterly-review",title:"Entrepreneurship Quarterly Exam Review",course:"Entrepreneurship",type:"Assessment",lessonIds:["ENT-020"],fileId:"1ouaBe_U_ls5dMDKXJmpUzSEdSBm0FacPdjV7Ub2vimY",url:"https://docs.google.com/document/d/1ouaBe_U_ls5dMDKXJmpUzSEdSBm0FacPdjV7Ub2vimY",status:"Verified in Drive"},
  {id:"verified-ent-quarterly-key",title:"Entrepreneurship Quarterly Exam Review Answer Key",course:"Entrepreneurship",type:"Answer Key",lessonIds:["ENT-020"],fileId:"1kLvUYqPEgqyX3W-nJJqp2leRwOO4H-4roxR38YlhxqU",url:"https://docs.google.com/document/d/1kLvUYqPEgqyX3W-nJJqp2leRwOO4H-4roxR38YlhxqU",status:"Verified in Drive"},
  {id:"verified-ent-fill-key",title:"Entrepreneurship Fill-in-the-Blank Exam Review Answer Key",course:"Entrepreneurship",type:"Answer Key",lessonIds:["ENT-020"],fileId:"1sMGBV4_xXhrYPgFazzXatImZbJOe-2PV0DNgbkXKBFs",url:"https://docs.google.com/document/d/1sMGBV4_xXhrYPgFazzXatImZbJOe-2PV0DNgbkXKBFs",status:"Verified in Drive"}
 ];
 const generatedTypes=[
  {key:"organizer",label:"Student Organizer",reviewRequired:false},
  {key:"rubric",label:"Scoring Rubric",reviewRequired:false},
  {key:"exit",label:"Exit Ticket",reviewRequired:false},
  {key:"assessment",label:"Quick Check",reviewRequired:true},
  {key:"guide",label:"Teacher Scoring Guide",reviewRequired:true}
 ];
 const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
 const courseNames=()=>["All",...new Set(lessons.map(lesson=>lesson.course))];
 const lessonFor=id=>lessons.find(lesson=>lesson.id===id);
 const generatedResources=lessons.flatMap(lesson=>generatedTypes.map(type=>({
  id:`${lesson.id.toLowerCase()}-${type.key}`,
  title:`${lesson.id} ${type.label}`,
  course:lesson.course,
  type:type.label,
  lessonIds:[lesson.id],
  status:"Generated",
  verification:"Generated from the complete lesson package",
  reviewRequired:type.reviewRequired
 })));
 const allResources=[...verifiedSources,...generatedResources];
 const demandPattern=/worksheet|organizer|matrix|template|chart|checklist|rubric|assessment|performance check|review|answer key|notes|cards|station/i;
 function demandType(material){
  const value=String(material).toLowerCase();
  if(value.includes("answer key"))return "Answer Key";
  if(value.includes("rubric")||value.includes("checklist"))return "Scoring Rubric";
  if(value.includes("assessment")||value.includes("performance check")||value.includes("review"))return "Assessment";
  return "Student Organizer";
 }
 const demands=lessons.flatMap(lesson=>(lesson.materials||[]).filter(material=>demandPattern.test(material)).map(material=>{
  const type=demandType(material);
  const verified=verifiedSources.some(resource=>resource.lessonIds.includes(lesson.id)&&resource.type===type);
  return {lessonId:lesson.id,course:lesson.course,title:lesson.title,material,type,verified,status:verified?"Verified in Drive":"Generated coverage only"};
 }));
 const generatedOnlyDemands=demands.filter(item=>!item.verified);
 window.FONTaineCompanionSources={verifiedSources,demands};
 window.FONTaineCompanionResources=allResources;
 window.FONTaineCompanionAudit={
  totalLessons:lessons.length,
  generatedResources:generatedResources.length,
  verifiedResources:verifiedSources.length,
  verifiedAnswerKeys:verifiedSources.filter(resource=>resource.type==="Answer Key").length,
  materialDemands:demands.length,
  generatedOnlyDemands:generatedOnlyDemands.length
 };
 state.companionCourse=state.companionCourse||"All";
 state.companionType=state.companionType||"All";
 state.companionStatus=state.companionStatus||"All";
 state.companionSearch=state.companionSearch||"";
 state.companionSelected=state.companionSelected||"";
 function resourceStatusMatches(resource){
  if(state.companionStatus==="All")return true;
  if(state.companionStatus==="Teacher Review Required")return !!resource.reviewRequired;
  return resource.status===state.companionStatus;
 }
 function filteredResources(){
  const q=state.companionSearch.toLowerCase().trim();
  return allResources.filter(resource=>
   (state.companionCourse==="All"||resource.course===state.companionCourse)&&
   (state.companionType==="All"||resource.type===state.companionType)&&
   resourceStatusMatches(resource)&&
   (!q||[resource.title,resource.course,resource.type,...resource.lessonIds,resource.status,resource.verification].join(" ").toLowerCase().includes(q))
  ).sort((a,b)=>(a.status===b.status?0:a.status==="Verified in Drive"?-1:1)||a.course.localeCompare(b.course)||a.title.localeCompare(b.title));
 }
 function responseBoxes(labels){return labels.map(label=>`<section class="companion-response"><h3>${esc(label)}</h3><div class="companion-writing-space"></div></section>`).join("");}
 function printableHtml(resource){
  const lesson=lessonFor(resource.lessonIds[0]);
  if(resource.status==="Verified in Drive")return `<article class="companion-printable"><header><span class="pill">${esc(resource.course)}</span><h1>${esc(resource.title)}</h1><p>Verified existing classroom resource in Google Drive.</p></header><div class="companion-source-details"><p><strong>Type:</strong> ${esc(resource.type)}</p><p><strong>Linked lessons:</strong> ${resource.lessonIds.map(esc).join(", ")}</p><p><strong>Verification:</strong> File ID ${esc(resource.fileId)}</p></div><div class="companion-notice verified">This file is source-verified. Open the Drive file to review or use the original.</div></article>`;
  if(!lesson)return `<article class="companion-printable"><h1>${esc(resource.title)}</h1><p>Lesson data unavailable.</p></article>`;
  const heading=`<header><span class="pill">${esc(lesson.course)} ${esc(lesson.courseCode)}</span><h1>${esc(resource.title)}</h1><p>${esc(lesson.title)}</p></header><section class="companion-target"><h2>Learning Target</h2><p>${esc(lesson.target)}</p><h2>Success Criteria</h2><p>${esc(lesson.success)}</p></section>`;
  if(resource.type==="Student Organizer")return `<article class="companion-printable">${heading}<section><h2>Directions</h2><p>${esc(lesson.activity)}</p></section>${responseBoxes(["Key concepts and vocabulary","Evidence, examples, or research","Analysis and business decision","Final response or product plan","Reflection: What did you learn or revise?"])}<section class="companion-check"><h2>Before You Submit</h2><label>□ I completed every required section.</label><label>□ I used course vocabulary accurately.</label><label>□ I included evidence or examples.</label><label>□ I checked my work against the success criteria.</label></section></article>`;
  if(resource.type==="Scoring Rubric")return `<article class="companion-printable">${heading}<table class="companion-rubric"><thead><tr><th>Criteria</th><th>4 — Exceeds</th><th>3 — Meets</th><th>2 — Developing</th><th>1 — Beginning</th></tr></thead><tbody><tr><th>Concept accuracy</th><td>Accurate, detailed, and uses vocabulary precisely.</td><td>Mostly accurate and uses required vocabulary.</td><td>Some accurate ideas with noticeable gaps.</td><td>Major misunderstandings or missing concepts.</td></tr><tr><th>Evidence and application</th><td>Uses strong evidence and applies ideas insightfully.</td><td>Uses relevant evidence and applies the concept correctly.</td><td>Evidence is limited or application is partly correct.</td><td>Little evidence or application is inaccurate.</td></tr><tr><th>Completion and organization</th><td>Complete, polished, and exceptionally organized.</td><td>All required parts are complete and organized.</td><td>One or more parts are incomplete or unclear.</td><td>Multiple required parts are missing.</td></tr><tr><th>Professional communication</th><td>Clear, persuasive, and audience-ready.</td><td>Clear, appropriate, and easy to follow.</td><td>Meaning is understandable but inconsistent.</td><td>Communication is unclear or unprofessional.</td></tr></tbody></table><div class="companion-score"><strong>Total: ____ / 16</strong><span>80% mastery = 13 points</span></div></article>`;
  if(resource.type==="Exit Ticket")return `<article class="companion-printable">${heading}<section class="companion-exit"><h2>Exit Ticket</h2><p>${esc(lesson.exitTicket)}</p><div class="companion-writing-space tall"></div><h3>Self-Check</h3><label>□ I answered the entire prompt.</label><label>□ I used a specific example or evidence.</label><label>□ My response demonstrates at least 80% mastery.</label></section></article>`;
  if(resource.type==="Quick Check")return `<article class="companion-printable">${heading}<div class="companion-notice review">Teacher review required before assigning. This generated quick check is not a verified source assessment.</div><ol class="companion-questions"><li>Identify and explain two important ideas from this lesson: ${esc(lesson.title)}.</li><li>Apply the learning target to a new business, customer, product, event, or fashion example.</li><li>Analyze this opening situation and explain the best response: ${esc(lesson.bellRinger)}</li><li>Describe one decision required by the student activity and justify the decision with evidence.</li><li>${esc(lesson.exitTicket)}</li></ol>${responseBoxes(["Responses and evidence"])}<section class="companion-score"><strong>Score: ____ / 10</strong><span>80% mastery = 8 points</span></section></article>`;
  return `<article class="companion-printable">${heading}<div class="companion-notice review">Teacher review required. This is a generated scoring guide, not a verified answer key.</div><section><h2>Acceptable Evidence</h2><ul><li>Response directly addresses: ${esc(lesson.target)}</li><li>Work meets the stored success criteria: ${esc(lesson.success)}</li><li>Student accurately uses ideas from the mini lesson: ${esc(lesson.miniLesson)}</li><li>Student completes the required application: ${esc(lesson.activity)}</li><li>Exit response includes a relevant example, evidence, or justified decision.</li></ul></section><section><h2>Scoring Guidance</h2><p>Use 2 points for accurate concept use, 2 points for evidence or application, 2 points for reasoning, 2 points for completion, and 2 points for professional communication. Accept alternate responses when they are accurate and supported.</p></section><section><h2>Teacher Notes</h2><div class="companion-writing-space tall"></div></section></article>`;
 }
 function companionResourceText(resource){
  const lesson=lessonFor(resource.lessonIds[0]);
  if(resource.status==="Verified in Drive")return `${resource.title}\n${resource.course}\n${resource.type}\nLinked lessons: ${resource.lessonIds.join(", ")}\n${resource.url}`;
  if(!lesson)return resource.title;
  return [resource.title,lesson.title,`Learning Target: ${lesson.target}`,`Success Criteria: ${lesson.success}`,`Student Activity: ${lesson.activity}`,`Exit Ticket: ${lesson.exitTicket}`,resource.type==="Teacher Scoring Guide"?"Teacher review required; generated scoring guide, not a verified answer key.":""].filter(Boolean).join("\n\n");
 }
 window.openCompanionResource=id=>{state.companionSelected=id;render();};
 window.closeCompanionResource=()=>{state.companionSelected="";render();};
 window.openCompanionDrive=id=>{const resource=allResources.find(item=>item.id===id);if(resource?.url)window.open(resource.url,"_blank","noopener");};
 window.copyCompanionResource=id=>{const resource=allResources.find(item=>item.id===id);if(!resource)return;navigator.clipboard?.writeText(companionResourceText(resource)).then(()=>toast("Companion resource copied."));};
 window.printCompanionResource=id=>{state.companionSelected=id;render();setTimeout(()=>window.print(),80);};
 window.clearCompanionFilters=()=>{state.companionCourse="All";state.companionType="All";state.companionStatus="All";state.companionSearch="";render();};
 function resourceCard(resource){return `<article class="card companion-card" data-resource-type="${esc(resource.type)}"><div class="row"><span class="pill">${esc(resource.course)}</span><span class="companion-status ${resource.status==="Verified in Drive"?"verified":"generated"}">${esc(resource.status)}</span></div><h3>${esc(resource.title)}</h3><p class="muted">${esc(resource.type)} • ${resource.lessonIds.map(esc).join(", ")}</p>${resource.reviewRequired?'<div class="companion-review-flag">Teacher review required</div>':""}<div class="companion-card-actions"><button class="btn secondary" onclick="openCompanionResource('${resource.id}')">Preview</button>${resource.url?`<button class="btn" onclick="openCompanionDrive('${resource.id}')">Open Drive</button>`:`<button class="btn" onclick="printCompanionResource('${resource.id}')">Print</button>`}</div></article>`;}
 function companionDetail(resource){return shell(`<div class="companion-detail"><div class="companion-actions"><button class="btn secondary" onclick="closeCompanionResource()">Back to resources</button><div><button class="btn secondary" onclick="copyCompanionResource('${resource.id}')">Copy</button>${resource.url?` <button class="btn" onclick="openCompanionDrive('${resource.id}')">Open Drive</button>`:` <button class="btn" onclick="printCompanionResource('${resource.id}')">Print</button>`}</div></div>${printableHtml(resource)}</div>`);}
 function companionResourcesView(){
  const selected=allResources.find(resource=>resource.id===state.companionSelected);
  if(selected)return companionDetail(selected);
  const filtered=filteredResources();
  const types=["All",...new Set(allResources.map(resource=>resource.type))];
  const visibleGaps=generatedOnlyDemands.filter(item=>state.companionCourse==="All"||item.course===state.companionCourse).slice(0,12);
  return shell(`<div class="companion-dashboard"><section class="card companion-hero"><div><span class="pill">Three-course resource audit</span><h2>Companion Resources</h2><p>Printable organizers, rubrics, exit tickets, quick checks, and teacher guides—separated from verified Drive answer keys.</p></div><div class="companion-metrics"><div data-companion-metric="generated"><strong>${generatedResources.length}</strong><span>Generated printables</span></div><div data-companion-metric="verified"><strong>${verifiedSources.length}</strong><span>Verified Drive files</span></div><div data-companion-metric="keys"><strong>${verifiedSources.filter(resource=>resource.type==="Answer Key").length}</strong><span>Verified answer keys</span></div><div data-companion-metric="lessons"><strong>${lessons.length}</strong><span>Lessons covered</span></div></div></section><section class="card companion-toolbar"><input aria-label="Search companion resources" placeholder="Search resource or lesson" value="${esc(state.companionSearch)}" oninput="state.companionSearch=this.value;render()"/><select aria-label="Filter companion resources by course" onchange="state.companionCourse=this.value;render()">${courseNames().map(value=>`<option ${state.companionCourse===value?"selected":""}>${esc(value)}</option>`).join("")}</select><select aria-label="Filter companion resources by type" onchange="state.companionType=this.value;render()">${types.map(value=>`<option ${state.companionType===value?"selected":""}>${esc(value)}</option>`).join("")}</select><select aria-label="Filter companion resources by status" onchange="state.companionStatus=this.value;render()">${["All","Verified in Drive","Generated","Teacher Review Required"].map(value=>`<option ${state.companionStatus===value?"selected":""}>${value}</option>`).join("")}</select><button class="btn secondary" onclick="clearCompanionFilters()">Clear</button></section><section class="companion-grid">${filtered.slice(0,60).map(resourceCard).join("")||'<div class="card empty">No companion resources match the current filters.</div>'}</section>${filtered.length>60?`<p class="muted companion-result-note">Showing 60 of ${filtered.length} matching resources. Use filters to narrow the list.</p>`:""}<section class="card companion-gap-section"><div class="row"><div><h2>Generated-Only Material Demands</h2><p class="muted">These lesson materials have printable coverage in Fontaine, but no matching source-verified Drive file is recorded yet.</p></div><strong>${generatedOnlyDemands.length}</strong></div><div class="companion-gap-list">${visibleGaps.map(item=>`<button onclick="state.companionSearch='${item.lessonId}';state.companionType='${demandType(item.material)==="Assessment"?"Quick Check":demandType(item.material)}';render()"><span><strong>${item.lessonId}</strong> — ${esc(item.material)}</span><small>${esc(item.course)} • ${esc(item.type)}</small></button>`).join("")||'<div class="muted">No generated-only demands for this filter.</div>'}</div></section></div>`);
 }
 if(!pages.includes("Companion Resources"))pages.splice(pages.indexOf("Resource Library")+1,0,"Companion Resources");
 const renderBeforeCompanions=render;
 render=function(){if(state.page==="Companion Resources"){document.getElementById("app").outerHTML=`<div id="app">${companionResourcesView()}</div>`;return;}renderBeforeCompanions();};
 render();
})();