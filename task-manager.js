const completedTaskHistory=[];
state.taskSearch="";
state.taskCourse="All";
state.taskPriority="All";
state.taskStatus="Open";
state.taskLesson="All";
state.taskComponent="All";

function currentOpenTasks(){
  return window.FONTaineBuildTasks.map(task=>{
    const lesson=lessons.find(item=>item.id===task.lessonId);
    return {...task,course:lesson?.course||"Unknown",lessonTitle:lesson?.title||"Unknown lesson",lessonDay:lesson?.day||0};
  });
}

function taskMatches(task){
  const q=state.taskSearch.toLowerCase();
  const haystack=[task.lessonId,task.lessonTitle,task.title,task.componentKey,task.course,task.priority,task.status].join(" ").toLowerCase();
  return (!q||haystack.includes(q))&&
    (state.taskCourse==="All"||task.course===state.taskCourse)&&
    (state.taskPriority==="All"||task.priority===state.taskPriority)&&
    (state.taskLesson==="All"||task.lessonId===state.taskLesson)&&
    (state.taskComponent==="All"||task.componentKey===state.taskComponent);
}

function completeTask(taskId){
  const task=currentOpenTasks().find(item=>item.id===taskId);
  if(!task)return;
  const lesson=lessons.find(item=>item.id===task.lessonId);
  const component=lesson?.componentDetails.find(item=>item.key===task.componentKey);
  if(!lesson||!component)return;
  component.status="complete";
  completedTaskHistory.unshift({...task,status:"Done",completedAt:new Date().toISOString()});
  calculateReadiness(lesson);
  refreshReadiness();
  toast(`${task.title} completed for ${task.lessonId}.`);
  render();
}

function reopenTask(historyId){
  const index=completedTaskHistory.findIndex(item=>item.id===historyId);
  if(index<0)return;
  const task=completedTaskHistory[index];
  const lesson=lessons.find(item=>item.id===task.lessonId);
  const component=lesson?.componentDetails.find(item=>item.key===task.componentKey);
  if(component)component.status="missing";
  completedTaskHistory.splice(index,1);
  if(lesson)calculateReadiness(lesson);
  refreshReadiness();
  toast(`${task.title} reopened for ${task.lessonId}.`);
  render();
}

function bulkCompleteVisible(){
  const visible=currentOpenTasks().filter(taskMatches);
  if(!visible.length){toast("No visible open tasks to complete.");return;}
  visible.forEach(task=>{
    const lesson=lessons.find(item=>item.id===task.lessonId);
    const component=lesson?.componentDetails.find(item=>item.key===task.componentKey);
    if(component)component.status="complete";
    completedTaskHistory.unshift({...task,status:"Done",completedAt:new Date().toISOString()});
    if(lesson)calculateReadiness(lesson);
  });
  refreshReadiness();
  toast(`${visible.length} visible tasks completed.`);
  render();
}

function clearTaskFilters(){
  state.taskSearch="";
  state.taskCourse="All";
  state.taskPriority="All";
  state.taskStatus="Open";
  state.taskLesson="All";
  state.taskComponent="All";
  render();
}

buildQueue=function(){
  const openTasks=currentOpenTasks();
  const allTasks=state.taskStatus==="Done"?completedTaskHistory:state.taskStatus==="All"?[...openTasks,...completedTaskHistory]:openTasks;
  const visible=allTasks.filter(taskMatches).sort((a,b)=>a.priority.localeCompare(b.priority)||a.lessonDay-b.lessonDay||a.lessonId.localeCompare(b.lessonId));
  const courses=["All",...new Set(openTasks.map(task=>task.course))];
  const priorities=["All",...new Set([...openTasks,...completedTaskHistory].map(task=>task.priority))];
  const lessonsList=["All",...new Set(openTasks.map(task=>task.lessonId))].sort();
  const components=["All",...new Set(openTasks.map(task=>task.componentKey))].sort();
  const p0=openTasks.filter(task=>task.priority==="P0").length;
  const completeLessons=lessons.filter(lesson=>lesson.status==="Complete").length;
  return shell(`<div class="grid task-summary"><section class="card span-3"><div class="metric">${openTasks.length}</div><div class="muted">Open tasks</div></section><section class="card span-3"><div class="metric">${p0}</div><div class="muted">P0 gaps</div></section><section class="card span-3"><div class="metric">${completedTaskHistory.length}</div><div class="muted">Completed this session</div></section><section class="card span-3"><div class="metric">${completeLessons}/${lessons.length}</div><div class="muted">Complete lessons</div></section></div><div class="card task-toolbar"><div class="filters"><input placeholder="Search tasks" value="${state.taskSearch}" oninput="state.taskSearch=this.value;render()"/><select onchange="state.taskCourse=this.value;render()">${courses.map(value=>`<option ${state.taskCourse===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.taskPriority=this.value;render()">${priorities.map(value=>`<option ${state.taskPriority===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.taskStatus=this.value;render()">${["Open","Done","All"].map(value=>`<option ${state.taskStatus===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.taskLesson=this.value;render()">${lessonsList.map(value=>`<option ${state.taskLesson===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="state.taskComponent=this.value;render()">${components.map(value=>`<option ${state.taskComponent===value?"selected":""}>${value}</option>`).join("")}</select><button class="btn secondary" onclick="clearTaskFilters()">Clear</button></div><div class="row"><span class="muted">${visible.length} task(s) shown</span><button class="btn" onclick="bulkCompleteVisible()">Complete visible</button></div></div><div class="task-list">${visible.map(task=>`<article class="card task-card"><div class="row"><div><span class="pill">${task.course}</span> <span class="pill">${task.priority}</span><h3>${task.lessonId} — ${task.title}</h3><div class="muted">${task.lessonTitle}</div></div><span class="status ${task.status==="Done"?"complete":"needs"}">${task.status}</span></div><div class="task-details"><span>Component: <strong>${task.componentKey}</strong></span><span>Day: <strong>${task.lessonDay}</strong></span></div><div class="resource-actions"><button class="btn secondary" onclick="openLesson('${task.lessonId}')">Open lesson</button>${task.status==="Done"?`<button class="btn" onclick="reopenTask('${task.id}')">Reopen</button>`:`<button class="btn" onclick="completeTask('${task.id}')">Mark complete</button>`}</div></article>`).join("")||'<div class="card empty"><h3>No matching tasks</h3><p>Adjust the filters or switch between open and completed work.</p></div>'}</div>`);
};

render();