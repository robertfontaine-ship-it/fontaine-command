(() => {
  "use strict";
  const missionStore=window.FontaineMissionStore;
  const pathwayData=window.FontaineCoursePathways;
  if(!missionStore)return;
  const TOPICS={
    branding:"Branding", "target-market":"Target Market", "four-ps":"The 4Ps",
    "marketing-functions":"Marketing Functions", "promotional-mix":"Promotional Mix", "market-research":"Market Research",
    pricing:"Pricing Strategy", distribution:"Distribution", service:"Selling & Customer Service",
    "startup-street":"Startup Street", "wrs-career-center":"WRS Career Center", agency:"Wolverine Agency"
  };
  const TOPIC_ALIASES={functions:"marketing-functions",promotion:"promotional-mix"};
  const DEPARTMENT_TOPICS=["branding","target-market","four-ps","marketing-functions","promotional-mix","market-research","pricing","distribution","service"];
  const RANKS=[
    {name:"Marketing Rookie",xp:0},{name:"Campaign Specialist",xp:75},{name:"Brand Strategist",xp:175},
    {name:"Marketing Director",xp:325},{name:"Vice President",xp:525},{name:"Chief Marketing Officer",xp:800},{name:"Industry Legend",xp:1200}
  ];
  const weekKey=missionStore.getWeekKey;
  const getIdentity=missionStore.getActiveProfile;
  const saveIdentity=missionStore.setActiveProfile;
  const completeIdentity=identity=>Boolean(identity?.first&&identity?.last&&identity?.period);
  const xpFor=item=>Number(item.xp??missionStore.xpForEntries(item.requestedEntries??item.entries));
  function collect(){
    const identity=getIdentity(),topicData={},unique=new Map();
    missionStore.getAllHistory({profile:identity}).forEach(item=>{
      const topic=TOPIC_ALIASES[item.topic]||item.topic,id=item.missionId;
      topicData[topic]=topicData[topic]||{missions:new Map(),weekly:0};
      topicData[topic].missions.set(id,item);
      if(item.week===weekKey())topicData[topic].weekly+=Number(item.entries||0);
      unique.set(`${topic}:${id}`,item);
    });
    const xp=[...unique.values()].reduce((sum,item)=>sum+xpFor(item),0);
    const weekly=missionStore.weeklyEntrySummary({profile:identity}).total;
    return {topicData,unique,xp,weekly,inferred:identity};
  }
  function rankFor(xp){return [...RANKS].reverse().find(r=>xp>=r.xp)||RANKS[0];}
  function nextRank(xp){return RANKS.find(r=>xp<r.xp)||null;}
  function codeFor(identity){if(!identity.first||!identity.last||!identity.period)return"NOT-SET";const base=`${identity.first[0]}${identity.last}${identity.period}`.toUpperCase();let hash=0;for(const c of `${identity.first}${identity.last}${identity.period}`)hash=(hash*31+c.charCodeAt(0))%9999;return `FMN-${base}-${String(hash).padStart(4,"0")}`;}
  function badges(data){
    const count=data.unique.size,topics=Object.keys(data.topicData).filter(k=>data.topicData[k].missions.size).length,agency=data.topicData.agency?.missions.size||0,startup=data.topicData["startup-street"]?.missions.size||0,wrs=data.topicData["wrs-career-center"]?.missions.size||0;
    const allDepartments=DEPARTMENT_TOPICS.every(topic=>(data.topicData[topic]?.missions.size||0)>=1);
    const pathways=missionStore.getPathwayProgress({profile:getIdentity()});
    const gateCount=pathwayData?pathwayData.courseList.reduce((sum,course)=>sum+course.stages.filter(stage=>pathways.courses?.[course.id]?.stages?.[stage.id]?.passed).length,0):0;
    const courseMaster=pathwayData?pathwayData.courseList.some(course=>course.stages.every(stage=>pathways.courses?.[course.id]?.stages?.[stage.id]?.passed)):false;
    return [
      {icon:"🚀",name:"First Mission",desc:"Complete your first mission.",on:count>=1},
      {icon:"⚡",name:"Mission Streak",desc:"Complete five missions.",on:count>=5},
      {icon:"🏆",name:"Ten Deep",desc:"Complete ten missions.",on:count>=10},
      {icon:"🧭",name:"Explorer",desc:"Complete work in three departments.",on:topics>=3},
      {icon:"💼",name:"Agency Rookie",desc:"Complete your first client project.",on:agency>=1},
      {icon:"💡",name:"Founder",desc:"Complete your first Startup Street mission.",on:startup>=1},
      {icon:"🚀",name:"Launch Ready",desc:"Complete five Startup Street missions.",on:startup>=5},
      {icon:"🛡️",name:"Work Ready",desc:"Complete your first WRS competency mission.",on:wrs>=1},
      {icon:"🧟",name:"Career Survivor",desc:"Complete 11 WRS competency missions.",on:wrs>=11},
      {icon:"🏅",name:"WRS Master",desc:"Complete all 22 WRS competency missions.",on:wrs>=22},
      {icon:"🔓",name:"Gate Breaker",desc:"Clear the first course mastery gate at 80% or higher.",on:gateCount>=1},
      {icon:"🧭",name:"Course Master",desc:"Clear all six gates in one course pathway.",on:courseMaster},
      {icon:"🌐",name:"Networked",desc:"Complete work in all nine marketing departments.",on:allDepartments},
      {icon:"🧠",name:"Strategy Mind",desc:"Reach 175 XP.",on:data.xp>=175},
      {icon:"🎯",name:"Focused Marketer",desc:"Reach 325 XP.",on:data.xp>=325},
      {icon:"👑",name:"Industry Legend",desc:"Reach 1,200 XP.",on:data.xp>=1200}
    ];
  }
  function targetFor(id){if(id==="wrs-career-center")return 22;if(id==="startup-street")return 12;if(id==="agency")return 6;return 10;}
  function renderPathways(identity){
    const target=document.getElementById("coursePathwayProgress");
    if(!target||!pathwayData)return;
    const pathways=missionStore.getPathwayProgress({profile:identity});
    const total=pathwayData.courseList.reduce((sum,course)=>sum+course.stages.filter(stage=>pathways.courses?.[course.id]?.stages?.[stage.id]?.passed).length,0);
    document.getElementById("pathwayRecordSummary").textContent=total?`${total} of 18 total course gates mastered across this Mission ID.`:"Choose a course route and clear each checkpoint at 80% or higher.";
    target.innerHTML=pathwayData.courseList.map(course=>{
      const mastered=course.stages.filter(stage=>pathways.courses?.[course.id]?.stages?.[stage.id]?.passed).length;
      const next=course.stages.find(stage=>!pathways.courses?.[course.id]?.stages?.[stage.id]?.passed);
      const percent=Math.round(mastered/course.stages.length*100);
      const active=pathways.activeCourse===course.id;
      return `<article class="course-pathway-record ${active?"active":""}"><div class="course-pathway-record-head"><span>${course.icon}</span><div><small>Course ${course.code}${active?" • Active route":""}</small><h3>${course.title}</h3></div></div><p>${next?`Next gate: ${next.title}`:"All six gates mastered."}</p><div class="entry-meter"><i style="width:${percent}%"></i></div><div class="course-pathway-record-meta"><strong>${mastered}/6 gates</strong><span>${percent}% complete</span></div><a class="mission-button ${active?"primary":"secondary"}" href="course-pathways.html?course=${course.id}">${mastered?"Continue pathway":"Open pathway"}</a></article>`;
    }).join("");
  }
  function transferStatus(message,state=""){
    const target=document.getElementById("profileTransferStatus");
    if(!target)return;
    target.textContent=message;
    if(state)target.dataset.state=state;else delete target.dataset.state;
  }
  function updateTransfer(identity){
    const button=document.getElementById("exportMissionProfile");
    if(button)button.disabled=!completeIdentity(identity);
    const status=document.getElementById("profileTransferStatus");
    if(!completeIdentity(identity))transferStatus("Set your Mission ID before creating a backup.");
    else if(status&&!status.dataset.state)transferStatus("Your profile is ready to back up or move to another device.");
  }
  function render(){
    const data=collect(); let identity=getIdentity();
    if(!identity.first&&data.inferred){identity={first:data.inferred.first||"",last:data.inferred.last||"",period:data.inferred.period||""};saveIdentity(identity);}
    const rank=rankFor(data.xp),next=nextRank(data.xp),initials=identity.first?`${identity.first[0]}${identity.last||""}`.toUpperCase():"?";
    document.getElementById("studentName").textContent=identity.first?`${identity.first} ${identity.last}.`:"Profile not set";
    document.getElementById("studentDetails").textContent=identity.period?`Woodside • Period ${identity.period}`:"Select your name and class period.";
    document.getElementById("idAvatar").textContent=initials; document.getElementById("idRank").textContent=rank.name;
    document.getElementById("heroRank").textContent=rank.name; document.getElementById("heroXp").textContent=`${data.xp} XP`;
    document.getElementById("xpTotal").textContent=data.xp; document.getElementById("missionsTotal").textContent=data.unique.size;
    document.getElementById("weeklyEntries").textContent=data.weekly; document.getElementById("topicsTotal").textContent=Object.values(data.topicData).filter(x=>x.missions.size).length;
    document.getElementById("missionCode").textContent=codeFor(identity);
    const prior=RANKS[RANKS.indexOf(rank)],span=next?next.xp-prior.xp:1,progress=next?Math.max(0,Math.min(100,(data.xp-prior.xp)/span*100)):100;
    document.getElementById("heroMeter").style.width=`${progress}%`;
    document.getElementById("nextRankText").textContent=next?`${next.xp-data.xp} XP until ${next.name}.`:"Maximum reputation achieved.";
    document.getElementById("rankPath").innerHTML=RANKS.map(r=>`<article class="rank-card ${data.xp>=r.xp?"unlocked":"locked"} ${r.name===rank.name?"current":""}"><h3>${r.name}</h3><p>${r.xp} XP required</p></article>`).join("");
    document.getElementById("badgeGrid").innerHTML=badges(data).map(b=>`<article class="badge-card ${b.on?"":"locked"}"><div class="badge-icon">${b.icon}</div><h3>${b.name}</h3><p>${b.on?"Unlocked":b.desc}</p></article>`).join("");
    document.getElementById("topicProgress").innerHTML=Object.entries(TOPICS).map(([id,title])=>{const d=data.topicData[id],count=d?.missions.size||0,target=targetFor(id);return `<article class="topic-progress-card"><h3>${title}</h3><p>${id==="wrs-career-center"?`${count} of 22 competencies`:`${count} ${id==="agency"?(count===1?"client project":"client projects"):(count===1?"mission":"missions")} completed`}</p><div class="entry-meter"><i style="width:${Math.min(100,count/target*100)}%"></i></div></article>`;}).join("");
    renderPathways(identity);
    updateTransfer(identity);
  }
  const modal=document.getElementById("identityModal");
  function open(){const i=getIdentity();document.getElementById("idFirst").value=i.first||"";document.getElementById("idLast").value=i.last||"";document.getElementById("idPeriod").value=i.period||"";modal.hidden=false;document.body.style.overflow="hidden";}
  function close(){modal.hidden=true;document.body.style.overflow="";}
  function downloadProfile(){
    try{
      const payload=missionStore.exportProfile();
      const json=JSON.stringify(payload,null,2);
      const blob=new Blob([json],{type:"application/json;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      const safeName=`${payload.profile.first}-${payload.profile.last}-period-${payload.profile.period}`.toLowerCase().replace(/[^a-z0-9-]+/g,"-");
      link.href=url;
      link.download=`fontaine-mission-${safeName}-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),0);
      const draftCount=Object.keys(payload.missionData.drafts||{}).length;
      const launchCount=Object.keys(payload.missionData.agencyLaunches||{}).length;
      const gateCount=Object.values(payload.missionData.pathways?.courses||{}).reduce((sum,course)=>sum+Object.values(course.stages||{}).filter(stage=>stage.passed).length,0);
      transferStatus(`Backup downloaded for ${payload.profile.first} ${payload.profile.last}. It includes ${draftCount} autosaved ${draftCount===1?"draft":"drafts"}, ${launchCount} assigned Agency ${launchCount===1?"project":"projects"}, and ${gateCount} mastered pathway ${gateCount===1?"gate":"gates"}.`,"success");
    }catch(error){
      transferStatus(error.message||"The profile backup could not be created.","error");
    }
  }
  async function importProfile(event){
    const field=event.currentTarget;
    const file=field.files?.[0];
    if(!file)return;
    try{
      if(file.size>2*1024*1024)throw new Error("That backup is too large. Choose a Fontaine Mission JSON backup under 2 MB.");
      const payload=JSON.parse(await file.text());
      const incoming=missionStore.normalizeProfile(payload.profile||{});
      const current=getIdentity();
      if(completeIdentity(current)&&missionStore.profileKey(current)!==missionStore.profileKey(incoming)){
        const confirmed=window.confirm(`This backup belongs to ${incoming.first||"another student"} ${incoming.last?`${incoming.last}.`:""}, Period ${incoming.period||"?"}. Import it and switch profiles?`);
        if(!confirmed){transferStatus("Import canceled. The current Mission ID was not changed.");return;}
      }
      const result=missionStore.importProfile(payload,{mode:"merge"});
      render();
      transferStatus(`Progress restored for ${result.profile.first} ${result.profile.last}. This profile includes ${result.missions} completed ${result.missions===1?"mission":"missions"}, ${result.drafts} autosaved ${result.drafts===1?"draft":"drafts"}, ${result.agencyLaunches} assigned Agency ${result.agencyLaunches===1?"project":"projects"}, and ${result.pathwayGates||0} mastered pathway ${(result.pathwayGates||0)===1?"gate":"gates"}.`,"success");
    }catch(error){
      transferStatus(error.message||"That file could not be imported.","error");
    }finally{
      field.value="";
    }
  }
  document.getElementById("editIdentity").addEventListener("click",open);
  document.querySelectorAll("[data-close-id]").forEach(x=>x.addEventListener("click",close));
  document.getElementById("identityForm").addEventListener("submit",e=>{e.preventDefault();const identity=saveIdentity({first:document.getElementById("idFirst").value.trim(),last:document.getElementById("idLast").value.trim().slice(0,1).toUpperCase(),period:document.getElementById("idPeriod").value});close();transferStatus(`Mission ID ready for ${identity.first} ${identity.last}., Period ${identity.period}.`);render();});
  document.getElementById("exportMissionProfile").addEventListener("click",downloadProfile);
  document.getElementById("importMissionProfile").addEventListener("change",importProfile);
  render();
})();
