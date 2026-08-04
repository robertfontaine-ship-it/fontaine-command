(() => {
  "use strict";

  const ADMIN_STORAGE_KEY = "fontaineTopicHubAdmin:v1";
  const TOPIC_ADMIN_PAGE = "Topic Hubs";

  function topicWeekKey(date = new Date()) {
    const working = new Date(date);
    const day = working.getDay();
    working.setDate(working.getDate() + (day === 0 ? -6 : 1 - day));
    working.setHours(0, 0, 0, 0);
    return `${working.getFullYear()}-${String(working.getMonth() + 1).padStart(2, "0")}-${String(working.getDate()).padStart(2, "0")}`;
  }

  function topicAdminStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || "{}");
      return {
        settings: {
          prize: parsed.settings?.prize || "Fontaine Friday Mystery Drop",
          drawingDay: parsed.settings?.drawingDay || "Friday",
          entryCap: Number(parsed.settings?.entryCap || 10),
          activeTopic: parsed.settings?.activeTopic || "Branding"
        },
        ledgers: parsed.ledgers || {},
        winners: parsed.winners || {}
      };
    } catch {
      return { settings: { prize: "Fontaine Friday Mystery Drop", drawingDay: "Friday", entryCap: 10, activeTopic: "Branding" }, ledgers: {}, winners: {} };
    }
  }

  function saveTopicAdminStore(store) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
  }

  function topicEscape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentLedger(store = topicAdminStore()) {
    return store.ledgers[topicWeekKey()] || [];
  }

  function ledgerSummary(ledger) {
    const students = new Set(ledger.map(row => `${row.name.toLowerCase()}|${row.period}`));
    return {
      entries: ledger.reduce((sum, row) => sum + Number(row.entries || 0), 0),
      students: students.size,
      records: ledger.length
    };
  }

  function topicHubAdminView() {
    const store = topicAdminStore();
    const ledger = currentLedger(store);
    const summary = ledgerSummary(ledger);
    const winner = store.winners[topicWeekKey()];
    const missionStore = window.FontaineMissionStore;
    const studentProfiles = missionStore?.listProfiles() || [];
    const activeStudent = studentProfiles.find(item => item.active);
    const savedDrafts = studentProfiles.reduce((total, item) => total + Number(item.drafts || 0), 0);
    const studentOptions = studentProfiles.map(item => `<option value="${topicEscape(item.key)}">${topicEscape(item.profile.first)} ${topicEscape(item.profile.last)}. • Period ${topicEscape(item.profile.period)} • ${item.missions} missions • ${item.drafts} drafts</option>`).join("");
    const rows = ledger.map((row, index) => `<tr>
      <td>${topicEscape(row.name)}</td><td>${topicEscape(row.period)}</td><td>${topicEscape(row.source)}</td><td>${row.entries}</td>
      <td><button class="btn secondary" type="button" onclick="removeTopicEntry(${index})">Remove</button></td>
    </tr>`).join("");

    return shell(`<div class="topic-admin">
      <section class="card topic-admin-hero">
        <div class="row"><div><span class="topic-admin-status">Network live</span><h2>Fontaine Mission Network</h2><p class="muted">Six permanent marketing departments, 59 independent missions, one student progression system, and Agency client work.</p></div><div class="topic-admin-actions"><a class="btn" href="mission-control.html" target="_blank" rel="noopener">Open Mission Control</a><a class="btn secondary" href="topic-hubs.html" target="_blank" rel="noopener">Open departments</a><a class="btn secondary" href="wolverine-agency.html" target="_blank" rel="noopener">Open Agency</a><a class="btn secondary" href="mission-classroom-kit.html" target="_blank" rel="noopener">Open print + substitute kit</a></div></div>
      </section>

      <div class="grid">
        <section class="card span-4 topic-admin-card"><div class="metric">6</div><div class="muted">Live departments</div><h3>Core Marketing Library</h3><p>Branding, Target Market, the 4Ps, Marketing Functions, Promotional Mix, and Market Research Lab are live.</p></section>
        <section class="card span-4 topic-admin-card"><div class="metric">59</div><div class="muted">Available missions</div><h3>Quick, Skill, and Boss</h3><p>Every mission includes a time estimate, numbered prompts, quality standards, and a teacher review packet.</p></section>
        <section class="card span-4 topic-admin-card"><div class="metric">${summary.entries}</div><div class="muted">Entries this week</div><h3>${summary.students} participating students</h3><p>${summary.records} approved ledger records for the week of ${topicWeekKey()}.</p></section>
      </div>

      <section class="card">
        <div class="row"><div><h2>Weekly Giveaway Settings</h2><p class="muted">These settings manage the teacher workflow. Student mission receipts remain provisional until approved here.</p></div></div>
        <form class="topic-admin-form" onsubmit="saveTopicHubSettings(event)">
          <label>Featured prize<input id="topicPrize" value="${topicEscape(store.settings.prize)}" /></label>
          <label>Drawing day<select id="topicDrawingDay">${["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => `<option ${store.settings.drawingDay === day ? "selected" : ""}>${day}</option>`).join("")}</select></label>
          <label>Weekly entry cap<input id="topicEntryCap" type="number" min="1" max="50" value="${store.settings.entryCap}" /></label>
          <label>Featured department<select id="topicActive">${["Branding", "Target Market & Segmentation", "The 4Ps of Marketing", "Marketing Functions", "Promotional Mix", "Market Research Lab"].map(topic => `<option ${store.settings.activeTopic === topic ? "selected" : ""}>${topic}</option>`).join("")}</select></label>
          <button class="btn" type="submit">Save settings</button>
        </form>
      </section>

      <section class="card topic-classroom-kit">
        <div class="row"><div><h2>Classroom Launch Kit</h2><p class="muted">Prepare a class without rebuilding directions. Roster text is used only to make first-name/last-initial cards and is not saved.</p></div><a class="btn" href="mission-classroom-kit.html" target="_blank" rel="noopener">Build printable materials</a></div>
        <div class="grid">
          <div class="card span-6"><strong>Student Check-In Cards</strong><p class="muted">Six black-and-white cards per sheet with Mission ID, Periods 1–7, starting link, mission/project code, submission step, and shared-device reminder.</p></div>
          <div class="card span-6"><strong>One-Page Substitute Mode</strong><p class="muted">Independent-work flow, all seven periods, offline backup, mission limits, exact substitute boundaries, and end-of-class procedures.</p></div>
        </div>
      </section>

      <section class="card">
        <div class="row"><div><h2>Approve an Entry</h2><p class="muted">Verify the student’s receipt or goodwill action, then add the approved entries to this browser’s weekly ledger.</p></div></div>
        <form class="topic-admin-form" onsubmit="addTopicEntry(event)">
          <label>Student name<input id="topicStudent" required placeholder="First name + last initial" /></label>
          <label>Class period<select id="topicPeriod" required><option value="">Select period</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select></label>
          <label>Entry source<select id="topicSource"><option>Quick Mission</option><option>Skill Mission</option><option>Boss Mission</option><option>Agency Project</option><option>Goodwill Ticket</option><option>Growth / Improvement</option><option>Review Game</option></select></label>
          <label>Entries<input id="topicEntries" required type="number" min="1" max="4" value="1" /></label>
          <button class="btn" type="submit">Approve entries</button>
        </form>
      </section>

      <section class="card">
        <div class="row"><div><h2>Weekly Drawing Ledger</h2><p class="muted">${topicEscape(store.settings.prize)} • Drawing day: ${topicEscape(store.settings.drawingDay)}</p></div><div class="topic-admin-actions"><button class="btn secondary" type="button" onclick="exportTopicLedger()">Export CSV</button><button class="btn" type="button" onclick="drawTopicWinner()" ${summary.entries ? "" : "disabled"}>Draw weighted winner</button></div></div>
        ${winner ? `<div class="topic-winner"><strong>Current winner: ${topicEscape(winner.name)}</strong><div class="muted">Period ${topicEscape(winner.period)} • Drawn ${new Date(winner.drawnAt).toLocaleString()}</div></div>` : ""}
        <div style="overflow-x:auto"><table class="topic-ledger-table"><thead><tr><th>Student</th><th>Period</th><th>Source</th><th>Entries</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="5" class="topic-empty">No approved entries yet this week.</td></tr>`}</tbody></table></div>
        <div class="row" style="margin-top:14px"><span class="muted">Each approved entry becomes one ticket in the weighted drawing.</span><button class="btn secondary" type="button" onclick="clearTopicLedger()">Reset this week</button></div>
      </section>

      <section class="card topic-device-manager">
        <div class="row"><div><h2>Shared-Device Student Data</h2><p class="muted">Teacher-only cleanup for classroom computers. This does not erase the teacher review queue, approved-entry ledger, or giveaway winner.</p></div><span class="topic-admin-status">${studentProfiles.length} saved ${studentProfiles.length === 1 ? "profile" : "profiles"}</span></div>
        <div class="grid topic-device-summary">
          <div class="card span-4"><div class="metric">${studentProfiles.length}</div><div class="muted">Student profiles on this browser</div></div>
          <div class="card span-4"><div class="metric">${savedDrafts}</div><div class="muted">Interrupted-work drafts protected</div></div>
          <div class="card span-4"><strong>${activeStudent ? `${topicEscape(activeStudent.profile.first)} ${topicEscape(activeStudent.profile.last)}. • Period ${topicEscape(activeStudent.profile.period)}` : "No active student"}</strong><div class="muted">Current shared-device identity</div></div>
        </div>
        <div class="topic-device-actions">
          <label><strong>Select one student profile</strong><select id="missionDeviceProfile" ${studentProfiles.length ? "" : "disabled"}><option value="">Choose a saved profile</option>${studentOptions}</select></label>
          <button class="btn secondary" type="button" onclick="clearSelectedMissionProfile()" ${studentProfiles.length ? "" : "disabled"}>Clear selected student</button>
          <button class="btn secondary topic-danger" type="button" onclick="resetMissionStudentDevice()" ${studentProfiles.length ? "" : "disabled"}>Reset all student data</button>
        </div>
        <p class="muted topic-device-note">Before clearing a student who needs to continue on another device, have them download a backup from My Mission ID.</p>
      </section>

      <section class="card">
        <h2>Next Build Queue</h2>
        <div class="grid">
          <div class="card span-4"><strong>Pricing Strategy</strong><p class="muted">Cost, value, competition, revenue, and pricing-psychology missions.</p></div>
          <div class="card span-4"><strong>Distribution</strong><p class="muted">Channels, access, retail, inventory, and customer-experience missions.</p></div>
          <div class="card span-4"><strong>Selling &amp; Customer Service</strong><p class="muted">Needs discovery, sales steps, recovery, loyalty, and follow-up missions.</p></div>
        </div>
      </section>
    </div>`);
  }

  window.saveTopicHubSettings = function saveTopicHubSettings(event) {
    event.preventDefault();
    const store = topicAdminStore();
    store.settings = {
      prize: document.getElementById("topicPrize").value.trim() || "Fontaine Friday Mystery Drop",
      drawingDay: document.getElementById("topicDrawingDay").value,
      entryCap: Number(document.getElementById("topicEntryCap").value || 10),
      activeTopic: document.getElementById("topicActive").value
    };
    saveTopicAdminStore(store);
    toast("Topic Hub giveaway settings saved.");
    render();
  };

  window.addTopicEntry = function addTopicEntry(event) {
    event.preventDefault();
    const store = topicAdminStore();
    const week = topicWeekKey();
    const name = document.getElementById("topicStudent").value.trim();
    const period = document.getElementById("topicPeriod").value;
    const source = document.getElementById("topicSource").value;
    const requested = Math.max(1, Math.min(4, Number(document.getElementById("topicEntries").value || 1)));
    store.ledgers[week] = store.ledgers[week] || [];
    const existing = store.ledgers[week].filter(row => row.name.toLowerCase() === name.toLowerCase() && row.period === period).reduce((sum, row) => sum + Number(row.entries || 0), 0);
    const approved = Math.min(requested, Math.max(0, store.settings.entryCap - existing));
    if (!approved) {
      toast(`${name} has reached the ${store.settings.entryCap}-entry weekly cap.`);
      return;
    }
    store.ledgers[week].push({ name, period, source, entries: approved, approvedAt: new Date().toISOString() });
    saveTopicAdminStore(store);
    toast(`${approved} ${approved === 1 ? "entry" : "entries"} approved for ${name}.`);
    render();
  };

  window.removeTopicEntry = function removeTopicEntry(index) {
    const store = topicAdminStore();
    const week = topicWeekKey();
    if (!store.ledgers[week]) return;
    store.ledgers[week].splice(index, 1);
    saveTopicAdminStore(store);
    render();
  };

  window.drawTopicWinner = function drawTopicWinner() {
    const store = topicAdminStore();
    const week = topicWeekKey();
    const ledger = store.ledgers[week] || [];
    const tickets = ledger.flatMap(row => Array.from({ length: Number(row.entries || 0) }, () => row));
    if (!tickets.length) return;
    const selected = tickets[Math.floor(Math.random() * tickets.length)];
    store.winners[week] = { name: selected.name, period: selected.period, drawnAt: new Date().toISOString() };
    saveTopicAdminStore(store);
    toast(`Winner: ${selected.name}, Period ${selected.period}.`);
    render();
  };

  window.clearTopicLedger = function clearTopicLedger() {
    if (!window.confirm("Reset this week’s approved entries and winner?")) return;
    const store = topicAdminStore();
    const week = topicWeekKey();
    delete store.ledgers[week];
    delete store.winners[week];
    saveTopicAdminStore(store);
    render();
  };

  window.exportTopicLedger = function exportTopicLedger() {
    const store = topicAdminStore();
    const ledger = currentLedger(store);
    const rows = [["Week", "Student", "Period", "Source", "Entries", "Approved At"], ...ledger.map(row => [topicWeekKey(), row.name, row.period, row.source, row.entries, row.approvedAt])];
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fontaine-mission-ledger-${topicWeekKey()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  window.clearSelectedMissionProfile = function clearSelectedMissionProfile() {
    const missionStore = window.FontaineMissionStore;
    const selectedKey = document.getElementById("missionDeviceProfile")?.value;
    const selected = missionStore?.listProfiles().find(item => item.key === selectedKey);
    if (!selected) {
      toast("Choose a student profile to clear.");
      return;
    }
    const phrase = `CLEAR ${selected.profile.first}`.toUpperCase();
    const entered = window.prompt(`To clear ${selected.profile.first} ${selected.profile.last}., Period ${selected.profile.period}, type ${phrase}`);
    if (String(entered || "").trim().toUpperCase() !== phrase) {
      toast("Student data was not cleared.");
      return;
    }
    missionStore.clearProfile({ profile: selected.profile });
    toast(`${selected.profile.first} ${selected.profile.last}.’s Mission Network data was cleared from this browser.`);
    render();
  };

  window.resetMissionStudentDevice = function resetMissionStudentDevice() {
    const missionStore = window.FontaineMissionStore;
    if (!missionStore?.listProfiles().length) return;
    const entered = window.prompt("This clears every student profile, mission, Agency project, and autosaved draft on this browser. Type RESET STUDENT DEVICE to continue.");
    if (String(entered || "").trim().toUpperCase() !== "RESET STUDENT DEVICE") {
      toast("Shared-device student data was not reset.");
      return;
    }
    missionStore.clearAllProfiles();
    toast("All Mission Network student data was cleared from this browser. Teacher records were preserved.");
    render();
  };

  if (typeof pages !== "undefined" && !pages.includes(TOPIC_ADMIN_PAGE)) {
    const resourceIndex = pages.indexOf("Resource Library");
    pages.splice(resourceIndex >= 0 ? resourceIndex : 3, 0, TOPIC_ADMIN_PAGE);
  }

  if (typeof render === "function") {
    const renderBeforeTopicHubs = render;
    render = function renderWithTopicHubs() {
      if (state.page === TOPIC_ADMIN_PAGE) {
        document.getElementById("app").outerHTML = `<div id="app">${topicHubAdminView()}</div>`;
        return;
      }
      renderBeforeTopicHubs();
    };
    render();
  }
})();
