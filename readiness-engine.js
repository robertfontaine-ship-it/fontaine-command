const READINESS_COMPONENTS=[
  {key:"lesson-plan",label:"Lesson Plan",required:true,task:"Build lesson plan"},
  {key:"learning-target",label:"Learning Target",required:true,task:"Write learning target"},
  {key:"agenda",label:"Agenda",required:true,task:"Build agenda"},
  {key:"activity",label:"Activity",required:true,task:"Create student activity"},
  {key:"exit-ticket",label:"Exit Ticket",required:true,task:"Create exit ticket"},
  {key:"canvas-directions",label:"Canvas Directions",required:true,task:"Create Canvas directions"},
  {key:"slides",label:"Slides",required:false,task:"Create slides"},
  {key:"worksheet",label:"Worksheet",required:false,task:"Create worksheet"},
  {key:"answer-key",label:"Answer Key",required:false,task:"Create answer key"}
];

function componentKey(label){
  const clean=label.replace(/^(Missing|Draft)\s+/i,"").trim().toLowerCase();
  return READINESS_COMPONENTS.find(component=>component.label.toLowerCase()===clean)?.key||clean.replace(/\s+/g,"-");
}

function initialComponentDetails(lesson){
  const source=new Map((lesson.components||[]).map(label=>{
    const status=/^missing/i.test(label)?"missing":/draft/i.test(label)?"draft":"complete";
    return [componentKey(label),status];
  }));
  return READINESS_COMPONENTS.map(definition=>({
    ...definition,
    status:source.get(definition.key)||(definition.required?"missing":"not-required")
  }));
}

function calculateReadiness(lesson){
  const required=lesson.componentDetails.filter(component=>component.required);
  const complete=required.filter(component=>component.status==="complete").length;
  const missing=required.filter(component=>component.status==="missing");
  const drafts=required.filter(component=>component.status==="draft");
  const score=Math.round((complete/required.length)*100);
  let status="Planned";
  if(complete===required.length)status="Complete";
  else if(missing.length>0)status="Needs Materials";
  else if(drafts.length>0)status="Ready to Build";
  lesson.readinessScore=score;
  lesson.status=status;
  lesson.missingComponents=missing;
  lesson.draftComponents=drafts;
  lesson.buildTasks=[...missing,...drafts].map((component,index)=>({
    id:`${lesson.id}-${component.key}-${index+1}`,
    lessonId:lesson.id,
    componentKey:component.key,
    title:component.task,
    priority:component.required?"P0":"P1",
    status:"Open"
  }));
  return lesson;
}

function readinessSignature(lesson){
  return (lesson.components||[]).join("|");
}

function ensureLessonReadiness(lesson){
  if(!lesson)return null;
  const signature=readinessSignature(lesson);
  if(!Array.isArray(lesson.componentDetails)||lesson.readinessComponentSignature!==signature){
    lesson.componentDetails=initialComponentDetails(lesson);
    lesson.readinessComponentSignature=signature;
  }
  return calculateReadiness(lesson);
}

function refreshReadiness(){
  lessons.forEach(ensureLessonReadiness);
  window.FONTaineBuildTasks=lessons.flatMap(lesson=>lesson.buildTasks||[]);
}

function toggleLessonComponent(lessonId,key){
  const lesson=ensureLessonReadiness(lessons.find(item=>item.id===lessonId));
  const component=lesson?.componentDetails.find(item=>item.key===key);
  if(!component)return;
  component.status=component.status==="complete"?"missing":"complete";
  calculateReadiness(lesson);
  window.FONTaineBuildTasks=lessons.flatMap(item=>(item.buildTasks||[]));
  toast(`${component.label} marked ${component.status} for ${lessonId}.`);
  render();
}

componentChecklist=function(lesson){
  const readyLesson=ensureLessonReadiness(lesson);
  if(!readyLesson)return "";
  return readyLesson.componentDetails.filter(component=>component.required||component.status!=="not-required").map(component=>{
    const complete=component.status==="complete";
    const icon=complete?"✓":component.status==="draft"?"◐":"⚠";
    return `<div class="component ${complete?"done":"missing"}"><span>${icon}</span><span><strong>${component.label}</strong><small>${component.status.replace("-"," ")}</small></span><button class="component-toggle" onclick="toggleLessonComponent('${readyLesson.id}','${component.key}')">${complete?"Mark missing":"Mark complete"}</button></div>`;
  }).join("");
};

