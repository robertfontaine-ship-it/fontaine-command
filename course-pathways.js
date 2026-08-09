(() => {
  "use strict";

  const store = window.FontaineMissionStore;
  const pathwayData = window.FontaineCoursePathways;
  if (!store || !pathwayData) return;

  const { COURSES, courseList, MASTERY_THRESHOLD } = pathwayData;
  const TOPIC_ALIASES = { functions: "marketing-functions", promotion: "promotional-mix" };
  const board = document.getElementById("pathway-board");
  const checkSection = document.getElementById("mastery-check");
  const masteryForm = document.getElementById("masteryForm");
  const resultPanel = document.getElementById("masteryResult");
  let activeCourseId = "";
  let activeStageId = "";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffled(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function profile() {
    return store.getActiveProfile();
  }

  function profileReady(identity = profile()) {
    return Boolean(identity.first && identity.last && identity.period);
  }

  function progress() {
    return store.getPathwayProgress({ profile: profile() });
  }

  function courseProgress(courseId) {
    return progress().courses?.[courseId] || { stages: {} };
  }

  function stageProgress(courseId, stageId) {
    return courseProgress(courseId).stages?.[stageId] || {};
  }

  function missionHistory() {
    if (!profileReady()) return [];
    return store.getAllHistory({ profile: profile() }).map(item => ({
      ...item,
      topic: TOPIC_ALIASES[item.topic] || item.topic,
      missionId: item.missionId || item.id
    }));
  }

  function evidenceComplete(stage, history = missionHistory()) {
    return stage.evidence.options.some(option => history.some(item => {
      if (item.topic !== option.topic) return false;
      return !option.missionIds.length || option.missionIds.includes(item.missionId);
    }));
  }

  function stageUnlocked(course, index) {
    if (index === 0) return true;
    return Boolean(stageProgress(course.id, course.stages[index - 1].id).passed);
  }

  function stageState(course, stage, index, history = missionHistory()) {
    const record = stageProgress(course.id, stage.id);
    if (record.passed) return { id: "mastered", label: "Mastered", record };
    if (!stageUnlocked(course, index)) return { id: "locked", label: "Locked", record };
    if (!evidenceComplete(stage, history)) return { id: "mission-needed", label: "Mission needed", record };
    return { id: "ready", label: "Check ready", record };
  }

  function passedCount(course) {
    return course.stages.filter(stage => stageProgress(course.id, stage.id).passed).length;
  }

  function renderIdentity() {
    const identity = profile();
    const target = document.getElementById("pathwayIdentity");
    if (profileReady(identity)) {
      target.className = "pathway-identity ready";
      target.innerHTML = `Mission ID active for <strong>${escapeHtml(identity.first)} ${escapeHtml(identity.last)}.</strong>, Period ${escapeHtml(identity.period)}. Course selection and gate attempts will save to this profile.`;
    } else {
      target.className = "pathway-identity";
      target.innerHTML = `A Mission ID is required to save scores and unlock gates. <a href="student-mission-id.html">Set your name, last initial, and Period 1–7 first.</a>`;
    }
  }

  function renderCourseChooser() {
    const identityReady = profileReady();
    document.getElementById("courseChooser").innerHTML = courseList.map(course => {
      const mastered = passedCount(course);
      const active = course.id === activeCourseId;
      const label = identityReady ? (active ? "Continue this pathway" : "Choose this pathway") : "Preview this pathway";
      return `<article class="course-choice ${active ? "active" : ""}" data-accent="${course.accent}">
        <span class="course-choice-icon" aria-hidden="true">${course.icon}</span>
        <span class="course-choice-code">Course ${course.code}</span>
        <h3>${escapeHtml(course.title)}</h3>
        <p>${escapeHtml(course.promise)}</p>
        <div class="course-choice-meta"><span>6 mastery gates</span><span>${mastered}/6 cleared</span></div>
        <button class="mission-button ${active ? "secondary" : "primary"}" type="button" data-course-id="${course.id}">${label}</button>
      </article>`;
    }).join("");
  }

  function routeLinks(stage) {
    return stage.evidence.options.map(option => `<a href="${option.href}">${escapeHtml(option.label)} <span aria-hidden="true">→</span></a>`).join("");
  }

  function stageCard(course, stage, index, history) {
    const state = stageState(course, stage, index, history);
    const record = state.record;
    const best = Number(record.bestPercent || 0);
    const attempts = Number(record.attemptsCount || 0);
    let buttonLabel = "Take 5-question mastery check";
    let disabled = "";
    if (state.id === "mastered") buttonLabel = "Retake to improve my score";
    if (state.id === "mission-needed") {
      buttonLabel = "Complete an applied mission first";
      disabled = " disabled";
    }
    if (state.id === "locked") {
      buttonLabel = `Pass Gate ${index} first`;
      disabled = " disabled";
    }
    const scoreLine = attempts
      ? `<span class="stage-score">Best score: ${best}% • ${attempts} ${attempts === 1 ? "attempt" : "attempts"}</span>`
      : `<span class="stage-score">No mastery attempt recorded yet.</span>`;
    const evidenceMessage = evidenceComplete(stage, history)
      ? "Applied mission detected on this Mission ID."
      : stage.evidence.instruction;
    return `<article class="pathway-stage ${state.id}" id="stage-${stage.id}">
      <div class="stage-rail"><span class="stage-number">${index + 1}</span><span>Gate ${index + 1}</span></div>
      <div class="stage-content">
        <div class="stage-heading">
          <div><span class="stage-milestone">${escapeHtml(stage.milestone)}</span><h3>${escapeHtml(stage.title)}</h3></div>
          <span class="stage-status">${state.label}</span>
        </div>
        <p class="stage-outcome">${escapeHtml(stage.outcome)}</p>
        <div class="stage-steps">
          <section class="stage-step"><strong>1. Learn</strong><ul>${stage.learn.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          <section class="stage-step"><strong>2. Apply</strong><p>${escapeHtml(evidenceMessage)}</p><div class="stage-route-links">${routeLinks(stage)}</div></section>
          <section class="stage-step"><strong>3. Prove</strong><p>Answer all five questions. Score 4/5 or higher to clear this 80% gate.</p><div class="stage-check-action"><button class="mission-button ${state.id === "ready" ? "primary" : "secondary"}" type="button" data-check-stage="${stage.id}"${disabled}>${buttonLabel}</button>${scoreLine}</div></section>
        </div>
      </div>
    </article>`;
  }

  function nextStepText(course, history) {
    const nextIndex = course.stages.findIndex(stage => !stageProgress(course.id, stage.id).passed);
    if (nextIndex < 0) return "All six gates are mastered. Your complete course pathway is recorded on My Mission ID.";
    const stage = course.stages[nextIndex];
    if (!stageUnlocked(course, nextIndex)) return `Gate ${nextIndex + 1} is locked until the previous gate reaches 80%.`;
    if (!evidenceComplete(stage, history)) return `Next: complete the listed mission for Gate ${nextIndex + 1} — ${stage.title}.`;
    return `Next: take the Gate ${nextIndex + 1} mastery check for ${stage.title}.`;
  }

  function renderBoard() {
    const course = COURSES[activeCourseId];
    if (!course) {
      board.hidden = true;
      return;
    }
    board.hidden = false;
    const history = missionHistory();
    const mastered = passedCount(course);
    const percent = Math.round((mastered / course.stages.length) * 100);
    document.getElementById("pathwayCourseIcon").textContent = course.icon;
    document.getElementById("pathwayCourseCode").textContent = `Course ${course.code} • ${course.shortTitle}`;
    document.getElementById("pathwayCourseTitle").textContent = course.title;
    document.getElementById("pathwayCoursePromise").textContent = course.promise;
    document.getElementById("pathwayProgressText").textContent = `${mastered} of ${course.stages.length} gates mastered`;
    document.getElementById("pathwayProgressPercent").textContent = `${percent}%`;
    const meter = document.getElementById("pathwayProgressMeter");
    meter.style.width = `${percent}%`;
    meter.parentElement.setAttribute("aria-valuenow", String(percent));
    document.getElementById("pathwayNextStep").textContent = nextStepText(course, history);
    document.getElementById("pathwayStages").innerHTML = course.stages.map((stage, index) => stageCard(course, stage, index, history)).join("");
  }

  function renderAll() {
    const requested = new URLSearchParams(location.search).get("course");
    const saved = progress().activeCourse;
    if (!activeCourseId) activeCourseId = COURSES[requested] ? requested : (COURSES[saved] ? saved : "");
    renderIdentity();
    renderCourseChooser();
    renderBoard();
  }

  function selectCourse(courseId, shouldScroll = true) {
    if (!COURSES[courseId]) return;
    activeCourseId = courseId;
    if (profileReady()) store.setActivePathway(courseId, { profile: profile() });
    const url = new URL(location.href);
    url.searchParams.set("course", courseId);
    window.history.replaceState({}, "", url);
    renderAll();
    if (shouldScroll) board.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function renderQuestions(stage) {
    document.getElementById("masteryQuestions").innerHTML = shuffled(stage.questions).map((item, questionIndex) => `<fieldset class="mastery-question">
      <legend><span class="question-number">${questionIndex + 1}.</span>${escapeHtml(item.prompt)}</legend>
      <div class="question-choices">${shuffled(item.choices.map((choice, originalIndex) => ({ choice, originalIndex }))).map((option, choiceIndex) => `<label class="question-choice"><input type="radio" name="${item.id}" value="${option.originalIndex}" required /><span><strong>${String.fromCharCode(65 + choiceIndex)}.</strong> ${escapeHtml(option.choice)}</span></label>`).join("")}</div>
    </fieldset>`).join("");
  }

  function openMastery(stageId) {
    const course = COURSES[activeCourseId];
    const stageIndex = course?.stages.findIndex(item => item.id === stageId) ?? -1;
    if (!course || stageIndex < 0 || !profileReady()) {
      document.getElementById("pathwayIdentity").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const stage = course.stages[stageIndex];
    if (!stageUnlocked(course, stageIndex) || !evidenceComplete(stage)) return;
    activeStageId = stageId;
    store.setActivePathway(course.id, { profile: profile() });
    document.getElementById("masteryCourseLabel").textContent = `${course.shortTitle} • Gate ${stageIndex + 1} • 80% required`;
    document.getElementById("masteryTitle").textContent = stage.title;
    document.getElementById("masteryDirections").textContent = `Answer every question. You need 4 of 5 correct to clear ${stage.title} and unlock the next stage. Question and answer order can change on a retry.`;
    renderQuestions(stage);
    masteryForm.hidden = false;
    masteryForm.reset();
    resultPanel.hidden = true;
    resultPanel.className = "mastery-result";
    resultPanel.innerHTML = "";
    checkSection.hidden = false;
    checkSection.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    requestAnimationFrame(() => document.getElementById("masteryTitle").focus({ preventScroll: true }));
  }

  function closeMastery() {
    const stageId = activeStageId;
    checkSection.hidden = true;
    activeStageId = "";
    if (stageId) document.getElementById(`stage-${stageId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderResult(course, stage, score, missed, saved) {
    const passedNow = score / stage.questions.length * 100 >= MASTERY_THRESHOLD;
    const stageIndex = course.stages.findIndex(item => item.id === stage.id);
    const nextStage = course.stages[stageIndex + 1];
    resultPanel.hidden = false;
    resultPanel.className = `mastery-result ${passedNow ? "passed" : "retry"}`;
    const remediation = missed.map(item => `<li><strong>${escapeHtml(item.skill)}</strong><p>${escapeHtml(item.feedback)}</p><a href="${item.reviewHref}">${escapeHtml(item.reviewLabel)} <span aria-hidden="true">→</span></a></li>`).join("");
    const actions = passedNow
      ? `${nextStage ? `<button class="mission-button primary" type="button" data-next-stage="${nextStage.id}">Continue to Gate ${stageIndex + 2}</button>` : `<a class="mission-button primary" href="student-mission-id.html">View completed pathway on Mission ID</a>`}<button class="mission-button secondary" type="button" data-action="close-result">Return to pathway</button>`
      : `<button class="mission-button primary" type="button" data-action="retry-check">Retry this mastery check</button><button class="mission-button secondary" type="button" data-action="close-result">Return to pathway</button>`;
    resultPanel.innerHTML = `<div class="result-score"><strong>${score}/5</strong><div><h3>${passedNow ? "Gate cleared." : "Review, then retry."}</h3><p>${passedNow ? `You scored ${saved.latestPercent}%. The next stage is now unlocked.` : `You scored ${saved.latestPercent}%. You need 4/5 (80%) to continue, and your best score remains saved.`}</p></div></div>${missed.length ? `<ul class="remediation-list">${remediation}</ul>` : ""}<div class="result-actions">${actions}</div>`;
    resultPanel.tabIndex = -1;
    requestAnimationFrame(() => resultPanel.focus({ preventScroll: true }));
  }

  function submitMastery(event) {
    event.preventDefault();
    const course = COURSES[activeCourseId];
    const stage = course?.stages.find(item => item.id === activeStageId);
    if (!course || !stage || !profileReady()) return;
    const values = new FormData(masteryForm);
    const answers = {};
    const missed = [];
    let score = 0;
    stage.questions.forEach(item => {
      const selected = Number(values.get(item.id));
      answers[item.id] = selected;
      if (selected === item.answer) score += 1;
      else missed.push(item);
    });
    const saved = store.savePathwayAttempt({
      courseId: course.id,
      stageId: stage.id,
      score,
      total: stage.questions.length,
      answers,
      missedQuestionIds: missed.map(item => item.id),
      profile: profile()
    });
    renderCourseChooser();
    renderBoard();
    masteryForm.hidden = true;
    renderResult(course, stage, score, missed, saved);
  }

  document.getElementById("courseChooser").addEventListener("click", event => {
    const button = event.target.closest("[data-course-id]");
    if (button) selectCourse(button.dataset.courseId);
  });

  document.getElementById("pathwayStages").addEventListener("click", event => {
    const button = event.target.closest("[data-check-stage]");
    if (button) openMastery(button.dataset.checkStage);
  });

  document.getElementById("changePathway").addEventListener("click", () => {
    document.getElementById("course-select").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("closeMastery").addEventListener("click", closeMastery);
  masteryForm.addEventListener("submit", submitMastery);

  resultPanel.addEventListener("click", event => {
    const retry = event.target.closest('[data-action="retry-check"]');
    if (retry) {
      const course = COURSES[activeCourseId];
      const stage = course?.stages.find(item => item.id === activeStageId);
      if (stage) renderQuestions(stage);
      masteryForm.hidden = false;
      masteryForm.reset();
      resultPanel.hidden = true;
      document.getElementById("masteryTitle").focus({ preventScroll: true });
      return;
    }
    if (event.target.closest('[data-action="close-result"]')) {
      closeMastery();
      return;
    }
    const next = event.target.closest("[data-next-stage]");
    if (next) {
      checkSection.hidden = true;
      activeStageId = "";
      document.getElementById(`stage-${next.dataset.nextStage}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  window.addEventListener("storage", renderAll);
  window.addEventListener("pageshow", renderAll);
  renderAll();
})();
