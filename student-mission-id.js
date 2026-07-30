(() => {
  "use strict";
  const ID_KEY="fontaineMissionIdentity:v1";
  const TOPICS={
    branding:"Branding", "target-market":"Target Market", "four-ps":"The 4Ps",
    functions:"Marketing Functions", promotion:"Promotional Mix", agency:"Wolverine Agency"
  };
  const RANKS=[
    {name:"Marketing Rookie",xp:0},{name:"Campaign Specialist",xp:75},{name:"Brand Strategist",xp:175},
    {name:"Marketing Director",xp:325},{name:"Vice President",xp:525},{name:"Chief Marketing Officer",xp:800},{name:"Industry Legend",xp:1200}
  ];
  const weekKey=()=>{const d=new Date(),day=d.getDay();d.setDate(d.getDate()+(day===0?-6:1-day));d.setHours(0,0,0,0);return d.toISOString().slice(0,10);};
  const readJSON=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||"null")||fallback;}catch{return fallback;}};
  const getIdentity=()=>readJSON(ID_KEY,{first:"",last:"",period:""});
  const saveIdentity=x=>localStorage.setItem(ID_KEY,JSON.stringify(x));
  const xpFor=entries=>Number(entries)>=4?50:Number(entries)>=2?25:10;
  function collect(){
    const topicData={}; let inferred=null;
    Object.keys(localStorage).filter(k=>k.startsWith("fontaineHub:")).forEach(key=>{
      const id=key.split(":")[1], all=readJSON(key,{}); topicData[id]=topicData[id]||{missions:new Map(),weekly:0};
      Object.entries(all).forEach(([week,data])=>{
        if(data?.profile?.first) inferred=data.profile;
        Object.entries(data?.completions||{}).forEach(([missionId,item])=>{
          topicData[id].missions.set(missionId,item);
          if(week===weekKey()) topicData[id].weekly+=Number(item.entries||0);
        });
      });
    });
    const legacy=readJSON("fontaineMissionNetwork:v1",{});
    if(legacy.profile?.first) inferred=legacy.profile;
    const branding={missions:new Map(),weekly:0};
    Object.entries(legacy.completions||{}).forEach(([week,missions])=>Object.entries(missions||{}).forEach(([missionId,item])=>{branding.missions.set(missionId,item);if(week===weekKey())branding.weekly+=Number(item.entries||0);}));
    if(branding.missions.size) topicData.branding=branding;
    const master=readJSON("fontaineMissionNetwork:profiles:v1",{});
    Object.values(master.profiles||{}).forEach(profile=>{
      if(profile?.profile?.first) inferred=profile.profile;
      Object.entries(profile?.completions||{}).forEach(([week,missions])=>Object.entries(missions||{}).forEach(([missionId,item])=>{branding.missions.set(missionId,item);if(week===weekKey())branding.weekly+=Number(item.entries||0);}));
    });
    if(branding.missions.size) topicData.branding=branding;
    const unique=new Map(); Object.entries(topicData).forEach(([topic,data])=>data.missions.forEach((item,id)=>unique.set(`${topic}:${id}`,{...item,topic,id})));
    const xp=[...unique.values()].reduce((sum,item)=>sum+xpFor(item.entries),0);
    const weekly=Math.min(10,Object.values(topicData).reduce((sum,x)=>sum+x.weekly,0));
    return {topicData,unique,xp,weekly,inferred};
  }
  function rankFor(xp){return [...RANKS].reverse().find(r=>xp>=r.xp)||RANKS[0];}
  function nextRank(xp){return RANKS.find(r=>xp<r.xp)||null;}
  function codeFor(identity){if(!identity.first||!identity.last||!identity.period)return"NOT-SET";const base=`${identity.first[0]}${identity.last}${identity.period}`.toUpperCase();let hash=0;for(const c of `${identity.first}${identity.last}${identity.period}`)hash=(hash*31+c.charCodeAt(0))%9999;return `FMN-${base}-${String(hash).padStart(4,"0")}`;}
  function badges(data){
    const count=data.unique.size,topics=Object.keys(data.topicData).filter(k=>data.topicData[k].missions.size).length,agency=data.topicData.agency?.missions.size||0;
    return [
      {icon:"🚀",name:"First Mission",desc:"Complete your first mission.",on:count>=1},
      {icon:"⚡",name:"Mission Streak",desc:"Complete five missions.",on:count>=5},
      {icon:"🏆",name:"Ten Deep",desc:"Complete ten missions.",on:count>=10},
      {icon:"🧭",name:"Explorer",desc:"Complete work in three departments.",on:topics>=3},
      {icon:"💼",name:"Agency Rookie",desc:"Complete your first client project.",on:agency>=1},
      {icon:"🌐",name:"Networked",desc:"Complete work in all five departments plus the agency.",on:topics>=6},
      {icon:"🧠",name:"Strategy Mind",desc:"Reach 175 XP.",on:data.xp>=175},
      {icon:"🎯",name:"Focused Marketer",desc:"Reach 325 XP.",on:data.xp>=325},
      {icon:"👑",name:"Industry Legend",desc:"Reach 1,200 XP.",on:data.xp>=1200}
    ];
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
    document.getElementById("topicProgress").innerHTML=Object.entries(TOPICS).map(([id,title])=>{const d=data.topicData[id],count=d?.missions.size||0;return `<article class="topic-progress-card"><h3>${title}</h3><p>${count} ${id==="agency"?(count===1?"client project":"client projects"):(count===1?"mission":"missions")} completed</p><div class="entry-meter"><i style="width:${Math.min(100,count/10*100)}%"></i></div></article>`;}).join("");
  }
  const modal=document.getElementById("identityModal");
  function open(){const i=getIdentity();document.getElementById("idFirst").value=i.first||"";document.getElementById("idLast").value=i.last||"";document.getElementById("idPeriod").value=i.period||"";modal.hidden=false;document.body.style.overflow="hidden";}
  function close(){modal.hidden=true;document.body.style.overflow="";}
  document.getElementById("editIdentity").addEventListener("click",open);
  document.querySelectorAll("[data-close-id]").forEach(x=>x.addEventListener("click",close));
  document.getElementById("identityForm").addEventListener("submit",e=>{e.preventDefault();saveIdentity({first:document.getElementById("idFirst").value.trim(),last:document.getElementById("idLast").value.trim().slice(0,1).toUpperCase(),period:document.getElementById("idPeriod").value});close();render();});
  render();
})();
