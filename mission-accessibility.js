(() => {
  "use strict";

  const body = document.body;
  if (!body?.classList.contains("mission-site")) return;

  const currentFile = location.pathname.split("/").pop() || "topic-hubs.html";
  const departmentPages = new Set([
    "branding-hub.html",
    "target-market-hub.html",
    "four-ps-hub.html",
    "marketing-functions-hub.html",
    "promotional-mix-hub.html"
  ]);
  const pageLabels = {
    "mission-control.html": "Mission Control",
    "topic-hubs.html": "Department Directory",
    "branding-hub.html": "Brand Studio",
    "target-market-hub.html": "Consumer Intelligence Center",
    "four-ps-hub.html": "Strategy War Room",
    "marketing-functions-hub.html": "Marketing Operations HQ",
    "promotional-mix-hub.html": "Campaign Command Center",
    "wolverine-agency.html": "Wolverine Marketing Agency",
    "student-mission-id.html": "Student Mission ID"
  };
  const primaryLinks = [
    { href: "business-world.html", label: "City Hall" },
    { href: "mission-control.html", label: "Mission Control" },
    { href: "topic-hubs.html", label: "Departments" },
    { href: "wolverine-agency.html", label: "Agency" },
    { href: "student-mission-id.html", label: "My Mission ID" }
  ];
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");
  const modalStates = new WeakMap();

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
  }

  function focusableWithin(root) {
    return [...root.querySelectorAll(focusableSelector)].filter(isVisible);
  }

  function setupSkipLink() {
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
    if (document.querySelector(".skip-link")) return;
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = `#${main.id}`;
    link.textContent = "Skip to main content";
    link.addEventListener("click", () => requestAnimationFrame(() => main.focus({ preventScroll: true })));
    body.prepend(link);
  }

  function activePrimaryHref() {
    if (departmentPages.has(currentFile)) return "topic-hubs.html";
    return primaryLinks.some(link => link.href === currentFile) ? currentFile : "";
  }

  function setupPrimaryNavigation() {
    const brand = document.querySelector(".mission-brand");
    if (brand) {
      brand.href = "business-world.html";
      brand.setAttribute("aria-label", "Woodside Business World City Hall");
      const mark = brand.querySelector(".mission-brand-mark");
      const strong = brand.querySelector("strong");
      const small = brand.querySelector("small");
      if (mark) mark.textContent = "W";
      if (strong) strong.textContent = "Woodside Business World";
      if (small && pageLabels[currentFile]) small.textContent = pageLabels[currentFile];
    }

    const nav = document.querySelector(".mission-nav");
    if (!nav) return;
    const activeHref = activePrimaryHref();
    nav.setAttribute("aria-label", "Primary navigation");
    nav.innerHTML = primaryLinks.map(link => {
      const active = link.href === activeHref;
      return `<a href="${link.href}"${active ? ' class="active" aria-current="page"' : ""}>${link.label}</a>`;
    }).join("");
  }

  function contextualLinks() {
    if (departmentPages.has(currentFile)) {
      return [
        { href: document.getElementById("directions") ? "#directions" : "#start", label: "Start here" },
        { href: "#missions", label: "Missions" },
        { href: "#progress", label: "My progress" }
      ];
    }
    if (currentFile === "topic-hubs.html") {
      return [
        { href: "#workflow", label: "How it works" },
        { href: "#topics", label: "Live departments" },
        { href: "#rewards", label: "Rewards" }
      ];
    }
    if (currentFile === "wolverine-agency.html") {
      return [
        { href: "#assigned-projects", label: "Assigned projects" },
        { href: "#roles", label: "Agency roles" },
        { href: "#briefs", label: "Client briefs" },
        { href: "#agencyHistory", label: "My portfolio" }
      ];
    }
    return [];
  }

  function setupContextNavigation() {
    const links = contextualLinks().filter(link => document.querySelector(link.href));
    if (!links.length || document.querySelector(".mission-subnav")) return;
    const nav = document.createElement("nav");
    nav.className = "mission-subnav";
    nav.setAttribute("aria-label", "On this page");
    nav.innerHTML = links.map(link => `<a href="${link.href}">${link.label}</a>`).join("");
    document.querySelector(".mission-topbar")?.insertAdjacentElement("afterend", nav);
  }

  function modalBackgroundTargets() {
    return [...document.querySelectorAll("body > .skip-link, body > header, body > main, body > footer, body > .mission-subnav")];
  }

  function activateModal(modal) {
    if (modalStates.get(modal)?.open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = modalBackgroundTargets().map(element => ({ element, inert: element.inert }));
    background.forEach(item => { item.element.inert = true; });
    modalStates.set(modal, { open: true, trigger, background });
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    const panel = modal.querySelector(".modal-panel");
    requestAnimationFrame(() => {
      if (modal.contains(document.activeElement)) return;
      const preferred = modal.querySelector("[autofocus]")
        || modal.querySelector("input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled])")
        || modal.querySelector("button:not([disabled]):not(.modal-close), a[href]")
        || modal.querySelector(".modal-close");
      (preferred || panel)?.focus({ preventScroll: true });
    });
  }

  function deactivateModal(modal) {
    const state = modalStates.get(modal);
    modal.setAttribute("aria-hidden", "true");
    if (!state?.open) return;
    state.background.forEach(item => { item.element.inert = item.inert; });
    modalStates.set(modal, { ...state, open: false });
    if (![...document.querySelectorAll(".mission-modal")].some(item => !item.hidden)) body.classList.remove("modal-open");
    requestAnimationFrame(() => {
      if (state.trigger?.isConnected && !state.trigger.closest("[inert]")) state.trigger.focus({ preventScroll: true });
    });
  }

  function closeModalFromKeyboard(modal) {
    const closeButton = modal.querySelector(".modal-close") || [...modal.querySelectorAll("[data-close-modal], [data-close-id], [data-close-agency-profile], [data-close-agency-join], [data-close-agency-project]")].find(element => !element.classList.contains("modal-backdrop"));
    closeButton?.click();
  }

  function focusChangedView(target) {
    if (!(target instanceof HTMLElement) || target.hidden) return;
    if (!/^(receiptView|agencyReceiptView|missionFormView|agencyProjectFormView)$/.test(target.id)) return;
    const preferred = target.id.toLowerCase().includes("receipt")
      ? target.querySelector("h1, h2, h3")
      : target.querySelector("input:not([type='hidden']), select, textarea, button");
    if (!preferred) return;
    if (!preferred.hasAttribute("tabindex") && /^H[1-6]$/.test(preferred.tagName)) preferred.tabIndex = -1;
    requestAnimationFrame(() => preferred.focus({ preventScroll: true }));
  }

  function setupModal(modal, index) {
    const panel = modal.querySelector(".modal-panel");
    if (!panel) return;
    const modalId = modal.id || `mission-modal-${index + 1}`;
    modal.id = modalId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.tabIndex = -1;
    const heading = panel.querySelector("h1, h2, h3");
    if (heading) {
      if (!heading.id) heading.id = `${modalId}-title`;
      panel.setAttribute("aria-labelledby", heading.id);
    }
    const description = [...panel.querySelectorAll("p")].find(item => !item.classList.contains("eyebrow"));
    if (description) {
      if (!description.id) description.id = `${modalId}-description`;
      panel.setAttribute("aria-describedby", description.id);
    }
    modal.querySelectorAll(".modal-close").forEach(button => {
      button.type = "button";
      if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", "Close dialog");
    });
    modal.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.setAttribute("aria-hidden", "true"));
    modal.querySelectorAll("#receiptView, #agencyReceiptView").forEach(view => {
      view.setAttribute("role", "region");
      view.setAttribute("aria-live", "polite");
    });

    modal.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeModalFromKeyboard(modal);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusableWithin(modal);
      if (!items.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target === modal) {
          if (modal.hidden) deactivateModal(modal);
          else activateModal(modal);
        } else focusChangedView(mutation.target);
      });
    });
    observer.observe(modal, { attributes: true, subtree: true, attributeFilter: ["hidden"] });
    if (modal.hidden) modal.setAttribute("aria-hidden", "true");
    else activateModal(modal);
  }

  function syncPressedFilters() {
    document.querySelectorAll("[data-filter], [data-agency-filter]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    });
  }

  setupSkipLink();
  setupPrimaryNavigation();
  setupContextNavigation();
  document.querySelectorAll(".mission-modal").forEach(setupModal);
  syncPressedFilters();
  document.addEventListener("click", event => {
    if (event.target.closest("[data-filter], [data-agency-filter]")) queueMicrotask(syncPressedFilters);
  });
})();
