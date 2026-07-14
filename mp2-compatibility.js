(()=>{
 const defaults={health:84,status:"Mapped Source",version:"MP2 Map",lastUsed:"MP2 planning",companions:[],tags:["mp2","source-backed"]};
 resources.forEach(resource=>{
  if(resource.health===undefined)resource.health=defaults.health;
  if(!resource.status)resource.status=defaults.status;
  if(!resource.version)resource.version=defaults.version;
  if(!resource.lastUsed)resource.lastUsed=defaults.lastUsed;
  if(!Array.isArray(resource.companions))resource.companions=[];
  if(!Array.isArray(resource.tags))resource.tags=[...defaults.tags];
 });
 const mappedLessons=lessons.filter(lesson=>lesson.markingPeriod==="MP2");
 mappedLessons.forEach(lesson=>{
  if(typeof initialComponentDetails==="function"&&!lesson.componentDetails)lesson.componentDetails=initialComponentDetails(lesson);
  if(typeof calculateReadiness==="function"&&lesson.componentDetails){
   calculateReadiness(lesson);
   lesson.status="Planned";
   lesson.mapStatus="Mapped";
  }
 });
 if(Array.isArray(window.FONTaineBuildTasks))window.FONTaineBuildTasks=lessons.flatMap(lesson=>lesson.buildTasks||[]);
 const coveredLessons=window.FONTaineCompanionAudit?.totalLessons||Math.round((window.FONTaineCompanionAudit?.generatedResources||0)/5);
 const renderBeforeMP2Compatibility=render;
 render=function(){
  renderBeforeMP2Compatibility();
  if(state.page==="Companion Resources"){
   const metric=document.querySelector('[data-companion-metric="lessons"] strong');
   if(metric)metric.textContent=String(coveredLessons);
  }
 };
})();