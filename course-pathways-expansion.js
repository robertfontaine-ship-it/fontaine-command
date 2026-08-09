(() => {
  "use strict";

  const store = window.FontaineMissionStore;
  const data = window.FontaineCoursePathways;
  const screen = document.getElementById("screen");
  if (!store || !data || !screen) return;

  function pathwayProgress() {
    return store.getPathwayProgress({ profile: store.getActiveProfile() });
  }

  function summary() {
    const progress = pathwayProgress();
    const courseCounts = Object.fromEntries(data.courseList.map(course => [course.id, course.stages.filter(stage => progress.courses?.[course.id]?.stages?.[stage.id]?.passed).length]));
    const total = Object.values(courseCounts).reduce((sum, count) => sum + count, 0);
    const completeCourse = data.courseList.find(course => courseCounts[course.id] === course.stages.length);
    return { progress, courseCounts, total, completeCourse };
  }

  function pathwayHref() {
    const active = pathwayProgress().activeCourse;
    return data.COURSES[active] ? `course-pathways.html?course=${encodeURIComponent(active)}` : "course-pathways.html";
  }

  function enhanceHome() {
    const actions = screen.querySelector(".hero-card .hero-actions");
    if (actions && !actions.querySelector("[data-course-pathway-link]")) {
      actions.insertAdjacentHTML("beforeend", `<a class="secondary-button" href="${pathwayHref()}" data-course-pathway-link>OPEN COURSE PATHWAY</a>`);
    }
    const nextNews = [...screen.querySelectorAll(".news-item")].find(item => item.textContent.includes("Next system") || item.textContent.includes("Course mastery pathways"));
    if (nextNews && !nextNews.dataset.pathwayLive) {
      nextNews.innerHTML = `<span>🧭</span><div><strong>Course pathways are live</strong><small>SEM, Fashion, and Entrepreneurship use applied missions plus 80% mastery gates.</small><a href="${pathwayHref()}">Open my pathway</a></div>`;
      nextNews.dataset.pathwayLive = "true";
    }
  }

  function enhanceMissions() {
    const header = screen.querySelector(".page-header");
    if (header && !header.querySelector("[data-course-pathway-link]")) {
      header.insertAdjacentHTML("beforeend", `<a class="secondary-button" href="${pathwayHref()}" data-course-pathway-link>OPEN COURSE PATHWAYS</a>`);
    }
    const grid = screen.querySelector(".department-grid");
    if (grid && !grid.querySelector("[data-course-pathway-card]")) {
      const { total } = summary();
      grid.insertAdjacentHTML("beforeend", `<article class="department-card" data-course-pathway-card><span class="department-icon">🧭</span><span class="status-tag open">Live</span><h3>Course Pathways</h3><p>Follow the SEM, Fashion, or Entrepreneurship route and clear each applied 80% mastery gate.</p><a class="mini-button" href="${pathwayHref()}" style="display:inline-block;">${total ? `Continue • ${total}/18 cleared` : "Choose Course Route"}</a></article>`);
    }
  }

  function enhancePassport() {
    const grid = screen.querySelector(".passport-grid");
    if (!grid || grid.querySelector("[data-course-pathway-card]")) return;
    const { total } = summary();
    grid.insertAdjacentHTML("beforeend", `<article class="passport-card ${total ? "completed" : ""}" data-course-pathway-card><span class="passport-icon">🧭</span><h3 style="margin-top:16px;">Course Pathways</h3><p>${total} of 18 mastery gates cleared</p><span class="status-tag ${total ? "complete" : "open"}">${total ? "In progress" : "Open"}</span><a class="mini-button" href="${pathwayHref()}" style="display:inline-block;margin-top:14px;">View Routes</a></article>`);
  }

  function enhanceAchievements() {
    const grid = screen.querySelector(".achievement-grid");
    if (!grid || grid.querySelector("[data-course-pathway-badge]")) return;
    const { total, completeCourse } = summary();
    const badges = [
      { icon: "🔓", name: "Gate Breaker", description: "Clear the first course mastery gate at 80% or higher.", earned: total >= 1 },
      { icon: "🧭", name: "Course Master", description: "Clear all six gates in one course pathway.", earned: Boolean(completeCourse) }
    ];
    badges.forEach(badge => grid.insertAdjacentHTML("beforeend", `<article class="achievement-card ${badge.earned ? "earned" : "locked"}" data-course-pathway-badge><span class="achievement-icon">${badge.icon}</span><h3 style="margin-top:16px;">${badge.name}</h3><p>${badge.earned ? "Unlocked and added to your course mastery record." : badge.description}</p><span class="status-tag ${badge.earned ? "complete" : ""}">${badge.earned ? "Earned" : "Locked"}</span></article>`));
    const earnedCount = screen.querySelector(".page-header .status-tag.complete");
    if (earnedCount && !earnedCount.dataset.pathwayCounted) {
      const base = Number.parseInt(earnedCount.textContent, 10) || 0;
      earnedCount.textContent = `${base + badges.filter(badge => badge.earned).length} Earned`;
      earnedCount.dataset.pathwayCounted = "true";
    }
  }

  let scheduled = false;
  function enhance() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (screen.querySelector(".business-city-grid")) enhanceHome();
      if (screen.querySelector(".department-grid")) enhanceMissions();
      if (screen.querySelector(".passport-grid")) enhancePassport();
      if (screen.querySelector(".achievement-grid")) enhanceAchievements();
    });
  }

  new MutationObserver(enhance).observe(screen, { childList: true, subtree: true });
  window.addEventListener("storage", enhance);
  enhance();
})();
