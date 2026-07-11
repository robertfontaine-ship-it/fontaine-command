const STORAGE_KEY="fontaine-command-state";
const STORAGE_VERSION=1;

const teacherPreferenceDefaults=[
  "Discussion","Collaboration","Competition","Simulations","Business Cases",
  "Sports Examples","Music Examples","Minimal Lecture","Black-and-White Worksheets",
  "Canvas directions with emojis"
];

let teacherPreferences=Object.fromEntries(teacherPreferenceDefaults.map(name=>[name,true]));

function serializePersistentState(){
  return {
    version:STORAGE_VERSION,
    savedAt:new Date().toISOString(),
    lessons:Object.fromEntries(lessons.map(lesson=>[lesson.id,{
      notes:lesson.notes,
      componentStatuses:Object.fromEntries((lesson.componentDetails||[]).map(component=>[component.key,component.status]))
    }])),
    completedTasks:[...completedTaskHistory],
    preferences:{...teacherPreferences},
    ui:{
      selectedLessonId:state.selected?.id||null,
      course:state.course,
      status:state.status,
      resourceCourse:state.resourceCourse,
      resourceType:state.resourceType,
      resourceLesson:state.resourceLesson,
      taskCourse:state.taskCourse,
      taskPriority:state.taskPriority,
      taskStatus:state.taskStatus,
      taskLesson:state.taskLesson,
      taskComponent:state.taskComponent
    }
  };
}

function persistState(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(serializePersistentState()));}
  catch(error){console.warn("Fontaine Command could not save local state.",error);}
}

function restorePersistentState(){
  let stored;
  try{stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");}
  catch(error){console.warn("Ignoring invalid Fontaine Command local state.",error);return;}
  if(!stored||stored.version!==STORAGE_VERSION)return;
  Object.entries(stored.lessons||{}).forEach(([lessonId,savedLesson])=>{
    const lesson=lessons.find(item=>item.id===lessonId);
    if(!lesson)return;
    if(typeof savedLesson.notes==="string")lesson.notes=savedLesson.notes;
    Object.entries(savedLesson.componentStatuses||{}).forEach(([key,status])=>{
      const component=lesson.componentDetails?.find(item=>item.key===key);
      if(component&&["complete","draft","missing","not-required"].includes(status))component.status=status;
    });
    calculateReadiness(lesson);
  });
  completedTaskHistory.splice(0,completedTaskHistory.length,...(Array.isArray(stored.completedTasks)?stored.completedTasks:[]));
  teacherPreferences={...teacherPreferences,...(stored.preferences||{})};
  const ui=stored.ui||{};
  ["course","status","resourceCourse","resourceType","resourceLesson","taskCourse","taskPriority","taskStatus","taskLesson","taskComponent"].forEach(key=>{
    if(typeof ui[key]==="string")state[key]=ui[key];
  });
  if(ui.selectedLessonId){
    const selected=lessons.find(item=>item.id===ui.selectedLessonId);
    if(selected)state.selected=selected;
  }
  refreshReadiness();
}

function resetLocalData(){
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function setTeacherPreference(name,checked){
  teacherPreferences[name]=checked;
  persistState();
  toast(`${name} preference ${checked?"enabled":"disabled"}.`);
}

const originalToggleLessonComponent=toggleLessonComponent;
toggleLessonComponent=function(lessonId,key){originalToggleLessonComponent(lessonId,key);persistState();};

const originalCompleteTask=completeTask;
completeTask=function(taskId){originalCompleteTask(taskId);persistState();};

const originalReopenTask=reopenTask;
reopenTask=function(taskId){originalReopenTask(taskId);persistState();};

const originalBulkCompleteVisible=bulkCompleteVisible;
bulkCompleteVisible=function(){originalBulkCompleteVisible();persistState();};

const originalSaveNotes=saveNotes;
saveNotes=function(id){originalSaveNotes(id);persistState();};

const originalGo=go;
go=function(page){originalGo(page);persistState();};

const originalOpenLesson=openLesson;
openLesson=function(id){originalOpenLesson(id);persistState();};

settings=function(){
  return shell(`<div class="grid"><section class="card span-8"><h2>Teacher Preferences</h2><p class="muted">These choices guide future lesson and resource generation.</p><div class="preference-grid">${teacherPreferenceDefaults.map(name=>`<label class="item preference-item"><input type="checkbox" ${teacherPreferences[name]?"checked":""} onchange="setTeacherPreference('${name.replaceAll("'","\\'")}',this.checked)"/> <span>${name}</span></label>`).join("")}</div></section><section class="card span-4"><h2>Local Data</h2><p class="muted">Notes, lesson readiness, task history, filters, and preferences are saved in this browser.</p><div class="list"><div class="item"><strong>Storage version</strong><div class="muted">Version ${STORAGE_VERSION}</div></div><button class="btn secondary" onclick="persistState();toast('Local data saved.')">Save now</button><button class="btn danger" onclick="resetLocalData()">Reset to seeded defaults</button></div></section></div>`);
};

restorePersistentState();
persistState();
render();
window.addEventListener("beforeunload",persistState);
