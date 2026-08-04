(() => {
  "use strict";

  const missionStore = window.FontaineMissionStore;
  const autosaveFactory = window.FontaineMissionAutosave;
  const ENTRY_CAP = missionStore?.WEEKLY_ENTRY_CAP || 10;

  const topics = [
    { id: "branding", title: "Brand Studio", status: "Live", description: "Build identity, positioning, voice, touchpoints, and brand equity.", tags: ["SEM", "Fashion", "Entrepreneurship"], href: "branding-hub.html" },
    { id: "target-market", title: "Consumer Intelligence Center", status: "Live", description: "Investigate customer segments, personas, evidence, and audience opportunities.", tags: ["Customer", "Segments", "Personas"], href: "target-market-hub.html" },
    { id: "four-ps", title: "Strategy War Room", status: "Live", description: "Coordinate Product, Price, Place, and Promotion around one target customer.", tags: ["Product", "Price", "Place", "Promotion"], href: "four-ps-hub.html" },
    { id: "functions", title: "Marketing Operations HQ", status: "Live", description: "See how seven departments cooperate to create, communicate, and deliver value.", tags: ["7 Functions", "Careers", "Strategy"], href: "marketing-functions-hub.html" },
    { id: "promotion", title: "Campaign Command Center", status: "Live", description: "Deploy advertising, PR, sales promotion, personal selling, and direct marketing.", tags: ["Campaigns", "Media", "Messaging"], href: "promotional-mix-hub.html" },
    { id: "market-research", title: "Market Research Lab", status: "Live", description: "Ask focused questions, collect credible evidence, analyze patterns, and recommend business decisions.", tags: ["Surveys", "Sampling", "Insights"], href: "market-research-hub.html" },
    { id: "pricing", title: "Pricing Strategy", status: "Queued", description: "Costs, customer value, competitor pressure, revenue goals, and pricing psychology.", tags: ["Revenue", "Value", "Strategy"] },
    { id: "distribution", title: "Distribution", status: "Queued", description: "Channels, intermediaries, inventory, access, convenience, and customer experience.", tags: ["Place", "Channels", "Retail"] },
    { id: "service", title: "Selling & Customer Service", status: "Queued", description: "Customer needs, communication, sales steps, recovery, loyalty, and follow-up.", tags: ["Sales", "Recovery", "Loyalty"] }
  ];

  const brandingMissions = [
    {
      id: "BR-01", level: "Quick", entries: 1, minutes: 8, title: "Brand Snapshot",
      brief: "Select a recognizable brand and explain the identity it is trying to create.",
      outcomes: ["Identify visible identity elements", "Connect evidence to personality"],
      prompts: [
        "Name the brand and identify three visible or verbal identity elements.",
        "Choose three personality words that fit the brand. Explain one piece of evidence for each word.",
        "Who appears to be the primary target customer, and what makes you think that?"
      ]
    },
    {
      id: "BR-02", level: "Quick", entries: 1, minutes: 8, title: "Slogan Surgery",
      brief: "Repair a weak slogan so it communicates a clearer promise and stronger personality.",
      outcomes: ["Diagnose weak messaging", "Write a purposeful slogan"],
      prompts: [
        "Choose one weak slogan: “We Sell Good Stuff,” “The Best Company,” or “Products for Everyone.” Explain two reasons it is ineffective.",
        "Rewrite the slogan for a specific imaginary brand and target customer.",
        "Explain the brand promise and personality communicated by your new slogan."
      ]
    },
    {
      id: "BR-03", level: "Quick", entries: 1, minutes: 10, title: "Personality Match",
      brief: "Compare two competitors and determine how their personalities help them attract different customers.",
      outcomes: ["Compare competitors", "Use personality evidence"],
      prompts: [
        "Choose two competing brands in the same category.",
        "Give each brand three different personality traits and provide evidence from messaging, visuals, products, or customer experience.",
        "Which target customer is more likely to prefer each brand? Explain why."
      ]
    },
    {
      id: "BR-04", level: "Skill", entries: 2, minutes: 18, title: "Color Code",
      brief: "Create a purposeful brand color system for a new product or organization.",
      outcomes: ["Build a color palette", "Defend visual decisions"],
      prompts: [
        "Describe a new product, organization, team, event, or fashion brand and identify its target customer.",
        "Choose one primary color and two supporting colors. Include color names or hex codes.",
        "Explain what each color should communicate and where each color would appear across brand touchpoints.",
        "Name one color you intentionally avoided and explain why it would weaken the brand."
      ]
    },
    {
      id: "BR-05", level: "Skill", entries: 2, minutes: 18, title: "Voice Translator",
      brief: "Translate the same announcement into three distinct brand voices.",
      outcomes: ["Control tone and word choice", "Match voice to audience"],
      prompts: [
        "Use this announcement: “Our new product launches Friday.” Rewrite it in a playful youth brand voice.",
        "Rewrite the same announcement in a premium luxury brand voice.",
        "Rewrite the announcement in a reliable professional brand voice.",
        "Identify the word-choice and sentence-style decisions that made the three voices different."
      ]
    },
    {
      id: "BR-06", level: "Skill", entries: 2, minutes: 20, title: "Competitor Face-Off",
      brief: "Audit two competitors and recommend a position a new challenger could own.",
      outcomes: ["Analyze positioning", "Find an open market space"],
      prompts: [
        "Choose two competing brands and summarize each brand’s current position in one sentence.",
        "Compare them on target customer, price level, personality, promise, and one major strength.",
        "Identify one customer need or identity neither competitor fully owns.",
        "Write a positioning statement for a new challenger designed to own that opportunity."
      ]
    },
    {
      id: "BR-07", level: "Skill", entries: 2, minutes: 22, title: "Touchpoint Audit",
      brief: "Evaluate whether a real brand delivers one consistent experience across customer touchpoints.",
      outcomes: ["Audit consistency", "Recommend improvements"],
      prompts: [
        "Choose a brand and identify five touchpoints customers experience before, during, or after purchase.",
        "Rate each touchpoint from 1–5 for consistency with the brand promise. Explain every rating.",
        "Identify the weakest touchpoint and explain how inconsistency could damage trust or loyalty.",
        "Recommend two specific improvements to strengthen the complete brand experience."
      ]
    },
    {
      id: "BR-08", level: "Boss", entries: 4, minutes: 35, title: "Mystery Product Brand Kit",
      brief: "Create the foundation of a complete brand for an unusual mystery product.",
      outcomes: ["Build an integrated identity", "Connect all choices to a customer"],
      prompts: [
        "Choose one mystery product: self-cooling backpack, sneaker subscription, mobile study lounge, silent basketball, or smart jacket. Define the target customer and customer problem.",
        "Create a brand name, slogan, promise, and five personality traits.",
        "Describe a logo concept, one primary color, two supporting colors, and a typography style.",
        "Write one social post in the brand voice and describe the packaging or launch-event experience.",
        "Explain how all elements work together to create one consistent position."
      ]
    },
    {
      id: "BR-09", level: "Boss", entries: 4, minutes: 35, title: "Brand Rescue",
      brief: "Respond to a fictional brand crisis without abandoning the organization’s identity or customers.",
      outcomes: ["Protect brand trust", "Build a recovery strategy"],
      prompts: [
        "Choose a fictional crisis: delayed orders, offensive advertisement, defective product, rude employee video, or environmental criticism. Describe the brand and target customer.",
        "Explain the immediate damage to the brand promise, associations, and customer trust.",
        "Write a short public response in an appropriate brand voice.",
        "Create a three-action recovery plan covering customers, internal operations, and future communication.",
        "Identify one action the brand should avoid and explain why it would make the crisis worse."
      ]
    },
    {
      id: "BR-10", level: "Boss", entries: 4, minutes: 32, title: "Partnership Decision Room",
      brief: "Decide whether a celebrity, athlete, influencer, or organization is a strong brand partner.",
      outcomes: ["Evaluate brand fit", "Balance opportunity and risk"],
      prompts: [
        "Choose a real or fictional brand and a potential celebrity, athlete, influencer, team, artist, or organization partner.",
        "Score the partnership from 1–5 on audience overlap, personality fit, credibility, attention potential, and reputation risk. Explain every score.",
        "Recommend approve, revise, or reject. Defend the decision using your scorecard evidence.",
        "If approved or revised, describe one campaign activation that would feel natural instead of forced.",
        "Create one measurable result the brand should track to judge whether the partnership worked."
      ]
    }
  ];

  function getWeekKey(date = new Date()) {
    return missionStore?.getWeekKey(date) || "";
  }

  function getStore() {
    const week = getWeekKey();
    return {
      profile: missionStore?.getActiveProfile() || { first: "", last: "", period: "" },
      completions: { [week]: missionStore?.getTopicCompletions("branding") || {} }
    };
  }

  function currentCompletions() {
    const store = getStore();
    return store.completions[getWeekKey()] || {};
  }

  function totalEntries(completions = currentCompletions()) {
    void completions;
    return missionStore?.weeklyEntrySummary().total || 0;
  }

  function escapeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderTopicGrid() {
    const target = document.getElementById("topicGrid");
    if (!target) return;
    target.innerHTML = topics.map(topic => {
      const isLive = topic.status === "Live";
      return `<article class="topic-card ${isLive ? "live" : ""}">
        <span class="topic-status ${isLive ? "live" : "queued"}">${topic.status}</span>
        <h3>${escapeText(topic.title)}</h3>
        <p>${escapeText(topic.description)}</p>
        <div class="topic-meta">${topic.tags.map(tag => `<span>${escapeText(tag)}</span>`).join("")}</div>
        ${isLive ? `<a class="mission-button primary" href="${topic.href}">Open topic hub</a>` : `<span class="mission-button secondary" aria-disabled="true">Build queue</span>`}
      </article>`;
    }).join("");
  }

  let activeFilter = "All";
  let activeMissionId = null;
  let lastReceiptText = "";
  let autosave = null;

  function profileFromMissionForm() {
    return {
      first: document.getElementById("studentFirst").value.trim(),
      last: document.getElementById("studentLast").value.trim().slice(0, 1).toUpperCase(),
      period: document.getElementById("studentPeriod").value
    };
  }

  function missionResponses() {
    return [...document.querySelectorAll("[data-prompt-index]")].map(field => field.value);
  }

  function ensureDraftStatus(form) {
    let status = form.querySelector("[data-draft-status]");
    if (status) return status;
    status = document.createElement("div");
    status.className = "draft-status";
    status.dataset.draftStatus = "";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.querySelector(".profile-fields")?.insertAdjacentElement("afterend", status);
    return status;
  }

  function renderMissionGrid() {
    const target = document.getElementById("missionGrid");
    if (!target) return;
    const completions = currentCompletions();
    const visible = brandingMissions.filter(mission => activeFilter === "All" || mission.level === activeFilter);
    target.innerHTML = visible.map(mission => {
      const complete = Boolean(completions[mission.id]);
      return `<article class="mission-card ${complete ? "complete" : ""}">
        <span class="level-badge ${mission.level.toLowerCase()}">${mission.level} Mission</span>
        <h3>${mission.id} — ${escapeText(mission.title)}</h3>
        <p>${escapeText(mission.brief)}</p>
        <div class="mission-details"><span>${mission.minutes} minutes</span><span>${mission.entries} ${mission.entries === 1 ? "entry" : "entries"}</span></div>
        <ul>${mission.outcomes.map(outcome => `<li>${escapeText(outcome)}</li>`).join("")}</ul>
        <button class="mission-button ${complete ? "secondary" : "primary"}" type="button" data-mission-id="${mission.id}">${complete ? "View or revise receipt" : "Start mission"}</button>
      </article>`;
    }).join("");
  }

  function renderProgress() {
    const entryElement = document.getElementById("entryCount");
    if (!entryElement) return;
    const completions = currentCompletions();
    const entries = totalEntries(completions);
    entryElement.textContent = String(entries);
    document.getElementById("missionCount").textContent = String(Object.keys(completions).length);
    document.getElementById("entryMeter").style.width = `${Math.min(100, (entries / ENTRY_CAP) * 100)}%`;
    const weekStart = new Date(`${getWeekKey()}T12:00:00`);
    document.getElementById("weekLabel").textContent = `Week of ${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }

  function openMission(missionId) {
    const mission = brandingMissions.find(item => item.id === missionId);
    const modal = document.getElementById("missionModal");
    if (!mission || !modal) return;
    activeMissionId = missionId;
    autosave?.dispose();
    const store = getStore();
    const prior = (store.completions[getWeekKey()] || {})[missionId];
    const draft = missionStore.getDraft("branding", missionId, { profile: store.profile });
    const priorTime = Date.parse(prior?.submittedAt || prior?.completedAt || "") || 0;
    const recoveredDraft = draft && ((Date.parse(draft.updatedAt) || 0) > priorTime) ? draft : null;
    if (draft && !recoveredDraft) missionStore.deleteDraft("branding", missionId, { profile: store.profile });
    const responses = recoveredDraft?.values?.responses || prior?.responses || [];

    document.getElementById("missionFormView").hidden = false;
    document.getElementById("receiptView").hidden = true;
    document.getElementById("modalLevel").textContent = `${mission.level} Mission • ${mission.entries} ${mission.entries === 1 ? "entry" : "entries"}`;
    document.getElementById("modalTitle").textContent = `${mission.id} — ${mission.title}`;
    document.getElementById("modalBrief").textContent = mission.brief;
    document.getElementById("studentFirst").value = store.profile.first || "";
    document.getElementById("studentLast").value = store.profile.last || "";
    document.getElementById("studentPeriod").value = store.profile.period || "";
    document.getElementById("integrityCheck").checked = false;
    document.getElementById("promptFields").innerHTML = mission.prompts.map((prompt, index) => `<label>${index + 1}. ${escapeText(prompt)}<textarea required minlength="12" data-prompt-index="${index}">${escapeText(responses[index] || "")}</textarea></label>`).join("");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const form = document.getElementById("missionForm");
    autosave = autosaveFactory?.create({
      form,
      status: ensureDraftStatus(form),
      topic: "branding",
      missionId,
      title: mission.title,
      getProfile: profileFromMissionForm,
      readValues: () => ({ responses: missionResponses() }),
      recoveredDraft
    }) || null;
    setTimeout(() => document.getElementById("studentFirst").focus(), 0);
  }

  function closeMission() {
    const modal = document.getElementById("missionModal");
    if (!modal) return;
    autosave?.dispose();
    autosave = null;
    modal.hidden = true;
    document.body.style.overflow = "";
    activeMissionId = null;
  }

  function receiptCode(missionId) {
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${missionId}-${getWeekKey().replaceAll("-", "").slice(4)}-${random}`;
  }

  function submitMission(event) {
    event.preventDefault();
    const mission = brandingMissions.find(item => item.id === activeMissionId);
    if (!mission) return;

    const { first, last, period } = profileFromMissionForm();
    const responses = missionResponses().map(value => value.trim());
    if (!first || !last || !period || responses.some(response => response.length < 12)) return;

    const week = getWeekKey();
    const submittedAt = new Date().toISOString();
    const profile = missionStore.setActiveProfile({ first, last, period });
    const previous = missionStore.getTopicCompletions("branding", { profile })[mission.id];
    const code = previous?.code || receiptCode(mission.id);
    const saved = missionStore.saveCompletion({
      topic: "branding",
      missionId: mission.id,
      profile,
      requestedEntries: mission.entries,
      xp: missionStore.xpForEntries(mission.entries),
      item: { code, title: mission.title, level: mission.level, responses, submittedAt }
    }).item;
    autosave?.clear();
    autosave?.dispose({ save: false });
    autosave = null;
    const entries = Number(saved.entries || 0);

    lastReceiptText = [
      "FONTAINE MISSION RECEIPT",
      `Student: ${first} ${last}.`,
      `Class period: ${period}`,
      `Mission: ${mission.id} — ${mission.title}`,
      `Level: ${mission.level}`,
      `XP earned: ${saved.xp}`,
      `Provisional entries: ${entries}`,
      entries < mission.entries ? "Weekly cap note: This mission is complete, but only the remaining weekly entries were added." : "",
      `Week: ${week}`,
      `Receipt code: ${code}`,
      `Submitted: ${new Date(submittedAt).toLocaleString()}`,
      "Teacher verification required."
    ].filter(Boolean).join("\n");

    document.getElementById("missionFormView").hidden = true;
    document.getElementById("receiptView").hidden = false;
    document.getElementById("receiptCard").innerHTML = `<dl>
      <dt>Student</dt><dd>${escapeText(first)} ${escapeText(last)}.</dd>
      <dt>Class period</dt><dd>${escapeText(period)}</dd>
      <dt>Mission</dt><dd>${mission.id} — ${escapeText(mission.title)}</dd>
      <dt>XP</dt><dd>${saved.xp} earned</dd>
      <dt>Provisional entries</dt><dd>${entries}${entries < mission.entries ? " — weekly cap reached" : ""}</dd>
      <dt>Receipt code</dt><dd>${escapeText(code)}</dd>
      <dt>Status</dt><dd>Teacher approval required</dd>
    </dl>`;
    renderMissionGrid();
    renderProgress();
  }

  async function copyReceipt() {
    if (!lastReceiptText) return;
    try {
      await navigator.clipboard.writeText(lastReceiptText);
      const button = document.getElementById("copyReceipt");
      const original = button.textContent;
      button.textContent = "Receipt copied";
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      window.prompt("Copy your mission receipt:", lastReceiptText);
    }
  }

  function editProfile() {
    const store = getStore();
    const first = window.prompt("Student first name:", store.profile.first || "");
    if (first === null) return;
    const last = window.prompt("Student last initial:", store.profile.last || "");
    if (last === null) return;
    const period = window.prompt("Class period:", store.profile.period || "");
    if (period === null) return;
    missionStore.setActiveProfile({ first: first.trim(), last: last.trim().slice(0, 1).toUpperCase(), period: period.trim() });
  }

  function bindBrandingPage() {
    renderMissionGrid();
    renderProgress();

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("active", item === button));
        renderMissionGrid();
      });
    });

    document.getElementById("missionGrid")?.addEventListener("click", event => {
      const button = event.target.closest("[data-mission-id]");
      if (button) openMission(button.dataset.missionId);
    });
    document.querySelectorAll("[data-close-modal]").forEach(item => item.addEventListener("click", closeMission));
    document.getElementById("missionForm")?.addEventListener("submit", submitMission);
    document.getElementById("copyReceipt")?.addEventListener("click", copyReceipt);
    document.getElementById("profileButton")?.addEventListener("click", editProfile);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMission(); });
  }

  const page = document.body?.dataset.page;
  if (page === "network") renderTopicGrid();
  if (page === "branding") bindBrandingPage();
})();
