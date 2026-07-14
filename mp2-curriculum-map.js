(()=>{
 const source=window.FONTaineMP2Sources;
 if(!source)throw new Error("MP2 source registry must load before the curriculum map.");
 const specs={
  SEM:[
   ["SEM-021","Promotional Mix Foundations","sem-mp2-u01","explain how the promotional mix builds awareness and influences customers"],
   ["SEM-022","Advertising Forms and Media Choices","sem-mp2-u01","compare advertising formats and select media that fit an SEM audience and objective"],
   ["SEM-023","Social Media Promotion in SEM","sem-mp2-u01","analyze how sports and entertainment brands use social platforms to engage audiences"],
   ["SEM-024","Public Relations, Publicity, and Crisis Response","sem-mp2-u01","distinguish public relations from publicity and recommend an appropriate response to a reputation problem"],
   ["SEM-025","Sales Promotion and Fan Activation","sem-mp2-u01","design a sales promotion or fan activation that supports a measurable marketing objective"],
   ["SEM-026","Promo Mix Scenario Sorting","sem-mp2-u01","classify SEM promotional scenarios and justify each promotional-tool decision"],
   ["SEM-027","Integrated Promotional Campaign Planning","sem-mp2-u01","combine promotional tools into a coordinated campaign for a sports, entertainment, or event property"],
   ["SEM-028","Promotional Campaign Pitch and Checkpoint","sem-mp2-u01","present and defend an integrated SEM promotional campaign using audience, message, media, and measurement evidence"],
   ["SEM-029","Selling in SEM: Revenue and Relationships","sem-mp2-u02","explain how selling supports revenue, customer experience, and long-term relationships in SEM"],
   ["SEM-030","Steps of Personal Selling","sem-mp2-u02","sequence and apply the major steps of personal selling in an SEM scenario"],
   ["SEM-031","Customer Approach and Needs Discovery","sem-mp2-u02","use questioning and active listening to identify a customer’s needs"],
   ["SEM-032","Features, Benefits, and Product Presentation","sem-mp2-u02","translate ticket, sponsorship, merchandise, or event features into customer benefits"],
   ["SEM-033","Handling Objections in SEM","sem-mp2-u02","respond professionally to realistic customer objections using evidence and alternatives"],
   ["SEM-034","Closing the Sale and Follow-Up","sem-mp2-u02","select an appropriate closing method and plan a follow-up that supports retention"],
   ["SEM-035","Ticket, Sponsorship, and Merchandise Role-Play","sem-mp2-u02","complete an SEM sales role-play using the full sales process and professional communication"],
   ["SEM-036","Professional Communication and Active Listening","sem-mp2-u03","demonstrate clear speaking, listening, and written communication in workplace situations"],
   ["SEM-037","Time and Resource Management","sem-mp2-u03","prioritize tasks and allocate time and resources for an SEM workday or event"],
   ["SEM-038","Customer Service in the Event Experience","sem-mp2-u03","evaluate customer-service touchpoints and recommend improvements to an event experience"],
   ["SEM-039","DECA Role-Play and Semester Case Review","sem-mp2-u03","analyze an SEM case and communicate a justified recommendation in role-play format"],
   ["SEM-040","MP2 Review and Performance Check","sem-mp2-u03","apply MP2 promotion, selling, communication, time-management, and customer-service concepts to new scenarios"]
  ],
  Fashion:[
   ["FASH-021","Marketing and Customer Value in Fashion","fash-mp2-u01","explain how fashion marketers create and communicate customer value"],
   ["FASH-022","Fashion Marketing Mix Brand Breakdown","fash-mp2-u01","analyze how a fashion brand coordinates product, price, place, and promotion"],
   ["FASH-023","Promotional Mix Elements in Fashion","fash-mp2-u01","explain how fashion brands use the major promotional-mix elements"],
   ["FASH-024","Fashion Promo Mix Scenario Sorting","fash-mp2-u01","classify fashion promotional scenarios and justify each decision"],
   ["FASH-025","Promotional Tool Selection for Fashion Brands","fash-mp2-u01","select promotional tools that fit a fashion brand, target customer, objective, and budget"],
   ["FASH-026","Selling Process and Buying Motives","fash-mp2-u02","connect customer buying motives to the steps of the fashion selling process"],
   ["FASH-027","Approaching and Discovering Customer Needs","fash-mp2-u02","use professional approaches, questions, and listening to identify fashion customer needs"],
   ["FASH-028","Presenting Fashion Features and Benefits","fash-mp2-u02","present garment and accessory features as benefits for a specific customer"],
   ["FASH-029","Handling Objections and Offering Alternatives","fash-mp2-u02","respond to fashion customer objections and offer appropriate alternatives"],
   ["FASH-030","Closing the Fashion Sale","fash-mp2-u02","identify buying signals and use an appropriate method to close a fashion sale"],
   ["FASH-031","Holiday Pop-Up Boutique Concept","fash-mp2-u02","develop a holiday pop-up boutique concept for a defined target market"],
   ["FASH-032","Pop-Up Product Mix and Target Customer","fash-mp2-u02","build a coordinated product mix that fits a pop-up boutique customer profile"],
   ["FASH-033","Fashion Sales Pitch and Role-Play","fash-mp2-u02","deliver a customer-focused fashion sales presentation using the complete selling process"],
   ["FASH-034","Clienteling and Fashion Service Standards","fash-mp2-u03","explain clienteling and establish service standards for a fashion retailer"],
   ["FASH-035","Customer Types and Communication","fash-mp2-u03","adapt communication to different fashion customer types and needs"],
   ["FASH-036","Service Recovery in Fashion Retail","fash-mp2-u03","apply service-recovery steps to resolve a fashion retail problem"],
   ["FASH-037","Brand Loyalty and Customer Retention","fash-mp2-u03","recommend retention strategies that strengthen loyalty to a fashion brand"],
   ["FASH-038","Winter Window Display Planning","fash-mp2-u03","plan a visual display that uses theme, focal point, balance, color, and target-customer appeal"],
   ["FASH-039","Visual Merchandising, Store Layout, and Planograms","fash-mp2-u03","evaluate how store layout and product placement influence shopping behavior"],
   ["FASH-040","Semester Review and Performance Check","fash-mp2-u03","apply MP2 promotion, selling, customer-service, and visual-merchandising concepts to new fashion scenarios"]
  ],
  Entrepreneurship:[
   ["ENT-021","Marketing Principles and Customer Awareness","ent-mp2-u01","explain how entrepreneurs use marketing principles to build customer awareness and value"],
   ["ENT-022","The Five-Tool Promotional Mix","ent-mp2-u01","identify and compare the five promotional tools available to a new venture"],
   ["ENT-023","Advertising and Digital Promotion for Startups","ent-mp2-u01","select affordable advertising and digital channels for a startup target customer"],
   ["ENT-024","Sales Promotion, Public Relations, and Direct Marketing","ent-mp2-u01","compare sales promotion, public relations, and direct marketing for a new venture"],
   ["ENT-025","Startup Promotion Scenario Sorting","ent-mp2-u01","classify startup promotional scenarios and justify each tool selection"],
   ["ENT-026","Startup Launch Campaign Planning","ent-mp2-u01","develop a coordinated launch campaign with objectives, audience, message, channels, budget, and measurement"],
   ["ENT-027","Business Reboot Challenge: Company Diagnosis","ent-mp2-u01","diagnose why a struggling business failed and develop a repositioning strategy"],
   ["ENT-028","Business Reboot Pitch and Presentation","ent-mp2-u01","present and defend a redesigned business concept and promotional comeback plan"],
   ["ENT-029","Business Ownership Structures Review","ent-mp2-u02","compare the major forms of business ownership and their tradeoffs"],
   ["ENT-030","Sole Proprietorships and Partnerships","ent-mp2-u02","evaluate when a sole proprietorship or partnership fits a venture"],
   ["ENT-031","Corporations and Limited-Liability Companies","ent-mp2-u02","compare corporations and LLCs using liability, control, continuity, and funding"],
   ["ENT-032","Liability, Control, Taxes, and Funding","ent-mp2-u02","analyze how ownership choices affect liability, control, taxes, and access to funding"],
   ["ENT-033","Ownership Scenario Analysis","ent-mp2-u02","match venture scenarios to appropriate ownership structures using evidence"],
   ["ENT-034","Ownership Recommendation Case Study","ent-mp2-u02","write and defend an ownership recommendation using claim, evidence, and reasoning"],
   ["ENT-035","Starting-Business Risk and Legal Checklist","ent-mp2-u02","identify ownership, registration, tax, insurance, and risk decisions required to start a business"],
   ["ENT-036","Financial Statements Overview","ent-mp2-u03","explain how entrepreneurs use financial statements to monitor business performance"],
   ["ENT-037","Income Statement: Revenue, Expenses, and Profit","ent-mp2-u03","organize revenue and expenses to determine profit or loss"],
   ["ENT-038","Balance Sheet: Assets, Liabilities, and Equity","ent-mp2-u03","classify financial items and complete a basic balance sheet"],
   ["ENT-039","Financial Statement Analysis and Business Decisions","ent-mp2-u03","analyze financial-statement evidence and recommend a business decision"],
   ["ENT-040","Semester Review and Performance Check","ent-mp2-u03","apply MP2 marketing, ownership, and financial-statement concepts to new entrepreneurial scenarios"]
  ]
 };
 const courseCodes={SEM:"8175",Fashion:"8140",Entrepreneurship:"9093"};
 const certifications={SEM:"WRS",Fashion:"WRS",Entrepreneurship:"NRF Customer Service & Sales"};
 lessons.forEach(lesson=>{if(!lesson.markingPeriod)lesson.markingPeriod="MP1";});
 Object.entries(source.units).forEach(([id,unit])=>{data.units[id]=unit.title;});
 function lessonSources(id){return Object.entries(source.resources).filter(([,resource])=>resource.lessonIds.includes(id)).map(([resourceId])=>resourceId);}
 Object.entries(specs).forEach(([course,rows])=>{
  const key=course==="SEM"?"semMp2":course==="Fashion"?"fashionMp2":"entrepreneurshipMp2";
  data.lessonTitles[key]=rows.map(row=>row[1]);
  rows.forEach(([id,title,unitId,objective],index)=>{
   if(lessons.some(lesson=>lesson.id===id))return;
   const unit=source.units[unitId];
   lessons.push({
    id,course,courseCode:courseCodes[course],markingPeriod:"MP2",sequence:index+1,day:index+21,title,unitId,unit:unit.title,status:"Planned",mapStatus:"Mapped",standards:unit.standards,certification:certifications[course],duration:"45–60 minutes",
    components:["Mapped lesson sequence","Mapped pacing-guide unit","Mapped standards","Verified source links","Missing full lesson plan","Missing student activity","Missing assessment evidence","Missing Canvas directions"],
    overview:`Source-backed MP2 curriculum map for ${title}. This lesson is sequenced inside ${unit.title}; the complete classroom package has not yet been built.`,
    target:`I will ${objective}.`,
    success:"I will know I am successful when I complete the mapped application and demonstrate the required concept with at least 80% accuracy.",
    agenda:[],bellRinger:"Bell ringer pending full MP2 lesson build.",miniLesson:"Mini lesson pending full MP2 lesson build.",activity:"Student application pending full MP2 lesson build.",exitTicket:"Exit ticket pending full MP2 lesson build.",
    materials:["Verified source resources","Pacing-guide standards","Missing lesson-specific student materials"],
    differentiation:["Differentiation plan pending full MP2 lesson build"],canvas:"Canvas directions pending full MP2 lesson build.",
    sourceIds:lessonSources(id),notes:`MP2 source-backed curriculum map. Verification: ${source.lessons[id]?.verification||"pacing-guide map"}.`,version:"Version 0 — MP2 curriculum map"
   });
  });
 });
 Object.entries(source.resources).forEach(([id,resource])=>{
  const existing=resources.find(item=>item.title===resource.title);
  if(existing)existing.lessonIds=[...new Set([...(existing.lessonIds||[]),...resource.lessonIds])];
  else resources.push({title:resource.title,course:resource.course,type:resource.type,lessonIds:[...resource.lessonIds],sourceId:resource.fileId});
  const existingData=data.resources.find(item=>item.title===resource.title);
  if(existingData)existingData.lessonIds=[...new Set([...(existingData.lessonIds||[]),...resource.lessonIds])];
  else data.resources.push({id:`mp2-${id}`,title:resource.title,course:resource.course,type:resource.type,lessonIds:[...resource.lessonIds]});
  if(window.FONTaineDriveInventory){
   const driveFile=window.FONTaineDriveInventory.files.find(file=>file.id===resource.fileId);
   if(driveFile)driveFile.lessonIds=[...new Set([...(driveFile.lessonIds||[]),...resource.lessonIds])];
   else window.FONTaineDriveInventory.files.push({id:resource.fileId,title:resource.title,course:resource.course,type:resource.type,url:`https://docs.google.com/${resource.type==="Slides"?"presentation":"document"}/d/${resource.fileId}`,modified:"2026-07-13",lessonIds:[...resource.lessonIds]});
  }
 });
 const standards=[
  {id:"SEM-MP2-01",course:"SEM",code:"8175.MP2.01",title:"Develop and evaluate an integrated promotional mix",category:"Promotion",lessonIds:["SEM-021","SEM-022","SEM-023","SEM-024","SEM-025","SEM-026","SEM-027","SEM-028"],assessmentIds:["SEM-028"]},
  {id:"SEM-MP2-02",course:"SEM",code:"8175.MP2.02",title:"Apply the personal selling process in SEM",category:"Selling",lessonIds:["SEM-029","SEM-030","SEM-031","SEM-032","SEM-033","SEM-034","SEM-035"],assessmentIds:["SEM-035"]},
  {id:"SEM-MP2-03",course:"SEM",code:"8175.MP2.03",title:"Demonstrate professional communication, resource management, and customer service",category:"Professional Skills",lessonIds:["SEM-036","SEM-037","SEM-038","SEM-039","SEM-040"],assessmentIds:["SEM-040"]},
  {id:"FASH-MP2-01",course:"Fashion",code:"8140.MP2.01",title:"Apply promotional-mix elements to fashion brands",category:"Promotion",lessonIds:["FASH-021","FASH-022","FASH-023","FASH-024","FASH-025"],assessmentIds:["FASH-025"]},
  {id:"FASH-MP2-02",course:"Fashion",code:"8140.MP2.02",title:"Apply the fashion selling process",category:"Selling",lessonIds:["FASH-026","FASH-027","FASH-028","FASH-029","FASH-030","FASH-031","FASH-032","FASH-033"],assessmentIds:["FASH-033"]},
  {id:"FASH-MP2-03",course:"Fashion",code:"8140.MP2.03",title:"Apply customer-service and visual-merchandising strategies",category:"Customer Experience",lessonIds:["FASH-034","FASH-035","FASH-036","FASH-037","FASH-038","FASH-039","FASH-040"],assessmentIds:["FASH-040"]},
  {id:"ENT-MP2-01",course:"Entrepreneurship",code:"9093.MP2.01",title:"Apply marketing principles and promotion to a new venture",category:"Marketing Principles",lessonIds:["ENT-021","ENT-022","ENT-023","ENT-024","ENT-025","ENT-026","ENT-027","ENT-028"],assessmentIds:["ENT-028"]},
  {id:"ENT-MP2-02",course:"Entrepreneurship",code:"9093.MP2.02",title:"Evaluate and recommend forms of business ownership",category:"Business Ownership",lessonIds:["ENT-029","ENT-030","ENT-031","ENT-032","ENT-033","ENT-034","ENT-035"],assessmentIds:["ENT-034"]},
  {id:"ENT-MP2-03",course:"Entrepreneurship",code:"9093.MP2.03",title:"Prepare and analyze basic financial statements",category:"Financial Statements",lessonIds:["ENT-036","ENT-037","ENT-038","ENT-039","ENT-040"],assessmentIds:["ENT-040"]}
 ];
 standards.forEach(record=>{if(!window.FONTaineStandards.courseStandards.some(item=>item.id===record.id))window.FONTaineStandards.courseStandards.push(record);});
 const wrsAdd={"WRS-02":["SEM-027","SEM-039","FASH-036","ENT-034","ENT-039"],"WRS-07":["SEM-031","SEM-035","SEM-036","FASH-027","FASH-033"],"WRS-09":["SEM-038","FASH-034","FASH-035","FASH-036","FASH-037"],"WRS-14":["SEM-037","FASH-031","ENT-026"],"WRS-19":["ENT-037","ENT-038","ENT-039"],"WRS-20":["SEM-035","SEM-039","FASH-033","ENT-028"]};
 Object.entries(wrsAdd).forEach(([key,ids])=>window.FONTaineStandards.wrsMappings[key]=[...new Set([...(window.FONTaineStandards.wrsMappings[key]||[]),...ids])]);
 state.markingPeriod=state.markingPeriod||"All";
 state.buildCourse=state.buildCourse||"All";
 state.buildPeriod=state.buildPeriod||"MP2";
 const lessonViewBeforeMP2=lessonView;
 lessonView=function(){
  const selected=state.selected;
  let html=lessonViewBeforeMP2();
  if(selected?.markingPeriod)html=html.replace(`<span class="pill">${selected.course}</span>`,`<span class="pill">${selected.course}</span> <span class="mp-period">${selected.markingPeriod}</span>`);
  html=html.replace("Lesson added to the MP1 curriculum map.",`Lesson added to the ${selected?.markingPeriod||"MP1"} curriculum map.`);
  if(selected?.certification)html=html.replace("<strong>WRS aligned</strong>",`<strong>${selected.certification}</strong>`);
  return html;
 };
 lessonList=function(){
  const courseNames=["All",...new Set(lessons.map(lesson=>lesson.course))];
  const periods=["All","MP1","MP2"];
  const statuses=["All",...new Set(lessons.map(lesson=>lesson.status))];
  const filtered=lessons.filter(lesson=>(state.course==="All"||lesson.course===state.course)&&(state.markingPeriod==="All"||lesson.markingPeriod===state.markingPeriod)&&(state.status==="All"||lesson.status===state.status)&&[lesson.id,lesson.title,lesson.unit,lesson.standards].join(" ").toLowerCase().includes(state.search));
  return shell(`<div class="filters mp2-filters"><input aria-label="Search lessons" placeholder="Search lessons, units, or standards" value="${state.search}" oninput="state.search=this.value.toLowerCase();render()"/><select aria-label="Filter lessons by course" onchange="state.course=this.value;render()">${courseNames.map(value=>`<option ${state.course===value?"selected":""}>${value}</option>`).join("")}</select><select aria-label="Filter lessons by marking period" onchange="state.markingPeriod=this.value;render()">${periods.map(value=>`<option ${state.markingPeriod===value?"selected":""}>${value}</option>`).join("")}</select><select aria-label="Filter lessons by status" onchange="state.status=this.value;render()">${statuses.map(value=>`<option ${state.status===value?"selected":""}>${value}</option>`).join("")}</select></div><div class="mp2-result-count">${filtered.length} lessons</div><div class="grid">${filtered.map(lesson=>`<article class="card span-4 item" onclick="openLesson('${lesson.id}')"><div class="row"><div><span class="pill">${lesson.course}</span> <span class="mp-period">${lesson.markingPeriod}</span></div>${badge(lesson.status)}</div><h3>${lesson.id}</h3><div>${lesson.title}</div><p class="muted">${lesson.unit}</p></article>`).join("")||`<div class="empty">No lessons match.</div>`}</div>`);
 };
 courses=function(){
  const courseNames=[...new Set(lessons.map(lesson=>lesson.course))];
  return shell(`<div class="grid">${courseNames.map(course=>{const courseLessons=lessons.filter(lesson=>lesson.course===course),complete=courseLessons.filter(lesson=>lesson.status==="Complete").length,mp1=courseLessons.filter(lesson=>lesson.markingPeriod==="MP1"),mp2=courseLessons.filter(lesson=>lesson.markingPeriod==="MP2"),mapped=mp2.filter(lesson=>lesson.mapStatus==="Mapped").length;return `<div class="card span-4 mp2-course-card"><h2>${course}</h2><div class="metric">${complete}/${courseLessons.length}</div><div class="muted">Complete lesson packages</div><div class="progress"><i style="width:${courseLessons.length?complete/courseLessons.length*100:0}%"></i></div><div class="mp2-course-breakdown"><span><strong>${mp1.length}</strong> MP1 lessons</span><span><strong>${mapped}</strong> MP2 mapped</span></div><button class="btn" onclick="state.course='${course}';state.markingPeriod='MP2';go('Lessons')">Open MP2 map</button></div>`;}).join("")}</div>`);
 };
 buildQueue=function(){
  const courses=["All",...new Set(lessons.map(lesson=>lesson.course))];
  const periods=["All","MP1","MP2"];
  const list=lessons.filter(lesson=>lesson.status!=="Complete"&&(state.buildCourse==="All"||lesson.course===state.buildCourse)&&(state.buildPeriod==="All"||lesson.markingPeriod===state.buildPeriod));
  return shell(`<div class="filters mp2-filters"><select aria-label="Filter build queue by course" onchange="state.buildCourse=this.value;render()">${courses.map(value=>`<option ${state.buildCourse===value?"selected":""}>${value}</option>`).join("")}</select><select aria-label="Filter build queue by marking period" onchange="state.buildPeriod=this.value;render()">${periods.map(value=>`<option ${state.buildPeriod===value?"selected":""}>${value}</option>`).join("")}</select></div><div class="mp2-result-count">${list.length} mapped lessons awaiting full packages</div><div class="list">${list.map(lesson=>`<div class="card row mp2-queue-item"><div><strong>${lesson.id}</strong> <span class="mp-period">${lesson.markingPeriod}</span><div>${lesson.title}</div><div class="muted">${lesson.course} • ${lesson.unit}</div></div><div>${badge(lesson.status)} <button class="btn" onclick="openLesson('${lesson.id}')">Open</button></div></div>`).join("")||`<div class="empty">No lessons are waiting in this view.</div>`}</div>`);
 };
 dashboard=function(){
  const today=lessons.filter(lesson=>lesson.day===CURRENT_DAY&&lesson.markingPeriod==="MP1"),complete=lessons.filter(lesson=>lesson.status==="Complete").length,mp2=lessons.filter(lesson=>lesson.markingPeriod==="MP2"),queue=mp2.filter(lesson=>lesson.status!=="Complete").slice(0,6),upcoming=lessons.filter(lesson=>lesson.markingPeriod==="MP1"&&lesson.day>CURRENT_DAY&&lesson.day<=CURRENT_DAY+2).sort((a,b)=>a.day-b.day||a.course.localeCompare(b.course));
  return shell(`<div class="grid"><section class="card span-8"><div class="row"><h2>Today — Day ${CURRENT_DAY}</h2><span class="muted">MP1 instructional sequence</span></div><div class="grid">${today.map(lesson=>`<div class="card span-4 lesson-card"><div class="row"><span class="pill">${lesson.course}</span>${badge(lesson.status)}</div><div class="lesson-title">${lesson.id}</div><div>${lesson.title}</div><div class="muted">${lesson.unit}</div><button class="btn secondary" onclick="openLesson('${lesson.id}')">Open lesson</button></div>`).join("")}</div></section><section class="card span-4"><h2>Curriculum Health</h2><div class="metric">${Math.round(complete/lessons.length*100)}%</div><div class="muted">Complete packages across MP1 + MP2</div><div class="progress"><i style="width:${complete/lessons.length*100}%"></i></div><br/><div class="row"><span>Complete packages</span><strong>${complete}</strong></div><div class="row"><span>Total mapped lessons</span><strong>${lessons.length}</strong></div><div class="row"><span>Courses</span><strong>${data.courses.length}</strong></div></section><section class="card span-4 mp2-map-summary"><h2>MP2 Map</h2><div class="metric">${mp2.length}</div><div class="muted">Source-backed lessons mapped</div><div class="row"><span>Units</span><strong>${Object.keys(source.units).length}</strong></div><div class="row"><span>Verified resources</span><strong>${Object.keys(source.resources).length}</strong></div><button class="btn" onclick="state.course='All';state.markingPeriod='MP2';go('Lessons')">Open MP2 lessons</button></section><section class="card span-8"><h2>MP2 Build Queue</h2><div class="list">${queue.map(lesson=>`<div class="item row" onclick="openLesson('${lesson.id}')"><div><strong>${lesson.id}</strong><div class="muted">${lesson.course} • ${lesson.title}</div></div>${badge(lesson.status)}</div>`).join("")}</div><button class="btn secondary" onclick="state.buildPeriod='MP2';go('Build Queue')">View all 60 mapped lessons</button></section><section class="card span-12"><h2>Upcoming MP1</h2><div class="grid">${upcoming.map(lesson=>`<div class="card span-4 item" onclick="openLesson('${lesson.id}')"><strong>Day ${lesson.day} • ${lesson.id}</strong><div>${lesson.title}</div><div class="muted">${lesson.course}</div></div>`).join("")}</div></section></div>`);
 };
 window.FONTaineMP2Audit={total:lessons.filter(lesson=>lesson.markingPeriod==="MP2").length,byCourse:Object.fromEntries(["SEM","Fashion","Entrepreneurship"].map(course=>[course,lessons.filter(lesson=>lesson.course===course&&lesson.markingPeriod==="MP2").length])),units:Object.keys(source.units).length,resources:Object.keys(source.resources).length,standards:standards.length,completePackages:lessons.filter(lesson=>lesson.markingPeriod==="MP2"&&lesson.status==="Complete").length};
 render();
})();