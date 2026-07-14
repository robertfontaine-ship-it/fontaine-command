(()=>{
 const audit=window.FONTaineCompanionAudit;
 const resources=window.FONTaineCompanionResources;
 const sources=window.FONTaineCompanionSources;
 if(!audit||!Array.isArray(resources)||!sources)return;
 const generatedTypes=[
  {key:"organizer",label:"Student Organizer",reviewRequired:false},
  {key:"rubric",label:"Scoring Rubric",reviewRequired:false},
  {key:"exit",label:"Exit Ticket",reviewRequired:false},
  {key:"assessment",label:"Quick Check",reviewRequired:true},
  {key:"guide",label:"Teacher Scoring Guide",reviewRequired:true}
 ];
 const semMp2Lessons=lessons.filter(lesson=>lesson.course==="SEM"&&lesson.markingPeriod==="MP2"&&lesson.status==="Complete"&&lesson.mapStatus==="Built");
 const existingIds=new Set(resources.map(resource=>resource.id));
 const generated=[];
 semMp2Lessons.forEach(lesson=>generatedTypes.forEach(type=>{
  const resource={
   id:`${lesson.id.toLowerCase()}-${type.key}`,
   title:`${lesson.id} ${type.label}`,
   course:lesson.course,
   type:type.label,
   lessonIds:[lesson.id],
   status:"Generated",
   verification:"Generated from the complete SEM MP2 lesson package",
   reviewRequired:type.reviewRequired
  };
  if(!existingIds.has(resource.id)){
   resources.push(resource);
   generated.push(resource);
   existingIds.add(resource.id);
  }
 }));
 const verified=[
  {id:"verified-sem-mp2-promo-notes",title:"The Promotional Mix – Sports, Entertainment & Event Marketing Notes",course:"SEM",type:"Student Organizer",lessonIds:["SEM-021","SEM-022","SEM-023","SEM-024","SEM-025"],fileId:"1MaMDmHQj-KHdo7RxD2dh9Avek4_Kjb6tZ6NesQ_XSHA",url:"https://docs.google.com/document/d/1MaMDmHQj-KHdo7RxD2dh9Avek4_Kjb6tZ6NesQ_XSHA",status:"Verified in Drive"},
  {id:"verified-sem-mp2-promo-sort",title:"SEM Promo Mix Scenario Sorting",course:"SEM",type:"Student Organizer",lessonIds:["SEM-026"],fileId:"1kkndbvugBfcMGsmf292kmzR5NAOof-0aN4HyA0QROpA",url:"https://docs.google.com/presentation/d/1kkndbvugBfcMGsmf292kmzR5NAOof-0aN4HyA0QROpA",status:"Verified in Drive"},
  {id:"verified-sem-mp2-selling-notes",title:"Selling in Sports & Entertainment Marketing Notes",course:"SEM",type:"Student Organizer",lessonIds:["SEM-029","SEM-030","SEM-031","SEM-032","SEM-033","SEM-034"],fileId:"1IVsPr5q6o1lHcGGlf0oFILqW65FeAY1gNa5b-_rYhak",url:"https://docs.google.com/document/d/1IVsPr5q6o1lHcGGlf0oFILqW65FeAY1gNa5b-_rYhak",status:"Verified in Drive"},
  {id:"verified-sem-mp2-role-play",title:"SEM Individual Role-Play Worksheet",course:"SEM",type:"Student Organizer",lessonIds:["SEM-035","SEM-039"],fileId:"1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk",url:"https://docs.google.com/document/d/1m64puXnE5kv9OEWnnkqIJoM2zgPa5QEpOEygvnGCCUk",status:"Verified in Drive"},
  {id:"verified-sem-mp2-case-analysis",title:"SEM Marketing Case Study Analysis",course:"SEM",type:"Student Organizer",lessonIds:["SEM-039"],fileId:"1wDudBgWWEBX2nByp62oOjq-3H3vcwReUa9Tg7lSdoCk",url:"https://docs.google.com/document/d/1wDudBgWWEBX2nByp62oOjq-3H3vcwReUa9Tg7lSdoCk",status:"Verified in Drive"},
  {id:"verified-sem-mp2-semester-review",title:"Sports & Entertainment Marketing Semester 1 Review",course:"SEM",type:"Assessment",lessonIds:["SEM-040"],fileId:"1mPlPuqQ6x05BaABvWKCsm2brMxFNt5HsIZbl5pVzpnA",url:"https://docs.google.com/document/d/1mPlPuqQ6x05BaABvWKCsm2brMxFNt5HsIZbl5pVzpnA",status:"Verified in Drive"}
 ];
 const verifiedAdded=[];
 verified.forEach(resource=>{
  if(existingIds.has(resource.id))return;
  resources.push(resource);
  sources.verifiedSources.push(resource);
  verifiedAdded.push(resource);
  existingIds.add(resource.id);
 });
 const demandPattern=/worksheet|organizer|matrix|template|chart|checklist|rubric|assessment|performance check|review|answer key|notes|cards|station/i;
 const demandType=material=>{
  const value=String(material).toLowerCase();
  if(value.includes("answer key"))return "Answer Key";
  if(value.includes("rubric")||value.includes("checklist"))return "Scoring Rubric";
  if(value.includes("assessment")||value.includes("performance check")||value.includes("review"))return "Assessment";
  return "Student Organizer";
 };
 semMp2Lessons.forEach(lesson=>(lesson.materials||[]).filter(material=>demandPattern.test(material)).forEach(material=>{
  const type=demandType(material);
  const verifiedMatch=sources.verifiedSources.some(resource=>resource.lessonIds.includes(lesson.id)&&resource.type===type);
  sources.demands.push({lessonId:lesson.id,course:lesson.course,title:lesson.title,material,type,verified:verifiedMatch,status:verifiedMatch?"Verified in Drive":"Generated coverage only"});
 }));
 audit.totalLessons+=semMp2Lessons.length;
 audit.generatedResources+=generated.length;
 audit.verifiedResources+=verifiedAdded.length;
 audit.materialDemands=sources.demands.length;
 audit.generatedOnlyDemands=sources.demands.filter(item=>!item.verified).length;
 window.FONTaineSEMMP2CompanionResources={lessons:semMp2Lessons.length,generated:generated.length,verified:verifiedAdded.length};
 const renderBeforeSEMMP2Companions=render;
 render=function(){
  renderBeforeSEMMP2Companions();
  if(state.page!=="Companion Resources")return;
  const generatedMetric=document.querySelector('[data-companion-metric="generated"] strong');
  const lessonMetric=document.querySelector('[data-companion-metric="lessons"] strong');
  if(generatedMetric)generatedMetric.textContent=String(audit.generatedResources);
  if(lessonMetric)lessonMetric.textContent=String(audit.totalLessons);
 };
})();