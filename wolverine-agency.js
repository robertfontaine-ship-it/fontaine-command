(() => {
  "use strict";

  const missionStore = window.FontaineMissionStore;
  const autosaveFactory = window.FontaineMissionAutosave;
  const kit = window.FontaineAgencyKit;
  if (!missionStore || !kit) return;

  const PROJECT_XP = 50;
  const PROJECT_ENTRIES = 4;
  const roles = kit.roles;
  const briefs = kit.briefs;
  const escapeText = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const roleById = id => kit.roleById(id);
  const briefById = id => kit.briefById(id);

  let activeFilter = "All";
  let activeProjectId = null;
  let lastReceipt = "";
  let lastReviewPacket = "";
  let autosave = null;
  let pendingLaunch = null;

  function getStore() {
    const profile = missionStore.getActiveProfile();
    const role = missionStore.getAgencyRole({ profile });
    const history = missionStore.getTopicHistory("agency", { profile });
    return {
      profile: { ...profile, role },
      completions: Object.fromEntries(history.map(item => [item.missionId, item])),
      launches: missionStore.getAgencyLaunches({ profile })
    };
  }

  function roleForLaunch(launch, profile) {
    return roleById(launch.joinedRole || kit.memberForProfile(launch, profile)?.role || profile.role);
  }

  function projectById(id, store = getStore()) {
    const launch = store.launches.find(item => item.launchId === id);
    if (launch) {
      const role = roleForLaunch(launch, store.profile);
      return {
        missionId: launch.launchId,
        displayId: launch.launchId,
        launch,
        brief: launch.brief,
        role,
        promptRows: role ? kit.projectPrompts(launch, role) : []
      };
    }
    const brief = briefById(id);
    const role = roleById(store.profile.role);
    if (!brief) return null;
    return {
      missionId: brief.id,
      displayId: brief.id,
      launch: null,
      brief,
      role,
      promptRows: role ? [
        ...brief.prompts.map((prompt, index) => ({ kind:"client", label:`CLIENT DELIVERABLE ${index + 1} — ${prompt}` })),
        { kind:"role", label:`ROLE WORK ORDER — ${role.deliverable}` }
      ] : []
    };
  }

  function renderStatus() {
    const store = getStore();
    const completed = Object.values(store.completions || {});
    document.getElementById("agencyStudent").textContent = store.profile.first ? `${store.profile.first} ${store.profile.last}. • Period ${store.profile.period}` : "Profile not set";
    document.getElementById("agencyRole").textContent = roleById(store.profile.role)?.name || "No role selected";
    document.getElementById("agencyProjects").textContent = String(completed.length);
    document.getElementById("agencyXp").textContent = String(completed.reduce((sum, item) => sum + Number(item.xp || PROJECT_XP), 0));
  }

  function renderRoles() {
    const selected = getStore().profile.role;
    document.getElementById("agencyRoleGrid").innerHTML = roles.map(role => `<article class="agency-role-card ${selected === role.id ? "selected" : ""}">
      <div class="agency-role-icon">${role.icon}</div><h3>${escapeText(role.name)}</h3><p>${escapeText(role.focus)}</p>
      <div class="agency-role-meta">${role.skills.map(skill => `<span>${escapeText(skill)}</span>`).join("")}</div>
      <button class="mission-button ${selected === role.id ? "secondary" : "primary"}" type="button" data-role-id="${role.id}">${selected === role.id ? "Current role" : "Choose this role"}</button>
    </article>`).join("");
  }

  function renderAssignedProjects() {
    const store = getStore();
    const grid = document.getElementById("agencyAssignedGrid");
    if (!store.profile.first) {
      grid.innerHTML = `<div class="agency-empty">Set your Mission ID or open the project link from your teacher. <button class="mission-button secondary" type="button" data-join-agency-project>Join a project</button></div>`;
      return;
    }
    if (!store.launches.length) {
      grid.innerHTML = `<div class="agency-empty">No teacher-launched projects are connected to ${escapeText(store.profile.first)} ${escapeText(store.profile.last)}. yet. <button class="mission-button secondary" type="button" data-join-agency-project>Paste a project code</button></div>`;
      return;
    }
    grid.innerHTML = store.launches.map(launch => {
      const role = roleForLaunch(launch, store.profile);
      const completed = store.completions[launch.launchId];
      const due = launch.dueDate ? new Date(`${launch.dueDate}T12:00:00`).toLocaleDateString() : "No due date";
      const roster = launch.members.map(member => {
        const current = kit.memberForProfile(launch, store.profile);
        const isCurrent = current && current.first === member.first && current.last === member.last && current.period === member.period;
        return `<span class="${isCurrent ? "current" : ""}">${escapeText(member.first)} ${escapeText(member.last)}. — ${escapeText(roleById(member.role)?.name || member.role)}</span>`;
      }).join("");
      return `<article class="agency-assigned-card ${completed ? "complete" : ""}">
        <div class="agency-assigned-heading"><div><span class="agency-assigned-code">${escapeText(launch.launchId)}</span><h3>${escapeText(launch.brief.title)}</h3></div><span class="agency-assigned-status">${completed ? "Submitted" : "Ready"}</span></div>
        <p>${escapeText(launch.brief.summary)}</p>
        <div class="agency-assigned-facts"><span>${escapeText(launch.brief.client)}</span><span>Due ${escapeText(due)}</span><span>${launch.mode === "team" ? escapeText(launch.teamName) : "Individual"}</span><span>${escapeText(role?.name || "Choose role")}</span></div>
        ${roster ? `<div class="agency-team-roster" aria-label="Project team roster">${roster}</div>` : ""}
        <button class="mission-button ${completed ? "secondary" : "primary"}" type="button" data-project-id="${escapeText(launch.launchId)}">${completed ? "View or revise my packet" : "Open my work order"}</button>
      </article>`;
    }).join("");
  }

  function renderBriefs() {
    const completions = getStore().completions || {};
    const visible = briefs.filter(brief => activeFilter === "All" || brief.category === activeFilter);
    document.getElementById("agencyBriefGrid").innerHTML = visible.map(brief => `<article class="agency-brief-card ${completions[brief.id] ? "complete" : ""}">
      <div class="agency-client-name">${escapeText(brief.client)}</div><h3>${brief.id} — ${escapeText(brief.title)}</h3><p>${escapeText(brief.summary)}</p>
      <div class="agency-brief-meta"><span>${escapeText(brief.category)} client</span><span>30–45 minutes</span><span>50 XP</span><span>4 provisional entries</span></div>
      <button class="mission-button ${completions[brief.id] ? "secondary" : "primary"}" type="button" data-brief-id="${brief.id}">${completions[brief.id] ? "View or revise project" : "Accept client brief"}</button>
    </article>`).join("");
  }

  function renderHistory() {
    const completed = Object.values(getStore().completions || {}).sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)));
    document.getElementById("agencyHistory").innerHTML = completed.length ? completed.map(item => `<article><div><h3>${escapeText(item.id || item.missionId)} — ${escapeText(item.title)}</h3><p>${escapeText(item.roleName)} • ${escapeText(item.client)}${item.teamName ? ` • ${escapeText(item.teamName)}` : ""}</p></div><time>${new Date(item.completedAt).toLocaleDateString()}</time></article>`).join("") : `<div class="agency-empty">No completed client projects yet. Choose a role, join a teacher project, or accept an open brief.</div>`;
  }

  function openProfile(preferredRole = "") {
    const store = getStore();
    document.getElementById("agencyFirst").value = store.profile.first || "";
    document.getElementById("agencyLast").value = store.profile.last || "";
    document.getElementById("agencyPeriod").value = store.profile.period || "";
    document.getElementById("agencyRoleSelect").innerHTML = `<option value="">Select a role</option>${roles.map(role => `<option value="${role.id}" ${(preferredRole || store.profile.role) === role.id ? "selected" : ""}>${escapeText(role.name)}</option>`).join("")}`;
    document.getElementById("agencyProfileModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeProfile() {
    document.getElementById("agencyProfileModal").hidden = true;
    document.body.style.overflow = "";
  }

  function clearJoinPreview() {
    pendingLaunch = null;
    document.getElementById("agencyJoinPreview").hidden = true;
    document.getElementById("agencyTeamJoinFields").hidden = true;
    document.getElementById("agencySoloJoinFields").hidden = true;
    document.getElementById("acceptAgencyLaunch").hidden = true;
    document.getElementById("agencyJoinStatus").textContent = "";
  }

  function openJoin(raw = "") {
    clearJoinPreview();
    const field = document.getElementById("agencyLaunchCode");
    field.value = raw || "";
    document.getElementById("agencyJoinModal").hidden = false;
    document.body.style.overflow = "hidden";
    if (raw) previewLaunch(raw);
  }

  function closeJoin() {
    document.getElementById("agencyJoinModal").hidden = true;
    document.body.style.overflow = "";
  }

  function previewLaunch(raw = document.getElementById("agencyLaunchCode").value) {
    clearJoinPreview();
    try {
      pendingLaunch = kit.decodeLaunch(raw);
      const due = pendingLaunch.dueDate ? new Date(`${pendingLaunch.dueDate}T12:00:00`).toLocaleDateString() : "No due date";
      document.getElementById("agencyJoinPreview").innerHTML = `<span class="agency-assigned-code">${escapeText(pendingLaunch.launchId)}</span><h3>${escapeText(pendingLaunch.brief.title)}</h3><p>${escapeText(pendingLaunch.brief.client)} • Period ${escapeText(pendingLaunch.period)} • ${pendingLaunch.mode === "team" ? `${escapeText(pendingLaunch.teamName)} team` : "Individual project"} • Due ${escapeText(due)}</p><p>${escapeText(pendingLaunch.brief.summary)}</p>`;
      document.getElementById("agencyJoinPreview").hidden = false;
      const teamFields = document.getElementById("agencyTeamJoinFields");
      const soloFields = document.getElementById("agencySoloJoinFields");
      const teamSelect = document.getElementById("agencyTeamMemberSelect");
      const soloInputs = ["agencyJoinFirst", "agencyJoinLast", "agencyJoinPeriod", "agencyJoinRole"].map(id => document.getElementById(id));
      if (pendingLaunch.mode === "team") {
        const profile = getStore().profile;
        const current = kit.memberForProfile(pendingLaunch, profile);
        teamSelect.innerHTML = `<option value="">Choose your name</option>${pendingLaunch.members.map((member, index) => `<option value="${index}" ${current && current.first === member.first && current.last === member.last && current.period === member.period ? "selected" : ""}>${escapeText(member.first)} ${escapeText(member.last)}. • ${escapeText(roleById(member.role)?.name || member.role)}</option>`).join("")}`;
        teamSelect.required = true;
        soloInputs.forEach(input => { input.required = false; });
        teamFields.hidden = false;
        soloFields.hidden = true;
        document.getElementById("agencyJoinStatus").textContent = "Choose only your own assigned name. Your role is locked to the teacher’s roster.";
      } else {
        const profile = getStore().profile;
        teamSelect.required = false;
        teamFields.hidden = true;
        soloFields.hidden = false;
        document.getElementById("agencyJoinFirst").value = profile.first || "";
        document.getElementById("agencyJoinLast").value = profile.last || "";
        document.getElementById("agencyJoinPeriod").value = pendingLaunch.period || profile.period || "";
        document.getElementById("agencyJoinPeriod").disabled = Boolean(pendingLaunch.period);
        document.getElementById("agencyJoinRole").innerHTML = `<option value="">Select a role</option>${roles.map(role => `<option value="${role.id}" ${profile.role === role.id ? "selected" : ""}>${escapeText(role.name)}</option>`).join("")}`;
        soloInputs.forEach(input => { input.required = true; });
        document.getElementById("agencyJoinStatus").textContent = "Confirm your Mission ID and choose the professional role you will own.";
      }
      document.getElementById("acceptAgencyLaunch").hidden = false;
    } catch (error) {
      document.getElementById("agencyJoinStatus").textContent = error.message || "The project code could not be read.";
    }
  }

  function agencyDraftId(missionId, roleId) {
    return `${missionId}:${roleId}`;
  }

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

  function startAgencyAutosave(project, recoveredDraft = null) {
    const form = document.getElementById("agencyProjectForm");
    autosave?.dispose();
    autosave = autosaveFactory?.create({
      form,
      status: ensureAgencyDraftStatus(form),
      topic: "agency",
      missionId: agencyDraftId(project.missionId, project.role.id),
      title: `${project.brief.title} — ${project.role.name}`,
      getProfile: () => getStore().profile,
      readValues: () => ({ roleId:project.role.id, launchId:project.launch?.launchId || "", answers:agencyAnswers() }),
      recoveredDraft
    }) || null;
  }

  function openProject(id) {
    const store = getStore();
    if (!store.profile.first) {
      if (store.launches.some(launch => launch.launchId === id)) openJoin(kit.encodeLaunch(store.launches.find(launch => launch.launchId === id)));
      else openProfile();
      return;
    }
    const project = projectById(id, store);
    if (!project) return;
    if (!project.role) {
      openProfile();
      return;
    }
    const prior = store.completions[project.missionId];
    const draftId = agencyDraftId(project.missionId, project.role.id);
    const draft = missionStore.getDraft("agency", draftId, { profile:store.profile });
    const priorTime = Date.parse(prior?.submittedAt || prior?.completedAt || "") || 0;
    const recoveredDraft = draft && ((Date.parse(draft.updatedAt) || 0) > priorTime) ? draft : null;
    if (draft && !recoveredDraft) missionStore.deleteDraft("agency", draftId, { profile:store.profile });
    const answers = recoveredDraft?.values?.answers || prior?.answers || [];
    activeProjectId = id;
    document.getElementById("agencyProjectFormView").hidden = false;
    document.getElementById("agencyReceiptView").hidden = true;
    document.getElementById("agencyProjectCategory").textContent = project.launch ? `${project.launch.mode === "team" ? "Team" : "Individual"} Assignment • ${project.brief.client}` : `${project.brief.category} Client • ${project.brief.client}`;
    document.getElementById("agencyProjectTitle").textContent = `${project.displayId} — ${project.brief.title}`;
    document.getElementById("agencyProjectSummary").textContent = project.brief.summary;
    const facts = [
      ["Target audience", project.brief.audience],
      ["Client problem", project.brief.problem],
      ["Constraints", project.brief.constraints],
      ["Required work", project.brief.required]
    ];
    if (project.launch) {
      facts.push(["Project team", project.launch.mode === "team" ? project.launch.teamName : "Individual assignment"]);
      facts.push(["Due date", project.launch.dueDate ? new Date(`${project.launch.dueDate}T12:00:00`).toLocaleDateString() : "No due date"]);
    }
    document.getElementById("agencyProjectFacts").innerHTML = facts.map(([label, value]) => `<div><strong>${escapeText(label)}</strong><span>${escapeText(value)}</span></div>`).join("");
    const roster = project.launch?.members?.length ? `<div class="agency-project-team-context"><strong>${escapeText(project.launch.teamName)} roster</strong><div class="agency-team-roster">${project.launch.members.map(member => `<span>${escapeText(member.first)} ${escapeText(member.last)}. — ${escapeText(roleById(member.role)?.name || member.role)}</span>`).join("")}</div></div>` : "";
    document.getElementById("agencyRoleBanner").innerHTML = `<strong>${project.launch ? "Your assigned role" : "Your role"}: ${escapeText(project.role.name)}</strong><p>${escapeText(project.role.deliverable)}</p>${roster}`;
    document.getElementById("agencyPromptFields").innerHTML = project.promptRows.map((row, index) => `<label>${index + 1}. ${escapeText(row.label)}<textarea rows="5" minlength="40" data-agency-answer="${index}" required placeholder="${row.kind === "accountability" ? "Name your specific contribution, evidence, and team connection." : "Write a specific response with evidence, reasoning, and client fit."}">${escapeText(answers[index] || "")}</textarea></label>`).join("");
    document.getElementById("agencyIntegrity").checked = false;
    document.getElementById("agencyProjectModal").hidden = false;
    document.body.style.overflow = "hidden";
    startAgencyAutosave(project, recoveredDraft);
  }

  function closeProject() {
    autosave?.dispose();
    autosave = null;
    document.getElementById("agencyProjectModal").hidden = true;
    document.body.style.overflow = "";
  }

  function buildReceipt(project, profile, answers, saved) {
    const capNote = saved.entries < PROJECT_ENTRIES ? ["Weekly cap note: The project is complete, but only the remaining weekly entries were added."] : [];
    const teamLines = project.launch ? [
      `Teacher project code: ${project.launch.launchId}`,
      `Project format: ${project.launch.mode === "team" ? "Team project" : "Individual project"}`,
      ...(project.launch.teamName ? [`Team: ${project.launch.teamName}`] : []),
      ...(project.launch.dueDate ? [`Due date: ${project.launch.dueDate}`] : [])
    ] : [];
    return [
      "WOLVERINE MARKETING AGENCY — CLIENT REVIEW PACKET",
      `Project: ${project.displayId} — ${project.brief.title}`,
      `Client: ${project.brief.client}`,
      ...teamLines,
      `Student: ${profile.first} ${profile.last}.`,
      `Period: ${profile.period}`,
      `Agency Role: ${project.role.name}`,
      `Completed: ${new Date().toLocaleString()}`,
      `Reward: ${saved.xp} XP + ${saved.entries} provisional weekly ${saved.entries === 1 ? "entry" : "entries"}`,
      `Receipt code: ${saved.code}`,
      ...capNote,
      "",
      ...answers.flatMap((answer, index) => [`RESPONSE ${index + 1}`, project.promptRows[index]?.label || "Agency response", answer, ""]),
      "APPROVAL NOTE",
      "Teacher/client verifies originality, completion, evidence, role ownership, individual accountability, and fit with the brief before awarding entries or project credit."
    ].join("\n");
  }

  function encodeReviewPacket(project, profile, answers, saved) {
    const payload = {
      version: 1,
      student: `${profile.first} ${profile.last}.`,
      first: profile.first,
      last: profile.last,
      period: profile.period,
      topic: "Wolverine Agency",
      mission: `${project.displayId} — ${project.brief.title}`,
      receiptCode: saved.code,
      provisionalEntries: Number(saved.entries || 0),
      projectLaunchId: project.launch?.launchId || "",
      teamName: project.launch?.teamName || "",
      teamMode: project.launch?.mode || "solo",
      agencyRole: project.role.name,
      teamMembers: project.launch?.members?.map(member => ({ student:`${member.first} ${member.last}.`, role:roleById(member.role)?.name || member.role })) || [],
      individualAccountability: project.promptRows.map((row, index) => ({ ...row, response:answers[index] })).filter(row => row.kind === "accountability"),
      responses: answers.map((response, index) => ({ step:index + 1, prompt:project.promptRows[index]?.label || "Agency response", kind:project.promptRows[index]?.kind || "client", response })),
      submittedAt: saved.submittedAt
    };
    return `FMN-REVIEW:${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`;
  }

  document.getElementById("agencyProfileForm").addEventListener("submit", event => {
    event.preventDefault();
    const profile = missionStore.setActiveProfile({
      first:document.getElementById("agencyFirst").value.trim(),
      last:document.getElementById("agencyLast").value.trim().slice(0, 1).toUpperCase(),
      period:document.getElementById("agencyPeriod").value
    });
    missionStore.setAgencyRole(document.getElementById("agencyRoleSelect").value, { profile });
    closeProfile();
    renderAll();
  });

  document.getElementById("agencyJoinForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!pendingLaunch) {
      previewLaunch();
      return;
    }
    let profile;
    let assignedRole;
    if (pendingLaunch.mode === "team") {
      const selectedMember = document.getElementById("agencyTeamMemberSelect").value;
      const index = selectedMember === "" ? -1 : Number(selectedMember);
      const member = pendingLaunch.members[index];
      if (!member) {
        document.getElementById("agencyJoinStatus").textContent = "Choose your assigned name from the team roster.";
        return;
      }
      profile = missionStore.setActiveProfile(member);
      assignedRole = member.role;
    } else {
      profile = missionStore.setActiveProfile({
        first:document.getElementById("agencyJoinFirst").value.trim(),
        last:document.getElementById("agencyJoinLast").value.trim().slice(0, 1).toUpperCase(),
        period:pendingLaunch.period || document.getElementById("agencyJoinPeriod").value
      });
      assignedRole = document.getElementById("agencyJoinRole").value;
      if (!assignedRole) {
        document.getElementById("agencyJoinStatus").textContent = "Choose the Agency role you will own.";
        return;
      }
    }
    const personalized = { ...pendingLaunch, joinedRole:assignedRole, joinedAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
    missionStore.saveAgencyLaunch(personalized, { profile });
    missionStore.setAgencyRole(assignedRole, { profile });
    const joinedId = personalized.launchId;
    closeJoin();
    if (location.hash.includes("agency-launch=")) history.replaceState(null, "", `${location.pathname}${location.search}`);
    renderAll();
    requestAnimationFrame(() => openProject(joinedId));
  });

  document.getElementById("agencyProjectForm").addEventListener("submit", event => {
    event.preventDefault();
    const store = getStore();
    const project = projectById(activeProjectId, store);
    if (!project?.role) return;
    const answers = agencyAnswers().map(value => value.trim());
    if (answers.some(answer => answer.length < 40)) return;
    const previous = store.completions[project.missionId];
    const code = previous?.code || `${project.missionId}-${missionStore.getWeekKey().replaceAll("-", "").slice(4)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const item = {
      id:project.missionId,
      code,
      title:project.brief.title,
      client:project.brief.client,
      category:project.brief.category,
      role:project.role.id,
      roleName:project.role.name,
      answers,
      prompts:project.promptRows,
      launchId:project.launch?.launchId || "",
      teamName:project.launch?.teamName || "",
      teamMode:project.launch?.mode || "solo",
      teamMembers:project.launch?.members || [],
      dueDate:project.launch?.dueDate || "",
      completedAt:new Date().toISOString(),
      entries:PROJECT_ENTRIES
    };
    const saved = missionStore.saveCompletion({ topic:"agency", missionId:project.missionId, profile:store.profile, item, requestedEntries:PROJECT_ENTRIES, xp:PROJECT_XP }).item;
    autosave?.clear();
    autosave?.dispose({ save:false });
    autosave = null;
    lastReceipt = buildReceipt(project, store.profile, answers, saved);
    lastReviewPacket = encodeReviewPacket(project, store.profile, answers, saved);
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
    const projectButton = event.target.closest("[data-project-id]");
    if (projectButton) openProject(projectButton.dataset.projectId);
    if (event.target.closest("[data-join-agency-project]")) openJoin();
    const filter = event.target.closest("[data-agency-filter]");
    if (filter) {
      activeFilter = filter.dataset.agencyFilter;
      document.querySelectorAll("[data-agency-filter]").forEach(button => button.classList.toggle("active", button === filter));
      renderBriefs();
    }
  });

  document.getElementById("joinAgencyProject").addEventListener("click", () => openJoin());
  document.getElementById("readAgencyLaunch").addEventListener("click", () => previewLaunch());
  document.getElementById("editAgencyProfile").addEventListener("click", () => openProfile());
  document.querySelectorAll("[data-close-agency-profile]").forEach(element => element.addEventListener("click", closeProfile));
  document.querySelectorAll("[data-close-agency-join]").forEach(element => element.addEventListener("click", closeJoin));
  document.querySelectorAll("[data-close-agency-project]").forEach(element => element.addEventListener("click", closeProject));
  document.getElementById("copyAgencyReceipt").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastReceipt);
      document.getElementById("copyAgencyReceipt").textContent = "Copied";
    } catch {
      window.prompt("Copy the review packet:", lastReceipt);
    }
  });
  document.getElementById("copyAgencyTeacherPacket").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastReviewPacket);
      document.getElementById("copyAgencyTeacherPacket").textContent = "Teacher submission copied";
    } catch {
      window.prompt("Copy this teacher submission:", lastReviewPacket);
    }
  });
  document.getElementById("reviseAgencyProject").addEventListener("click", () => {
    document.getElementById("agencyProjectFormView").hidden = false;
    document.getElementById("agencyReceiptView").hidden = true;
    const project = projectById(activeProjectId, getStore());
    if (project?.role) startAgencyAutosave(project);
  });

  function renderAll() {
    renderStatus();
    renderAssignedProjects();
    renderRoles();
    renderBriefs();
    renderHistory();
  }

  renderAll();
  window.addEventListener("storage", renderAll);
  if (location.hash.includes("agency-launch=")) requestAnimationFrame(() => openJoin(location.href));
})();
