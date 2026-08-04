(() => {
  "use strict";

  const missionStore = window.FontaineMissionStore;
  const autosaveFactory = window.FontaineMissionAutosave;
  if (!missionStore) return;
  const PROJECT_XP = 50;
  const PROJECT_ENTRIES = 4;

  const roles = [
    { id:"account", icon:"🤝", name:"Account Executive", focus:"Client communication, priorities, timelines, and final recommendations.", skills:["Leadership","Communication","Project management"], deliverable:"Write the final client recommendation, organize the project, and explain how the solution meets the brief." },
    { id:"research", icon:"🔎", name:"Market Research Analyst", focus:"Audience evidence, competitor research, trends, and customer insight.", skills:["Research","Segmentation","Evidence"], deliverable:"Build an evidence-based audience and competitor insight report that guides the team’s decisions." },
    { id:"brand", icon:"🧭", name:"Brand Strategist", focus:"Positioning, promise, personality, identity, and consistency.", skills:["Branding","Positioning","Strategy"], deliverable:"Define the brand position, promise, personality, and identity choices for the client solution." },
    { id:"creative", icon:"✦", name:"Creative Director", focus:"Campaign concept, message, visuals, content, and customer experience.", skills:["Creative concept","Messaging","Design direction"], deliverable:"Create the campaign concept, headline, visual direction, and two sample executions." },
    { id:"partnerships", icon:"📣", name:"Partnerships & Sales Lead", focus:"Sponsors, influencers, outreach, value propositions, and activation ideas.", skills:["Selling","Partnerships","Promotion"], deliverable:"Build the partnership or sales approach, including the value proposition, outreach message, and activation idea." },
    { id:"analytics", icon:"📊", name:"Analytics Manager", focus:"Goals, KPIs, budget choices, forecasts, and measurement.", skills:["KPIs","Budgeting","Evaluation"], deliverable:"Set measurable objectives, select KPIs, create a simple budget allocation, and explain how results will be judged." }
  ];

  const briefs = [
    { id:"WA-01", category:"School", client:"Woodside Student Organization", title:"New Club Launch", summary:"A student organization needs a launch campaign that earns attention, explains its purpose, and recruits its first members.", audience:"Woodside students who do not already know the organization", problem:"Low awareness and no established identity", constraints:"School-appropriate, low-cost, launchable within two weeks", required:"Audience insight, positioning, launch idea, three promotional touchpoints, and success metrics", prompts:["Define the target student and the main reason that student would join.","Write the clearest one-sentence position or promise for the organization.","Create a launch concept with a campaign name, headline, and call to action.","Recommend three promotional touchpoints and explain the job of each one.","Set two measurable launch goals and explain how the client should track them."] },
    { id:"WA-02", category:"School", client:"Woodside Event Team", title:"Friday Night Fan Boost", summary:"A school sports, performance, or entertainment event needs a campaign that increases attendance and makes the experience feel worth showing up for.", audience:"Students, families, alumni, and nearby community members", problem:"Weak advance buzz and inconsistent attendance", constraints:"One-week campaign, limited budget, school-approved channels", required:"Event positioning, audience priority, promotional mix, experience upgrade, and measurement plan", prompts:["Choose the event and identify the primary audience segment the campaign should prioritize.","Explain the strongest reason that audience should attend instead of doing something else.","Create a campaign theme, headline, and short social caption.","Build a five-day promotional mix using at least three different promotion methods.","Recommend one on-site experience upgrade and three KPIs for evaluating the campaign."] },
    { id:"WA-03", category:"Business", client:"Wolverine School Store", title:"School Store Rebrand", summary:"The school store feels forgettable and needs a sharper identity, better product focus, and stronger reasons for students to visit.", audience:"Students, staff, families, and school supporters", problem:"Low differentiation and unclear product strategy", constraints:"Affordable products, school spirit, limited space", required:"Brand audit, target segment, identity direction, product recommendation, and launch promotion", prompts:["Describe the store’s likely current image and identify the biggest brand weakness.","Choose one primary target segment and explain what that group values.","Create a new store name or campaign identity, slogan, personality, and visual direction.","Recommend three priority products or services and explain why they fit the target segment.","Design a relaunch promotion and identify two ways to measure whether the rebrand works."] },
    { id:"WA-04", category:"Community", client:"Community Improvement Group", title:"Donation Campaign", summary:"A community organization needs a credible campaign to raise money for a visible local improvement without sounding vague or desperate.", audience:"Residents, local businesses, families, and community supporters", problem:"People agree with the cause but have not been motivated to donate", constraints:"Low-cost campaign, transparent message, realistic goal", required:"Donor segments, value proposition, campaign story, outreach plan, and trust signals", prompts:["Define the improvement being funded and the specific outcome donations will create.","Identify two donor segments and explain what would motivate each segment.","Create a campaign name, core message, and three donation levels with meaningful labels.","Write one direct outreach message and recommend three campaign channels.","Explain how the organization will build trust, report progress, and thank supporters."] },
    { id:"WA-05", category:"Business", client:"Local Small Business", title:"Business Emergency Room", summary:"A small business has a good product but declining traffic, weak promotion, and no clear reason for customers to choose it over competitors.", audience:"A specific local customer segment selected by the agency", problem:"Low traffic and weak differentiation", constraints:"Thirty-day rescue plan and modest budget", required:"Diagnosis, target market, offer strategy, campaign plan, and performance dashboard", prompts:["Choose a type of local business and diagnose three likely causes of declining traffic.","Define the target customer and identify the most important unmet need or frustration.","Recommend one product, price, place, or service change that would strengthen the offer.","Create a thirty-day promotional plan with a campaign concept and four actions.","Set a simple dashboard with four KPIs and a decision rule for what the owner should do next."] },
    { id:"WA-06", category:"Creator", client:"Emerging Student Creator", title:"Influencer Partnership Kit", summary:"An emerging creator needs a focused personal brand and a professional partnership pitch that attracts appropriate sponsors.", audience:"A defined follower community and potential brand partners", problem:"Inconsistent identity and no clear sponsor value", constraints:"Authentic, age-appropriate, and realistic for a small creator", required:"Creator positioning, content pillars, partner fit, media-kit copy, and campaign concept", prompts:["Define the creator’s niche, target follower, personality, and one-sentence promise.","Create three repeatable content pillars and explain the role of each one.","Choose one realistic brand partner and score the fit on audience, values, credibility, and risk.","Write the creator’s short media-kit introduction and a partnership outreach message.","Design one sponsored content idea and identify three results both sides should measure."] }
  ];

  const escapeText = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const getStore = () => {
    const profile = missionStore.getActiveProfile();
    const role = missionStore.getAgencyRole({ profile });
    const history = missionStore.getTopicHistory("agency", { profile });
    return {
      profile: { ...profile, role },
      completions: Object.fromEntries(history.map(item => [item.missionId, item]))
    };
  };
  const roleById = id => roles.find(role => role.id === id);
  const briefById = id => briefs.find(brief => brief.id === id);
  let activeFilter = "All";
  let activeBriefId = null;
  let lastReceipt = "";
  let lastReviewPacket = "";
  let autosave = null;

  function inferIdentity(store) {
    return store;
  }

  function renderStatus() {
    const store = inferIdentity(getStore());
    const completed = Object.values(store.completions || {});
    document.getElementById("agencyStudent").textContent = store.profile.first ? `${store.profile.first} ${store.profile.last}. • Period ${store.profile.period}` : "Profile not set";
    document.getElementById("agencyRole").textContent = roleById(store.profile.role)?.name || "No role selected";
    document.getElementById("agencyProjects").textContent = String(completed.length);
    document.getElementById("agencyXp").textContent = String(completed.length * PROJECT_XP);
  }

  function renderRoles() {
    const selected = getStore().profile.role;
    document.getElementById("agencyRoleGrid").innerHTML = roles.map(role => `<article class="agency-role-card ${selected===role.id?"selected":""}">
      <div class="agency-role-icon">${role.icon}</div><h3>${escapeText(role.name)}</h3><p>${escapeText(role.focus)}</p>
      <div class="agency-role-meta">${role.skills.map(skill=>`<span>${escapeText(skill)}</span>`).join("")}</div>
      <button class="mission-button ${selected===role.id?"secondary":"primary"}" type="button" data-role-id="${role.id}">${selected===role.id?"Current role":"Choose this role"}</button>
    </article>`).join("");
  }

  function renderBriefs() {
    const completions = getStore().completions || {};
    const visible = briefs.filter(brief => activeFilter === "All" || brief.category === activeFilter);
    document.getElementById("agencyBriefGrid").innerHTML = visible.map(brief => `<article class="agency-brief-card ${completions[brief.id]?"complete":""}">
      <div class="agency-client-name">${escapeText(brief.client)}</div><h3>${brief.id} — ${escapeText(brief.title)}</h3><p>${escapeText(brief.summary)}</p>
      <div class="agency-brief-meta"><span>${escapeText(brief.category)} client</span><span>30–45 minutes</span><span>50 XP</span><span>4 provisional entries</span></div>
      <button class="mission-button ${completions[brief.id]?"secondary":"primary"}" type="button" data-brief-id="${brief.id}">${completions[brief.id]?"View or revise project":"Accept client brief"}</button>
    </article>`).join("");
  }

  function renderHistory() {
    const completed = Object.values(getStore().completions || {}).sort((a,b)=>String(b.completedAt).localeCompare(String(a.completedAt)));
    document.getElementById("agencyHistory").innerHTML = completed.length ? completed.map(item=>`<article><div><h3>${escapeText(item.id)} — ${escapeText(item.title)}</h3><p>${escapeText(item.roleName)} • ${escapeText(item.client)}</p></div><time>${new Date(item.completedAt).toLocaleDateString()}</time></article>`).join("") : `<div class="agency-empty">No completed client projects yet. Choose a role and accept your first brief.</div>`;
  }

  function openProfile(preferredRole="") {
    const store = inferIdentity(getStore());
    document.getElementById("agencyFirst").value = store.profile.first || "";
    document.getElementById("agencyLast").value = store.profile.last || "";
    document.getElementById("agencyPeriod").value = store.profile.period || "";
    document.getElementById("agencyRoleSelect").innerHTML = `<option value="">Select a role</option>${roles.map(role=>`<option value="${role.id}" ${(preferredRole||store.profile.role)===role.id?"selected":""}>${escapeText(role.name)}</option>`).join("")}`;
    document.getElementById("agencyProfileModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeProfile() { document.getElementById("agencyProfileModal").hidden = true; document.body.style.overflow = ""; }

  function agencyDraftId(briefId, roleId) { return `${briefId}:${roleId}`; }

  function agencyAnswers() {
    return [...document.querySelectorAll("[data-agency-answer]")].map(field => field.value);
  }

  function ensureAgencyDraftStatus(form) {
    let status = form.querySelector("[data-draft-status]");
    if (status) return status;
    status = document.createElement("div");
    status.className = "draft-status";
    status.dataset.draftStatus = "";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.querySelector(".agency-role-banner")?.insertAdjacentElement("afterend", status);
    return status;
  }

  function startAgencyAutosave(brief, role, recoveredDraft = null) {
    const form = document.getElementById("agencyProjectForm");
    autosave?.dispose();
    autosave = autosaveFactory?.create({
      form,
      status: ensureAgencyDraftStatus(form),
      topic: "agency",
      missionId: agencyDraftId(brief.id, role.id),
      title: `${brief.title} — ${role.name}`,
      getProfile: () => getStore().profile,
      readValues: () => ({ roleId: role.id, answers: agencyAnswers() }),
      recoveredDraft
    }) || null;
  }

  function openProject(id) {
    const store = inferIdentity(getStore());
    if (!store.profile.first || !store.profile.role) { openProfile(); return; }
    const brief = briefById(id), role = roleById(store.profile.role), prior = store.completions[id];
    if (!brief || !role) return;
    const draft = missionStore.getDraft("agency", agencyDraftId(id, role.id), { profile: store.profile });
    const priorTime = Date.parse(prior?.submittedAt || prior?.completedAt || "") || 0;
    const recoveredDraft = draft && ((Date.parse(draft.updatedAt) || 0) > priorTime) ? draft : null;
    if (draft && !recoveredDraft) missionStore.deleteDraft("agency", agencyDraftId(id, role.id), { profile: store.profile });
    const answers = recoveredDraft?.values?.answers || prior?.answers || [];
    activeBriefId = id;
    document.getElementById("agencyProjectFormView").hidden = false;
    document.getElementById("agencyReceiptView").hidden = true;
    document.getElementById("agencyProjectCategory").textContent = `${brief.category} Client • ${brief.client}`;
    document.getElementById("agencyProjectTitle").textContent = `${brief.id} — ${brief.title}`;
    document.getElementById("agencyProjectSummary").textContent = brief.summary;
    document.getElementById("agencyProjectFacts").innerHTML = `<div><strong>Target audience</strong><span>${escapeText(brief.audience)}</span></div><div><strong>Client problem</strong><span>${escapeText(brief.problem)}</span></div><div><strong>Constraints</strong><span>${escapeText(brief.constraints)}</span></div><div><strong>Required work</strong><span>${escapeText(brief.required)}</span></div>`;
    document.getElementById("agencyRoleBanner").innerHTML = `<strong>Your role: ${escapeText(role.name)}</strong><p>${escapeText(role.deliverable)}</p>`;
    const prompts = [...brief.prompts, `ROLE DELIVERABLE — ${role.deliverable}`];
    document.getElementById("agencyPromptFields").innerHTML = prompts.map((prompt,index)=>`<label>${index+1}. ${escapeText(prompt)}<textarea rows="5" minlength="40" data-agency-answer="${index}" required placeholder="Write a specific response with evidence, reasoning, and client fit.">${escapeText(answers[index]||"")}</textarea></label>`).join("");
    document.getElementById("agencyIntegrity").checked = false;
    document.getElementById("agencyProjectModal").hidden = false;
    document.body.style.overflow = "hidden";
    startAgencyAutosave(brief, role, recoveredDraft);
  }

  function closeProject() {
    autosave?.dispose();
    autosave = null;
    document.getElementById("agencyProjectModal").hidden = true;
    document.body.style.overflow = "";
  }

  function buildReceipt(brief, role, profile, answers, saved) {
    const capNote = saved.entries < PROJECT_ENTRIES
      ? ["Weekly cap note: The project is complete, but only the remaining weekly entries were added."]
      : [];
    const lines = [
      "WOLVERINE MARKETING AGENCY — CLIENT REVIEW PACKET",
      `Project: ${brief.id} — ${brief.title}`,
      `Client: ${brief.client}`,
      `Student: ${profile.first} ${profile.last}.`,
      `Period: ${profile.period}`,
      `Agency Role: ${role.name}`,
      `Completed: ${new Date().toLocaleString()}`,
      `Reward: ${saved.xp} XP + ${saved.entries} provisional weekly ${saved.entries === 1 ? "entry" : "entries"}`,
      `Receipt code: ${saved.code}`,
      ...capNote,
      "",
      ...answers.flatMap((answer,index)=>[`RESPONSE ${index+1}`, brief.prompts[index] || `Role deliverable — ${role.deliverable}`, answer, ""]),
      "APPROVAL NOTE",
      "Teacher/client verifies originality, completion, evidence, and fit with the brief before awarding entries or project credit."
    ];
    return lines.join("\n");
  }

  function encodeReviewPacket(brief, profile, answers, saved) {
    const payload = {
      version: 1,
      student: `${profile.first} ${profile.last}.`,
      first: profile.first,
      last: profile.last,
      period: profile.period,
      topic: "Wolverine Agency",
      mission: `${brief.id} — ${brief.title}`,
      receiptCode: saved.code,
      provisionalEntries: Number(saved.entries || 0),
      responses: answers.map((response, index) => ({ step: index + 1, response })),
      submittedAt: saved.submittedAt
    };
    return `FMN-REVIEW:${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
  }

  document.getElementById("agencyProfileForm").addEventListener("submit", event => {
    event.preventDefault();
    const profile = missionStore.setActiveProfile({
      first:document.getElementById("agencyFirst").value.trim(),
      last:document.getElementById("agencyLast").value.trim().slice(0,1).toUpperCase(),
      period:document.getElementById("agencyPeriod").value
    });
    missionStore.setAgencyRole(document.getElementById("agencyRoleSelect").value, { profile });
    closeProfile(); renderAll();
  });

  document.getElementById("agencyProjectForm").addEventListener("submit", event => {
    event.preventDefault();
    const store = getStore(), brief = briefById(activeBriefId), role = roleById(store.profile.role);
    if (!brief || !role) return;
    const answers = agencyAnswers().map(value=>value.trim());
    if (answers.some(answer => answer.length < 40)) return;
    const previous = store.completions[brief.id];
    const code = previous?.code || `${brief.id}-${missionStore.getWeekKey().replaceAll("-","").slice(4)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    const item = { id:brief.id, code, title:brief.title, client:brief.client, category:brief.category, role:role.id, roleName:role.name, answers, completedAt:new Date().toISOString(), entries:PROJECT_ENTRIES };
    const saved = missionStore.saveCompletion({ topic:"agency", missionId:brief.id, profile:store.profile, item, requestedEntries:PROJECT_ENTRIES, xp:PROJECT_XP }).item;
    autosave?.clear();
    autosave?.dispose({save:false});
    autosave = null;
    lastReceipt = buildReceipt(brief,role,store.profile,answers,saved);
    lastReviewPacket = encodeReviewPacket(brief,store.profile,answers,saved);
    document.getElementById("agencyReceiptText").textContent = lastReceipt;
    document.getElementById("agencyProjectFormView").hidden = true;
    document.getElementById("agencyReceiptView").hidden = false;
    renderAll();
  });

  document.addEventListener("click", event => {
    const roleButton = event.target.closest("[data-role-id]");
    if (roleButton) openProfile(roleButton.dataset.roleId);
    const briefButton = event.target.closest("[data-brief-id]");
    if (briefButton) openProject(briefButton.dataset.briefId);
    const filter = event.target.closest("[data-agency-filter]");
    if (filter) {
      activeFilter = filter.dataset.agencyFilter;
      document.querySelectorAll("[data-agency-filter]").forEach(button=>button.classList.toggle("active",button===filter));
      renderBriefs();
    }
  });

  document.getElementById("editAgencyProfile").addEventListener("click",()=>openProfile());
  document.querySelectorAll("[data-close-agency-profile]").forEach(element=>element.addEventListener("click",closeProfile));
  document.querySelectorAll("[data-close-agency-project]").forEach(element=>element.addEventListener("click",closeProject));
  document.getElementById("copyAgencyReceipt").addEventListener("click",async()=>{
    try { await navigator.clipboard.writeText(lastReceipt); document.getElementById("copyAgencyReceipt").textContent="Copied"; }
    catch { window.prompt("Copy the review packet:",lastReceipt); }
  });
  document.getElementById("copyAgencyTeacherPacket").addEventListener("click",async()=>{
    try { await navigator.clipboard.writeText(lastReviewPacket); document.getElementById("copyAgencyTeacherPacket").textContent="Teacher submission copied"; }
    catch { window.prompt("Copy this teacher submission:",lastReviewPacket); }
  });
  document.getElementById("reviseAgencyProject").addEventListener("click",()=>{
    document.getElementById("agencyProjectFormView").hidden=false;
    document.getElementById("agencyReceiptView").hidden=true;
    const store=getStore(), brief=briefById(activeBriefId), role=roleById(store.profile.role);
    if(brief&&role)startAgencyAutosave(brief,role);
  });

  function renderAll(){ renderStatus(); renderRoles(); renderBriefs(); renderHistory(); }
  renderAll();
})();
