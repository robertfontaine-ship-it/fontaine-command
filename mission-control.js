(() => {
  "use strict";
  const missionStore = window.FontaineMissionStore;
  if (!missionStore) return;
  const RANKS = [
    {name:"Marketing Rookie",xp:0},{name:"Campaign Specialist",xp:75},{name:"Brand Strategist",xp:175},
    {name:"Marketing Director",xp:325},{name:"Vice President",xp:525},{name:"Chief Marketing Officer",xp:800},{name:"Industry Legend",xp:1200}
  ];
  const TOPICS = {
    branding:{title:"Brand Studio",href:"branding-hub.html"},
    "target-market":{title:"Consumer Intelligence Center",href:"target-market-hub.html"},
    "four-ps":{title:"Strategy War Room",href:"four-ps-hub.html"},
    functions:{title:"Marketing Operations HQ",href:"marketing-functions-hub.html"},
    promotion:{title:"Campaign Command Center",href:"promotional-mix-hub.html"},
    "market-research":{title:"Market Research Lab",href:"market-research-hub.html"},
    agency:{title:"Wolverine Marketing Agency",href:"wolverine-agency.html"}
  };
  const DAILY = [
    {title:"Brand Detective",brief:"Choose a real brand and identify three clues that reveal its personality and target customer.",topic:"branding",level:"Quick Mission",minutes:"8–10 minutes"},
    {title:"Audience Undercover",brief:"Study one advertisement and build the most specific target-market profile the evidence supports.",topic:"target-market",level:"Quick Mission",minutes:"10 minutes"},
    {title:"Marketing Mix Repair",brief:"Find one Product, Price, Place, or Promotion decision that does not fit its customer and repair it.",topic:"four-ps",level:"Skill Mission",minutes:"15–20 minutes"},
    {title:"Department Breakdown",brief:"Choose a business action and explain which marketing functions must cooperate to make it work.",topic:"functions",level:"Skill Mission",minutes:"15–20 minutes"},
    {title:"Campaign Decision Room",brief:"Choose the best promotional tool for a specific audience, goal, message, and required action.",topic:"promotion",level:"Quick Mission",minutes:"10 minutes"},
    {title:"Evidence Reality Check",brief:"Audit one survey question, sample, or data claim and repair the research before it drives a bad decision.",topic:"market-research",level:"Quick Mission",minutes:"10 minutes"},
    {title:"Sunday Strategy Reset",brief:"Review your completed missions and choose the department where your next skill upgrade should happen.",topic:"branding",level:"Reflection",minutes:"5 minutes"}
  ];
  function collect(){
    const identity=missionStore.getActiveProfile();
    const missions=missionStore.getAllHistory({profile:identity}).sort((a,b)=>new Date(b.submittedAt||b.completedAt||0)-new Date(a.submittedAt||a.completedAt||0));
    const xp=missions.reduce((sum,item)=>sum+Number(item.xp??missionStore.xpForEntries(item.requestedEntries??item.entries)),0);
    const weekly=missionStore.weeklyEntrySummary({profile:identity}).total;
    const topics=new Set(missions.map(item=>item.topic));
    return {identity,missions,xp,weekly,topics};
  }
  const rankFor=xp=>[...RANKS].reverse().find(r=>xp>=r.xp)||RANKS[0];
  const nextRank=xp=>RANKS.find(r=>xp<r.xp)||null;
  function unlockedBadges(data){
    const badges=[];
    if(data.missions.length>=1)badges.push(["🚀","First Mission","Completed the first mission"]);
    if(data.missions.length>=5)badges.push(["⚡","Mission Streak","Completed five missions"]);
    if(data.missions.length>=10)badges.push(["🏆","Ten Deep","Completed ten missions"]);
    if(data.topics.size>=3)badges.push(["🧭","Explorer","Worked in three departments"]);
    if(data.topics.has("agency"))badges.push(["💼","Agency Rookie","Completed a client project"]);
    if(["branding","target-market","four-ps","functions","promotion","market-research"].every(topic=>data.topics.has(topic)))badges.push(["🌐","Networked","Worked in all six live departments"]);
    if(data.xp>=175)badges.push(["🧠","Strategy Mind","Reached Brand Strategist rank"]);
    return badges;
  }
  function render(){
    const data=collect(),rank=rankFor(data.xp),next=nextRank(data.xp),identity=data.identity;
    document.getElementById("mcWelcome").textContent=identity.first?`Welcome back, ${identity.first}.`:`Welcome to Mission Control.`;
    document.getElementById("mcSubhead").textContent=identity.first?`Period ${identity.period} • Your progress is active across every live department.`:"Open My Mission ID and set your name and period before beginning a mission.";
    document.getElementById("mcRank").textContent=rank.name;
    document.getElementById("mcXp").textContent=`${data.xp} XP`;
    document.getElementById("mcXpStat").textContent=data.xp;
    document.getElementById("mcMissionStat").textContent=data.missions.length;
    document.getElementById("mcEntryStat").textContent=data.weekly;
    document.getElementById("mcEntryLarge").textContent=data.weekly;
    const badges=unlockedBadges(data);
    document.getElementById("mcBadgeStat").textContent=badges.length;
    const prior=rank,span=next?next.xp-prior.xp:1,progress=next?Math.max(0,Math.min(100,(data.xp-prior.xp)/span*100)):100;
    document.getElementById("mcRankMeter").style.width=`${progress}%`;
    document.getElementById("mcNextRank").textContent=next?`${next.xp-data.xp} XP until ${next.name}.`:`Maximum reputation achieved.`;
    const recent=data.missions[0];
    if(recent){
      const department=TOPICS[recent.topic]||{title:"Marketing Department",href:"topic-hubs.html"};
      document.getElementById("currentMissionTitle").textContent=`${recent.id} • ${department.title}`;
      document.getElementById("currentMissionText").textContent="Your latest mission is saved. Reopen the department to review, revise, or start another challenge.";
      document.getElementById("currentMissionLink").href=department.href;
      document.getElementById("currentMissionLink").textContent="Return to department";
      document.getElementById("continueMission").href=department.href;
      document.getElementById("continueMission").textContent="Continue in department";
    }
    const daily=DAILY[(new Date().getDay()+6)%7],department=TOPICS[daily.topic];
    document.getElementById("dailyTitle").textContent=daily.title;
    document.getElementById("dailyBrief").textContent=daily.brief;
    document.getElementById("dailyMeta").innerHTML=`<span>${daily.level}</span><span>${daily.minutes}</span><span>${department.title}</span>`;
    document.getElementById("dailyLink").href=department.href;
    const badgeTarget=document.getElementById("mcBadges");
    badgeTarget.innerHTML=(badges.slice(-3).reverse().map(b=>`<div class="mc-badge"><span>${b[0]}</span><div><strong>${b[1]}</strong><small>${b[2]}</small></div></div>`).join(""))||`<p>Complete your first mission to unlock an achievement.</p>`;
  }
  window.addEventListener("storage",render);
  render();
})();
