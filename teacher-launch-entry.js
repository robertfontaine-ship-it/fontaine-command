(() => {
  "use strict";

  function addTeacherLaunchLink() {
    const nav = document.querySelector(".nav");
    if (!nav || nav.querySelector("[data-teacher-launch-link]")) return;
    const link = document.createElement("a");
    link.href = "teacher-launch.html";
    link.dataset.teacherLaunchLink = "";
    link.textContent = "Teacher Launch";
    const dashboard = [...nav.children].find(item => item.textContent.trim() === "Dashboard");
    if (dashboard) dashboard.insertAdjacentElement("afterend", link);
    else nav.prepend(link);
  }

  function applyRequestedTeacherView() {
    const requested = new URLSearchParams(location.search).get("launch");
    const page = requested === "reviews" ? "Topic Hubs" : requested === "dashboard" ? "Dashboard" : "";
    if (page && typeof state !== "undefined" && Array.isArray(pages) && pages.includes(page)) state.page = page;
  }

  function finishTeacherRoute() {
    addTeacherLaunchLink();
    if (!location.hash) return;
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" }));
  }

  if (typeof render === "function") {
    const renderBeforeTeacherLaunch = render;
    render = function renderWithTeacherLaunchEntry() {
      renderBeforeTeacherLaunch();
      finishTeacherRoute();
    };
    applyRequestedTeacherView();
    render();
  }
})();
