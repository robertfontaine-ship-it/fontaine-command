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
})();