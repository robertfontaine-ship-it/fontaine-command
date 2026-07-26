(() => {
  const live = {
    "Target Market & Segmentation": "target-market-hub.html",
    "The 4Ps of Marketing": "four-ps-hub.html"
  };
  function activate(){
    document.querySelectorAll(".topic-card").forEach(card => {
      const title = card.querySelector("h3")?.textContent?.trim();
      if (!live[title]) return;
      card.classList.add("live");
      const status = card.querySelector(".topic-status");
      if (status) { status.textContent = "Live"; status.classList.remove("queued"); status.classList.add("live"); }
      const action = card.querySelector(".mission-button");
      if (action) {
        const link = document.createElement("a");
        link.className = "mission-button primary";
        link.href = live[title];
        link.textContent = "Open topic hub";
        action.replaceWith(link);
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", activate);
  else activate();
})();