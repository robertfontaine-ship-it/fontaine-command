(() => {
  "use strict";

  function patchTopicAdmin() {
    if (typeof state === "undefined" || state.page !== "Topic Hubs") return;
    const root = document.querySelector(".topic-admin");
    if (!root) return;

    const cards = root.querySelectorAll(".topic-admin-card");
    if (cards[0]) {
      const metric = cards[0].querySelector(".metric");
      const muted = cards[0].querySelector(".muted");
      const heading = cards[0].querySelector("h3");
      const paragraph = cards[0].querySelector("p");
      if (metric) metric.textContent = "5";
      if (muted) muted.textContent = "Live topic hubs";
      if (heading) heading.textContent = "Core Marketing Library";
      if (paragraph) paragraph.textContent = "Branding, Target Market, the 4Ps, Marketing Functions, and Promotional Mix are live.";
    }
    if (cards[1]) {
      const metric = cards[1].querySelector(".metric");
      const muted = cards[1].querySelector(".muted");
      const heading = cards[1].querySelector("h3");
      const paragraph = cards[1].querySelector("p");
      if (metric) metric.textContent = "49";
      if (muted) muted.textContent = "Available missions";
      if (heading) heading.textContent = "Quick, Skill, and Boss";
      if (paragraph) paragraph.textContent = "Each mission includes an estimated time, numbered prompts, quality standards, and a receipt.";
    }

    const active = document.getElementById("topicActive");
    if (active) {
      const selected = active.value;
      active.innerHTML = ["Branding", "Target Market & Segmentation", "The 4Ps of Marketing", "Marketing Functions", "Promotional Mix"]
        .map(topic => `<option ${selected === topic ? "selected" : ""}>${topic}</option>`).join("");
    }

    const queueHeading = [...root.querySelectorAll("h2")].find(item => item.textContent.trim() === "Next Build Queue");
    const queueSection = queueHeading?.closest("section");
    const queueGrid = queueSection?.querySelector(".grid");
    if (queueGrid) queueGrid.innerHTML = `
      <div class="card span-4"><strong>Market Research</strong><p class="muted">Source evaluation, surveys, data analysis, and decision missions.</p></div>
      <div class="card span-4"><strong>Pricing Strategy</strong><p class="muted">Cost, value, competition, revenue, and pricing-psychology missions.</p></div>
      <div class="card span-4"><strong>Distribution</strong><p class="muted">Channels, access, retail, inventory, and customer-experience missions.</p></div>`;
  }

  if (typeof render === "function") {
    const previousRender = render;
    render = function renderWithExpandedTopicHubs() {
      previousRender();
      patchTopicAdmin();
    };
    patchTopicAdmin();
  }
})();