const driveInventory=window.FONTaineDriveInventory;
state.driveCourse="All";
state.driveType="All";
state.driveStatus="All";
state.driveSearch="";
function normalizedWords(value){return value.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(word=>word.length>2)}
function matchDriveFile(file){
  const exact=file.lessonIds.map(id=>lessons.find(lesson=>lesson.id===id)).filter(Boolean);
  if(exact.length)return {lessons:exact,confidence:100,method:"Exact lesson ID"};
  const titleWords=new Set(normalizedWords(file.title));
  const candidates=lessons.filter(lesson=>lesson.course===file.course).map(lesson=>{
    const lessonWords=normalizedWords(`${lesson.title} ${lesson.unit}`);
    const overlap=lessonWords.filter(word=>titleWords.has(word)).length;
    return {lesson,score:Math.min(92,Math.round((overlap/Math.max(3,lessonWords.length))*180))};
  }).filter(item=>item.score>=35).sort((a,b)=>b.score-a.score);
  return {lessons:candidates.slice(0,3).map(item=>item.lesson),confidence:candidates[0]?.score||0,method:candidates.length?"Keyword match":"Unmatched"};
}
const driveFiles=driveInventory.files.map(file=>({...file,match:matchDriveFile(file)}));
function driveStatus(file){if(file.duplicateGroup)return "Duplicate Review";if(file.match.confidence>=80)return "Matched";if(file.match.confidence>=35)return "Suggested";return "Unmatched"}
function duplicateFamilies(){return Object.entries(driveFiles.reduce((groups,file)=>{if(file.duplicateGroup)(groups[file.duplicateGroup]??=[]).push(file);return groups},{}))}
function driveView(){
  const q=state.driveSearch.toLowerCase();
  const list=driveFiles.filter(file=>{
    const status=driveStatus(file),hay=[file.title,file.course,file.type,status,...file.lessonIds,...file.match.lessons.map(l=>l.id)].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(state.driveCourse==="All"||file.course===state.driveCourse)&&(state.driveType==="All"||file.type===state.driveType)&&(state.driveStatus==="All"||status===state.driveStatus);
  });
  const duplicates=duplicateFamilies();
  return shell(`<div class="grid"><section class="card span-3"><div class="metric">${driveFiles.length}</div><div class="muted">Verified Drive files</div></section><section class="card span-3"><div class="metric">${driveFiles.filter(f=>driveStatus(f)==="Matched").length}</div><div class="muted">High-confidence matches</div></section><section class="card span-3"><div class="metric">${driveFiles.filter(f=>driveStatus(f)==="Unmatched").length}</div><div class="muted">Need review</div></section><section class="card span-3"><div class="metric">${duplicates.length}</div><div class="muted">Duplicate families</div></section></div><div class="card"><div class="row"><div><h2>Google Drive Inventory</h2><div class="muted">Last verified scan: July 11, 2026. Static catalog until OAuth/backend sync is added.</div></div></div><div class="filters"><input placeholder="Search Drive files" value="${state.driveSearch}" oninput="state.driveSearch=this.value;render()"/><select onchange="state.driveCourse=this.value;render()">${["All","SEM","Fashion","Shared"].map(v=>`<option ${state.driveCourse===v?"selected":""}>${v}</option>`).join("")}</select><select onchange="state.driveType=this.value;render()">${["All","Document","Slides","Spreadsheet"].map(v=>`<option ${state.driveType===v?"selected":""}>${v}</option>`).join("")}</select><select onchange="state.driveStatus=this.value;render()">${["All","Matched","Suggested","Unmatched","Duplicate Review"].map(v=>`<option ${state.driveStatus===v?"selected":""}>${v}</option>`).join("")}</select></div></div><div class="resource-grid">${list.map(file=>`<article class="card resource-library-card"><div class="row"><div><span class="pill">${file.course}</span> <span class="resource-type">${file.type}</span></div><span class="status ${driveStatus(file)==="Matched"?"complete":driveStatus(file)==="Unmatched"?"needs":"ready"}">${driveStatus(file)}</span></div><h3>${file.title}</h3><div class="resource-meta"><span>Modified: <strong>${file.modified}</strong></span><span>Confidence: <strong>${file.match.confidence}%</strong></span><span>Method: <strong>${file.match.method}</strong></span></div><h4>Suggested lessons</h4><div class="lesson-links">${file.match.lessons.map(lesson=>`<button onclick="openLesson('${lesson.id}')">${lesson.id}</button>`).join("")||'<span class="muted">No confident match</span>'}</div><div class="resource-actions"><a class="btn secondary" href="${file.url}" target="_blank" rel="noopener">Open in Drive</a><button class="btn" onclick="toast('Drive match retained for ${file.title.replaceAll("'","\\'")}')">Keep match</button></div></article>`).join("")}</div>${duplicates.length?`<div class="card"><h2>Duplicate Review</h2>${duplicates.map(([name,files])=>`<div class="item"><strong>${name}</strong><div class="muted">${files.map(f=>f.title).join(" • ")}</div></div>`).join("")}</div>`:""}`)}
const originalPages=pages.includes("Google Drive")?pages:pages.splice(pages.indexOf("Resource Library")+1,0,"Google Drive");
const renderBeforeDrive=render;
render=function(){if(state.page==="Google Drive"){document.getElementById("app").outerHTML=`<div id="app">${driveView()}</div>`;return;}renderBeforeDrive();};
render();