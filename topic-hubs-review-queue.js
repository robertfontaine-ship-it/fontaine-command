(() => {
  "use strict";

  const PAGE = "Topic Hubs";
  const QUEUE_KEY = "fontaineMissionReviewQueue:v1";
  const ADMIN_KEY = "fontaineTopicHubAdmin:v1";
  const PREFIX = "FMN-REVIEW:";
  const reviewFilters = { period: "All", status: "Pending", search: "", sort: "Newest" };
  const selectedReceipts = new Set();

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function weekKey(date = new Date()) {
    const working = new Date(date);
    if (!Number.isFinite(working.getTime())) return weekKey();
    const day = working.getDay();
    working.setDate(working.getDate() + (day === 0 ? -6 : 1 - day));
    working.setHours(0, 0, 0, 0);
    return `${working.getFullYear()}-${String(working.getMonth() + 1).padStart(2, "0")}-${String(working.getDate()).padStart(2, "0")}`;
  }

  function itemDate(item) {
    return item.resubmittedAt || item.importedAt || item.submittedAt || "";
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toLocaleString() : "Not recorded";
  }

  function readQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]") || []; }
    catch { return []; }
  }

  function writeQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  function readAdmin() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ADMIN_KEY) || "{}") || {};
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
      return {
        settings: {
          prize: "Fontaine Friday Mystery Drop",
          drawingDay: "Friday",
          entryCap: 10,
          activeTopic: "Branding"
        },
        ledgers: {},
        winners: {}
      };
    }
  }

  function writeAdmin(store) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(store));
  }

  function decodePacket(raw) {
    const trimmed = String(raw || "").trim();
    if (!trimmed.startsWith(PREFIX)) throw new Error("This is not a Fontaine Mission review packet.");
    const encoded = trimmed.slice(PREFIX.length);
    const json = decodeURIComponent(escape(atob(encoded)));
    const packet = JSON.parse(json);
    if (!packet.receiptCode || !packet.student || !packet.period || !Array.isArray(packet.responses)) {
      throw new Error("The review packet is incomplete.");
    }
    return packet;
  }

  function statusCounts(queue) {
    return queue.reduce((out, item) => {
      const status = item.status || "Pending";
      out[status] = (out[status] || 0) + 1;
      return out;
    }, {});
  }

  function studentKey(name, period) {
    return `${String(name || "").trim().toLowerCase()}|${String(period || "").trim()}`;
  }

  function queueMatchesFilters(item) {
    const status = item.status || "Pending";
    const search = reviewFilters.search.toLowerCase();
    if (reviewFilters.period !== "All" && String(item.period) !== reviewFilters.period) return false;
    if (reviewFilters.status !== "All" && status !== reviewFilters.status) return false;
    if (!search) return true;
    return [item.student, item.topic, item.mission, item.receiptCode, item.projectLaunchId, item.teamName, item.agencyRole]
      .join(" ")
      .toLowerCase()
      .includes(search);
  }

  function filteredQueue(queue) {
    const items = queue.map((item, index) => ({ item, index })).filter(({ item }) => queueMatchesFilters(item));
    items.sort((a, b) => {
      if (reviewFilters.sort === "Student A–Z") {
        return `${a.item.student}|${a.item.period}`.localeCompare(`${b.item.student}|${b.item.period}`);
      }
      const difference = new Date(itemDate(b.item)).getTime() - new Date(itemDate(a.item)).getTime();
      return reviewFilters.sort === "Oldest" ? -difference : difference;
    });
    return items;
  }

  function reviewHistory(item) {
    return Array.isArray(item.reviewHistory) ? item.reviewHistory : [];
  }

  function addReviewHistory(item, status, note, extra = {}) {
    item.reviewHistory = [...reviewHistory(item), {
      status,
      note: String(note || "").trim(),
      reviewedAt: new Date().toISOString(),
      ...extra
    }];
  }

  function responseList(item) {
    return (item.responses || [])
      .map(row => `<div class="review-response"><strong>Step ${esc(row.step)}</strong>${row.prompt ? `<span class="review-response-prompt">${esc(row.prompt)}</span>` : ""}<p>${esc(row.response)}</p></div>`)
      .join("");
  }

  function agencyContext(item) {
    if (!item.projectLaunchId && !item.teamName && !item.agencyRole) return "";
    const roster = Array.isArray(item.teamMembers) && item.teamMembers.length
      ? `<div class="mission-review-team-roster">${item.teamMembers.map(member => `<span>${esc(member.student)} — ${esc(member.role)}</span>`).join("")}</div>`
      : "";
    return `<div class="mission-review-agency-context"><strong>Agency accountability</strong><div><span><b>Project:</b> ${esc(item.projectLaunchId || "Open brief")}</span>${item.teamName ? `<span><b>Team:</b> ${esc(item.teamName)}</span>` : ""}${item.agencyRole ? `<span><b>Assigned role:</b> ${esc(item.agencyRole)}</span>` : ""}</div>${roster}</div>`;
  }

  function reviewHistoryList(item) {
    const history = reviewHistory(item);
    if (!history.length) return "";
    return `<details class="mission-review-history"><summary>Review history (${history.length})</summary><ol>${history.map(entry => `<li><strong>${esc(entry.status)}</strong> • ${formatDate(entry.reviewedAt)}${entry.note ? `<p>${esc(entry.note)}</p>` : ""}</li>`).join("")}</ol></details>`;
  }

  function queueRow(item, index) {
    const status = item.status || "Pending";
    const statusClass = status.toLowerCase().replaceAll(" ", "-");
    const pending = status === "Pending";
    const checked = selectedReceipts.has(item.receiptCode);
    const entryLabel = status === "Approved"
      ? `${Number(item.approvedEntries || 0)} approved ${Number(item.approvedEntries || 0) === 1 ? "entry" : "entries"}`
      : `${Number(item.provisionalEntries || 0)} provisional ${Number(item.provisionalEntries || 0) === 1 ? "entry" : "entries"}`;
    return `<article class="card mission-review-item ${statusClass}${checked ? " selected" : ""}" data-review-receipt="${esc(item.receiptCode)}">
      <div class="mission-review-item-heading">
        ${pending ? `<label class="mission-review-select"><input type="checkbox" data-receipt="${esc(item.receiptCode)}" ${checked ? "checked" : ""} onchange="setMissionReviewSelected(this.dataset.receipt,this.checked)" /><span>Select after review</span></label>` : ""}
        <div class="row mission-review-title-row">
          <div><span class="topic-admin-status status-${statusClass}">${esc(status)}</span><h3>${esc(item.student)} • Period ${esc(item.period)}</h3><p class="muted">${esc(item.topic)} • ${esc(item.mission)}</p></div>
          <div class="topic-admin-actions"><strong>${entryLabel}</strong></div>
        </div>
      </div>
      <div class="mission-review-meta"><span><strong>Receipt:</strong> ${esc(item.receiptCode)}</span><span><strong>Imported:</strong> ${formatDate(item.importedAt || item.submittedAt)}</span>${item.resubmittedAt ? `<span><strong>Resubmitted:</strong> ${formatDate(item.resubmittedAt)} • Revision ${Number(item.revisionCount || 1)}</span>` : ""}</div>
      ${agencyContext(item)}
      <details class="mission-review-evidence"><summary>Review ${Number(item.responses?.length || 0)} student responses</summary><div class="mission-review-responses">${responseList(item)}</div></details>
      ${item.teacherNote ? `<div class="briefing-callout"><strong>Teacher note:</strong> ${esc(item.teacherNote)}</div>` : ""}
      ${reviewHistoryList(item)}
      <div class="topic-admin-actions mission-review-actions">
        ${pending ? `<button class="btn" type="button" onclick="approveMissionReview(${index})">Approve entries</button><button class="btn secondary" type="button" onclick="returnMissionReview(${index})">Return for revision</button><button class="btn secondary" type="button" onclick="rejectMissionReview(${index})">Reject</button>` : ""}
        ${!pending && item.teacherNote ? `<button class="btn secondary" type="button" onclick="copyMissionReviewFeedback(${index})">Copy feedback</button>` : ""}
        <button class="btn secondary" type="button" onclick="deleteMissionReview(${index})">Delete record</button>
      </div>
    </article>`;
  }

  function periodSummary(queue, admin, week = weekKey()) {
    const weeklyQueue = queue.filter(item => weekKey(item.submittedAt || item.importedAt) === week);
    const weeklyLedger = admin.ledgers[week] || [];
    const rows = Array.from({ length: 7 }, (_, offset) => {
      const period = String(offset + 1);
      const submissions = weeklyQueue.filter(item => String(item.period) === period);
      const ledger = weeklyLedger.filter(item => String(item.period) === period);
      const students = new Set([
        ...submissions.map(item => studentKey(item.student, period)),
        ...ledger.map(item => studentKey(item.name, period))
      ]);
      return {
        period,
        students: students.size,
        submissions: submissions.length,
        approved: submissions.filter(item => item.status === "Approved").length,
        pending: submissions.filter(item => (item.status || "Pending") === "Pending").length,
        revisions: submissions.reduce((sum, item) => sum + Number(item.revisionCount || 0) + (item.status === "Revision Requested" ? 1 : 0), 0),
        rejected: submissions.filter(item => item.status === "Rejected").length,
        entries: ledger.reduce((sum, item) => sum + Number(item.entries || 0), 0)
      };
    });
    const totals = rows.reduce((out, row) => {
      Object.keys(out).forEach(key => { out[key] += Number(row[key] || 0); });
      return out;
    }, { students: 0, submissions: 0, approved: 0, pending: 0, revisions: 0, rejected: 0, entries: 0 });
    totals.students = new Set([
      ...weeklyQueue.map(item => studentKey(item.student, item.period)),
      ...weeklyLedger.map(item => studentKey(item.name, item.period))
    ]).size;
    return { week, rows, totals, weeklyQueue, weeklyLedger };
  }

  function weeklyParticipationSection(queue, admin) {
    const report = periodSummary(queue, admin);
    return `<details class="mission-weekly-report" open>
      <summary>Weekly participation summary • Week of ${esc(report.week)}</summary>
      <div class="mission-weekly-metrics">
        <div><strong>${report.totals.students}</strong><span>participating students</span></div>
        <div><strong>${report.totals.submissions}</strong><span>mission submissions</span></div>
        <div><strong>${report.totals.pending}</strong><span>awaiting review</span></div>
        <div><strong>${report.totals.entries}</strong><span>entries awarded</span></div>
      </div>
      <div class="mission-weekly-table-wrap"><table class="mission-weekly-table"><thead><tr><th>Period</th><th>Students</th><th>Submitted</th><th>Approved</th><th>Pending</th><th>Revision cycles</th><th>Rejected</th><th>Entries</th></tr></thead><tbody>${report.rows.map(row => `<tr><th scope="row">${row.period}</th><td>${row.students}</td><td>${row.submissions}</td><td>${row.approved}</td><td>${row.pending}</td><td>${row.revisions}</td><td>${row.rejected}</td><td>${row.entries}</td></tr>`).join("")}<tr class="mission-weekly-total"><th scope="row">All</th><td>${report.totals.students}</td><td>${report.totals.submissions}</td><td>${report.totals.approved}</td><td>${report.totals.pending}</td><td>${report.totals.revisions}</td><td>${report.totals.rejected}</td><td>${report.totals.entries}</td></tr></tbody></table></div>
      <div class="topic-admin-actions"><button class="btn secondary" type="button" onclick="exportMissionWeeklyReport()">Export weekly report</button></div>
    </details>`;
  }

  function agencyTeamSection(queue) {
    const groups = new Map();
    const currentWeek = weekKey();
    queue
      .filter(item => item.projectLaunchId && item.teamName && weekKey(item.submittedAt || item.importedAt) === currentWeek)
      .forEach(item => {
        const key = `${item.projectLaunchId}|${item.teamName}|${item.period}`;
        const group = groups.get(key) || {
          projectName: item.mission,
          teamName: item.teamName,
          period: item.period,
          expected: [],
          submissions: []
        };
        group.submissions.push(item);
        if (group.expected.length < (item.teamMembers || []).length) group.expected = item.teamMembers;
        groups.set(key, group);
      });
    if (!groups.size) return "";

    const cards = [...groups.values()]
      .sort((a, b) => `${a.period}|${a.projectName}|${a.teamName}`.localeCompare(`${b.period}|${b.projectName}|${b.teamName}`))
      .map(group => {
        const submitted = new Set(group.submissions.map(item => String(item.student || "").trim().toLowerCase()));
        const roleRows = group.expected.map(member => {
          const student = String(member.student || "").trim();
          const complete = submitted.has(student.toLowerCase());
          return `<li class="${complete ? "submitted" : "waiting"}"><span>${complete ? "✓" : "○"} ${esc(member.role || "Agency role")}</span><strong>${esc(student)}</strong></li>`;
        }).join("");
        const approved = group.submissions.filter(item => item.status === "Approved").length;
        const returned = group.submissions.filter(item => item.status === "Revision Requested").length;
        const expectedCount = group.expected.length || group.submissions.length;
        return `<article class="mission-agency-team-card"><div><span class="topic-admin-status">Period ${esc(group.period)}</span><h4>${esc(group.projectName)} • ${esc(group.teamName)}</h4><p class="muted">${group.submissions.length} of ${expectedCount} individual role packets submitted • ${approved} approved${returned ? ` • ${returned} returned` : ""}</p></div><ul>${roleRows || group.submissions.map(item => `<li class="submitted"><span>✓ ${esc(item.agencyRole || "Agency role")}</span><strong>${esc(item.student)}</strong></li>`).join("")}</ul></article>`;
      }).join("");

    return `<details class="mission-agency-team-report" open><summary>Agency team accountability • ${groups.size} active ${groups.size === 1 ? "team" : "teams"} this week</summary><p class="muted">See which professional roles have submitted individual evidence before approving the team’s client work.</p><div class="mission-agency-team-grid">${cards}</div></details>`;
  }

  function filterControls() {
    const periodOptions = ["All", "1", "2", "3", "4", "5", "6", "7"]
      .map(period => `<option value="${period}" ${reviewFilters.period === period ? "selected" : ""}>${period === "All" ? "All periods" : `Period ${period}`}</option>`)
      .join("");
    const statuses = ["Pending", "Revision Requested", "Approved", "Rejected", "All"]
      .map(status => `<option ${reviewFilters.status === status ? "selected" : ""}>${status === "All" ? "All statuses" : status}</option>`)
      .join("");
    const sorts = ["Newest", "Oldest", "Student A–Z"]
      .map(sort => `<option ${reviewFilters.sort === sort ? "selected" : ""}>${sort}</option>`)
      .join("");
    return `<form class="mission-review-filters" onsubmit="applyMissionReviewFilters(event)">
      <label>Class period<select id="missionReviewPeriod">${periodOptions}</select></label>
      <label>Review status<select id="missionReviewStatus">${statuses}</select></label>
      <label>Search student or mission<input id="missionReviewSearch" value="${esc(reviewFilters.search)}" placeholder="Name, topic, mission, or receipt" /></label>
      <label>Sort order<select id="missionReviewSort">${sorts}</select></label>
      <div class="mission-review-filter-actions"><button class="btn" type="submit">Apply filters</button><button class="btn secondary" type="button" onclick="resetMissionReviewFilters()">Reset filters</button></div>
    </form>`;
  }

  function batchToolbar(visible) {
    const selectable = visible.filter(({ item }) => (item.status || "Pending") === "Pending").length;
    const selected = [...selectedReceipts].length;
    return `<div class="mission-review-batch" aria-label="Batch review actions">
      <div><strong id="missionReviewSelectedCount">${selected} selected</strong><span>Batch actions only affect pending work you select after reviewing.</span></div>
      <div class="topic-admin-actions"><button class="btn secondary" type="button" onclick="selectVisibleMissionReviews()" ${selectable ? "" : "disabled"}>Select visible pending</button><button class="btn secondary" id="clearMissionReviewSelection" type="button" onclick="clearMissionReviewSelection()" ${selected ? "" : "disabled"}>Clear selection</button><button class="btn" id="batchApproveMissionReviews" type="button" onclick="batchApproveMissionReviews()" ${selected ? "" : "disabled"}>Approve selected</button><button class="btn secondary" id="batchReturnMissionReviews" type="button" onclick="batchReturnMissionReviews()" ${selected ? "" : "disabled"}>Return selected</button></div>
    </div>`;
  }

  function queueSection() {
    const queue = readQueue();
    const counts = statusCounts(queue);
    const pendingCodes = new Set(queue.filter(item => (item.status || "Pending") === "Pending").map(item => item.receiptCode));
    [...selectedReceipts].forEach(receipt => { if (!pendingCodes.has(receipt)) selectedReceipts.delete(receipt); });
    const visible = filteredQueue(queue);
    const emptyMessage = queue.length
      ? "No submissions match the current filters."
      : "No mission packets have been imported.";
    return `<section class="card mission-review-queue" id="mission-review-queue">
      <div class="row"><div><h2>Teacher Mission Review Queue</h2><p class="muted">Paste student packets, review the evidence, then approve, return, or reject from one screen. Start with one class period when the queue is busy.</p></div><div class="topic-admin-actions"><span class="topic-admin-status">${counts.Pending || 0} pending</span></div></div>
      <div class="mission-review-import">
        <label><strong>Paste student review packet</strong><textarea id="missionReviewPacket" placeholder="Paste the text beginning with FMN-REVIEW:"></textarea></label>
        <button class="btn" type="button" onclick="importMissionReview()">Import submission</button>
      </div>
      <div class="mission-review-summary" aria-label="Review queue totals"><span><strong>${queue.length}</strong> total</span><span><strong>${counts.Pending || 0}</strong> pending</span><span><strong>${counts.Approved || 0}</strong> approved</span><span><strong>${counts["Revision Requested"] || 0}</strong> returned</span><span><strong>${counts.Rejected || 0}</strong> rejected</span></div>
      ${weeklyParticipationSection(queue, readAdmin())}
      ${agencyTeamSection(queue)}
      <section class="mission-review-worklist" aria-labelledby="missionReviewWorklistTitle"><div class="row"><div><h3 id="missionReviewWorklistTitle">Review worklist</h3><p class="muted">Showing ${visible.length} of ${queue.length} submissions.</p></div></div>${filterControls()}${batchToolbar(visible)}<div class="mission-review-list">${visible.length ? visible.map(({ item, index }) => queueRow(item, index)).join("") : `<div class="topic-empty">${emptyMessage}</div>`}</div></section>
    </section>`;
  }

  function appendQueue() {
    if (typeof state === "undefined" || state.page !== PAGE) return;
    const container = document.querySelector(".topic-admin");
    if (!container || container.querySelector(".mission-review-queue")) return;
    const metricGrid = container.querySelector(":scope > .grid");
    if (metricGrid) metricGrid.insertAdjacentHTML("afterend", queueSection());
    else container.insertAdjacentHTML("beforeend", queueSection());
  }

  function approvalResult(item, admin) {
    const week = weekKey(item.submittedAt ? new Date(item.submittedAt) : new Date());
    admin.ledgers[week] = admin.ledgers[week] || [];
    const duplicateLedger = admin.ledgers[week].find(row => row.receiptCode && row.receiptCode === item.receiptCode);
    if (duplicateLedger) {
      item.status = "Approved";
      item.approvedEntries = Number(duplicateLedger.entries || 0);
      item.teacherNote = "Work approved. This receipt was already present in the weekly ledger, so no duplicate entries were added.";
      item.reviewedAt = new Date().toISOString();
      addReviewHistory(item, "Approved", item.teacherNote, { approvedEntries: item.approvedEntries });
      return { awarded: 0, duplicate: true };
    }
    const existing = admin.ledgers[week]
      .filter(row => String(row.name || "").toLowerCase() === String(item.student || "").toLowerCase() && String(row.period) === String(item.period))
      .reduce((sum, row) => sum + Number(row.entries || 0), 0);
    const requested = Math.max(0, Number(item.provisionalEntries || 0));
    const approved = Math.min(requested, Math.max(0, admin.settings.entryCap - existing));
    if (approved) {
      admin.ledgers[week].push({
        name: item.student,
        period: String(item.period),
        source: `${item.topic}: ${item.mission}`,
        entries: approved,
        receiptCode: item.receiptCode,
        approvedAt: new Date().toISOString()
      });
    }
    item.status = "Approved";
    item.approvedEntries = approved;
    item.teacherNote = !approved
      ? `Work approved. No additional drawing entries were added because the ${admin.settings.entryCap}-entry weekly cap was already reached.`
      : approved < requested
        ? `${approved} of ${requested} requested entries were added because the weekly cap was reached.`
        : "";
    item.reviewedAt = new Date().toISOString();
    addReviewHistory(item, "Approved", item.teacherNote, { approvedEntries: approved });
    return { awarded: approved, duplicate: false };
  }

  function selectedPending(queue) {
    return queue
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => selectedReceipts.has(item.receiptCode) && (item.status || "Pending") === "Pending");
  }

  function downloadCsv(rows, filename) {
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  window.importMissionReview = function importMissionReview() {
    const field = document.getElementById("missionReviewPacket");
    try {
      const packet = decodePacket(field?.value);
      const queue = readQueue();
      const duplicateIndex = queue.findIndex(item => item.receiptCode === packet.receiptCode);
      if (duplicateIndex >= 0 && queue[duplicateIndex].status === "Revision Requested") {
        const previous = queue[duplicateIndex];
        queue[duplicateIndex] = {
          ...previous,
          ...packet,
          status: "Pending",
          teacherNote: "",
          resubmittedAt: new Date().toISOString(),
          revisionCount: Number(previous.revisionCount || 0) + 1,
          reviewHistory: reviewHistory(previous)
        };
        writeQueue(queue);
        if (field) field.value = "";
        toast(`Revised submission received from ${packet.student}.`);
        render();
        return;
      }
      if (duplicateIndex >= 0) {
        toast(`Duplicate receipt blocked: ${packet.receiptCode}.`);
        return;
      }
      queue.unshift({ ...packet, status: "Pending", importedAt: new Date().toISOString(), teacherNote: "", reviewHistory: [] });
      writeQueue(queue);
      if (field) field.value = "";
      toast(`Imported ${packet.student} — ${packet.mission}.`);
      render();
    } catch (error) {
      toast(error.message || "The review packet could not be imported.");
    }
  };

  window.approveMissionReview = function approveMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item || (item.status || "Pending") !== "Pending") return;
    const admin = readAdmin();
    const result = approvalResult(item, admin);
    queue[index] = item;
    selectedReceipts.delete(item.receiptCode);
    writeAdmin(admin);
    writeQueue(queue);
    if (result.duplicate) toast(`${item.student}'s work was approved; duplicate ledger credit was blocked.`);
    else if (!result.awarded) toast(`${item.student}'s work was approved; the weekly entry cap was already reached.`);
    else toast(`${result.awarded} ${result.awarded === 1 ? "entry" : "entries"} approved for ${item.student}.`);
    render();
  };

  window.returnMissionReview = function returnMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item || (item.status || "Pending") !== "Pending") return;
    const note = window.prompt("What should the student revise?", "Add more specific evidence and explain the reasoning for each decision.");
    if (note === null) return;
    if (!note.trim()) {
      toast("Add a specific revision note before returning the work.");
      return;
    }
    item.status = "Revision Requested";
    item.teacherNote = note.trim();
    item.reviewedAt = new Date().toISOString();
    addReviewHistory(item, "Revision Requested", item.teacherNote);
    selectedReceipts.delete(item.receiptCode);
    queue[index] = item;
    writeQueue(queue);
    toast(`${item.student}'s submission was returned with a revision note.`);
    render();
  };

  window.rejectMissionReview = function rejectMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item || (item.status || "Pending") !== "Pending") return;
    const note = window.prompt("Reason for rejection:", "Incomplete, copied, off-topic, or did not meet the mission requirements.");
    if (note === null) return;
    if (!note.trim()) {
      toast("Add a specific reason before rejecting the work.");
      return;
    }
    item.status = "Rejected";
    item.teacherNote = note.trim();
    item.reviewedAt = new Date().toISOString();
    addReviewHistory(item, "Rejected", item.teacherNote);
    selectedReceipts.delete(item.receiptCode);
    queue[index] = item;
    writeQueue(queue);
    toast(`${item.student}'s submission was rejected with a reason.`);
    render();
  };

  window.deleteMissionReview = function deleteMissionReview(index) {
    if (!window.confirm("Delete this review record? Approved ledger entries will remain unless removed separately.")) return;
    const queue = readQueue();
    const [removed] = queue.splice(index, 1);
    if (removed) selectedReceipts.delete(removed.receiptCode);
    writeQueue(queue);
    render();
  };

  window.copyMissionReviewFeedback = async function copyMissionReviewFeedback(index) {
    const item = readQueue()[index];
    if (!item) return;
    const nextStep = item.status === "Revision Requested"
      ? "Revise the original mission, create the receipt again, and resubmit the packet with the same receipt code."
      : item.status === "Rejected"
        ? "Speak with Mr. Fontaine before starting this mission again."
        : "No revision is required.";
    const feedback = [
      "FONTAINE MISSION FEEDBACK",
      `Student: ${item.student}`,
      `Period: ${item.period}`,
      `Mission: ${item.topic} — ${item.mission}`,
      `Status: ${item.status || "Pending"}`,
      `Teacher note: ${item.teacherNote || "No additional note."}`,
      `Next step: ${nextStep}`,
      `Receipt: ${item.receiptCode}`
    ].join("\n");
    try {
      await navigator.clipboard.writeText(feedback);
      toast(`Feedback copied for ${item.student}.`);
    } catch {
      window.prompt("Copy this mission feedback:", feedback);
    }
  };

  window.applyMissionReviewFilters = function applyMissionReviewFilters(event) {
    event.preventDefault();
    reviewFilters.period = document.getElementById("missionReviewPeriod")?.value || "All";
    reviewFilters.status = document.getElementById("missionReviewStatus")?.value || "Pending";
    reviewFilters.search = document.getElementById("missionReviewSearch")?.value.trim() || "";
    reviewFilters.sort = document.getElementById("missionReviewSort")?.value || "Newest";
    selectedReceipts.clear();
    render();
  };

  window.resetMissionReviewFilters = function resetMissionReviewFilters() {
    Object.assign(reviewFilters, { period: "All", status: "Pending", search: "", sort: "Newest" });
    selectedReceipts.clear();
    render();
  };

  window.setMissionReviewSelected = function setMissionReviewSelected(receipt, checked) {
    if (checked) selectedReceipts.add(receipt);
    else selectedReceipts.delete(receipt);
    const card = [...(document.querySelectorAll?.("[data-review-receipt]") || [])]
      .find(node => node.dataset.reviewReceipt === receipt);
    card?.classList.toggle("selected", checked);
    const count = selectedReceipts.size;
    const countNode = document.getElementById("missionReviewSelectedCount");
    if (countNode) countNode.textContent = `${count} selected`;
    ["clearMissionReviewSelection", "batchApproveMissionReviews", "batchReturnMissionReviews"].forEach(id => {
      const button = document.getElementById(id);
      if (button) button.disabled = count === 0;
    });
  };

  window.selectVisibleMissionReviews = function selectVisibleMissionReviews() {
    document.querySelectorAll(".mission-review-select input[data-receipt]").forEach(input => {
      input.checked = true;
      selectedReceipts.add(input.dataset.receipt);
      input.closest(".mission-review-item")?.classList.add("selected");
    });
    const count = selectedReceipts.size;
    const countNode = document.getElementById("missionReviewSelectedCount");
    if (countNode) countNode.textContent = `${count} selected`;
    ["clearMissionReviewSelection", "batchApproveMissionReviews", "batchReturnMissionReviews"].forEach(id => {
      const button = document.getElementById(id);
      if (button) button.disabled = count === 0;
    });
  };

  window.clearMissionReviewSelection = function clearMissionReviewSelection() {
    selectedReceipts.clear();
    document.querySelectorAll(".mission-review-select input[data-receipt]").forEach(input => { input.checked = false; });
    document.querySelectorAll(".mission-review-item.selected").forEach(card => card.classList.remove("selected"));
    const countNode = document.getElementById("missionReviewSelectedCount");
    if (countNode) countNode.textContent = "0 selected";
    ["clearMissionReviewSelection", "batchApproveMissionReviews", "batchReturnMissionReviews"].forEach(id => {
      const button = document.getElementById(id);
      if (button) button.disabled = true;
    });
  };

  window.batchApproveMissionReviews = function batchApproveMissionReviews() {
    const queue = readQueue();
    const pending = selectedPending(queue);
    if (!pending.length) {
      toast("Select at least one pending submission.");
      return;
    }
    if (!window.confirm(`Approve ${pending.length} selected ${pending.length === 1 ? "submission" : "submissions"}? Weekly entry caps will be applied to each student.`)) return;
    const admin = readAdmin();
    let entries = 0;
    pending.forEach(({ item, index }) => {
      entries += approvalResult(item, admin).awarded;
      queue[index] = item;
    });
    writeAdmin(admin);
    writeQueue(queue);
    selectedReceipts.clear();
    toast(`${pending.length} ${pending.length === 1 ? "submission" : "submissions"} approved; ${entries} ${entries === 1 ? "entry" : "entries"} added.`);
    render();
  };

  window.batchReturnMissionReviews = function batchReturnMissionReviews() {
    const queue = readQueue();
    const pending = selectedPending(queue);
    if (!pending.length) {
      toast("Select at least one pending submission.");
      return;
    }
    const note = window.prompt(`Return ${pending.length} selected ${pending.length === 1 ? "submission" : "submissions"} with one shared revision note:`, "Add more specific evidence and explain the reasoning for each decision.");
    if (note === null) return;
    if (!note.trim()) {
      toast("Add a specific revision note before returning selected work.");
      return;
    }
    pending.forEach(({ item, index }) => {
      item.status = "Revision Requested";
      item.teacherNote = note.trim();
      item.reviewedAt = new Date().toISOString();
      addReviewHistory(item, "Revision Requested", item.teacherNote);
      queue[index] = item;
    });
    writeQueue(queue);
    selectedReceipts.clear();
    toast(`${pending.length} ${pending.length === 1 ? "submission was" : "submissions were"} returned with revision guidance.`);
    render();
  };

  window.exportMissionWeeklyReport = function exportMissionWeeklyReport() {
    const queue = readQueue();
    const admin = readAdmin();
    const report = periodSummary(queue, admin);
    const rows = [["Week", "Record Type", "Student", "Period", "Topic or Source", "Mission", "Project Launch", "Team", "Agency Role", "Status", "Revision Count", "Entries", "Receipt", "Submitted or Approved", "Reviewed", "Teacher Note"]];
    report.weeklyQueue.forEach(item => rows.push([
      report.week,
      "Submission",
      item.student,
      item.period,
      item.topic,
      item.mission,
      item.projectLaunchId || "",
      item.teamName || "",
      item.agencyRole || "",
      item.status || "Pending",
      Number(item.revisionCount || 0),
      Number(item.approvedEntries || 0),
      item.receiptCode,
      item.submittedAt || item.importedAt,
      item.reviewedAt || "",
      item.teacherNote || ""
    ]));
    report.weeklyLedger.forEach(item => rows.push([
      report.week,
      "Ledger Entry",
      item.name,
      item.period,
      item.source,
      "",
      "",
      "",
      "",
      "Entry awarded",
      "",
      Number(item.entries || 0),
      item.receiptCode || "",
      item.approvedAt || "",
      "",
      ""
    ]));
    downloadCsv(rows, `fontaine-mission-weekly-report-${report.week}.csv`);
  };

  if (typeof render === "function") {
    const beforeReviewQueue = render;
    render = function renderWithMissionReviewQueue() {
      beforeReviewQueue();
      appendQueue();
    };
    render();
  }
})();
