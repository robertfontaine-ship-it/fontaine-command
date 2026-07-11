const INSTRUCTIONAL_DAY_KEY="fontaine-command-instructional-day";
let instructionalDay=Number(localStorage.getItem(INSTRUCTIONAL_DAY_KEY))||8;
if(!Number.isInteger(instructionalDay)||instructionalDay<1||instructionalDay>20)instructionalDay=8;

function setInstructionalDay(day){
  const next=Math.max(1,Math.min(20,Number(day)||1));
  instructionalDay=next;
  localStorage.setItem(INSTRUCTIONAL_DAY_KEY,String(next));
  toast(`Instructional day set to Day ${next}.`);
  render();
}

function shiftInstructionalDay(amount){setInstructionalDay(instructionalDay+amount)}

function lessonsForDay(day){return lessons.filter(lesson=>lesson.day===day).sort((a,b)=>a.course.localeCompare(b.course))}

function dayCard(day){
  const dayLessons=lessonsForDay(day);
  return `<article class="card calendar-day ${day===instructionalDay?"current":""}"><div class="calendar-day-header"><h3>Day ${day}</h3>${day===instructionalDay?'<span class="pill">Current</span>':`<button class="btn secondary" onclick="setInstructionalDay(${day})">Set current</button>`}</div>${dayLessons.map(lesson=>`<div class="calendar-course-card"><div class="row"><span class="pill">${lesson.course}</span>${badge(lesson.status)}</div><strong>${lesson.id}</strong><div>${lesson.title}</div><div class="muted">${lesson.unit}</div><div class="calendar-readiness"><span>${lesson.readinessScore}%</span><div class="progress"><i style="width:${lesson.readinessScore}%"></i></div></div><button class="btn secondary" onclick="openLesson('${lesson.id}')">Open lesson</button></div>`).join("")}</article>`;
}

function calendarView(){
  const start=Math.max(1,Math.min(16,instructionalDay-2));
  const visibleDays=Array.from({length:5},(_,index)=>start+index).filter(day=>day<=20);
  const currentLessons=lessonsForDay(instructionalDay);
  return shell(`<div class="card calendar-detail"><div class="calendar-toolbar"><div><h2>MP1 Curriculum Calendar</h2><div class="muted">SEM 8175 and Fashion 8140 mapped across Days 1–20</div></div><div class="day-controls"><button class="btn secondary" onclick="shiftInstructionalDay(-1)" ${instructionalDay===1?"disabled":""}>Previous day</button><select onchange="setInstructionalDay(this.value)">${Array.from({length:20},(_,index)=>index+1).map(day=>`<option value="${day}" ${day===instructionalDay?"selected":""}>Day ${day}</option>`).join("")}</select><button class="btn secondary" onclick="shiftInstructionalDay(1)" ${instructionalDay===20?"disabled":""}>Next day</button></div></div><div class="grid">${currentLessons.map(lesson=>`<section class="card span-6 lesson-card"><div class="row"><span class="pill">${lesson.course}</span>${badge(lesson.status)}</div><div class="lesson-title">${lesson.id}</div><div>${lesson.title}</div><div class="muted">${lesson.unit}</div><div class="calendar-readiness"><strong>${lesson.readinessScore}% ready</strong><div class="progress"><i style="width:${lesson.readinessScore}%"></i></div></div><button class="btn" onclick="openLesson('${lesson.id}')">Open current lesson</button></section>`).join("")}</div></div><div class="calendar-jump">${Array.from({length:20},(_,index)=>index+1).map(day=>`<button class="${day===instructionalDay?"current":""}" onclick="setInstructionalDay(${day})">${day}</button>`).join("")}</div><div class="calendar-grid">${visibleDays.map(dayCard).join("")}</div>`);
}

const renderBeforeCalendar=render;
render=function(){
  if(state.page==="Calendar"){
    document.getElementById("app").outerHTML=`<div id="app">${calendarView()}</div>`;
    return;
  }
  renderBeforeCalendar();
};

dashboard=function(){
  const today=lessonsForDay(instructionalDay);
  const summary=curriculumReadinessSummary();
  const queue=window.FONTaineBuildTasks.slice(0,6);
  const upcoming=lessons.filter(lesson=>lesson.day>instructionalDay&&lesson.day<=instructionalDay+2).sort((a,b)=>a.day-b.day||a.course.localeCompare(b.course));
  return shell(`<div class="grid"><section class="card span-8"><div class="row"><div><h2>Instructional Day ${instructionalDay}</h2><span class="muted">Change this from Calendar or use the controls below.</span></div><div><button class="btn secondary" onclick="shiftInstructionalDay(-1)" ${instructionalDay===1?"disabled":""}>←</button> <button class="btn secondary" onclick="go('Calendar')">Calendar</button> <button class="btn secondary" onclick="shiftInstructionalDay(1)" ${instructionalDay===20?"disabled":""}>→</button></div></div><div class="grid">${today.map(lesson=>`<div class="card span-6 lesson-card"><div class="row"><span class="pill">${lesson.course}</span>${badge(lesson.status)}</div><div class="lesson-title">${lesson.id}</div><div>${lesson.title}</div><div class="muted">${lesson.unit}</div><div class="readiness-line"><strong>${lesson.readinessScore}% ready</strong><div class="progress"><i style="width:${lesson.readinessScore}%"></i></div></div><button class="btn secondary" onclick="openLesson('${lesson.id}')">Open lesson</button></div>`).join("")}</div></section><section class="card span-4"><h2>Curriculum Health</h2><div class="metric">${summary.score}%</div><div class="muted">Required components complete</div><div class="progress"><i style="width:${summary.score}%"></i></div><br/><div class="row"><span>Complete lessons</span><strong>${summary.completeLessons}/${lessons.length}</strong></div><div class="row"><span>Need materials</span><strong>${summary.needsMaterials}</strong></div><div class="row"><span>Open build tasks</span><strong>${summary.openTasks}</strong></div></section><section class="card span-6"><h2>Priority Build Queue</h2><div class="list">${queue.map(task=>`<div class="item row" onclick="openLesson('${task.lessonId}')"><div><strong>${task.lessonId}</strong><div>${task.title}</div></div><span class="pill">${task.priority}</span></div>`).join("")||'<div class="empty">No open readiness tasks.</div>'}</div></section><section class="card span-6"><h2>Upcoming</h2><div class="list">${upcoming.map(lesson=>`<div class="item row" onclick="openLesson('${lesson.id}')"><div><strong>Day ${lesson.day} • ${lesson.id}</strong><div class="muted">${lesson.title}</div></div><span>${lesson.readinessScore}%</span></div>`).join("")||'<div class="empty">No later MP1 lessons.</div>'}</div></section></div>`);
};

const askBeforeCalendar=ask;
ask=function(event){
  event.preventDefault();
  const input=document.getElementById("askInput");
  const query=input?.value.trim()||"";
  if(!query)return;
  if(query.toLowerCase().includes("tomorrow")){
    const next=lessonsForDay(Math.min(20,instructionalDay+1));
    toast(`Next mapped lessons: ${next.map(lesson=>lesson.id).join(" and ")}. ${next.filter(lesson=>lesson.status!=="Complete").length} need development.`);
    return;
  }
  askBeforeCalendar(event);
};

render();