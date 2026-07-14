const standardsData=window.FONTaineStandards;
state.standardFramework="Course";
state.standardCourse="All";
state.standardLevel="All";
state.standardSearch="";

function evidenceForLesson(lesson,assessmentIds=[]){
  if(!lesson)return "Introduced";
  if(assessmentIds.includes(lesson.id))return lesson.status==="Complete"?"Assessed":"Planned Assessment";
  if(lesson.status==="Complete")return lesson.day<=instructionalDay?"Practiced":"Introduced";
  return "Planned";
}

function coverageRecord(record){
  const linked=(record.lessonIds||[]).map(id=>lessons.find(lesson=>lesson.id===id)).filter(Boolean);
  const evidence=linked.map(lesson=>({lesson,level:evidenceForLesson(lesson,record.assessmentIds||[])}));
  const weights={"Planned":0,"Planned Assessment":20,"Introduced":35,"Practiced":70,"Assessed":90,"Mastered":100};
  const score=evidence.length?Math.round(evidence.reduce((sum,item)=>sum+(weights[item.level]||0),0)/evidence.length):0;
  const level=score>=85?"Strong":score>=55?"Developing":"Weak";
  return {...record,evidence,score,level};
}

function wrsRecord(record){
  const lessonIds=standardsData.wrsMappings[record.id]||[];
  const linked=lessonIds.map(id=>lessons.find(lesson=>lesson.id===id)).filter(Boolean);
  const evidence=linked.map(lesson=>({lesson,level:evidenceForLesson(lesson,[])}));
  const completed=evidence.filter(item=>["Practiced","Assessed"].includes(item.level)).length;
  const score=lessonIds.length?Math.min(100,Math.round((completed/Math.max(2,lessonIds.length))*100)):0;
  const level=score>=75?"Strong":score>=40?"Developing":"Weak";
  return {...record,course:"WRS",code:`WRS ${record.number}`,category:"Workplace Readiness",lessonIds,evidence,score,level};
}

function recommendation(record){
  if(record.level==="Strong")return "Maintain coverage and collect student-performance evidence.";
  if(record.evidence.length===0)return "Add a 5-minute bell ringer to the next aligned lesson.";
  const assessed=record.evidence.some(item=>item.level==="Assessed");
  if(!assessed)return `Add one exit-ticket or quiz item to ${record.evidence[record.evidence.length-1].lesson.id}.`;
  return `Add one guided-practice scenario before the assessment in ${record.evidence[0].lesson.id}.`;
}

function standardHeatClass(level){return level==="Strong"?"heat-strong":level==="Developing"?"heat-developing":"heat-weak"}
function setStandardsFilter(key,value){state[key]=value;render()}
function clearStandardsFilters(){state.standardFramework="Course";state.standardCourse="All";state.standardLevel="All";state.standardSearch="";render()}

function standardsView(){
  const courseRecords=standardsData.courseStandards.map(coverageRecord);
  const wrsRecords=standardsData.wrs.map(wrsRecord);
  let records=state.standardFramework==="WRS"?wrsRecords:courseRecords;
  const q=state.standardSearch.toLowerCase();
  records=records.filter(record=>(state.standardCourse==="All"||record.course===state.standardCourse)&&(state.standardLevel==="All"||record.level===state.standardLevel)&&(!q||[record.code,record.title,record.category,...record.lessonIds].join(" ").toLowerCase().includes(q)));
  const all=state.standardFramework==="WRS"?wrsRecords:courseRecords;
  const avg=all.length?Math.round(all.reduce((sum,record)=>sum+record.score,0)/all.length):0;
  const weak=all.filter(record=>record.level==="Weak").length;
  const strong=all.filter(record=>record.level==="Strong").length;
  const courses=state.standardFramework==="WRS"?["All"]:["All",...new Set(courseRecords.map(record=>record.course))];
  return shell(`<div class="grid standard-summary"><section class="card span-3"><div class="metric">${avg}%</div><div class="muted">Average coverage</div></section><section class="card span-3"><div class="metric">${strong}</div><div class="muted">Strong standards</div></section><section class="card span-3"><div class="metric">${weak}</div><div class="muted">Weak standards</div></section><section class="card span-3"><div class="metric">${all.length}</div><div class="muted">Tracked competencies</div></section></div><div class="card standards-toolbar"><div class="filters"><select onchange="setStandardsFilter('standardFramework',this.value)"><option ${state.standardFramework==="Course"?"selected":""}>Course</option><option ${state.standardFramework==="WRS"?"selected":""}>WRS</option></select><select onchange="setStandardsFilter('standardCourse',this.value)" ${state.standardFramework==="WRS"?"disabled":""}>${courses.map(value=>`<option ${state.standardCourse===value?"selected":""}>${value}</option>`).join("")}</select><select onchange="setStandardsFilter('standardLevel',this.value)">${["All","Strong","Developing","Weak"].map(value=>`<option ${state.standardLevel===value?"selected":""}>${value}</option>`).join("")}</select><input placeholder="Search standards or lessons" value="${state.standardSearch}" oninput="state.standardSearch=this.value;render()"/><button class="btn secondary" onclick="clearStandardsFilters()">Clear</button></div></div><div class="standards-grid">${records.map(record=>`<article class="card standard-card ${standardHeatClass(record.level)}"><div class="row"><div><span class="pill">${record.course}</span> <span class="muted">${record.category}</span></div><strong>${record.score}%</strong></div><h3>${record.code}</h3><p>${record.title}</p><div class="coverage-bar"><i style="width:${record.score}%"></i></div><div class="evidence-list">${record.evidence.map(item=>`<button onclick="openLesson('${item.lesson.id}')"><strong>${item.lesson.id}</strong><span>${item.level}</span></button>`).join("")||'<span class="muted">No mapped lesson evidence</span>'}</div><div class="standard-recommendation"><strong>Smallest useful addition</strong><p>${recommendation(record)}</p></div></article>`).join("")||'<div class="card empty">No standards match the current filters.</div>'}</div>`);
}

const renderBeforeStandards=render;
render=function(){
  if(state.page==="Standards"){
    document.getElementById("app").outerHTML=`<div id="app">${standardsView()}</div>`;
    return;
  }
  renderBeforeStandards();
};
render();