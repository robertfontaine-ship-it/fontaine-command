(() => {
  "use strict";

  const STORAGE_KEY = "fontaineMissionClassroomKit:v1";
  const PERIODS = ["1", "2", "3", "4", "5", "6", "7"];
  const destinationLabels = {
    "mission-control.html": "Mission Control",
    "topic-hubs.html": "Department Directory",
    "branding-hub.html": "Brand Studio",
    "target-market-hub.html": "Consumer Intelligence Center",
    "four-ps-hub.html": "Strategy War Room",
    "marketing-functions-hub.html": "Marketing Operations HQ",
    "promotional-mix-hub.html": "Campaign Command Center",
    "market-research-hub.html": "Market Research Lab",
    "pricing-strategy-hub.html": "Pricing Strategy Center",
    "distribution-hub.html": "Distribution & Logistics Center",
    "selling-customer-service-hub.html": "Customer Experience Center",
    "wolverine-agency.html": "Wolverine Marketing Agency",
    "student-mission-id.html": "My Mission ID"
  };

  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  }

  function formSettings() {
    return {
      cardPeriod: document.getElementById("cardPeriod").value,
      cardDestination: document.getElementById("cardDestination").value,
      cardMissionCode: document.getElementById("cardMissionCode").value,
      cardSubmitTo: document.getElementById("cardSubmitTo").value,
      blankCardCount: document.getElementById("blankCardCount").value,
      subTeacher: document.getElementById("subTeacher").value,
      subRoom: document.getElementById("subRoom").value,
      subMissionAccess: document.getElementById("subMissionAccess").value,
      subCommonTask: document.getElementById("subCommonTask").value,
      subSubmission: document.getElementById("subSubmission").value,
      subMission: document.getElementById("subMission").value,
      subOffline: document.getElementById("subOffline").value,
      periods: PERIODS.map(period => ({
        period,
        course: document.querySelector(`[data-period-course="${period}"]`)?.value || "",
        task: document.querySelector(`[data-period-task="${period}"]`)?.value || ""
      }))
    };
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formSettings()));
  }

  function buildPeriodInputs(saved = {}) {
    const periodData = new Map((saved.periods || []).map(item => [String(item.period), item]));
    document.getElementById("periodPlan").innerHTML = PERIODS.map(period => {
      const data = periodData.get(period) || {};
      return `<div class="period-plan-row"><strong>Period ${period}</strong><label>Course / section<input data-period-course="${period}" maxlength="70" value="${esc(data.course || "")}" placeholder="Course or planning" /></label><label>Task override<input data-period-task="${period}" maxlength="160" value="${esc(data.task || "")}" placeholder="Uses default task when blank" /></label></div>`;
    }).join("");
  }

  function hydrate() {
    const saved = readSettings();
    buildPeriodInputs(saved);
    Object.entries(saved).forEach(([id, value]) => {
      if (id === "periods" || value == null) return;
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
    const date = document.getElementById("subDate");
    if (!date.value) {
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      date.value = local.toISOString().slice(0, 10);
    }
  }

  function parseRoster(value) {
    return String(value || "").split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 42).map(line => {
      if (line.includes(",")) {
        const [lastName, ...firstParts] = line.split(",");
        return { first: firstParts.join(" ").trim().split(/\s+/)[0] || "", last: lastName.trim().slice(0, 1).toUpperCase() };
      }
      const words = line.split(/\s+/).filter(Boolean);
      return { first: words[0] || "", last: words.length > 1 ? words.at(-1).slice(0, 1).toUpperCase() : "" };
    });
  }

  function printableUrl(file) {
    try {
      return new URL(file, location.href).href.replace(/^https?:\/\//, "");
    } catch {
      return file;
    }
  }

  function checkInCard(student, settings) {
    const named = Boolean(student.first);
    const name = named ? `${student.first}${student.last ? ` ${student.last}.` : ""}` : "________________________";
    const missionCode = settings.code || "________________";
    return `<article class="checkin-card">
      <header><div><strong>WOODSIDE BUSINESS WORLD</strong><span>Fontaine Mission Network</span></div><b>STUDENT CHECK-IN</b></header>
      <div class="checkin-identity"><span><small>MISSION ID</small><strong>${esc(name)}</strong></span><span><small>PERIOD</small><strong>${esc(settings.period)}</strong></span></div>
      <div class="checkin-assignment"><small>STARTING POINT</small><strong>${esc(settings.destinationLabel)}</strong><span>${esc(printableUrl(settings.destination))}</span><span>Mission / project code: <b>${esc(missionCode)}</b></span></div>
      <ol><li>Open <b>My Mission ID</b>. Use your first name, last initial, and Period ${esc(settings.period)}.</li><li>Finish and submit the required Canvas assignment first.</li><li>Complete every mission step with specific evidence and your own reasoning.</li><li>Copy the teacher review packet. ${esc(settings.submitTo)}</li></ol>
      <footer><strong>Independent work only</strong><span>Do not use another student’s profile.</span><span>Teacher approval required • 10-entry weekly cap</span></footer>
    </article>`;
  }

  function renderCards() {
    const period = document.getElementById("cardPeriod").value;
    if (!period) {
      document.getElementById("cardStatus").textContent = "Choose a class period before generating cards.";
      document.getElementById("cardPeriod").focus();
      return false;
    }
    const roster = parseRoster(document.getElementById("cardRoster").value);
    const blankCount = Math.max(6, Math.min(42, Number(document.getElementById("blankCardCount").value || 24)));
    const students = roster.length ? roster : Array.from({ length: blankCount }, () => ({ first: "", last: "" }));
    const destination = document.getElementById("cardDestination").value;
    const settings = {
      period,
      destination,
      destinationLabel: destinationLabels[destination] || "Mission Network",
      code: document.getElementById("cardMissionCode").value.trim(),
      submitTo: document.getElementById("cardSubmitTo").value.trim() || "Submit it in the assigned location."
    };
    document.getElementById("cardPrintArea").innerHTML = students.map(student => checkInCard(student, settings)).join("");
    const pages = Math.ceil(students.length / 6);
    document.getElementById("cardStatus").textContent = `${students.length} ${roster.length ? "personalized" : "blank"} cards ready • ${pages} ${pages === 1 ? "sheet" : "sheets"}.`;
    saveSettings();
    return true;
  }

  function missionAccessText(value, mission) {
    if (value === "closed") return "Mission Network is closed. Students remain on the required or offline assignment for the full class.";
    if (value === "assigned") return `After required work, students may use only: ${mission}.`;
    return `After required work is submitted, students may open ${mission}. Mission work is optional enrichment.`;
  }

  function renderSubGuide() {
    const settings = formSettings();
    const dateValue = document.getElementById("subDate").value;
    if (!dateValue) {
      document.getElementById("subStatus").textContent = "Choose a date before generating the guide.";
      document.getElementById("subDate").focus();
      return false;
    }
    const date = new Date(`${dateValue}T12:00:00`);
    const commonTask = settings.subCommonTask.trim() || "Open Canvas and complete the posted assignment.";
    const rows = settings.periods.map(item => {
      const course = item.course.trim() || "Class / section";
      const task = item.task.trim() || commonTask;
      return `<tr><th scope="row">${esc(item.period)}</th><td>${esc(course)}</td><td>${esc(task)}</td></tr>`;
    }).join("");
    const missionText = missionAccessText(settings.subMissionAccess, settings.subMission.trim() || "Mission Control");
    document.getElementById("subGuidePrintArea").innerHTML = `<article class="sub-guide">
      <header><div><p>WOODSIDE HIGH SCHOOL • ${esc(settings.subRoom || "A202")}</p><h1>Independent Substitute Plan</h1><span>${esc(settings.subTeacher || "Mr. Fontaine")} • ${date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span></div><strong>NO GROUP WORK</strong></header>
      <section class="sub-priority"><b>Classroom priority:</b> Students work independently on the Canvas assignment listed for their period. Canvas is the official assignment and submission location.</section>
      <div class="sub-columns">
        <section><h2>Class Flow</h2><ol><li><b>Opening (0–5 min):</b> Take attendance. Students open Canvas and read the posted directions.</li><li><b>Work block:</b> Students complete the required task independently. Earbuds, phones, movement, and restroom procedures follow the posted classroom/school rules.</li><li><b>Early finishers:</b> ${esc(missionText)}</li><li><b>Last 5 minutes:</b> Students submit work, copy any teacher review packet, close tabs, sign out of Canvas when needed, and leave the device ready.</li></ol></section>
        <section><h2>Substitute Role</h2><ul><li>Keep students on the posted independent task.</li><li>Record names and a short note for repeated off-task behavior or technical problems.</li><li>Do not approve mission entries, grade mission packets, run the drawing, reset student profiles, or change Agency rosters.</li><li>If a student finishes a mission, remind them to copy the packet and submit it where directed.</li></ul></section>
      </div>
      <section><h2>Periods 1–7</h2><table><thead><tr><th>Period</th><th>Course / Section</th><th>Required Task</th></tr></thead><tbody>${rows}</tbody></table></section>
      <div class="sub-bottom-grid"><section><h2>Submission</h2><p>${esc(settings.subSubmission.trim() || "Submit in Canvas before class ends.")}</p></section><section><h2>If Technology Fails</h2><p>${esc(settings.subOffline.trim() || "Use the teacher-provided offline assignment.")}</p></section></div>
      <footer><b>Student reminder:</b> Required work first • Independent work only • Complete sentences and specific evidence • Mission rewards require teacher approval later</footer>
    </article>`;
    document.getElementById("subStatus").textContent = "One-page substitute guide ready for Periods 1–7.";
    saveSettings();
    return true;
  }

  function printTarget(target) {
    const ready = target === "cards" ? (document.querySelectorAll(".checkin-card").length || renderCards()) : (document.querySelector(".sub-guide") || renderSubGuide());
    if (!ready) return;
    document.body.dataset.printTarget = target;
    window.print();
  }

  document.getElementById("cardSetupForm").addEventListener("submit", event => { event.preventDefault(); renderCards(); });
  document.getElementById("subGuideForm").addEventListener("submit", event => { event.preventDefault(); renderSubGuide(); });
  document.getElementById("printCards").addEventListener("click", () => printTarget("cards"));
  document.getElementById("printSubGuide").addEventListener("click", () => printTarget("guide"));
  document.getElementById("clearRoster").addEventListener("click", () => {
    document.getElementById("cardRoster").value = "";
    document.getElementById("cardStatus").textContent = "Roster cleared. It was never stored in this browser.";
  });
  window.addEventListener("afterprint", () => { delete document.body.dataset.printTarget; });
  document.querySelectorAll("input, select").forEach(field => field.addEventListener("change", saveSettings));

  hydrate();
  renderSubGuide();
})();
