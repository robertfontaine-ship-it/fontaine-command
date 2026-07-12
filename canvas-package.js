const CANVAS_PACKAGE_KEY="fontaine-command-canvas-packages";
state.canvasLessonId=state.canvasLessonId||state.selected?.id||lessons[0]?.id;
state.canvasSubmission="Online Text Entry or File Upload";
state.canvasAttempts="Unlimited";
state.canvasPoints=100;
state.canvasDue="Teacher sets in Canvas";
let canvasPackages={};
try{canvasPackages=JSON.parse(localStorage.getItem(CANVAS_PACKAGE_KEY)||"{}");if(!canvasPackages||Array.isArray(canvasPackages))canvasPackages={};}catch{canvasPackages={};}

function canvasLesson(){return lessons.find(item=>item.id===state.canvasLessonId)||lessons[0]}
function canvasStandards(lesson){return window.FONTaineStandards?.courseStandards?.filter(item=>item.lessonIds?.includes(lesson.id))||[]}
function canvasResources(lesson){return typeof driveFiles!=="undefined"?driveFiles.filter(file=>file.match.lessons.some(item=>item.id===lesson.id)).sort((a,b)=>b.match.confidence-a.match.confidence).slice(0,5):[]}
function canvasRubricFor(lesson,points){
  const rows=[
    {name:"Content Accuracy",description:`Uses accurate ${lesson.course} concepts and lesson vocabulary.`,weight:.4},
    {name:"Application and Reasoning",description:"Applies the lesson concepts to the assigned scenario and explains decisions.",weight:.3},
    {name:"Completion and Evidence",description:"Completes every required section and supports responses with relevant evidence.",weight:.2},
    {name:"Professional Presentation",description:"Work is organized, readable, and appropriate for a business classroom.",weight:.1}
  ];
  let used=0;
  return rows.map((row,index)=>{const value=index===rows.length-1?points-used:Math.round(points*row.weight);used+=value;return {...row,points:value}});
}
function buildCanvasPackage(lesson){
  const saved=canvasPackages[lesson.id]||{};
  const points=Number(saved.points??state.canvasPoints)||100;
  const standards=canvasStandards(lesson);
  const resources=canvasResources(lesson);
  const directions=(lesson.canvas&& !lesson.canvas.toLowerCase().includes("pending"))?lesson.canvas:`📘 Review the lesson materials for ${lesson.title}.\n✅ Complete each required task using course vocabulary and evidence.\n💬 Explain your decisions clearly.\n📤 Submit your finished work in Canvas.\n🎯 Earn at least 80% mastery.`;
  const checklist=["Review all directions and attached materials","Complete the assigned lesson activity","Use course vocabulary and evidence","Proofread your work","Submit the correct file or response in Canvas"];
  return {
    lessonId:lesson.id,
    title:saved.title||`${lesson.id}: ${lesson.title}`,
    directions:saved.directions||directions,
    target:saved.target||lesson.target,
    success:saved.success||lesson.success,
    checklist:saved.checklist||checklist,
    submission:saved.submission||state.canvasSubmission,
    attempts:saved.attempts||state.canvasAttempts,
    points,
    due:saved.due||state.canvasDue,
    standards:standards.map(item=>`${item.code} — ${item.title}`),
    resources:resources.map(file=>file.title),
    rubric:saved.rubric||canvasRubricFor(lesson,points),
    savedAt:saved.savedAt||null
  };
}
function canvasPackageText(pkg){
  const rubric=pkg.rubric.map(row=>`- ${row.name} (${row.points} pts): ${row.description}`).join("\n");
  const standards=pkg.standards.length?pkg.standards.map(item=>`- ${item}`).join("\n"):"- Course standard alignment stored in Fontaine Command";
  const resources=pkg.resources.length?pkg.resources.map(item=>`- ${item}`).join("\n"):"- No linked Drive resources yet";
  return `${pkg.title}\n\nLEARNING TARGET\n${pkg.target}\n\nSUCCESS CRITERIA\n${pkg.success}\n\nSTUDENT DIRECTIONS\n${pkg.directions}\n\nSUBMISSION CHECKLIST\n${pkg.checklist.map(item=>`- ${item}`).join("\n")}\n\nCANVAS SETTINGS\nSubmission: ${pkg.submission}\nAttempts: ${pkg.attempts}\nPoints: ${pkg.points}\nDue date: ${pkg.due}\n\nRUBRIC\n${rubric}\n\nSTANDARDS\n${standards}\n\nLINKED RESOURCES\n${resources}`;
}
function copyCanvasText(text,label){navigator.clipboard?.writeText(text);toast(`${label} copied.`)}
function copyCanvasSection(section){const pkg=buildCanvasPackage(canvasLesson());const value=section==="checklist"?pkg.checklist.map(item=>`• ${item}`).join("\n"):section==="rubric"?pkg.rubric.map(row=>`${row.name} (${row.points} pts): ${row.description}`).join("\n"):pkg[section];copyCanvasText(String(value),section.replace(/\b\w/g,char=>char.toUpperCase()))}
function copyFullCanvasPackage(){copyCanvasText(canvasPackageText(buildCanvasPackage(canvasLesson())),"Full Canvas package")}
function downloadCanvasPackage(){const pkg=buildCanvasPackage(canvasLesson());const blob=new Blob([canvasPackageText(pkg)],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`${pkg.lessonId}-canvas-package.txt`;link.click();URL.revokeObjectURL(url);toast("Canvas package downloaded.")}
function saveCanvasPackage(){const lesson=canvasLesson();const pkg=buildCanvasPackage(lesson);pkg.title=document.getElementById("canvasTitle")?.value||pkg.title;pkg.directions=document.getElementById("canvasDirections")?.value||pkg.directions;pkg.submission=state.canvasSubmission;pkg.attempts=state.canvasAttempts;pkg.points=Number(state.canvasPoints)||100;pkg.due=state.canvasDue;pkg.rubric=canvasRubricFor(lesson,pkg.points);pkg.savedAt=new Date().toISOString();canvasPackages[lesson.id]=pkg;localStorage.setItem(CANVAS_PACKAGE_KEY,JSON.stringify(canvasPackages));lesson.canvas=pkg.directions;const component=lesson.componentDetails?.find(item=>item.key==="canvas-directions");if(component)component.status="complete";calculateReadiness(lesson);refreshReadiness();if(typeof persistState==="function")persistState();toast(`Canvas package saved for ${lesson.id}.`);render()}
function resetCanvasPackage(){delete canvasPackages[canvasLesson().id];localStorage.setItem(CANVAS_PACKAGE_KEY,JSON.stringify(canvasPackages));toast("Saved Canvas package reset to lesson defaults.");render()}
function openCanvasPackage(id){state.canvasLessonId=id||state.selected?.id||lessons[0].id;state.page="Canvas Builder";render()}
function rubricHtml(pkg){return `<table class="rubric-table"><thead><tr><th>Criterion</th><th>Description</th><th>Points</th></tr></thead><tbody>${pkg.rubric.map(row=>`<tr><td><strong>${row.name}</strong></td><td>${row.description}</td><td class="rubric-points">${row.points}</td></tr>`).join("")}</tbody></table>`}
function canvasSection(title,body,section){return `<section class="canvas-section"><div class="canvas-copy-row"><h3>${title}</h3><button class="btn secondary" onclick="copyCanvasSection('${section}')">Copy</button></div>${body}</section>`}
function canvasBuilderView(){
  const lesson=canvasLesson();const pkg=buildCanvasPackage(lesson);const saved=Boolean(canvasPackages[lesson.id]);
  return shell(`<div class="canvas-package-layout"><aside class="card canvas-package-panel"><h2>Canvas Package</h2><p class="muted">Create one complete assignment package from the current lesson.</p><label>Lesson</label><select onchange="state.canvasLessonId=this.value;render()">${lessons.map(item=>`<option value="${item.id}" ${item.id===lesson.id?"selected":""}>${item.id} — ${item.title}</option>`).join("")}</select><label>Assignment title</label><input id="canvasTitle" value="${pkg.title.replaceAll('"','&quot;')}"/><label>Submission type</label><select onchange="state.canvasSubmission=this.value;render()">${["Online Text Entry or File Upload","File Upload","Text Entry","Website URL","No Submission / Classroom Activity"].map(value=>`<option ${pkg.submission===value?"selected":""}>${value}</option>`).join("")}</select><label>Attempts</label><select onchange="state.canvasAttempts=this.value;render()">${["Unlimited","3 attempts","2 attempts","1 attempt"].map(value=>`<option ${pkg.attempts===value?"selected":""}>${value}</option>`).join("")}</select><label>Points</label><input type="number" min="1" max="500" value="${pkg.points}" onchange="state.canvasPoints=this.value;render()"/><label>Due date note</label><input value="${pkg.due.replaceAll('"','&quot;')}" onchange="state.canvasDue=this.value"/><div class="canvas-package-actions"><button class="btn" onclick="saveCanvasPackage()">Save package</button><button class="btn secondary" onclick="copyFullCanvasPackage()">Copy all</button><button class="btn secondary" onclick="downloadCanvasPackage()">Download .txt</button>${saved?'<button class="btn secondary" onclick="resetCanvasPackage()">Reset</button>':""}</div>${saved?`<div class="item canvas-saved"><strong>Saved</strong><div class="muted">${new Date(pkg.savedAt).toLocaleString()}</div></div>`:""}</aside><main class="canvas-package-preview">${canvasSection("Learning Target",`<p>${pkg.target}</p>`,"target")}${canvasSection("Success Criteria",`<p>${pkg.success}</p>`,"success")}<section class="canvas-section"><div class="canvas-copy-row"><h3>Student Directions</h3><button class="btn secondary" onclick="copyCanvasSection('directions')">Copy</button></div><textarea id="canvasDirections" class="notes-box">${pkg.directions}</textarea></section>${canvasSection("Submission Checklist",`<ul>${pkg.checklist.map(item=>`<li>${item}</li>`).join("")}</ul>`,"checklist")}<section class="canvas-section"><h3>Canvas Settings</h3><div class="canvas-meta-grid"><div><span>Submission</span><strong>${pkg.submission}</strong></div><div><span>Attempts</span><strong>${pkg.attempts}</strong></div><div><span>Points</span><strong>${pkg.points}</strong></div><div><span>Due date</span><strong>${pkg.due}</strong></div></div></section>${canvasSection("Rubric",rubricHtml(pkg),"rubric")}<section class="canvas-section"><h3>Alignment and Resources</h3><div class="canvas-meta-grid"><div><span>Standards</span><strong>${pkg.standards.join("<br>")||"Course framework"}</strong></div><div><span>Drive resources</span><strong>${pkg.resources.join("<br>")||"No confident match"}</strong></div></div></section></main></div>`)}

if(!pages.includes("Canvas Builder"))pages.splice(pages.indexOf("Lesson Builder")+1,0,"Canvas Builder");
const renderBeforeCanvasBuilder=render;
render=function(){
  if(state.page==="Canvas Builder"){document.getElementById("app").outerHTML=`<div id="app">${canvasBuilderView()}</div>`;return;}
  renderBeforeCanvasBuilder();
  if(state.page==="Lesson Workspace"){
    const actions=document.querySelector(".workspace-actions>div");
    if(actions&&!document.querySelector(".canvas-workspace-link")){const button=document.createElement("button");button.className="btn secondary canvas-workspace-link";button.textContent="Canvas package";button.onclick=()=>openCanvasPackage(state.selected?.id);actions.appendChild(button);}
    if(state.lessonTab==="Canvas"){
      const body=document.querySelector(".lesson-body");
      if(body&&!body.querySelector(".canvas-package-actions")){const wrap=document.createElement("div");wrap.className="canvas-package-actions";wrap.innerHTML=`<button class="btn" onclick="openCanvasPackage('${state.selected?.id}')">Build full Canvas package</button>`;body.appendChild(wrap);}
    }
  }
};
const resetBeforeCanvasPackage=resetLocalData;
resetLocalData=function(){localStorage.removeItem(CANVAS_PACKAGE_KEY);resetBeforeCanvasPackage();};
render();