function curriculumReadinessSummary(){
  lessons.forEach(ensureLessonReadiness);
  window.FONTaineBuildTasks=lessons.flatMap(lesson=>lesson.buildTasks||[]);
  const totalComponents=lessons.flatMap(lesson=>lesson.componentDetails.filter(component=>component.required));
  const completeComponents=totalComponents.filter(component=>component.status==="complete").length;
  return {
    score:Math.round((completeComponents/totalComponents.length)*100),
    completeLessons:lessons.filter(lesson=>lesson.status==="Complete").length,
    needsMaterials:lessons.filter(lesson=>lesson.status==="Needs Materials").length,
    openTasks:window.FONTaineBuildTasks.length
  };
}

const originalDashboard=dashboard;
dashboard=function(){
  const today=lessons.filter(lesson=>lesson.day===CURRENT_DAY);
  const summary=curriculumReadinessSummary();
  const queue=window.FONTaineBuildTasks.slice(0,6);
  const upcoming=lessons.filter(lesson=>lesson.day>CURRENT_DAY&&lesson.day<=CURRENT_DAY+2).sort((a,b)=>a.day-b.day||a.course.localeCompare(b.course));
  return shell(`<div class="grid"><section class="card span-8"><div class="row"><h2>Today — Day ${CURRENT_DAY}</h2><span class="muted">Calculated from required lesson components</span></div><div class="grid">${today.map(lesson=>`<div class="card span-6 lesson-card"><div class="row"><span class="pill">${lesson.course}</span>${badge(lesson.status)}</div><div class="lesson-title">${lesson.id}</div><div>${lesson.title}</div><div class="muted">${lesson.unit}</div><div class="readiness-line"><strong>${lesson.readinessScore}% ready</strong><div class="progress"><i style="width:${lesson.readinessScore}%"></i></div></div><button class="btn secondary" onclick="openLesson('${lesson.id}')">Open lesson</button></div>`).join("")}</div></section><section class="card span-4"><h2>Curriculum Health</h2><div class="metric">${summary.score}%</div><div class="muted">Required components complete</div><div class="progress"><i style="width:${summary.score}%"></i></div><br/><div class="row"><span>Complete lessons</span><strong>${summary.completeLessons}/${lessons.length}</strong></div><div class="row"><span>Need materials</span><strong>${summary.needsMaterials}</strong></div><div class="row"><span>Open build tasks</span><strong>${summary.openTasks}</strong></div></section><section class="card span-6"><h2>Priority Build Queue</h2><div class="list">${queue.map(task=>`<div class="item row" onclick="openLesson('${task.lessonId}')"><div><strong>${task.lessonId}</strong><div>${task.title}</div></div><span class="pill">${task.priority}</span></div>`).join("")||'<div class="empty">No open readiness tasks.</div>'}</div></section><section class="card span-6"><h2>Upcoming</h2><div class="list">${upcoming.map(lesson=>`<div class="item row" onclick="openLesson('${lesson.id}')"><div><strong>Day ${lesson.day} • ${lesson.id}</strong><div class="muted">${lesson.title}</div></div><span>${lesson.readinessScore}%</span></div>`).join("")}</div></section></div>`);
};

buildQueue=function(){
  refreshReadiness();
  const tasks=window.FONTaineBuildTasks;
  return shell(`<div class="grid"><section class="card span-4"><div class="metric">${tasks.length}</div><div class="muted">Open component tasks</div></section><section class="card span-4"><div class="metric">${tasks.filter(task=>task.priority==="P0").length}</div><div class="muted">P0 required gaps</div></section><section class="card span-4"><div class="metric">${lessons.filter(lesson=>lesson.status==="Complete").length}</div><div class="muted">Complete lessons</div></section><section class="card span-12"><div class="list">${tasks.map(task=>`<div class="item row"><div><strong>${task.lessonId}</strong><div>${task.title}</div><div class="muted">Component: ${task.componentKey}</div></div><div><span class="pill">${task.priority}</span> <button class="btn" onclick="openLesson('${task.lessonId}')">Resolve</button></div></div>`).join("")||'<div class="empty">Every required lesson component is complete.</div>'}</div></section></div>`);
};

refreshReadiness();
render();
