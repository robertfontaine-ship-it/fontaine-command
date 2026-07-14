(()=>{
 const source=window.FONTaineMP3Sources;
 if(!source)throw new Error("MP3 source registry must load before the curriculum map.");
 const specs={
  SEM:[
   ["SEM-041","Distribution Foundations and Channel Systems","sem-mp3-u01","explain how distribution moves sports and entertainment products, services, media, and experiences to customers"],
   ["SEM-042","Direct and Indirect Distribution","sem-mp3-u01","compare direct and indirect distribution channels for sports and entertainment offers"],
   ["SEM-043","Intermediaries and Channel Decisions","sem-mp3-u01","evaluate how intermediaries affect reach, control, cost, and customer access"],
   ["SEM-044","Ticketing and Digital Distribution","sem-mp3-u01","analyze ticketing and digital delivery systems for sports and entertainment experiences"],
   ["SEM-045","Merchandise, Media, and Content Distribution","sem-mp3-u01","select distribution channels for merchandise, media rights, streaming content, and fan products"],
   ["SEM-046","Inventory, Shipping, and Customer Access","sem-mp3-u01","explain how inventory, fulfillment, shipping, and access affect customer satisfaction"],
   ["SEM-047","Distribution Power Move","sem-mp3-u01","recommend and defend a distribution strategy for an SEM property"],
   ["SEM-048","Distribution Review and Application","sem-mp3-u01","apply distribution vocabulary and channel decisions to new SEM scenarios"],
   ["SEM-049","Pricing Foundations: Cost, Demand, and Value","sem-mp3-u02","explain how cost, demand, competition, value, and profit goals influence pricing"],
   ["SEM-050","Dynamic Pricing in Sports and Entertainment","sem-mp3-u02","analyze dynamic pricing decisions using demand, timing, capacity, and customer evidence"],
   ["SEM-051","Premium, Penetration, and Promotional Pricing","sem-mp3-u02","compare pricing strategies and select the strongest approach for an SEM objective"],
   ["SEM-052","Bundling and Psychological Pricing","sem-mp3-u02","design bundles and psychological price points that create customer value"],
   ["SEM-053","Competition, Ethics, and Fan Perception","sem-mp3-u02","evaluate the competitive and ethical effects of an SEM pricing decision"],
   ["SEM-054","Price the Venue","sem-mp3-u02","set ticket prices using venue, capacity, audience, competition, and revenue evidence"],
   ["SEM-055","Pricing and Profit Calculations","sem-mp3-u02","calculate revenue, cost, profit, margin, and break-even information for SEM offers"],
   ["SEM-056","Pricing Strategy Review and Checkpoint","sem-mp3-u02","apply pricing strategies and calculations to new sports and entertainment scenarios"],
   ["SEM-057","GRAMMYs Marketing Scavenger Hunt","sem-mp3-u03","identify distribution, pricing, promotion, sponsorship, and audience strategies in a major entertainment event"],
   ["SEM-058","Event Revenue Streams","sem-mp3-u03","analyze tickets, sponsorships, merchandise, concessions, media, and premium experiences as event revenue streams"],
   ["SEM-059","Event Revenue Upsell, Bundle, and Experience Plan","sem-mp3-u03","develop a coordinated event revenue plan using upsells, bundles, and customer-experience evidence"],
   ["SEM-060","MP3 Review and Performance Check","sem-mp3-u03","apply MP3 distribution, pricing, and event-revenue concepts to new SEM scenarios"]
  ],
  Fashion:[
   ["FASH-041","Retail Formats and Store Positioning","fash-mp3-u01","differentiate fashion retail formats and explain how each serves a target customer"],
   ["FASH-042","Department, Specialty, Discount, and Off-Price Retail","fash-mp3-u01","compare major store-based fashion retail formats using assortment, price, service, and customer expectations"],
   ["FASH-043","E-Commerce, Direct-to-Consumer, and Omnichannel Retail","fash-mp3-u01","analyze how digital and omnichannel fashion retailers create access and customer value"],
   ["FASH-044","Store Spotter Retail Format Analysis","fash-mp3-u01","classify fashion retailers and justify each format decision with evidence"],
   ["FASH-045","Style Profile and Target Customer","fash-mp3-u01","develop a fashion shopper profile that connects lifestyle, preferences, budget, and retail behavior"],
   ["FASH-046","Product Assortment and Retail Mix","fash-mp3-u01","build a product assortment that fits a fashion retailer and target customer"],
   ["FASH-047","Fiber, Yarn, Fabric, and Finish Foundations","fash-mp3-u02","explain how fibers become yarns, fabrics, finishes, and fashion products"],
   ["FASH-048","Natural Fibers","fash-mp3-u02","compare natural fibers using source, properties, care, quality, cost, and product use"],
   ["FASH-049","Manufactured Fibers","fash-mp3-u02","compare manufactured fibers using performance, care, cost, sustainability, and product use"],
   ["FASH-050","Fabric Construction: Woven, Knit, and Nonwoven","fash-mp3-u02","distinguish fabric constructions and connect structure to product performance"],
   ["FASH-051","Fabric Properties, Quality, and Performance","fash-mp3-u02","evaluate textile properties that affect quality, comfort, durability, care, and customer value"],
   ["FASH-052","What’s in Your Clothes? Fiber Label Analysis","fash-mp3-u02","analyze garment labels and explain how fiber content affects product expectations"],
   ["FASH-053","Laundry Symbols and Product Care","fash-mp3-u02","interpret care symbols and recommend procedures that protect fashion products"],
   ["FASH-054","Textile Marketing Strategy","fash-mp3-u02","connect textile evidence to product positioning, pricing, promotion, and target-customer value"],
   ["FASH-055","Fabric Fit Challenge","fash-mp3-u02","select textiles that fit product function, customer needs, retail format, and price position"],
   ["FASH-056","Sustainability and Fashion Systems","fash-mp3-u03","analyze environmental and social impacts across the fashion product life cycle"],
   ["FASH-057","Production, Sourcing, and Global Impact","fash-mp3-u03","evaluate how production and sourcing decisions affect cost, availability, quality, workers, and brand perception"],
   ["FASH-058","Sustainable Fit Challenge","fash-mp3-u03","build and defend a fashion look using sustainability, product, retailer, and customer evidence"],
   ["FASH-059","From Fiber to Floor Retail Strategy Capstone","fash-mp3-u03","integrate retail format, target customer, textiles, sourcing, sustainability, pricing, and merchandising decisions"],
   ["FASH-060","MP3 Review and Performance Check","fash-mp3-u03","apply MP3 retailing, textile, sustainability, and production concepts to new fashion scenarios"]
  ],
  Entrepreneurship:[
   ["ENT-041","Business Activation Overview and Product-Service Thesis","ent-mp3-u01","define a clear product or service and explain the customer problem it solves"],
   ["ENT-042","Target Market and Buying Method","ent-mp3-u01","identify the most likely first customer and select an in-person, online, or hybrid buying method"],
   ["ENT-043","Value Proposition and Competitive Position","ent-mp3-u01","develop a value proposition and position the venture against realistic alternatives"],
   ["ENT-044","Business Model: Brick-and-Mortar, E-Commerce, or Hybrid","ent-mp3-u01","select and defend a business model using customer, cost, access, and operational evidence"],
   ["ENT-045","Daily Operations and Workflow","ent-mp3-u01","map the daily operational steps required to deliver the product or service"],
   ["ENT-046","Resources, Suppliers, and Capacity","ent-mp3-u01","identify people, equipment, technology, suppliers, inventory, and capacity needed to operate"],
   ["ENT-047","Pricing, Revenue, and Cost Assumptions","ent-mp3-u01","build realistic pricing, revenue, variable-cost, and fixed-cost assumptions"],
   ["ENT-048","Business Activation Strategy Deck Checkpoint","ent-mp3-u01","present and revise a complete business activation strategy using evidence"],
   ["ENT-049","Grand Opening Marketing Kit","ent-mp3-u02","create coordinated launch materials that fit the venture, customer, offer, and brand"],
   ["ENT-050","Launch Calendar, Roles, and Metrics","ent-mp3-u02","plan a grand opening timeline, responsibilities, customer actions, and success measures"],
   ["ENT-051","Business Simulator Setup and Decision Rules","ent-mp3-u03","establish the business model, starting resources, goals, and decision rules for Month 1"],
   ["ENT-052","Month 1 Product and Quality Decisions","ent-mp3-u03","select product, quality, assortment, and customer-value decisions for the simulator"],
   ["ENT-053","Month 1 Pricing and Promotion Decisions","ent-mp3-u03","set pricing and promotion choices using customer, competition, cost, and cash evidence"],
   ["ENT-054","Month 1 Staffing and Operations Decisions","ent-mp3-u03","allocate staffing, time, capacity, and operating resources for Month 1"],
   ["ENT-055","Month 1 Customer and Risk Cards","ent-mp3-u03","respond to customer and risk events using ethical, operational, and financial reasoning"],
   ["ENT-056","Month 1 Financial Results and Profit Analysis","ent-mp3-u03","calculate and interpret sales, costs, cash, profit, and business performance"],
   ["ENT-057","Business Optimization and Decision Revision","ent-mp3-u03","revise weak business decisions using simulator evidence and tradeoff analysis"],
   ["ENT-058","Month 1 Executive Report","ent-mp3-u03","prepare an executive report explaining decisions, results, evidence, and next actions"],
   ["ENT-059","Business Simulator Presentation and Reflection","ent-mp3-u03","present Month 1 performance and defend the strongest business improvements"],
   ["ENT-060","MP3 Review and Performance Check","ent-mp3-u03","apply MP3 activation, launch, operations, and simulator concepts to new venture scenarios"]
  ]
 };
 const courseCodes={SEM:"8175",Fashion:"8140",Entrepreneurship:"9093"};
 const certifications={SEM:"WRS",Fashion:"WRS",Entrepreneurship:"NRF Customer Service & Sales"};
 Object.entries(source.units).forEach(([id,unit])=>{data.units[id]=unit.title;});
 const lessonSources=id=>Object.entries(source.resources).filter(([,r])=>r.lessonIds.includes(id)).map(([key])=>key);
 Object.entries(specs).forEach(([course,rows])=>{
  const key=course==="SEM"?"semMp3":course==="Fashion"?"fashionMp3":"entrepreneurshipMp3";
  data.lessonTitles[key]=rows.map(row=>row[1]);
  rows.forEach(([id,title,unitId,objective],index)=>{
   if(lessons.some(lesson=>lesson.id===id))return;
   const unit=source.units[unitId];
   lessons.push({
    id,course,courseCode:courseCodes[course],markingPeriod:"MP3",sequence:index+1,day:index+41,title,unitId,unit:unit.title,status:"Planned",mapStatus:"Mapped",standards:unit.standards,certification:certifications[course],duration:"45–60 minutes",
    components:["Mapped lesson sequence","Mapped pacing-guide unit","Mapped standards","Verified source links","Missing full lesson plan","Missing student activity","Missing assessment evidence","Missing Canvas directions"],
    overview:`Source-backed MP3 curriculum map for ${title}. This lesson is sequenced inside ${unit.title}; the complete classroom package has not yet been built.`,
    target:`I will ${objective}.`,success:"I will know I am successful when I complete the mapped application and demonstrate the required concept with at least 80% accuracy.",
    agenda:[],bellRinger:"Bell ringer pending full MP3 lesson build.",miniLesson:"Mini lesson pending full MP3 lesson build.",activity:"Student application pending full MP3 lesson build.",exitTicket:"Exit ticket pending full MP3 lesson build.",
    materials:["Verified source resources","Pacing-guide standards","Missing lesson-specific student materials"],differentiation:["Differentiation plan pending full MP3 lesson build"],canvas:"Canvas directions pending full MP3 lesson build.",
    sourceIds:lessonSources(id),notes:`MP3 source-backed curriculum map. Verification: ${source.lessons[id]?.verification||"pacing-guide map"}.`,version:"Version 0 — MP3 curriculum map"
   });
  });
 });
 Object.entries(source.resources).forEach(([id,resource])=>{
  const existing=resources.find(item=>item.title===resource.title);
  if(existing)existing.lessonIds=[...new Set([...(existing.lessonIds||[]),...resource.lessonIds])];
  else resources.push({title:resource.title,course:resource.course,type:resource.type,lessonIds:[...resource.lessonIds],sourceId:resource.fileId});
  const existingData=data.resources.find(item=>item.title===resource.title);
  if(existingData)existingData.lessonIds=[...new Set([...(existingData.lessonIds||[]),...resource.lessonIds])];
  else data.resources.push({id:`mp3-${id}`,title:resource.title,course:resource.course,type:resource.type,lessonIds:[...resource.lessonIds]});
  if(window.FONTaineDriveInventory){
   const driveFile=window.FONTaineDriveInventory.files.find(file=>file.id===resource.fileId);
   if(driveFile)driveFile.lessonIds=[...new Set([...(driveFile.lessonIds||[]),...resource.lessonIds])];
   else window.FONTaineDriveInventory.files.push({id:resource.fileId,title:resource.title,course:resource.course,type:resource.type,url:`https://docs.google.com/${resource.type==="Slides"?"presentation":"document"}/d/${resource.fileId}`,modified:"2026-07-14",lessonIds:[...resource.lessonIds]});
  }
 });
 const standards=[
  {id:"SEM-MP3-01",course:"SEM",code:"8175.MP3.01",title:"Evaluate distribution channels and fulfillment decisions",category:"Distribution",lessonIds:["SEM-041","SEM-042","SEM-043","SEM-044","SEM-045","SEM-046","SEM-047","SEM-048"],assessmentIds:["SEM-047","SEM-048"]},
  {id:"SEM-MP3-02",course:"SEM",code:"8175.MP3.02",title:"Apply pricing strategies and profit analysis",category:"Pricing",lessonIds:["SEM-049","SEM-050","SEM-051","SEM-052","SEM-053","SEM-054","SEM-055","SEM-056"],assessmentIds:["SEM-054","SEM-056"]},
  {id:"SEM-MP3-03",course:"SEM",code:"8175.MP3.03",title:"Develop integrated event revenue strategies",category:"Event Revenue",lessonIds:["SEM-057","SEM-058","SEM-059","SEM-060"],assessmentIds:["SEM-059","SEM-060"]},
  {id:"FASH-MP3-01",course:"Fashion",code:"8140.MP3.01",title:"Compare fashion retail formats and customer strategies",category:"Fashion Retailing",lessonIds:["FASH-041","FASH-042","FASH-043","FASH-044","FASH-045","FASH-046"],assessmentIds:["FASH-044","FASH-046"]},
  {id:"FASH-MP3-02",course:"Fashion",code:"8140.MP3.02",title:"Analyze fibers, fabrics, care, quality, and textile marketing",category:"Textiles",lessonIds:["FASH-047","FASH-048","FASH-049","FASH-050","FASH-051","FASH-052","FASH-053","FASH-054","FASH-055"],assessmentIds:["FASH-055"]},
  {id:"FASH-MP3-03",course:"Fashion",code:"8140.MP3.03",title:"Evaluate sustainability, sourcing, production, and retail strategy",category:"Sustainability",lessonIds:["FASH-056","FASH-057","FASH-058","FASH-059","FASH-060"],assessmentIds:["FASH-059","FASH-060"]},
  {id:"ENT-MP3-01",course:"Entrepreneurship",code:"9093.MP3.01",title:"Develop a business activation strategy",category:"Business Activation",lessonIds:["ENT-041","ENT-042","ENT-043","ENT-044","ENT-045","ENT-046","ENT-047","ENT-048"],assessmentIds:["ENT-048"]},
  {id:"ENT-MP3-02",course:"Entrepreneurship",code:"9093.MP3.02",title:"Plan and measure a grand opening launch",category:"Launch Operations",lessonIds:["ENT-049","ENT-050"],assessmentIds:["ENT-050"]},
  {id:"ENT-MP3-03",course:"Entrepreneurship",code:"9093.MP3.03",title:"Operate, analyze, and optimize a simulated venture",category:"Business Simulation",lessonIds:["ENT-051","ENT-052","ENT-053","ENT-054","ENT-055","ENT-056","ENT-057","ENT-058","ENT-059","ENT-060"],assessmentIds:["ENT-058","ENT-059","ENT-060"]}
 ];
 standards.forEach(record=>{if(!window.FONTaineStandards.courseStandards.some(item=>item.id===record.id))window.FONTaineStandards.courseStandards.push(record);});
 const wrsAdd={"WRS-02":["SEM-047","SEM-053","FASH-055","FASH-057","ENT-044","ENT-055","ENT-057"],"WRS-06":["SEM-054","SEM-059","FASH-045","FASH-059","ENT-048","ENT-050"],"WRS-14":["SEM-046","FASH-046","ENT-045","ENT-046","ENT-054"],"WRS-19":["SEM-055","ENT-047","ENT-056","ENT-058"],"WRS-20":["SEM-060","FASH-059","FASH-060","ENT-048","ENT-059","ENT-060"]};
 Object.entries(wrsAdd).forEach(([key,ids])=>window.FONTaineStandards.wrsMappings[key]=[...new Set([...(window.FONTaineStandards.wrsMappings[key]||[]),...ids])]);
 state.markingPeriod=state.markingPeriod||"All";state.buildCourse=state.buildCourse||"All";state.buildPeriod="MP3";
 lessonList=function(){
  const courseNames=["All",...new Set(lessons.map(l=>l.course))],periods=["All","MP1","MP2","MP3"],statuses=["All",...new Set(lessons.map(l=>l.status))];
  const filtered=lessons.filter(l=>(state.course==="All"||l.course===state.course)&&(state.markingPeriod==="All"||l.markingPeriod===state.markingPeriod)&&(state.status==="All"||l.status===state.status)&&[l.id,l.title,l.unit,l.standards].join(" ").toLowerCase().includes(state.search));
  return shell(`<div class="filters mp2-filters"><input aria-label="Search lessons" placeholder="Search lessons, units, or standards" value="${state.search}" oninput="state.search=this.value.toLowerCase();render()"/><select aria-label="Filter lessons by course" onchange="state.course=this.value;render()">${courseNames.map(v=>`<option ${state.course===v?"selected":""}>${v}</option>`).join("")}</select><select aria-label="Filter lessons by marking period" onchange="state.markingPeriod=this.value;render()">${periods.map(v=>`<option ${state.markingPeriod===v?"selected":""}>${v}</option>`).join("")}</select><select aria-label="Filter lessons by status" onchange="state.status=this.value;render()">${statuses.map(v=>`<option ${state.status===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="mp2-result-count">${filtered.length} lessons</div><div class="grid">${filtered.map(l=>`<article class="card span-4 item" onclick="openLesson('${l.id}')"><div class="row"><div><span class="pill">${l.course}</span> <span class="mp-period">${l.markingPeriod}</span></div>${badge(l.status)}</div><h3>${l.id}</h3><div>${l.title}</div><p class="muted">${l.unit}</p></article>`).join("")||`<div class="empty">No lessons match.</div>`}</div>`);
 };
 courses=function(){
  const names=[...new Set(lessons.map(l=>l.course))];
  return shell(`<div class="grid">${names.map(course=>{const all=lessons.filter(l=>l.course===course),complete=all.filter(l=>l.status==="Complete").length,counts=Object.fromEntries(["MP1","MP2","MP3"].map(p=>[p,all.filter(l=>l.markingPeriod===p).length])),mapped=all.filter(l=>l.markingPeriod==="MP3"&&l.mapStatus==="Mapped").length;return `<div class="card span-4 mp2-course-card"><h2>${course}</h2><div class="metric">${complete}/${all.length}</div><div class="muted">Complete lesson packages</div><div class="progress"><i style="width:${all.length?complete/all.length*100:0}%"></i></div><div class="mp2-course-breakdown"><span><strong>${counts.MP1}</strong> MP1</span><span><strong>${counts.MP2}</strong> MP2</span><span><strong>${mapped}</strong> MP3 mapped</span></div><button class="btn" onclick="state.course='${course}';state.markingPeriod='MP3';go('Lessons')">Open MP3 map</button></div>`;}).join("")}</div>`);
 };
 buildQueue=function(){
  const courseNames=["All",...new Set(lessons.map(l=>l.course))],periods=["All","MP1","MP2","MP3"];
  const list=lessons.filter(l=>l.status!=="Complete"&&(state.buildCourse==="All"||l.course===state.buildCourse)&&(state.buildPeriod==="All"||l.markingPeriod===state.buildPeriod));
  return shell(`<div class="filters mp2-filters"><select aria-label="Filter build queue by course" onchange="state.buildCourse=this.value;render()">${courseNames.map(v=>`<option ${state.buildCourse===v?"selected":""}>${v}</option>`).join("")}</select><select aria-label="Filter build queue by marking period" onchange="state.buildPeriod=this.value;render()">${periods.map(v=>`<option ${state.buildPeriod===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="mp2-result-count">${list.length} mapped lessons awaiting full packages</div><div class="list">${list.map(l=>`<div class="card row mp2-queue-item"><div><strong>${l.id}</strong> <span class="mp-period">${l.markingPeriod}</span><div>${l.title}</div><div class="muted">${l.course} • ${l.unit}</div></div><div>${badge(l.status)} <button class="btn" onclick="openLesson('${l.id}')">Open</button></div></div>`).join("")||`<div class="empty">No lessons are waiting in this view.</div>`}</div>`);
 };
 dashboard=function(){
  const complete=lessons.filter(l=>l.status==="Complete").length,mp3=lessons.filter(l=>l.markingPeriod==="MP3"),queue=mp3.filter(l=>l.status!=="Complete").slice(0,9),courseRows=["SEM","Fashion","Entrepreneurship"].map(course=>({course,count:mp3.filter(l=>l.course===course).length,units:new Set(mp3.filter(l=>l.course===course).map(l=>l.unitId)).size}));
  return shell(`<div class="grid"><section class="card span-8"><div class="row"><h2>MP3 Curriculum Map</h2><span class="muted">Source-backed build queue</span></div><div class="grid">${courseRows.map(r=>`<div class="card span-4"><span class="pill">${r.course}</span><div class="metric">${r.count}</div><div class="muted">mapped lessons • ${r.units} units</div><button class="btn secondary" onclick="state.course='${r.course}';state.markingPeriod='MP3';go('Lessons')">Open map</button></div>`).join("")}</div></section><section class="card span-4"><h2>Curriculum Health</h2><div class="metric">${Math.round(complete/lessons.length*100)}%</div><div class="muted">Complete packages across MP1–MP3</div><div class="progress"><i style="width:${complete/lessons.length*100}%"></i></div><br/><div class="row"><span>Complete packages</span><strong>${complete}</strong></div><div class="row"><span>Total mapped lessons</span><strong>${lessons.length}</strong></div><div class="row"><span>MP3 awaiting build</span><strong>${mp3.filter(l=>l.status!=="Complete").length}</strong></div></section><section class="card span-4 mp2-map-summary"><h2>MP3 Sources</h2><div class="metric">${Object.keys(source.resources).length}</div><div class="muted">Verified classroom resources</div><div class="row"><span>Units</span><strong>${Object.keys(source.units).length}</strong></div><div class="row"><span>Lessons</span><strong>${mp3.length}</strong></div><button class="btn" onclick="state.course='All';state.markingPeriod='MP3';go('Lessons')">Open all MP3 lessons</button></section><section class="card span-8"><h2>MP3 Build Queue</h2><div class="list">${queue.map(l=>`<div class="item row" onclick="openLesson('${l.id}')"><div><strong>${l.id}</strong><div class="muted">${l.course} • ${l.title}</div></div>${badge(l.status)}</div>`).join("")}</div><button class="btn secondary" onclick="state.buildPeriod='MP3';go('Build Queue')">View all 60 mapped lessons</button></section></div>`);
 };
 window.FONTaineMP3Audit={total:lessons.filter(l=>l.markingPeriod==="MP3").length,byCourse:Object.fromEntries(["SEM","Fashion","Entrepreneurship"].map(course=>[course,lessons.filter(l=>l.course===course&&l.markingPeriod==="MP3").length])),units:Object.keys(source.units).length,resources:Object.keys(source.resources).length,standards:standards.length,completePackages:lessons.filter(l=>l.markingPeriod==="MP3"&&l.status==="Complete").length};
 render();
})();