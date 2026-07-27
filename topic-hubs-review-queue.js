(() => {
  "use strict";

  const PAGE = "Topic Hubs";
  const QUEUE_KEY = "fontaineMissionReviewQueue:v1";
  const ADMIN_KEY = "fontaineTopicHubAdmin:v1";
  const PREFIX = "FMN-REVIEW:";

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function weekKey(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
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
      return { settings: { prize: "Fontaine Friday Mystery Drop", drawingDay: "Friday", entryCap: 10, activeTopic: "Branding" }, ledgers: {}, winners: {} };
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

  function responseList(item) {
    return (item.responses || []).map(row => `<div class="review-response"><strong>Step ${row.step}</strong><p>${esc(row.response)}</p></div>`).join("");
  }

  function queueRow(item, index) {
    const status = item.status || "Pending";
    const statusClass = status.toLowerCase().replaceAll(" ", "-");
    return `<article class="card mission-review-item ${statusClass}">
      <div class="row">
        <div><span class="topic-admin-status">${esc(status)}</span><h3>${esc(item.student)} • Period ${esc(item.period)}</h3><p class="muted">${esc(item.topic)} • ${esc(item.mission)}</p></div>
        <div class="topic-admin-actions"><strong>${Number(item.provisionalEntries || 0)} provisional ${Number(item.provisionalEntries || 0) === 1 ? "entry" : "entries"}</strong></div>
      </div>
      <div class="mission-review-meta"><span><strong>Receipt:</strong> ${esc(item.receiptCode)}</span><span><strong>Imported:</strong> ${new Date(item.importedAt).toLocaleString()}</span></div>
      <details><summary>Review student responses</summary><div class="mission-review-responses">${responseList(item)}</div></details>
      ${item.teacherNote ? `<div class="briefing-callout"><strong>Teacher note:</strong> ${esc(item.teacherNote)}</div>` : ""}
      <div class="topic-admin-actions mission-review-actions">
        ${status === "Pending" ? `<button class="btn" type="button" onclick="approveMissionReview(${index})">Approve entries</button><button class="btn secondary" type="button" onclick="returnMissionReview(${index})">Return for revision</button><button class="btn secondary" type="button" onclick="rejectMissionReview(${index})">Reject</button>` : ""}
        <button class="btn secondary" type="button" onclick="deleteMissionReview(${index})">Delete record</button>
      </div>
    </article>`;
  }

  function queueSection() {
    const queue = readQueue();
    const counts = statusCounts(queue);
    return `<section class="card mission-review-queue">
      <div class="row"><div><h2>Teacher Mission Review Queue</h2><p class="muted">Students copy a review packet after completing a mission. Paste it below to review every response and approve the drawing entries.</p></div><div class="topic-admin-actions"><span class="topic-admin-status">${counts.Pending || 0} pending</span></div></div>
      <div class="mission-review-import">
        <label><strong>Paste student review packet</strong><textarea id="missionReviewPacket" placeholder="Paste the text beginning with FMN-REVIEW:"></textarea></label>
        <button class="btn" type="button" onclick="importMissionReview()">Import submission</button>
      </div>
      <div class="mission-review-summary"><span><strong>${queue.length}</strong> total</span><span><strong>${counts.Approved || 0}</strong> approved</span><span><strong>${counts["Revision Requested"] || 0}</strong> returned</span><span><strong>${counts.Rejected || 0}</strong> rejected</span></div>
      <div class="mission-review-list">${queue.length ? queue.map(queueRow).join("") : `<div class="topic-empty">No mission packets have been imported.</div>`}</div>
    </section>`;
  }

  function appendQueue() {
    if (typeof state === "undefined" || state.page !== PAGE) return;
    const container = document.querySelector(".topic-admin");
    if (!container || container.querySelector(".mission-review-queue")) return;
    container.insertAdjacentHTML("beforeend", queueSection());
  }

  window.importMissionReview = function importMissionReview() {
    const field = document.getElementById("missionReviewPacket");
    try {
      const packet = decodePacket(field?.value);
      const queue = readQueue();
      if (queue.some(item => item.receiptCode === packet.receiptCode)) {
        toast(`Duplicate receipt blocked: ${packet.receiptCode}.`);
        return;
      }
      queue.unshift({ ...packet, status: "Pending", importedAt: new Date().toISOString(), teacherNote: "" });
      writeQueue(queue);
      toast(`Imported ${packet.student} — ${packet.mission}.`);
      render();
    } catch (error) {
      toast(error.message || "The review packet could not be imported.");
    }
  };

  window.approveMissionReview = function approveMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item || item.status !== "Pending") return;
    const admin = readAdmin();
    const week = weekKey(item.submittedAt ? new Date(item.submittedAt) : new Date());
    admin.ledgers[week] = admin.ledgers[week] || [];
    const existing = admin.ledgers[week]
      .filter(row => row.name.toLowerCase() === item.student.toLowerCase() && String(row.period) === String(item.period))
      .reduce((sum, row) => sum + Number(row.entries || 0), 0);
    const requested = Math.max(0, Number(item.provisionalEntries || 0));
    const approved = Math.min(requested, Math.max(0, admin.settings.entryCap - existing));
    if (!approved) {
      toast(`${item.student} has reached the ${admin.settings.entryCap}-entry weekly cap.`);
      return;
    }
    admin.ledgers[week].push({
      name: item.student,
      period: String(item.period),
      source: `${item.topic}: ${item.mission}`,
      entries: approved,
      receiptCode: item.receiptCode,
      approvedAt: new Date().toISOString()
    });
    item.status = "Approved";
    item.approvedEntries = approved;
    item.reviewedAt = new Date().toISOString();
    queue[index] = item;
    writeAdmin(admin);
    writeQueue(queue);
    toast(`${approved} ${approved === 1 ? "entry" : "entries"} approved for ${item.student}.`);
    render();
  };

  window.returnMissionReview = function returnMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item) return;
    const note = window.prompt("What should the student revise?", "Add more specific evidence and explain the reasoning for each decision.");
    if (note === null) return;
    item.status = "Revision Requested";
    item.teacherNote = note.trim();
    item.reviewedAt = new Date().toISOString();
    queue[index] = item;
    writeQueue(queue);
    render();
  };

  window.rejectMissionReview = function rejectMissionReview(index) {
    const queue = readQueue();
    const item = queue[index];
    if (!item) return;
    const note = window.prompt("Reason for rejection:", "Incomplete, copied, off-topic, or did not meet the mission requirements.");
    if (note === null) return;
    item.status = "Rejected";
    item.teacherNote = note.trim();
    item.reviewedAt = new Date().toISOString();
    queue[index] = item;
    writeQueue(queue);
    render();
  };

  window.deleteMissionReview = function deleteMissionReview(index) {
    if (!window.confirm("Delete this review record? Approved ledger entries will remain unless removed separately.")) return;
    const queue = readQueue();
    queue.splice(index, 1);
    writeQueue(queue);
    render();
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