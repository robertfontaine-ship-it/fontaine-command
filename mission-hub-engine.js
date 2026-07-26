(() => {
  "use strict";
  const config = window.HUB_CONFIG;
  if (!config) return;
  const CAP = 10;
  const weekKey = () => {
    const d = new Date(); const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  };
  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const storeKey = `fontaineHub:${config.id}:v1`;
  const read = () => { try { return JSON.parse(localStorage.getItem(storeKey) || "{}") || {}; } catch { return {}; } };
  const write = value => localStorage.setItem(storeKey, JSON.stringify(value));
  const current = () => read()[weekKey()] || { profile:{first:"",last:"",period:""}, completions:{} };
  const entries = data => Math.min(CAP, Object.values(data.completions || {}).reduce((s,x)=>s+Number(x.entries||0),0));
  let filter = "All", active = null, receiptText = "";

  function renderCards(){
    const target=document.getElementById("missionGrid"); if(!target)return;
    const data=current();
    target.innerHTML=config.missions.filter(m=>filter==="All"||m.level===filter).map(m=>{
      const done=Boolean(data.completions[m.id]);
      return `<article class="mission-card ${done?"complete":""}"><span class="level-badge ${m.level.toLowerCase()}">${m.level} Mission</span><h3>${m.id} — ${esc(m.title)}</h3><p>${esc(m.brief)}</p><div class="mission-details"><span>${m.minutes} minutes</span><span>${m.entries} ${m.entries===1?"entry":"entries"}</span></div><ul>${m.outcomes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><button class="mission-button ${done?"secondary":"primary"}" data-mission-id="${m.id}">${done?"Review or improve":"Start mission"}</button></article>`;
    }).join("");
  }
  function renderProgress(){
    const data=current(), total=entries(data);
    document.getElementById("entryCount").textContent=total;
    document.getElementById("missionCount").textContent=Object.keys(data.completions||{}).length;
    document.getElementById("entryMeter").style.width=`${total/CAP*100}%`;
    document.getElementById("weekLabel").textContent=`Week of ${new Date(weekKey()+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})}`;
  }
  function openMission(id){
    const m=config.missions.find(x=>x.id===id); if(!m)return; active=id;
    const data=current(), prior=data.completions[id];
    document.getElementById("missionFormView").hidden=false; document.getElementById("receiptView").hidden=true;
    document.getElementById("modalLevel").textContent=`${m.level} Mission • ${m.minutes} minutes • ${m.entries} ${m.entries===1?"entry":"entries"}`;
    document.getElementById("modalTitle").textContent=`${m.id} — ${m.title}`;
    document.getElementById("modalBrief").textContent=m.brief;
    document.getElementById("studentFirst").value=data.profile.first||"";
    document.getElementById("studentLast").value=data.profile.last||"";
    document.getElementById("studentPeriod").value=data.profile.period||"";
    document.getElementById("integrityCheck").checked=false;
    document.getElementById("promptFields").innerHTML=`<div class="briefing-callout"><strong>Complete every step:</strong> Give specific examples, explain your reasoning, and connect decisions to a target customer. One-word answers do not qualify.</div>`+m.prompts.map((p,i)=>`<label>Step ${i+1}: ${esc(p)}<textarea required minlength="20" data-response="${i}" placeholder="Write a complete response with evidence and explanation.">${esc(prior?.responses?.[i]||"")}</textarea></label>`).join("");
    document.getElementById("missionModal").hidden=false; document.body.style.overflow="hidden";
  }
  function close(){ document.getElementById("missionModal").hidden=true; document.body.style.overflow=""; active=null; }
  function submit(e){
    e.preventDefault(); const m=config.missions.find(x=>x.id===active); if(!m)return;
    const first=document.getElementById("studentFirst").value.trim(), last=document.getElementById("studentLast").value.trim().slice(0,1).toUpperCase(), period=document.getElementById("studentPeriod").value;
    const responses=[...document.querySelectorAll("[data-response]")].map(x=>x.value.trim());
    if(!first||!last||!period||responses.some(x=>x.length<20))return;
    const all=read(), week=weekKey(), data=all[week]||{profile:{},completions:{}};
    const previous=data.completions[m.id], available=Math.max(0,CAP-entries(data)+(previous?Number(previous.entries||0):0));
    const earned=previous?Number(previous.entries||0):Math.min(m.entries,available);
    const code=previous?.code||`${m.id}-${week.replaceAll("-","").slice(4)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    data.profile={first,last,period}; data.completions[m.id]={code,entries:earned,responses,submittedAt:new Date().toISOString()}; all[week]=data; write(all);
    receiptText=["FONTAINE MISSION RECEIPT",`Student: ${first} ${last}.`,`Period: ${period}`,`Topic: ${config.title}`,`Mission: ${m.id} — ${m.title}`,`Provisional entries: ${earned}`,`Receipt code: ${code}`,"Next step: Show this receipt to your teacher or paste it into the assigned location. Entries count only after teacher approval."].join("\n");
    document.getElementById("missionFormView").hidden=true; document.getElementById("receiptView").hidden=false;
    document.getElementById("receiptCard").innerHTML=`<dl><dt>Student</dt><dd>${esc(first)} ${esc(last)}.</dd><dt>Period</dt><dd>${esc(period)}</dd><dt>Topic</dt><dd>${esc(config.title)}</dd><dt>Mission</dt><dd>${m.id} — ${esc(m.title)}</dd><dt>Entries</dt><dd>${earned} provisional</dd><dt>Receipt code</dt><dd>${esc(code)}</dd><dt>Next step</dt><dd>Show or submit this receipt for teacher approval.</dd></dl>`;
    renderCards(); renderProgress();
  }
  async function copyReceipt(){ try{await navigator.clipboard.writeText(receiptText); document.getElementById("copyReceipt").textContent="Receipt copied";}catch{window.prompt("Copy your receipt:",receiptText);} }
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderCards();}));
  document.getElementById("missionGrid")?.addEventListener("click",e=>{const b=e.target.closest("[data-mission-id]");if(b)openMission(b.dataset.missionId);});
  document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",close));
  document.getElementById("missionForm")?.addEventListener("submit",submit);
  document.getElementById("copyReceipt")?.addEventListener("click",copyReceipt);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  renderCards(); renderProgress();
})();