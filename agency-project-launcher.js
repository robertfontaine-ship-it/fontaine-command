(() => {
  "use strict";

  const PAGE = "Topic Hubs";
  const STORAGE_KEY = "fontaineAgencyTeacherLaunches:v1";
  const kit = window.FontaineAgencyKit;
  if (!kit) return;

  const clone = value => JSON.parse(JSON.stringify(value));
  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
      return { launches: parsed.launches || {}, templates: parsed.templates || {} };
    } catch {
      return { launches: {}, templates: {} };
    }
  }

  function writeStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function emptyMember(role = "") {
    return { first:"", last:"", role };
  }

  function draftFromBrief(brief = kit.briefs[0], extras = {}) {
    return {
      editingLaunchId: "",
      templateId: brief.id,
      mode: "team",
      period: "",
      dueDate: "",
      teamName: "",
      brief: clone(brief),
      members: [emptyMember("account"), emptyMember("research")],
      ...clone(extras)
    };
  }

  let editorDraft = draftFromBrief();
  let latestLaunchId = "";

  function templateRecords(store = readStore()) {
    const builtIns = kit.briefs.map(brief => ({ id:brief.id, name:`${brief.id} — ${brief.title}`, brief }));
    const custom = Object.values(store.templates || {}).map(template => ({
      id: template.id,
      name: `Custom — ${template.name || template.brief?.title || "Brief"}`,
      brief: template.brief,
      custom: true
    }));
    return [...builtIns, ...custom];
  }

  function templateById(id, store = readStore()) {
    return templateRecords(store).find(template => template.id === id) || templateRecords(store)[0];
  }

  function roleOptions(selected = "") {
    return `<option value="">Select role</option>${kit.roles.map(role => `<option value="${role.id}" ${selected === role.id ? "selected" : ""}>${esc(role.name)}</option>`).join("")}`;
  }

  function periodOptions(selected = "") {
    return `<option value="">Select period</option>${Array.from({ length:7 }, (_, index) => String(index + 1)).map(period => `<option ${selected === period ? "selected" : ""}>${period}</option>`).join("")}`;
  }

  function memberRow(member, index) {
    const required = editorDraft.mode === "team" ? "required" : "";
    return `<div class="agency-launch-member" data-agency-member-row>
      <span class="agency-launch-member-number">${index + 1}</span>
      <label>First name<input data-member-first value="${esc(member.first)}" ${required} /></label>
      <label>Last initial<input data-member-last value="${esc(member.last)}" maxlength="1" ${required} /></label>
      <label>Agency role<select data-member-role ${required}>${roleOptions(member.role)}</select></label>
      <button class="btn secondary agency-member-remove" type="button" onclick="removeAgencyLaunchMember(${index})" ${editorDraft.members.length <= 2 ? "disabled" : ""}>Remove</button>
    </div>`;
  }

  function promptRow(prompt, index) {
    return `<label class="agency-launch-prompt"><span>Client deliverable ${index + 1}</span><textarea rows="3" data-agency-launch-prompt required>${esc(prompt)}</textarea><button class="btn secondary" type="button" onclick="removeAgencyLaunchPrompt(${index})" ${editorDraft.brief.prompts.length <= 3 ? "disabled" : ""}>Remove deliverable</button></label>`;
  }

  function templateOptions(store) {
    return templateRecords(store).map(template => `<option value="${esc(template.id)}" ${editorDraft.templateId === template.id ? "selected" : ""}>${esc(template.name)}</option>`).join("");
  }

  function launchCard(launch) {
    const roleNames = launch.members.map(member => `${member.first} ${member.last}. — ${kit.roleById(member.role)?.name || member.role}`);
    const due = launch.dueDate ? new Date(`${launch.dueDate}T12:00:00`).toLocaleDateString() : "No due date";
    const studentLink = kit.launchLink(launch, location.href);
    return `<article class="agency-saved-launch ${latestLaunchId === launch.launchId ? "just-created" : ""}">
      <div class="agency-saved-launch-heading"><div><span class="topic-admin-status">${esc(launch.launchId)}</span><h3>${esc(launch.brief.title)}</h3><p class="muted">${esc(launch.brief.client)} • Period ${esc(launch.period)} • ${launch.mode === "team" ? `${esc(launch.teamName)} team` : "Individual project"} • ${esc(due)}</p></div><strong>${launch.mode === "team" ? `${launch.members.length} roles` : "Student chooses role"}</strong></div>
      ${roleNames.length ? `<div class="agency-launch-roster-summary">${roleNames.map(name => `<span>${esc(name)}</span>`).join("")}</div>` : ""}
      <div class="topic-admin-actions agency-launch-card-actions">
        <button class="btn" type="button" onclick="copyAgencyLaunchLink('${esc(launch.launchId)}')">Copy student link</button>
        <button class="btn secondary" type="button" onclick="copyAgencyLaunchCode('${esc(launch.launchId)}')">Copy project code</button>
        <a class="btn secondary" href="${esc(studentLink)}" target="_blank" rel="noopener">Open student view</a>
        <button class="btn secondary" type="button" onclick="editAgencyLaunch('${esc(launch.launchId)}')">Edit</button>
        <button class="btn secondary" type="button" onclick="duplicateAgencyLaunch('${esc(launch.launchId)}')">Duplicate</button>
        <button class="btn secondary agency-launch-delete" type="button" onclick="deleteAgencyLaunch('${esc(launch.launchId)}')">Delete</button>
      </div>
    </article>`;
  }

  function launcherSection() {
    const store = readStore();
    const launches = Object.values(store.launches).sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
    const selectedTemplate = templateById(editorDraft.templateId, store);
    const selectedIsCustom = Boolean(selectedTemplate?.custom);
    const isTeam = editorDraft.mode === "team";
    return `<section class="card agency-project-launcher">
      <div class="row"><div><span class="topic-admin-status">Agency command desk</span><h2>Agency Project Launcher</h2><p class="muted">Customize a client brief, assign up to six students to distinct Agency roles, and create one link that carries the complete project to every team member.</p></div><div class="agency-launcher-metrics"><span><strong>${launches.length}</strong> saved projects</span><span><strong>${Object.keys(store.templates).length}</strong> custom templates</span></div></div>
      <details class="agency-launch-editor" open>
        <summary>${editorDraft.editingLaunchId ? `Editing ${esc(editorDraft.editingLaunchId)}` : "Build a new project"}</summary>
        <form id="agencyLaunchForm" onsubmit="generateAgencyLaunch(event)" oninput="captureAgencyLaunchDraft()">
          <div class="agency-launch-grid compact-grid">
            <label>Start from a client brief<select id="agencyLaunchTemplate" onchange="loadAgencyLaunchTemplate(this.value)">${templateOptions(store)}</select></label>
            <label>Project format<select id="agencyLaunchMode" onchange="setAgencyLaunchMode(this.value)"><option value="team" ${isTeam ? "selected" : ""}>Team project — assigned roles</option><option value="solo" ${!isTeam ? "selected" : ""}>Individual project — student chooses role</option></select></label>
            <label>Class period<select id="agencyLaunchPeriod" required>${periodOptions(editorDraft.period)}</select></label>
            <label>Due date<input id="agencyLaunchDueDate" type="date" value="${esc(editorDraft.dueDate)}" /></label>
          </div>

          <div class="agency-launch-brief-editor">
            <div class="agency-launch-grid">
              <label>Client or organization<input id="agencyLaunchClient" value="${esc(editorDraft.brief.client)}" required /></label>
              <label>Project title<input id="agencyLaunchTitle" value="${esc(editorDraft.brief.title)}" required /></label>
              <label>Client category<input id="agencyLaunchCategory" value="${esc(editorDraft.brief.category)}" required /></label>
              <label>Target audience<textarea id="agencyLaunchAudience" rows="3" required>${esc(editorDraft.brief.audience)}</textarea></label>
              <label class="wide">Client situation<textarea id="agencyLaunchSummary" rows="3" required>${esc(editorDraft.brief.summary)}</textarea></label>
              <label>Core problem<textarea id="agencyLaunchProblem" rows="3" required>${esc(editorDraft.brief.problem)}</textarea></label>
              <label>Constraints<textarea id="agencyLaunchConstraints" rows="3" required>${esc(editorDraft.brief.constraints)}</textarea></label>
              <label class="wide">Required final work<textarea id="agencyLaunchRequired" rows="3" required>${esc(editorDraft.brief.required)}</textarea></label>
            </div>
            <div class="agency-launch-prompts"><div class="row"><div><h3>Client Deliverables</h3><p class="muted">Students see these in order, followed by their role work order and—on team projects—three individual accountability checks.</p></div><button class="btn secondary" type="button" onclick="addAgencyLaunchPrompt()" ${editorDraft.brief.prompts.length >= 8 ? "disabled" : ""}>Add deliverable</button></div>${editorDraft.brief.prompts.map(promptRow).join("")}</div>
            <div class="topic-admin-actions"><button class="btn secondary" type="button" onclick="saveAgencyBriefTemplate()">Save edited brief as template</button>${selectedIsCustom ? `<button class="btn secondary agency-launch-delete" type="button" onclick="deleteAgencyBriefTemplate('${esc(selectedTemplate.id)}')">Delete selected template</button>` : ""}</div>
          </div>

          <div class="agency-team-editor" ${isTeam ? "" : "hidden"}>
            <div class="row"><div><h3>Team Roster and Role Assignments</h3><p class="muted">Every student gets the same client brief, a different professional responsibility, and an individual evidence packet.</p></div><button class="btn secondary" type="button" onclick="addAgencyLaunchMember()" ${editorDraft.members.length >= kit.roles.length ? "disabled" : ""}>Add teammate</button></div>
            <label class="agency-team-name">Team name<input id="agencyLaunchTeamName" value="${esc(editorDraft.teamName)}" ${isTeam ? "required" : ""} placeholder="Example: A202 Launch Lab" /></label>
            <div class="agency-launch-members">${editorDraft.members.map(memberRow).join("")}</div>
          </div>

          <div class="agency-launch-submit-row"><div id="agencyLauncherStatus" role="status" aria-live="polite">${latestLaunchId ? `Latest project ready: ${esc(latestLaunchId)}. Copy its student link below.` : "The student link contains the brief and roster, so no paid account or shared database is required."}</div><div class="topic-admin-actions"><button class="btn secondary" type="button" onclick="resetAgencyLaunchEditor()">Start over</button><button class="btn" type="submit">${editorDraft.editingLaunchId ? "Update project link" : "Create project link"}</button></div></div>
        </form>
      </details>
      <div class="agency-saved-launches"><div class="row"><div><h3>Saved Agency Projects</h3><p class="muted">Copy the student link into Canvas, display it, or copy the project code for students to paste on the Agency floor.</p></div></div>${launches.length ? launches.map(launchCard).join("") : `<div class="topic-empty">No teacher-launched Agency projects yet. Build one above from any client template.</div>`}</div>
    </section>`;
  }

  function appendLauncher() {
    if (typeof state === "undefined" || state.page !== PAGE) return;
    const container = document.querySelector(".topic-admin");
    if (!container || container.querySelector(".agency-project-launcher")) return;
    const reviewQueue = container.querySelector(".mission-review-queue");
    const metricGrid = container.querySelector(":scope > .grid");
    (reviewQueue || metricGrid || container.lastElementChild)?.insertAdjacentHTML("afterend", launcherSection());
  }

  function captureFormDraft() {
    const form = document.getElementById("agencyLaunchForm");
    if (!form) return editorDraft;
    editorDraft = {
      ...editorDraft,
      templateId: document.getElementById("agencyLaunchTemplate")?.value || editorDraft.templateId,
      mode: document.getElementById("agencyLaunchMode")?.value === "solo" ? "solo" : "team",
      period: document.getElementById("agencyLaunchPeriod")?.value || "",
      dueDate: document.getElementById("agencyLaunchDueDate")?.value || "",
      teamName: document.getElementById("agencyLaunchTeamName")?.value.trim() || "",
      brief: {
        id: editorDraft.brief.id,
        client: document.getElementById("agencyLaunchClient")?.value.trim() || "",
        title: document.getElementById("agencyLaunchTitle")?.value.trim() || "",
        category: document.getElementById("agencyLaunchCategory")?.value.trim() || "",
        audience: document.getElementById("agencyLaunchAudience")?.value.trim() || "",
        summary: document.getElementById("agencyLaunchSummary")?.value.trim() || "",
        problem: document.getElementById("agencyLaunchProblem")?.value.trim() || "",
        constraints: document.getElementById("agencyLaunchConstraints")?.value.trim() || "",
        required: document.getElementById("agencyLaunchRequired")?.value.trim() || "",
        prompts: [...document.querySelectorAll("[data-agency-launch-prompt]")].map(field => field.value.trim())
      },
      members: [...document.querySelectorAll("[data-agency-member-row]")].map(row => ({
        first: row.querySelector("[data-member-first]")?.value.trim() || "",
        last: row.querySelector("[data-member-last]")?.value.trim().slice(0, 1).toUpperCase() || "",
        role: row.querySelector("[data-member-role]")?.value || ""
      }))
    };
    return editorDraft;
  }

  function rerenderLauncher(focusSelector = "") {
    if (typeof render !== "function") return;
    render();
    requestAnimationFrame(() => {
      document.querySelector(".agency-project-launcher")?.scrollIntoView({ block:"start" });
      if (focusSelector) document.querySelector(focusSelector)?.focus({ preventScroll:true });
    });
  }

  function launchById(id) {
    return readStore().launches[id] || null;
  }

  async function copyText(value, success) {
    try {
      await navigator.clipboard.writeText(value);
      toast(success);
    } catch {
      window.prompt("Copy this text:", value);
    }
  }

  window.captureAgencyLaunchDraft = captureFormDraft;

  window.loadAgencyLaunchTemplate = function loadAgencyLaunchTemplate(id) {
    captureFormDraft();
    const template = templateById(id);
    editorDraft = {
      ...editorDraft,
      editingLaunchId: "",
      templateId: template.id,
      brief: clone(template.brief)
    };
    latestLaunchId = "";
    rerenderLauncher("#agencyLaunchClient");
  };

  window.setAgencyLaunchMode = function setAgencyLaunchMode(mode) {
    captureFormDraft();
    editorDraft.mode = mode === "solo" ? "solo" : "team";
    if (editorDraft.mode === "team" && editorDraft.members.length < 2) editorDraft.members = [emptyMember("account"), emptyMember("research")];
    rerenderLauncher(editorDraft.mode === "team" ? "#agencyLaunchTeamName" : "#agencyLaunchClient");
  };

  window.addAgencyLaunchMember = function addAgencyLaunchMember() {
    captureFormDraft();
    if (editorDraft.members.length >= kit.roles.length) return;
    const used = new Set(editorDraft.members.map(member => member.role));
    const nextRole = kit.roles.find(role => !used.has(role.id))?.id || "";
    editorDraft.members.push(emptyMember(nextRole));
    rerenderLauncher("[data-agency-member-row]:last-child [data-member-first]");
  };

  window.removeAgencyLaunchMember = function removeAgencyLaunchMember(index) {
    captureFormDraft();
    if (editorDraft.members.length <= 2) return;
    editorDraft.members.splice(index, 1);
    rerenderLauncher("[data-agency-member-row] [data-member-first]");
  };

  window.addAgencyLaunchPrompt = function addAgencyLaunchPrompt() {
    captureFormDraft();
    if (editorDraft.brief.prompts.length >= 8) return;
    editorDraft.brief.prompts.push("");
    rerenderLauncher("[data-agency-launch-prompt]:last-of-type");
  };

  window.removeAgencyLaunchPrompt = function removeAgencyLaunchPrompt(index) {
    captureFormDraft();
    if (editorDraft.brief.prompts.length <= 3) return;
    editorDraft.brief.prompts.splice(index, 1);
    rerenderLauncher("[data-agency-launch-prompt]");
  };

  window.saveAgencyBriefTemplate = function saveAgencyBriefTemplate() {
    const draft = captureFormDraft();
    const name = window.prompt("Name this reusable brief template:", draft.brief.title);
    if (name === null) return;
    if (!name.trim()) {
      toast("Add a template name before saving.");
      return;
    }
    try {
      const testLaunch = kit.validateLaunch({
        period: draft.period || "1",
        mode: "solo",
        brief: draft.brief,
        templateId: draft.templateId
      });
      const store = readStore();
      const id = `CUSTOM-${Date.now().toString(36).toUpperCase()}`;
      store.templates[id] = { id, name:name.trim(), brief:{ ...testLaunch.brief, id }, savedAt:new Date().toISOString() };
      writeStore(store);
      editorDraft.templateId = id;
      editorDraft.brief.id = id;
      toast(`Saved “${name.trim()}” as a reusable client brief.`);
      rerenderLauncher("#agencyLaunchTemplate");
    } catch (error) {
      toast(error.message || "Complete the client brief before saving it as a template.");
    }
  };

  window.deleteAgencyBriefTemplate = function deleteAgencyBriefTemplate(id) {
    const store = readStore();
    if (!store.templates[id]) return;
    if (!window.confirm("Delete this custom brief template? Existing project links will keep their brief.")) return;
    delete store.templates[id];
    writeStore(store);
    editorDraft = draftFromBrief();
    toast("Custom brief template deleted. Existing Agency projects were preserved.");
    rerenderLauncher("#agencyLaunchTemplate");
  };

  window.generateAgencyLaunch = function generateAgencyLaunch(event) {
    event.preventDefault();
    const draft = captureFormDraft();
    try {
      const existing = draft.editingLaunchId ? launchById(draft.editingLaunchId) : null;
      const launch = kit.validateLaunch({
        launchId: existing?.launchId,
        createdAt: existing?.createdAt,
        updatedAt: new Date().toISOString(),
        templateId: draft.templateId,
        period: draft.period,
        dueDate: draft.dueDate,
        mode: draft.mode,
        teamName: draft.mode === "team" ? draft.teamName : "",
        brief: draft.brief,
        members: draft.mode === "team" ? draft.members.map(member => ({ ...member, period:draft.period })) : []
      });
      const store = readStore();
      store.launches[launch.launchId] = launch;
      writeStore(store);
      latestLaunchId = launch.launchId;
      editorDraft = draftFromBrief(kit.briefById(draft.templateId) || draft.brief, {
        templateId: draft.templateId,
        period: draft.period,
        dueDate: draft.dueDate
      });
      toast(`${launch.launchId} is ready for Period ${launch.period}.`);
      rerenderLauncher(`[onclick="copyAgencyLaunchLink('${launch.launchId}')"]`);
    } catch (error) {
      toast(error.message || "The Agency project could not be created.");
    }
  };

  window.copyAgencyLaunchLink = function copyAgencyLaunchLink(id) {
    const launch = launchById(id);
    if (launch) copyText(kit.launchLink(launch, location.href), `${id} student link copied.`);
  };

  window.copyAgencyLaunchCode = function copyAgencyLaunchCode(id) {
    const launch = launchById(id);
    if (launch) copyText(kit.encodeLaunch(launch), `${id} project code copied.`);
  };

  window.editAgencyLaunch = function editAgencyLaunch(id) {
    const launch = launchById(id);
    if (!launch) return;
    editorDraft = {
      editingLaunchId: launch.launchId,
      templateId: launch.templateId,
      mode: launch.mode,
      period: launch.period,
      dueDate: launch.dueDate,
      teamName: launch.teamName,
      brief: clone(launch.brief),
      members: clone(launch.members)
    };
    latestLaunchId = "";
    rerenderLauncher("#agencyLaunchClient");
  };

  window.duplicateAgencyLaunch = function duplicateAgencyLaunch(id) {
    const launch = launchById(id);
    if (!launch) return;
    editorDraft = {
      editingLaunchId: "",
      templateId: launch.templateId,
      mode: launch.mode,
      period: launch.period,
      dueDate: launch.dueDate,
      teamName: launch.teamName ? `${launch.teamName} Copy` : "",
      brief: clone(launch.brief),
      members: clone(launch.members)
    };
    latestLaunchId = "";
    rerenderLauncher("#agencyLaunchTeamName");
  };

  window.deleteAgencyLaunch = function deleteAgencyLaunch(id) {
    const store = readStore();
    if (!store.launches[id]) return;
    if (!window.confirm(`Delete ${id} from this teacher launcher? Student links already shared will still work.`)) return;
    delete store.launches[id];
    writeStore(store);
    if (editorDraft.editingLaunchId === id) editorDraft = draftFromBrief();
    if (latestLaunchId === id) latestLaunchId = "";
    toast(`${id} removed from the saved launcher list.`);
    rerenderLauncher();
  };

  window.resetAgencyLaunchEditor = function resetAgencyLaunchEditor() {
    editorDraft = draftFromBrief();
    latestLaunchId = "";
    rerenderLauncher("#agencyLaunchTemplate");
  };

  if (typeof render === "function") {
    const beforeAgencyLauncher = render;
    render = function renderWithAgencyLauncher() {
      beforeAgencyLauncher();
      appendLauncher();
    };
    render();
  }
})();
