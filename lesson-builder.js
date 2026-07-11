const BUILDER_STORAGE_KEY="fontaine-command-builder-history";
const builderComponents=["learning-target","agenda","bell-ringer","mini-lesson","activity","exit-ticket","canvas-directions","materials","differentiation"];
state.builderLessonId=state.builderLessonId||state.selected?.id||lessons[0]?.id;
state.builderDuration=state.builderDuration||"45–60 minutes";
state.builderStyle=state.builderStyle||"Balanced";
state.builderPreview=null;
state.builderSelected=Object.fromEntries(builderComponents.map(key=>[key,true]));
let builderHistory=[];
try{builderHistory=JSON.parse(localStorage.getItem(BUILDER_STORAGE_KEY)||"[]");if(!Array.isArray(builderHistory))builderHistory=[];}catch{builderHistory=[];}

function enabledPreferences(){return Object.entries(typeof teacherPreferences==="object"?teacherPreferences:{}).filter(([,enabled])=>enabled).map(([name])=>name)}
function driveMatchesForLesson(lesson){return typeof driveFiles!=="undefined"?driveFiles.filter(file=>file.match.lessons.some(item=>item.id===lesson.id)).sort((a,b)=>b.match.confidence-a.match.confidence):[]}
function standardsForLesson(lesson){return window.FONTaineStandards?.courseStandards?.filter(item=>item.lessonIds?.includes(lesson.id))||[]}
function topicPhrase(lesson){return lesson.title.replace(/\b(and|the|a|an)\b/gi," ").replace(/\s+/g," ").trim().toLowerCase()}
function generatedActivity(lesson,style){
  const topic=topicPhrase(lesson);
  if(style==="Competitive")return `Teams complete a three-round ${topic} challenge. Round 1 identifies key concepts, Round 2 applies them to a realistic business scenario, and Round 3 requires teams to defend their strongest decision. Award points for accuracy, reasoning, and professional communication.`;
  if(style==="Collaborative")return `Student teams analyze a realistic ${topic} case, assign roles, create one shared recommendation, and complete a gallery walk. Each group must leave one evidence-based comment on another team's work.`;
  if(style==="Independent")return `Students complete an individual ${topic} scenario analysis, explain each decision in writing, and finish with a self-check aligned to the lesson success criteria.`;
  return `Students complete a short teacher-modeled example, work with a partner on a realistic ${topic} scenario, and independently submit a final application response.`;
}
function generateLessonPackage(lesson){
  const prefs=enabledPreferences();
  const standards=standardsForLesson(lesson);
  const drive=driveMatchesForLesson(lesson).slice(0,4);
  const topic=topicPhrase(lesson);
  const style=state.builderStyle;
  const duration=state.builderDuration;
  const sports=prefs.includes("Sports Examples")&&lesson.course==="SEM";
  const music=prefs.includes("Music Examples");
  const example=sports?"a professional sports team, athlete, or live event":music?"an artist, concert, or music brand":"a recognizable brand or local business";
  const target=`I will apply ${topic} concepts to a realistic ${lesson.course.toLowerCase()} scenario with at least 80% accuracy.`;
  const agenda=["Bell ringer and lesson connection",`Focused instruction on ${lesson.title}`,`${style} application activity`,"Share-out and check for understanding","Exit ticket"];
  return {
    lessonId:lesson.id,
    generatedAt:new Date().toISOString(),
    context:{duration,style,preferences:prefs,standards:standards.map(item=>item.code),resources:drive.map(file=>file.title)},
    sections:{
      "learning-target":target,
      "agenda":agenda,
      "bell-ringer":`Review ${example}. Identify one decision connected to ${topic} and explain why it matters.`,
      "mini-lesson":`Define the essential ${topic} vocabulary, model one example using ${example}, and use two quick checks for understanding. Keep direct instruction to approximately one-third of the ${duration} lesson.`,
      "activity":generatedActivity(lesson,style),
      "exit-ticket":`Apply one ${topic} concept to a new example. State the decision, explain the reasoning, and identify the expected result.`,
      "canvas-directions":`📘 Review the lesson materials for ${lesson.title}.\n✅ Complete the ${style.toLowerCase()} application activity.\n💬 Use evidence and course vocabulary in your response.\n📤 Submit all required work in Canvas.\n🎯 Earn at least 80% mastery.`,
      "materials":[...new Set(["Teacher lesson notes","Student activity directions","Exit ticket",...drive.map(file=>file.title)])],
      "differentiation":["Provide a vocabulary bank and completed example","Allow partner discussion before independent submission","Offer an extension scenario requiring comparison of two strategies"]
    }
  };
}
function createBuilderPreview(){const lesson=lessons.find(item=>item.id===state.builderLessonId);if(!lesson)return;state.builderPreview=generateLessonPackage(lesson);render();}
function toggleBuilderComponent(key,checked){state.builderSelected[key]=checked;render();}
function selectedBuilderKeys(){return builderComponents.filter(key=>state.builderSelected[key])}
function builderValue(packageData,key){return packageData.sections[key]}
function applyBuilderPreview(){
  const lesson=lessons.find(item=>item.id===state.builderPreview?.lessonId);if(!lesson)return;
  const keys=selectedBuilderKeys();
  const before={target:lesson.target,agenda:lesson.agenda,bellRinger:lesson.bellRinger,miniLesson:lesson.miniLesson,activity:lesson.activity,exitTicket:lesson.exitTicket,canvas:lesson.canvas,materials:lesson.materials,differentiation:lesson.differentiation,components:(lesson.componentDetails||[]).map(item=>({key:item.key,status:item.status}))};
  const s=state.builderPreview.sections;
  if(keys.includes("learning-target"))lesson.target=s["learning-target"];
  if(keys.includes("agenda"))lesson.agenda=s.agenda;
  if(keys.includes("bell-ringer"))lesson.bellRinger=s["bell-ringer"];
  if(keys.includes("mini-lesson"))lesson.miniLesson=s["mini-lesson"];
  if(keys.includes("activity"))lesson.activity=s.activity;
  if(keys.includes("exit-ticket"))lesson.exitTicket=s["exit-ticket"];
  if(keys.includes("canvas-directions"))lesson.canvas=s["canvas-directions"];
  if(keys.includes("materials"))lesson.materials=s.materials;
  if(keys.includes("differentiation"))lesson.differentiation=s.differentiation;
  const componentMap={"learning-target":"learning-target","agenda":"agenda","activity":"activity","exit-ticket":"exit-ticket","canvas-directions":"canvas-directions"};
  Object.entries(componentMap).forEach(([builderKey,componentKey])=>{if(keys.includes(builderKey)){const component=lesson.componentDetails?.find(item=>item.key===componentKey);if(component)component.status="complete";}});
  calculateReadiness(lesson);refreshReadiness();
  builderHistory.unshift({id:`${lesson.id}-${Date.now()}`,lessonId:lesson.id,createdAt:new Date().toISOString(),keys,before,after:state.builderPreview});
  builderHistory=builderHistory.slice(0,25);localStorage.setItem(BUILDER_STORAGE_KEY,JSON.stringify(builderHistory));
  if(typeof persistState==="function")persistState();
  state.selected=lesson;toast(`${keys.length} generated components applied to ${lesson.id}.`);render();
}
function undoBuilderRevision(id){
  const revision=builderHistory.find(item=>item.id===id);if(!revision)return;const lesson=lessons.find(item=>item.id===revision.lessonId);if(!lesson)return;Object.assign(lesson,{target:revision.before.target,agenda:revision.before.agenda,bellRinger:revision.before.bellRinger,miniLesson:revision.before.miniLesson,activity:revision.before.activity,exitTicket:revision.before.exitTicket,canvas:revision.before.canvas,materials:revision.before.materials,differentiation:revision.before.differentiation});
  (revision.before.components||[]).forEach(saved=>{const component=lesson.componentDetails?.find(item=>item.key===saved.key);if(component)component.status=saved.status;});calculateReadiness(lesson);refreshReadiness();builderHistory=builderHistory.filter(item=>item.id!==id);localStorage.setItem(BUILDER_STORAGE_KEY,JSON.stringify(builderHistory));if(typeof persistState==="function")persistState();toast(`Last generator revision undone for ${lesson.id}.`);render();
}
function previewSection(key,value){const label=key.replaceAll("-"," ").replace(/\b\w/g,char=>char.toUpperCase());const body=Array.isArray(value)?`<ul>${value.map(item=>`<li>${item}</li>`).join("")}</ul>`:`<p>${value}</p>`;return `<section class="generated-section"><div class="row"><h3>${label}</h3><label><input type="checkbox" ${state.builderSelected[key]?"checked":""} onchange="toggleBuilderComponent('${key}',this.checked)"/> Apply</label></div>${body}</section>`}
function lessonBuilderView(){
  const lesson=lessons.find(item=>item.id===state.builderLessonId)||lessons[0];const standards=standardsForLesson(lesson);const drive=driveMatchesForLesson(lesson).slice(0,5);const preview=state.builderPreview?.lessonId===lesson.id?state.builderPreview:null;
  return shell(`<div class="builder-layout"><aside class="card builder-panel"><h2>Lesson Builder</h2><p class="muted">Generate a classroom-ready package from existing curriculum context.</p><label>Lesson</label><select onchange="state.builderLessonId=this.value;state.builderPreview=null;render()">${lessons.map(item=>`<option value="${item.id}" ${item.id===lesson.id?"selected":""}>${item.id} — ${item.title}</option>`).join("")}</select><label>Lesson length</label><select onchange="state.builderDuration=this.value">${["30 minutes","45–60 minutes","90 minutes"].map(value=>`<option ${state.builderDuration===value?"selected":""}>${value}</option>`).join("")}</select><label>Activity style</label><select onchange="state.builderStyle=this.value">${["Balanced","Competitive","Collaborative","Independent"].map(value=>`<option ${state.builderStyle===value?"selected":""}>${value}</option>`).join("")}</select><div class="builder-context"><div><strong>Readiness</strong><div>${lesson.readinessScore}% • ${lesson.status}</div></div><div><strong>Standards</strong><div>${standards.map(item=>item.code).join(", ")||"Course framework"}</div></div><div><strong>Drive resources</strong><div>${drive.map(file=>`<span class="drive-chip">${file.title}</span>`).join("")||'<span class="muted">No confident Drive match</span>'}</div></div></div><div class="builder-actions"><button class="btn" onclick="createBuilderPreview()">Generate preview</button><button class="btn secondary" onclick="openLesson('${lesson.id}')">Open lesson</button></div></aside><main>${preview?`<div class="card"><div class="row"><div><h2>${lesson.id} — Generated Package</h2><div class="muted">${preview.context.style} • ${preview.context.duration} • ${preview.context.preferences.length} saved preferences used</div></div><button class="btn" onclick="applyBuilderPreview()">Apply selected</button></div></div><div class="builder-preview">${builderComponents.map(key=>previewSection(key,builderValue(preview,key))).join("")}</div>`:`<div class="card builder-empty"><h2>Ready to build ${lesson.id}</h2><p>Fontaine will reuse the lesson sequence, standards, Drive matches, and teacher preferences before creating new content.</p><button class="btn" onclick="createBuilderPreview()">Generate lesson package</button></div>`}<div class="card"><h2>Recent Generator Revisions</h2><div class="builder-history list">${builderHistory.slice(0,8).map(item=>`<div class="item row"><div><strong>${item.lessonId}</strong><div class="muted">${new Date(item.createdAt).toLocaleString()} • ${item.keys.length} components</div></div><button class="btn secondary" onclick="undoBuilderRevision('${item.id}')">Undo</button></div>`).join("")||'<div class="muted">No generated revisions yet.</div>'}</div></div></main></div>`);
}
if(!pages.includes("Lesson Builder"))pages.splice(pages.indexOf("Build Queue")+1,0,"Lesson Builder");
const renderBeforeBuilder=render;render=function(){if(state.page==="Lesson Builder"){document.getElementById("app").outerHTML=`<div id="app">${lessonBuilderView()}</div>`;return;}renderBeforeBuilder();};
const demoBeforeBuilder=demoAction;demoAction=function(text){const match=text.match(/(?:Generate missing components|Create substitute version) for ([A-Z]+-\d+)/i);if(match){state.builderLessonId=match[1].toUpperCase();state.builderPreview=null;state.page="Lesson Builder";render();return;}demoBeforeBuilder(text);};
render();