(()=>{
 const contextKeys=["search","course","status","markingPeriod","resourceCourse","resourceType","resourceLesson","companionCourse","companionType","companionStatus","companionSearch","companionSelected","driveCourse","driveType","driveStatus","driveSearch"];
 const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
 const list=value=>Array.isArray(value)?value:[];
 const originalOpenLesson=openLesson;
 function captureLessonReturnContext(){
  const snapshot={page:state.page};
  contextKeys.forEach(key=>{if(Object.prototype.hasOwnProperty.call(state,key))snapshot[key]=state[key];});
  state.lessonReturnContext=snapshot;
 }
 openLesson=function(id){
  if(state.page!=="Lesson Workspace")captureLessonReturnContext();
  originalOpenLesson(id);
 };
 function lessonSequence(){
  const selected=state.selected;
  return lessons.filter(lesson=>lesson.course===selected?.course).sort((a,b)=>(a.day||0)-(b.day||0)||a.id.localeCompare(b.id));
 }
 function adjacentState(){
  const sequence=lessonSequence();
  const index=sequence.findIndex(lesson=>lesson.id===state.selected?.id);
  return {sequence,index,previous:index>0?sequence[index-1]:null,next:index>=0&&index<sequence.length-1?sequence[index+1]:null};
 }
 window.returnFromLesson=()=>{
  const context=state.lessonReturnContext||{page:"Lessons"};
  Object.entries(context).forEach(([key,value])=>{state[key]=value;});
  state.page=context.page&&context.page!=="Lesson Workspace"?context.page:"Lessons";
  render();
 };
 window.openAdjacentLesson=direction=>{
  const {sequence,index}=adjacentState();
  const target=sequence[index+Number(direction)];
  if(!target)return;
  state.selected=target;
  state.page="Lesson Workspace";
  state.lessonTab="Overview";
  render();
  window.scrollTo?.({top:0,behavior:"smooth"});
 };
 window.openLessonSection=tab=>{state.lessonTab=tab;render();};
 window.openLessonCompanions=id=>{
  const lesson=lessons.find(item=>item.id===id)||state.selected;
  state.companionSelected="";
  state.companionSearch=lesson?.id||"";
  state.companionCourse=lesson?.course||"All";
  state.companionType="All";
  state.companionStatus="All";
  state.page="Companion Resources";
  render();
 };
 window.copyCurrentCanvas=()=>{if(state.selected)copyCanvas(state.selected.id);};
 function printableLesson(lesson){
  const numbered=list(lesson.agenda).map(item=>`<li>${esc(item)}</li>`).join("");
  const bullets=value=>list(value).map(item=>`<li>${esc(item)}</li>`).join("");
  return `<article class="lesson-print-sheet"><header><div class="lesson-print-kicker">${esc(lesson.course)} ${esc(lesson.courseCode)} • ${esc(lesson.id)}</div><h1>${esc(lesson.title)}</h1><p>${esc(lesson.unit)} • ${esc(lesson.duration)}</p></header><section class="lesson-print-target"><h2>Learning Target</h2><p>${esc(lesson.target)}</p><h2>Success Criteria</h2><p>${esc(lesson.success)}</p></section><section><h2>Agenda</h2><ol>${numbered}</ol></section><section><h2>Bell Ringer</h2><p>${esc(lesson.bellRinger)}</p></section><section><h2>Mini Lesson</h2><p>${esc(lesson.miniLesson)}</p></section><section><h2>Student Activity</h2><p>${esc(lesson.activity)}</p></section><section><h2>Exit Ticket</h2><p>${esc(lesson.exitTicket)}</p></section><div class="lesson-print-columns"><section><h2>Materials</h2><ul>${bullets(lesson.materials)}</ul></section><section><h2>Differentiation</h2><ul>${bullets(lesson.differentiation)}</ul></section></div><section><h2>Canvas Directions</h2><pre>${esc(lesson.canvas)}</pre></section><footer><strong>Standards:</strong> ${esc(lesson.standards)}</footer></article>`;
 }
 window.printCurrentLesson=()=>{
  const lesson=state.selected;
  if(!lesson)return;
  document.querySelector(".lesson-print-sheet")?.remove();
  document.body.insertAdjacentHTML("beforeend",printableLesson(lesson));
  document.body.classList.add("lesson-printing");
  const cleanup=()=>{document.body.classList.remove("lesson-printing");document.querySelector(".lesson-print-sheet")?.remove();};
  window.addEventListener?.("afterprint",cleanup,{once:true});
  window.print();
  setTimeout(cleanup,1200);
 };
 function returnLabel(){
  const page=state.lessonReturnContext?.page;
  const labels={Dashboard:"Dashboard",Courses:"Courses",Lessons:"Lessons","Resource Library":"Resource Library","Companion Resources":"Companion Resources","Google Drive":"Google Drive",Calendar:"Calendar","Build Queue":"Build Queue","Annual Review":"Annual Review"};
  return `Back to ${labels[page]||"Lessons"}`;
 }
 function lessonToolbar(){
  const {previous,next}=adjacentState();
  const id=state.selected?.id||"";
  return `<div class="classroom-toolbar" aria-label="Lesson classroom actions"><button class="btn secondary classroom-back" onclick="returnFromLesson()">${returnLabel()}</button><span class="classroom-toolbar-divider" aria-hidden="true"></span><button class="btn secondary" onclick="openAdjacentLesson(-1)" ${previous?"":"disabled"} aria-label="Previous lesson">← Previous</button><button class="btn secondary" onclick="openAdjacentLesson(1)" ${next?"":"disabled"} aria-label="Next lesson">Next →</button><span class="classroom-toolbar-divider" aria-hidden="true"></span><button class="btn secondary" onclick="openLessonSection('Teach')">Teach</button><button class="btn secondary" onclick="openLessonSection('Canvas')">Canvas</button><button class="btn secondary" onclick="openLessonCompanions('${id}')">Lesson resources</button><button class="btn secondary" onclick="copyCurrentCanvas()">Copy Canvas</button><button class="btn" onclick="printCurrentLesson()">Print full lesson</button></div>`;
 }
 function enhanceTopbar(){
  const subtitle=document.querySelector(".topbar>div>.muted");
  if(subtitle)subtitle.textContent="SEM 8175 • Fashion 8140 • Entrepreneurship 9093";
 }
 function enhanceLessonWorkspace(){
  if(state.page!=="Lesson Workspace")return;
  const header=document.querySelector(".lesson-header");
  const tabs=header?.querySelector(".tabs");
  if(header&&tabs&&!header.querySelector(".classroom-toolbar"))tabs.insertAdjacentHTML("beforebegin",lessonToolbar());
  const oldBack=document.querySelector(".workspace-actions>button");
  if(oldBack){oldBack.textContent=returnLabel();oldBack.setAttribute("onclick","returnFromLesson()");}
 }
 function enhanceLessonList(){
  if(state.page!=="Lessons")return;
  const filters=document.querySelector(".main>.filters");
  const lessonCards=document.querySelectorAll(".main article.item");
  if(filters&&!document.querySelector(".lesson-filter-summary"))filters.insertAdjacentHTML("afterend",`<div class="lesson-filter-summary"><strong>${lessonCards.length}</strong> matching lesson${lessonCards.length===1?"":"s"}<span>Open a lesson without losing these filters.</span></div>`);
 }
 const originalRender=render;
 render=function(){
  originalRender();
  enhanceTopbar();
  enhanceLessonWorkspace();
  enhanceLessonList();
 };
 document.addEventListener("keydown",event=>{
  if(state.page!=="Lesson Workspace"||event.target?.matches?.("input,textarea,select"))return;
  if(event.altKey&&event.key==="ArrowLeft"){event.preventDefault();openAdjacentLesson(-1);}
  if(event.altKey&&event.key==="ArrowRight"){event.preventDefault();openAdjacentLesson(1);}
 });
 render();
 window.FONTaineClassroomUsability={version:1,features:["return-context","adjacent-lessons","quick-actions","full-lesson-print","lesson-resource-filter","mobile-toolbar"]};
})();
