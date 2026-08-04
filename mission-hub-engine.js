(() => {
  "use strict";
  const config = window.HUB_CONFIG;
  const store = window.FontaineMissionStore;
  const autosaveFactory = window.FontaineMissionAutosave;
  if (!config || !store) return;
  const CAP = store.WEEKLY_ENTRY_CAP;
  const weekKey = store.getWeekKey;
  const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const current = () => ({
    profile: store.getActiveProfile(),
    completions: store.getTopicCompletions(config.id)
  });
  let filter = "All", active = null, receiptText = "", autosave = null;

  function addMissionIdLink(){
    const nav=document.querySelector(".mission-nav");
    if(nav&&!nav.querySelector('[href="student-mission-id.html"]')){
      const link=document.createElement("a"); link.href="student-mission-id.html"; link.textContent="My Mission ID"; nav.appendChild(link);
    }
  }
  function savedIdentity(){ return store.getActiveProfile(); }
  function saveIdentity(profile){ return store.setActiveProfile(profile); }
  function profileFromForm(){
    return {
      first:document.getElementById("studentFirst").value.trim(),
      last:document.getElementById("studentLast").value.trim().slice(0,1).toUpperCase(),
      period:document.getElementById("studentPeriod").value
    };
  }
  function responsesFromForm(){
    return [...document.querySelectorAll("[data-response]")].map(field=>field.value);
  }
  function draftStatus(form){
    let status=form.querySelector("[data-draft-status]");
    if(status)return status;
    status=document.createElement("div");
    status.className="draft-status";
    status.dataset.draftStatus="";
    status.setAttribute("role","status");
    status.setAttribute("aria-live","polite");
    form.querySelector(".profile-fields")?.insertAdjacentElement("afterend",status);
    return status;
  }

  function renderCards(){
    const target=document.getElementById("missionGrid"); if(!target)return;
    const data=current();
    target.innerHTML=config.missions.filter(m=>filter==="All"||m.level===filter).map(m=>{
      const done=Boolean(data.completions[m.id]);
      return `<article class="mission-card ${done?"complete":""}"><span class="level-badge ${m.level.toLowerCase()}">${m.level} Mission</span><h3>${m.id} — ${esc(m.title)}</h3><p>${esc(m.brief)}</p><div class="mission-details"><span>${m.minutes} minutes</span><span>${m.entries} ${m.entries===1?"entry":"entries"}</span></div><ul>${m.outcomes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><button class="mission-button ${done?"secondary":"primary"}" data-mission-id="${m.id}">${done?"Review or improve":"Start mission"}</button></article>`;
    }).join("");
  }
  function renderProgress(){
    const data=current(), total=store.weeklyEntrySummary().total;
    document.getElementById("entryCount").textContent=total;
    document.getElementById("missionCount").textContent=Object.keys(data.completions||{}).length;
    document.getElementById("entryMeter").style.width=`${total/CAP*100}%`;
    document.getElementById("weekLabel").textContent=`Week of ${new Date(weekKey()+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"})}`;
  }
  function openMission(id){
    const m=config.missions.find(x=>x.id===id); if(!m)return; active=id;
    autosave?.dispose();
    const data=current(), prior=data.completions[id], identity=savedIdentity();
    const profile=data.profile.first?data.profile:identity;
    const draft=store.getDraft(config.id,id,{profile});
    const priorTime=Date.parse(prior?.submittedAt||prior?.completedAt||"")||0;
    const recoveredDraft=draft&&((Date.parse(draft.updatedAt)||0)>priorTime)?draft:null;
    if(draft&&!recoveredDraft)store.deleteDraft(config.id,id,{profile});
    const responses=recoveredDraft?.values?.responses||prior?.responses||[];
    document.getElementById("missionFormView").hidden=false; document.getElementById("receiptView").hidden=true;
    document.getElementById("modalLevel").textContent=`${m.level} Mission • ${m.minutes} minutes • ${m.entries} ${m.entries===1?"entry":"entries"}`;
    document.getElementById("modalTitle").textContent=`${m.id} — ${m.title}`;
    document.getElementById("modalBrief").textContent=m.brief;
    document.getElementById("studentFirst").value=data.profile.first||identity.first||"";
    document.getElementById("studentLast").value=data.profile.last||identity.last||"";
    document.getElementById("studentPeriod").value=data.profile.period||identity.period||"";
    document.getElementById("integrityCheck").checked=false;
    document.getElementById("promptFields").innerHTML=`<div class="briefing-callout"><strong>Complete every step:</strong> Give specific examples, explain your reasoning, and connect decisions to a target customer. One-word answers do not qualify.</div>`+m.prompts.map((p,i)=>`<label>Step ${i+1}: ${esc(p)}<textarea required minlength="20" data-response="${i}" placeholder="Write a complete response with evidence and explanation.">${esc(responses[i]||"")}</textarea></label>`).join("");
    document.getElementById("missionModal").hidden=false; document.body.style.overflow="hidden";
    const form=document.getElementById("missionForm");
    autosave=autosaveFactory?.create({
      form,
      status:draftStatus(form),
      topic:config.id,
      missionId:id,
      title:m.title,
      getProfile:profileFromForm,
      readValues:()=>({responses:responsesFromForm()}),
      recoveredDraft
    })||null;
  }
  function close(){
    autosave?.dispose(); autosave=null;
    document.getElementById("missionModal").hidden=true; document.body.style.overflow=""; active=null;
  }
  function submit(e){
    e.preventDefault(); const m=config.missions.find(x=>x.id===active); if(!m)return;
    const {first,last,period}=profileFromForm();
    const responses=responsesFromForm().map(value=>value.trim());
    if(!first||!last||!period||responses.some(x=>x.length<20))return;
    const week=weekKey();
    const profile=saveIdentity({first,last,period});
    const previous=store.getTopicCompletions(config.id,{profile})[m.id];
    const code=previous?.code||`${m.id}-${week.replaceAll("-","").slice(4)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    const saved=store.saveCompletion({
      topic:config.id,
      missionId:m.id,
      profile,
      requestedEntries:m.entries,
      xp:store.xpForEntries(m.entries),
      item:{code,responses,level:m.level,title:m.title,submittedAt:new Date().toISOString()}
    }).item;
    autosave?.clear(); autosave?.dispose({save:false}); autosave=null;
    const earned=Number(saved.entries||0);
    receiptText=["FONTAINE MISSION RECEIPT",`Student: ${first} ${last}.`,`Period: ${period}`,`Topic: ${config.title}`,`Mission: ${m.id} — ${m.title}`,`XP earned: ${saved.xp}`,`Provisional entries: ${earned}`,`Receipt code: ${code}`,earned<m.entries?"Weekly cap note: This mission is complete, but only the remaining weekly entries were added.":"","Next step: Show this receipt to your teacher or paste it into the assigned location. Entries count only after teacher approval."].filter(Boolean).join("\n");
    document.getElementById("missionFormView").hidden=true; document.getElementById("receiptView").hidden=false;
    document.getElementById("receiptCard").innerHTML=`<dl><dt>Student</dt><dd>${esc(first)} ${esc(last)}.</dd><dt>Period</dt><dd>${esc(period)}</dd><dt>Topic</dt><dd>${esc(config.title)}</dd><dt>Mission</dt><dd>${m.id} — ${esc(m.title)}</dd><dt>XP</dt><dd>${saved.xp} earned</dd><dt>Entries</dt><dd>${earned} provisional${earned<m.entries?" — weekly cap reached":""}</dd><dt>Receipt code</dt><dd>${esc(code)}</dd><dt>Next step</dt><dd>Show or submit this receipt for teacher approval.</dd></dl>`;
    renderCards(); renderProgress();
  }
  async function copyReceipt(){ try{await navigator.clipboard.writeText(receiptText); document.getElementById("copyReceipt").textContent="Receipt copied";}catch{window.prompt("Copy your receipt:",receiptText);} }
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderCards();}));
  document.getElementById("missionGrid")?.addEventListener("click",e=>{const b=e.target.closest("[data-mission-id]");if(b)openMission(b.dataset.missionId);});
  document.querySelectorAll("[data-close-modal]").forEach(x=>x.addEventListener("click",close));
  document.getElementById("missionForm")?.addEventListener("submit",submit);
  document.getElementById("copyReceipt")?.addEventListener("click",copyReceipt);
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  addMissionIdLink(); renderCards(); renderProgress();
})();
