(() => {
  "use strict";

  const STORAGE_KEY = "fontaineTeacherLaunch:v1";
  const REVIEW_QUEUE_KEY = "fontaineMissionReviewQueue:v1";
  const ADMIN_KEY = "fontaineTopicHubAdmin:v1";
  const PERIODS = ["1", "2", "3", "4", "5", "6", "7"];
  const COURSE_OPTIONS = [
    ["", "Not using Business World"],
    ["SEM", "Sports & Entertainment Marketing 8175"],
    ["Fashion", "Fashion Marketing 8140"],
    ["Entrepreneurship", "Entrepreneurship 9093"],
    ["Other", "Other / flexible use"]
  ];
  const MODE_OPTIONS = [
    ["closed", "Closed for this period"],
    ["orientation", "New Hire Orientation"],
    ["quick", "Quick Mission"],
    ["pathway", "Course Pathway"],
    ["wrs", "WRS Career Center"],
    ["agency", "Wolverine Agency"]
  ];

  let launchState = readState();
  let toastTimer;

  function safeObject(value, fallback = {}) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readState() {
    const saved = safeObject(readJson(STORAGE_KEY, {}));
    return {
      checks: safeObject(saved.checks),
      periods: PERIODS.map(period => {
        const record = Array.isArray(saved.periods) ? saved.periods.find(item => String(item?.period) === period) : null;
        return { period, course: String(record?.course || ""), mode: String(record?.mode || "closed") };
      }),
      canvas: {
        period: PERIODS.includes(String(saved.canvas?.period)) ? String(saved.canvas.period) : "1",
        course: ["SEM", "Fashion", "Entrepreneurship"].includes(saved.canvas?.course) ? saved.canvas.course : "SEM",
        type: ["orientation", "mission", "pathway", "early-finisher"].includes(saved.canvas?.type) ? saved.canvas.type : "orientation"
      }
    };
  }

  function saveState(message = "Launch plan saved on this browser.") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(launchState));
    const status = document.getElementById("periodSaveStatus");
    if (status) status.textContent = message;
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function options(items, selected) {
    return items.map(([value, label]) => `<option value="${esc(value)}"${value === selected ? " selected" : ""}>${esc(label)}</option>`).join("");
  }

  function showToast(message) {
    const toast = document.getElementById("launchToast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    showToast(successMessage);
  }

  function absoluteLink(relative) {
    return new URL(relative, location.href).href;
  }

  function hydrateChecks() {
    document.querySelectorAll("[data-launch-check]").forEach(input => {
      const key = input.dataset.launchCheck;
      input.checked = Boolean(launchState.checks[key]);
      input.addEventListener("change", () => {
        launchState.checks[key] = input.checked;
        saveState();
        updateReadiness();
      });
    });
    updateReadiness();
  }

  function updateReadiness() {
    const checks = [...document.querySelectorAll("[data-launch-check]")];
    const complete = checks.filter(input => input.checked).length;
    const percent = checks.length ? Math.round(complete / checks.length * 100) : 0;
    document.getElementById("readinessPercent").textContent = `${percent}%`;
    document.getElementById("readinessBar").style.width = `${percent}%`;
    document.getElementById("readinessMessage").textContent = percent === 100
      ? "All six checks are green. The classroom launch is ready."
      : `${complete} of ${checks.length} preflight checks complete.`;
  }

  function renderPeriods() {
    const plan = document.getElementById("periodPlan");
    plan.innerHTML = launchState.periods.map(record => `<div class="period-row" data-period-row="${record.period}">
      <strong>Period ${record.period}</strong>
      <label>Course<select data-period-course="${record.period}">${options(COURSE_OPTIONS, record.course)}</select></label>
      <label>Starting mode<select data-period-mode="${record.period}">${options(MODE_OPTIONS, record.mode)}</select></label>
    </div>`).join("");

    plan.querySelectorAll("select").forEach(select => select.addEventListener("change", () => {
      const period = select.dataset.periodCourse || select.dataset.periodMode;
      const record = launchState.periods.find(item => item.period === period);
      if (!record) return;
      if (select.dataset.periodCourse) {
        record.course = select.value;
        if (!record.course) record.mode = "closed";
        else if (record.mode === "closed") record.mode = "orientation";
      } else {
        record.mode = select.value;
      }
      saveState(`Period ${period} launch lane saved.`);
      renderPeriods();
    }));

    const configured = launchState.periods.filter(item => item.course && item.mode !== "closed").length;
    document.getElementById("periodSaveStatus").textContent = configured
      ? `${configured} ${configured === 1 ? "period is" : "periods are"} configured for Business World.`
      : "No periods are open yet. Choose a course to activate a launch lane.";
  }

  function browserMetrics() {
    const profiles = window.FontaineMissionStore?.listProfiles?.() || [];
    const queue = readJson(REVIEW_QUEUE_KEY, []);
    const reviews = Array.isArray(queue) ? queue : [];
    const admin = safeObject(readJson(ADMIN_KEY, {}));
    const ledgers = safeObject(admin.ledgers);
    const entries = Object.values(ledgers).reduce((total, rows) => total + (Array.isArray(rows) ? rows.reduce((sum, row) => sum + Math.max(0, Number(row?.entries || 0)), 0) : 0), 0);
    document.getElementById("savedProfiles").textContent = profiles.length;
    document.getElementById("pendingReviews").textContent = reviews.filter(item => item?.status === "Pending" || !item?.status).length;
    document.getElementById("approvedEntries").textContent = entries;
  }

  function courseName(course) {
    if (course === "Fashion") return "Fashion Marketing 8140";
    if (course === "Entrepreneurship") return "Entrepreneurship 9093";
    return "Sports & Entertainment Marketing 8175";
  }

  function canvasPost({ period, course, type }) {
    const courseLabel = courseName(course);
    const cityHall = absoluteLink("business-world.html");
    const missionId = absoluteLink("student-mission-id.html");
    const pathways = absoluteLink(`course-pathways.html?course=${course === "Fashion" ? "fashion" : course === "Entrepreneurship" ? "entrepreneurship" : "sem"}`);
    const header = `${courseLabel} • Period ${period}`;

    if (type === "mission") return `📋 WOODSIDE BUSINESS WORLD — ASSIGNED MISSION\n${header}\n\n1. Open City Hall: ${cityHall}\n2. Confirm your Mission ID uses your first name, last initial, and Period ${period}.\n3. Complete the assigned mission: [ADD MISSION CODE OR DESTINATION].\n4. Answer every prompt with specific evidence and your own reasoning.\n5. Create the teacher review packet only after all work is complete.\n\n📤 SUBMIT IN CANVAS\nPaste the complete teacher review packet into this assignment. Canvas is the official submission location.\n\n✅ QUALITY CHECK\n• Required classwork comes first.\n• Complete sentences and specific evidence are required.\n• Mission rewards remain provisional until teacher approval.\n• You may revise returned work and resubmit.`;

    if (type === "pathway") return `🧭 WOODSIDE BUSINESS WORLD — COURSE MASTERY GATE\n${header}\n\n1. Open your course pathway: ${pathways}\n2. Confirm the correct Mission ID and Period ${period}.\n3. Open your current gate and complete one listed applied mission.\n4. Return to the pathway and take the five-question mastery check.\n5. Score at least 4 of 5 correct (80%) to unlock the next gate.\n\n📤 SUBMIT IN CANVAS\nPaste the applied-mission teacher review packet. Then add:\n• Gate name\n• Attempt score\n• “Mastered” or “Not yet”\n\n🎯 MASTERY RULE\n80% is required. Attempts are unlimited. A missed skill creates a direct review route; review it before retrying. Canvas remains the official gradebook.`;

    if (type === "early-finisher") return `⚡ EARLY FINISHER MISSION\n${header}\n\nRequired Canvas work must be finished and submitted first.\n\n1. Open City Hall: ${cityHall}\n2. Confirm your own Mission ID and Period ${period}.\n3. Choose a Quick Mission or continue your active course gate.\n4. Complete every prompt with specific evidence.\n5. Create the teacher review packet.\n\n📤 SUBMIT\nPaste the review packet in the teacher-designated Canvas assignment or save it until the teacher opens one. Mission rewards require teacher approval and follow the weekly cap.`;

    return `🏛️ WOODSIDE BUSINESS WORLD — NEW HIRE ORIENTATION\n${header}\n\n1. Open My Mission ID: ${missionId}\n2. Create or select your profile using ONLY your first name, last initial, and Period ${period}.\n3. Open City Hall: ${cityHall}\n4. Find Departments, Pathways, Agency, Passport, and My Mission ID.\n5. Remember the route: Learn → Apply → Prove. Course gates require 4 of 5 correct (80%).\n6. Required Canvas work always comes first. Canvas is the official submission and gradebook location.\n\n📤 CANVAS CHECK-IN\nSubmit three short lines:\n• My Mission ID is ready.\n• My course is ${courseLabel}.\n• One Business World destination I can explain is __________.\n\n🔒 SHARED-DEVICE RULE\nUse Switch Profile. Never type over another student’s work or use another student’s Mission ID.`;
  }

  function hydrateCanvas() {
    const period = document.getElementById("canvasPeriod");
    const course = document.getElementById("canvasCourse");
    const type = document.getElementById("canvasType");
    period.value = launchState.canvas.period;
    course.value = launchState.canvas.course;
    type.value = launchState.canvas.type;
    renderCanvasPost();

    document.getElementById("canvasForm").addEventListener("submit", event => {
      event.preventDefault();
      launchState.canvas = { period: period.value, course: course.value, type: type.value };
      saveState("Canvas handoff settings saved.");
      renderCanvasPost();
      showToast("Canvas directions refreshed.");
    });

    [period, course, type].forEach(field => field.addEventListener("change", () => {
      launchState.canvas = { period: period.value, course: course.value, type: type.value };
      saveState("Canvas handoff settings saved.");
      renderCanvasPost();
    }));
  }

  function renderCanvasPost() {
    document.getElementById("canvasPreview").textContent = canvasPost(launchState.canvas);
  }

  function bindActions() {
    document.querySelectorAll("[data-copy-link]").forEach(button => button.addEventListener("click", () => {
      copyText(absoluteLink(button.dataset.copyLink), "Permanent link copied.");
    }));

    document.getElementById("copyCanvasDirections").addEventListener("click", () => {
      copyText(document.getElementById("canvasPreview").textContent, "Canvas directions copied.");
    });
    document.getElementById("printLaunchPlan").addEventListener("click", () => window.print());
    document.getElementById("resetLaunchPlan").addEventListener("click", () => {
      if (!window.confirm("Clear only this browser’s launch checklist, period setup, and Canvas-template selections? Student and teacher records will stay untouched.")) return;
      localStorage.removeItem(STORAGE_KEY);
      launchState = readState();
      document.querySelectorAll("[data-launch-check]").forEach(input => {
        input.checked = Boolean(launchState.checks[input.dataset.launchCheck]);
      });
      updateReadiness();
      renderPeriods();
      hydrateCanvasValues();
      showToast("Fresh launch plan started. Student and teacher records were preserved.");
    });
  }

  function hydrateCanvasValues() {
    document.getElementById("canvasPeriod").value = launchState.canvas.period;
    document.getElementById("canvasCourse").value = launchState.canvas.course;
    document.getElementById("canvasType").value = launchState.canvas.type;
    renderCanvasPost();
  }

  hydrateChecks();
  renderPeriods();
  hydrateCanvas();
  bindActions();
  browserMetrics();
  window.addEventListener("pageshow", browserMetrics);
})();
