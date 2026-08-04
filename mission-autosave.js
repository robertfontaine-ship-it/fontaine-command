(() => {
  "use strict";

  const store = window.FontaineMissionStore;
  if (!store) return;

  function isCompleteProfile(profile = {}) {
    const normalized = store.normalizeProfile(profile);
    return Boolean(normalized.first && normalized.last && normalized.period);
  }

  function hasMeaningfulWork(value) {
    if (Array.isArray(value)) return value.some(hasMeaningfulWork);
    if (value && typeof value === "object") return Object.values(value).some(hasMeaningfulWork);
    return typeof value === "string" ? Boolean(value.trim()) : Boolean(value);
  }

  function savedTime(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "a previous visit";
    return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  function create({ form, status, topic, missionId, title, getProfile, readValues, recoveredDraft = null }) {
    if (!form || !status || !topic || !missionId || typeof getProfile !== "function" || typeof readValues !== "function") {
      return null;
    }

    let timer = null;
    let disposed = false;
    let dirty = false;

    function announce(message, state = "ready") {
      status.textContent = message;
      status.dataset.state = state;
    }

    function readyMessage() {
      const profile = getProfile();
      if (!isCompleteProfile(profile)) {
        announce("Enter your name, last initial, and period to turn on autosave.", "waiting");
        return;
      }
      announce("Autosave is on. Your work stays on this device until you submit it.", "ready");
    }

    function flush() {
      if (disposed) return null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (!dirty) return null;
      const profile = store.normalizeProfile(getProfile());
      if (!isCompleteProfile(profile)) {
        readyMessage();
        return null;
      }
      const values = readValues();
      if (!hasMeaningfulWork(values)) {
        dirty = false;
        readyMessage();
        return null;
      }
      try {
        const draft = store.saveDraft({ topic, missionId, profile, values, title });
        dirty = false;
        announce(`All changes saved at ${savedTime(draft.updatedAt)}.`, "saved");
        return draft;
      } catch {
        announce("Autosave could not update. Keep this tab open until you submit.", "error");
        return null;
      }
    }

    function schedule() {
      if (disposed) return;
      dirty = true;
      const profile = getProfile();
      if (!isCompleteProfile(profile)) {
        readyMessage();
        return;
      }
      announce("Saving your work…", "saving");
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, 450);
    }

    function pageHide() { flush(); }
    function visibilityChange() { if (document.visibilityState === "hidden") flush(); }
    form.addEventListener("input", schedule);
    form.addEventListener("change", schedule);
    window.addEventListener("pagehide", pageHide);
    document.addEventListener("visibilitychange", visibilityChange);

    if (recoveredDraft && hasMeaningfulWork(recoveredDraft.values)) {
      announce(`Recovered autosaved work from ${savedTime(recoveredDraft.updatedAt)}. Your latest changes are back.`, "recovered");
    } else {
      readyMessage();
    }

    return {
      flush,
      clear() {
        if (timer) clearTimeout(timer);
        timer = null;
        store.deleteDraft(topic, missionId, { profile: getProfile() });
        announce("Mission submitted. The autosaved draft was cleared.", "saved");
      },
      dispose({ save = true } = {}) {
        if (disposed) return;
        if (save) flush();
        disposed = true;
        if (timer) clearTimeout(timer);
        timer = null;
        form.removeEventListener("input", schedule);
        form.removeEventListener("change", schedule);
        window.removeEventListener("pagehide", pageHide);
        document.removeEventListener("visibilitychange", visibilityChange);
      }
    };
  }

  window.FontaineMissionAutosave = Object.freeze({ create });
})();
