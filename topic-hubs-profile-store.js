(() => {
  "use strict";

  const LEGACY_KEY = "fontaineMissionNetwork:v1";
  const MASTER_KEY = "fontaineMissionNetwork:profiles:v1";
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;

  function profileKey(profile = {}) {
    return [profile.first, profile.last, profile.period]
      .map(value => String(value || "").trim().toLowerCase())
      .join("|");
  }

  function emptyMaster() {
    return { activeProfileKey: "", profiles: {} };
  }

  function readMaster(storage) {
    try {
      return JSON.parse(originalGetItem.call(storage, MASTER_KEY) || "null") || emptyMaster();
    } catch {
      return emptyMaster();
    }
  }

  function writeMaster(storage, master) {
    originalSetItem.call(storage, MASTER_KEY, JSON.stringify(master));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function completionDelta(previous = {}, next = {}) {
    const delta = {};
    Object.entries(next).forEach(([week, missions]) => {
      Object.entries(missions || {}).forEach(([missionId, receipt]) => {
        if (JSON.stringify(previous?.[week]?.[missionId]) !== JSON.stringify(receipt)) {
          delta[week] = delta[week] || {};
          delta[week][missionId] = receipt;
        }
      });
    });
    return delta;
  }

  function mergeCompletions(base = {}, additions = {}) {
    const merged = clone(base);
    Object.entries(additions).forEach(([week, missions]) => {
      merged[week] = { ...(merged[week] || {}), ...missions };
    });
    return merged;
  }

  const legacy = originalGetItem.call(localStorage, LEGACY_KEY);
  const existingMaster = readMaster(localStorage);
  if (legacy && !Object.keys(existingMaster.profiles).length) {
    try {
      const parsed = JSON.parse(legacy);
      const key = profileKey(parsed.profile);
      if (key.replaceAll("|", "")) {
        existingMaster.activeProfileKey = key;
        existingMaster.profiles[key] = {
          profile: parsed.profile,
          completions: parsed.completions || {}
        };
        writeMaster(localStorage, existingMaster);
      }
    } catch {
      // Ignore malformed legacy data and begin with an empty profile store.
    }
  }

  Storage.prototype.getItem = function getItem(key) {
    if (this === localStorage && key === LEGACY_KEY) {
      const master = readMaster(this);
      const active = master.profiles[master.activeProfileKey];
      return JSON.stringify(active ? {
        profile: active.profile,
        completions: active.completions || {}
      } : {
        profile: { first: "", last: "", period: "" },
        completions: {}
      });
    }
    return originalGetItem.call(this, key);
  };

  Storage.prototype.setItem = function setItem(key, value) {
    if (this === localStorage && key === LEGACY_KEY) {
      try {
        const payload = JSON.parse(value || "{}");
        const master = readMaster(this);
        const nextKey = profileKey(payload.profile);
        if (!nextKey.replaceAll("|", "")) return;

        const previousKey = master.activeProfileKey;
        const previous = master.profiles[previousKey] || { completions: {} };
        const existing = master.profiles[nextKey] || { completions: {} };
        const completions = nextKey === previousKey
          ? clone(payload.completions)
          : mergeCompletions(existing.completions, completionDelta(previous.completions, payload.completions));

        master.activeProfileKey = nextKey;
        master.profiles[nextKey] = {
          profile: payload.profile,
          completions
        };
        writeMaster(this, master);
        return;
      } catch {
        return;
      }
    }
    return originalSetItem.call(this, key, value);
  };
})();
