const resourceMetadata={
  "Marketing Functions Project Template":{health:96,status:"Ready",version:"2026",lastUsed:"Current MP1",companions:["Rubric","Canvas directions"],tags:["marketing functions","project","presentation"]},
  "SEM Industries":{health:82,status:"Needs Companion",version:"2026",lastUsed:"Current MP1",companions:["Worksheet missing","Exit ticket missing"],tags:["sports","entertainment","industry"]},
  "DECA Website Scavenger Hunt":{health:91,status:"Ready",version:"2026",lastUsed:"Course launch",companions:["Student directions","Answer key"],tags:["DECA","career","shared"]},
  "Fashion of Yesterday & Today":{health:94,status:"Ready",version:"2026",lastUsed:"Current MP1",companions:["Research organizer","Presentation rubric"],tags:["history","decades","culture"]},
  "Color in Fashion":{health:88,status:"Ready",version:"2026",lastUsed:"Current MP1",companions:["Color activity"],tags:["color theory","design"]},
  "Elements of Design in Fashion":{health:84,status:"Needs Companion",version:"2026",lastUsed:"Current MP1",companions:["Worksheet missing"],tags:["elements","design","fashion"]}
};
resources.forEach(resource=>Object.assign(resource,resourceMetadata[resource.title]||{health:70,status:"Needs Review",version:"Unknown",lastUsed:"Not recorded",companions:[],tags:[]}));
state.resourceCourse="All";
state.resourceType="All";
state.resourceLesson="All";

function resourceHealthClass(score){return score>=90?"health-high":score>=80?"health-medium":"health-low"}
function clearResourceFilters(){state.search="";state.resourceCourse="All";state.resourceType="All";state.resourceLesson="All";render()}
function openResourceLesson(id){openLesson(id)}
function reuseResource(title){toast(`${title} selected for reuse. Existing content will be used before generating anything new.`)}
function findOrGenerateResource(){const hasFilters=state.search||state.resourceCourse!=="All"||state.resourceType!=="All"||state.resourceLesson!=="All";toast(hasFilters?"No matching resource selected. Review filters, then generate only if no existing item fits.":"Search or filter existing resources before generating a new one.")}
resourceLibrary=function(){
  const q=state.search.toLowerCase();
  const courses=["All",...new Set(resources.map(r=>r.course))];
  const types=["All",...new Set(resources.map(r=>r.type))];
  const linkedLessons=["All",...new Set(resources.flatMap(r=>r.lessonIds))].sort();
  const list=resources.filter(r=>{
    const haystack=[r.title,r.course,r.type,...r.lessonIds,...r.tags,...r.companions,r.status,r.version].join(" ").toLowerCase();
    return (!q||haystack.includes(q))&&(state.resourceCourse==="All"||r.course===state.resourceCourse)&&(state.resourceType==="All"||r.type===state.resourceType)&&(state.resourceLesson==="All"||r.lessonIds.includes(state.resourceLesson));
  }).sort((a,b)=>b.health-a.health||a.title.localeCompare(b.title));
  const readyCount=list.filter(r=>r.status==="Ready").length;
  const avgHealth=list.length?Math.round(list.reduce((sum,r)=>sum+r.health,0)/list.length):0;
  return shell(`<div class="resource-summary grid"><section class="card span-4"><div class="metric">${list.length}</div><div class="muted">Matching resources</div></section><section class="card span-4"><div class="metric">${readyCount}</div><div class="muted">Ready to reuse</div></section><section class="card span-4"><div class="metric">${avgHealth}%</div><div class="muted">Average health</div></section></div><div class="card resource-toolbar"><div class="filters"><input aria-label="Search resources" placeholder="Search title, tag, lesson, or companion" value="${state.search}" oninput="state.search=this.value.toLowerCase();render()"/><select aria-label="Filter by course" onchange="state.resourceCourse=this.value;render()">${courses.map(value=>`<option ${state.resourceCourse===value?"selected":""}>${value}</option>`).join("")}</select><select aria-label="Filter by type" onchange="state.resourceType=this.value;render()">${types.map(value=>`<option ${state.resourceType===value?"selected":""}>${value}</option>`).join("")}</select><select aria-label="Filter by lesson" onchange="state.resourceLesson=this.value;render()">${linkedLessons.map(value=>`<option ${state.resourceLesson===value?"selected":""}>${value}</option>`).join("")}</select><button class="btn secondary" onclick="clearResourceFilters()">Clear</button></div><div class="muted">Existing resources appear first. Generate only when no suitable match exists.</div></div><div class="resource-grid">${list.map(r=>`<article class="card resource-library-card"><div class="row"><div><span class="pill">${r.course}</span> <span class="resource-type">${r.type}</span></div><span class="resource-health ${resourceHealthClass(r.health)}">${r.health}% health</span></div><h3>${r.title}</h3><div class="resource-meta"><span>Status: <strong>${r.status}</strong></span><span>Version: <strong>${r.version}</strong></span><span>Used: <strong>${r.lastUsed}</strong></span></div><div class="tag-list">${r.tags.map(tag=>`<span>${tag}</span>`).join("")}</div><h4>Linked lessons</h4><div class="lesson-links">${r.lessonIds.map(id=>`<button onclick="openResourceLesson('${id}')">${id}</button>`).join("")}</div><h4>Companion materials</h4><ul class="companion-list">${r.companions.map(item=>`<li class="${item.toLowerCase().includes("missing")?"companion-missing":""}">${item}</li>`).join("")||"<li>None recorded</li>"}</ul><div class="resource-actions"><button class="btn secondary" onclick="demoAction('Open ${r.title}')">Open</button><button class="btn" onclick="reuseResource('${r.title.replaceAll("'","\\'")}')">Reuse</button></div></article>`).join("")||`<div class="card empty resource-empty"><h3>No matching resources</h3><p>Clear a filter or confirm that a new resource is truly needed.</p><button class="btn" onclick="findOrGenerateResource()">Generate only if needed</button></div>`}</div>`)
};