(() => {
  "use strict";

  const DATA_KEY = "fontaineMissionData:v2";
  const IDENTITY_KEY = "fontaineMissionIdentity:v1";
  const WEEKLY_ENTRY_CAP = 10;
  const PROFILE_EXPORT_FORMAT = "fontaine-mission-profile";
  const PROFILE_EXPORT_VERSION = 1;

  const clone = value => value === undefined ? {} : JSON.parse(JSON.stringify(value));

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
    } catch {
      return fallback;
    }
  }

  function normalizeProfile(profile = {}) {
    return {
      first: String(profile.first || "").trim(),
      last: String(profile.last || "").trim().slice(0, 1).toUpperCase(),
      period: String(profile.period || "").trim()
    };
  }

  function isCompleteProfile(profile = {}) {
    const normalized = normalizeProfile(profile);
    return Boolean(normalized.first && normalized.last && normalized.period);
  }

  function profileKey(profile = {}) {
    const normalized = normalizeProfile(profile);
    return [normalized.first, normalized.last, normalized.period]
      .map(value => value.toLowerCase())
      .join("|");
  }

  function getWeekKey(date = new Date()) {
    const working = new Date(date);
    const day = working.getDay();
    working.setDate(working.getDate() + (day === 0 ? -6 : 1 - day));
    working.setHours(0, 0, 0, 0);
    return working.toISOString().slice(0, 10);
  }

  function emptyData() {
    return {
      version: 3,
      activeProfileKey: "",
      profiles: {},
      migrations: {}
    };
  }

  function readData() {
    const parsed = readJSON(DATA_KEY, emptyData());
    return {
      ...emptyData(),
      ...parsed,
      version: 3,
      profiles: parsed?.profiles || {},
      migrations: parsed?.migrations || {}
    };
  }

  function writeData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  function ensureProfile(data, profile) {
    const normalized = normalizeProfile(profile);
    if (!isCompleteProfile(normalized)) return null;
    const key = profileKey(normalized);
    const existing = data.profiles[key] || {};
    data.profiles[key] = {
      profile: normalized,
      topics: existing.topics || {},
      drafts: existing.drafts || {},
      agencyRole: existing.agencyRole || ""
    };
    return { key, record: data.profiles[key] };
  }

  function itemTime(item = {}) {
    const value = item.submittedAt || item.completedAt || item.updatedAt || "";
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
  }

  function mergeLegacyCompletion(data, profile, topic, week, missionId, item) {
    const target = ensureProfile(data, profile);
    if (!target || !topic || !week || !missionId) return;
    target.record.topics[topic] = target.record.topics[topic] || { weeks: {} };
    const weeks = target.record.topics[topic].weeks;
    weeks[week] = weeks[week] || { completions: {} };
    const prior = weeks[week].completions[missionId];
    if (!prior || itemTime(item) >= itemTime(prior)) {
      weeks[week].completions[missionId] = clone(item);
    }
  }

  function importWeeklyStore(data, topic, store, fallbackProfile = {}) {
    Object.entries(store || {}).forEach(([week, bucket]) => {
      const profile = bucket?.profile || fallbackProfile;
      Object.entries(bucket?.completions || {}).forEach(([missionId, item]) => {
        mergeLegacyCompletion(data, profile, topic, week, missionId, item);
      });
    });
  }

  function migrateLegacyData(data) {
    if (data.migrations?.legacyV1) return data;

    const identity = normalizeProfile(readJSON(IDENTITY_KEY, {}));
    const brandingMaster = readJSON("fontaineMissionNetwork:profiles:v1", {});

    Object.values(brandingMaster.profiles || {}).forEach(profileStore => {
      const profile = profileStore?.profile || {};
      Object.entries(profileStore?.completions || {}).forEach(([week, completions]) => {
        Object.entries(completions || {}).forEach(([missionId, item]) => {
          mergeLegacyCompletion(data, profile, "branding", week, missionId, item);
        });
      });
    });

    const brandingLegacy = readJSON("fontaineMissionNetwork:v1", {});
    Object.entries(brandingLegacy.completions || {}).forEach(([week, completions]) => {
      Object.entries(completions || {}).forEach(([missionId, item]) => {
        mergeLegacyCompletion(data, brandingLegacy.profile || identity, "branding", week, missionId, item);
      });
    });

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith("fontaineHub:")) continue;
      const topic = key.split(":")[1];
      importWeeklyStore(data, topic, readJSON(key, {}), identity);
    }

    const agencyLegacy = readJSON("fontaineAgency:v1", {});
    const agencyProfile = agencyLegacy.profile || identity;
    const agencyTarget = ensureProfile(data, agencyProfile);
    if (agencyTarget && agencyLegacy.profile?.role) {
      agencyTarget.record.agencyRole = String(agencyLegacy.profile.role);
    }
    Object.entries(agencyLegacy.completions || {}).forEach(([missionId, item]) => {
      const completed = item?.completedAt ? new Date(item.completedAt) : new Date();
      mergeLegacyCompletion(data, agencyProfile, "agency", getWeekKey(completed), missionId, item);
    });

    const activeFromMaster = brandingMaster.profiles?.[brandingMaster.activeProfileKey]?.profile;
    const active = isCompleteProfile(identity) ? identity : activeFromMaster;
    const activeTarget = ensureProfile(data, active || {});
    if (activeTarget) data.activeProfileKey = activeTarget.key;

    data.migrations = { ...(data.migrations || {}), legacyV1: true };
    return data;
  }

  function initialize() {
    const data = migrateLegacyData(readData());
    const identity = normalizeProfile(readJSON(IDENTITY_KEY, {}));
    const target = ensureProfile(data, identity);
    if (target) data.activeProfileKey = target.key;
    writeData(data);
  }

  function resolveProfile(data, requestedProfile) {
    const requested = normalizeProfile(requestedProfile || {});
    if (isCompleteProfile(requested)) return ensureProfile(data, requested);

    const identity = normalizeProfile(readJSON(IDENTITY_KEY, {}));
    if (isCompleteProfile(identity)) return ensureProfile(data, identity);

    const active = data.profiles[data.activeProfileKey];
    if (active?.profile && isCompleteProfile(active.profile)) {
      return { key: data.activeProfileKey, record: active };
    }
    return null;
  }

  function setActiveProfile(profile) {
    const data = readData();
    const target = ensureProfile(data, profile);
    if (!target) return normalizeProfile({});
    data.activeProfileKey = target.key;
    writeData(data);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(target.record.profile));
    return clone(target.record.profile);
  }

  function getActiveProfile() {
    const data = readData();
    const target = resolveProfile(data);
    if (!target) return normalizeProfile({});
    if (data.activeProfileKey !== target.key) {
      data.activeProfileKey = target.key;
      writeData(data);
    }
    return clone(target.record.profile);
  }

  function topicRecord(record, topic) {
    return record?.topics?.[topic] || { weeks: {} };
  }

  function getTopicCompletions(topic, options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return {};
    const week = options.week || getWeekKey();
    return clone(topicRecord(target.record, topic).weeks?.[week]?.completions || {});
  }

  function getTopicHistory(topic, options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return [];
    const unique = new Map();
    const weeks = topicRecord(target.record, topic).weeks || {};
    Object.entries(weeks).forEach(([week, bucket]) => {
      Object.entries(bucket?.completions || {}).forEach(([missionId, item]) => {
        const candidate = { ...clone(item), missionId, id: missionId, topic, week };
        const prior = unique.get(missionId);
        if (!prior || itemTime(candidate) >= itemTime(prior)) unique.set(missionId, candidate);
      });
    });
    return [...unique.values()].sort((a, b) => itemTime(b) - itemTime(a));
  }

  function getAllHistory(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return [];
    return Object.keys(target.record.topics || {})
      .flatMap(topic => getTopicHistory(topic, { profile: target.record.profile }));
  }

  function weeklyEntrySummary(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    const week = options.week || getWeekKey();
    if (!target) return { total: 0, rawTotal: 0, remaining: WEEKLY_ENTRY_CAP, cap: WEEKLY_ENTRY_CAP };
    const rawTotal = Object.values(target.record.topics || {}).reduce((sum, topic) => {
      const completions = topic?.weeks?.[week]?.completions || {};
      return sum + Object.values(completions).reduce((topicSum, item) => topicSum + Number(item.entries || 0), 0);
    }, 0);
    const total = Math.min(WEEKLY_ENTRY_CAP, rawTotal);
    return {
      total,
      rawTotal,
      remaining: Math.max(0, WEEKLY_ENTRY_CAP - total),
      cap: WEEKLY_ENTRY_CAP
    };
  }

  function xpForEntries(entries) {
    const value = Number(entries || 0);
    if (value >= 4) return 50;
    if (value >= 2) return 25;
    return 10;
  }

  function saveCompletion({ topic, missionId, profile, item = {}, requestedEntries = 0, xp }) {
    if (!topic || !missionId) throw new Error("A topic and mission ID are required.");
    const data = readData();
    const target = ensureProfile(data, profile || resolveProfile(data)?.record?.profile || {});
    if (!target) throw new Error("Set a complete student identity before saving mission work.");

    const week = item.week || getWeekKey(item.submittedAt ? new Date(item.submittedAt) : new Date());
    target.record.topics[topic] = target.record.topics[topic] || { weeks: {} };
    target.record.topics[topic].weeks[week] = target.record.topics[topic].weeks[week] || { completions: {} };
    const completions = target.record.topics[topic].weeks[week].completions;
    const previous = completions[missionId];

    let otherEntries = 0;
    Object.entries(target.record.topics || {}).forEach(([topicId, topicData]) => {
      const weekly = topicData?.weeks?.[week]?.completions || {};
      Object.entries(weekly).forEach(([id, completion]) => {
        if (topicId === topic && id === missionId) return;
        otherEntries += Number(completion.entries || 0);
      });
    });

    const requested = Math.max(0, Number(requestedEntries || 0));
    const awardedEntries = Math.min(requested, Math.max(0, WEEKLY_ENTRY_CAP - otherEntries));
    const saved = {
      ...clone(previous || {}),
      ...clone(item),
      entries: awardedEntries,
      requestedEntries: requested,
      xp: Number(xp ?? item.xp ?? xpForEntries(requested)),
      submittedAt: item.submittedAt || new Date().toISOString()
    };
    completions[missionId] = saved;
    data.activeProfileKey = target.key;
    writeData(data);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(target.record.profile));

    return {
      item: clone(saved),
      profile: clone(target.record.profile),
      weekly: weeklyEntrySummary({ profile: target.record.profile, week })
    };
  }

  function draftKey(topic, missionId) {
    return `${String(topic || "").trim()}:${String(missionId || "").trim()}`;
  }

  function saveDraft({ topic, missionId, profile, values = {}, title = "" }) {
    if (!topic || !missionId) throw new Error("A topic and mission ID are required for autosave.");
    const data = readData();
    const target = ensureProfile(data, profile || resolveProfile(data)?.record?.profile || {});
    if (!target) throw new Error("Set a complete student identity before autosaving mission work.");
    const key = draftKey(topic, missionId);
    const saved = {
      topic: String(topic),
      missionId: String(missionId),
      title: String(title || ""),
      values: clone(values),
      updatedAt: new Date().toISOString()
    };
    target.record.drafts[key] = saved;
    data.activeProfileKey = target.key;
    writeData(data);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(target.record.profile));
    return clone(saved);
  }

  function getDraft(topic, missionId, options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return null;
    return clone(target.record.drafts?.[draftKey(topic, missionId)] || null);
  }

  function getDrafts(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return [];
    return Object.values(target.record.drafts || {})
      .map(clone)
      .sort((a, b) => itemTime(b) - itemTime(a));
  }

  function deleteDraft(topic, missionId, options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return false;
    const key = draftKey(topic, missionId);
    if (!target.record.drafts?.[key]) return false;
    delete target.record.drafts[key];
    writeData(data);
    return true;
  }

  function countCompletions(record = {}) {
    const unique = new Set();
    Object.entries(record.topics || {}).forEach(([topic, topicData]) => {
      Object.values(topicData?.weeks || {}).forEach(bucket => {
        Object.keys(bucket?.completions || {}).forEach(missionId => unique.add(`${topic}:${missionId}`));
      });
    });
    return unique.size;
  }

  function listProfiles() {
    const data = readData();
    return Object.entries(data.profiles || {})
      .map(([key, record]) => ({
        key,
        profile: clone(record.profile),
        missions: countCompletions(record),
        drafts: Object.keys(record.drafts || {}).length,
        active: key === data.activeProfileKey
      }))
      .sort((a, b) => {
        const periodDifference = Number(a.profile.period || 0) - Number(b.profile.period || 0);
        if (periodDifference) return periodDifference;
        return `${a.profile.first}|${a.profile.last}`.localeCompare(`${b.profile.first}|${b.profile.last}`);
      });
  }

  function exportProfile(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) throw new Error("Set or select a student profile before creating a backup.");
    return {
      format: PROFILE_EXPORT_FORMAT,
      version: PROFILE_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      profile: clone(target.record.profile),
      missionData: {
        topics: clone(target.record.topics || {}),
        drafts: clone(target.record.drafts || {}),
        agencyRole: String(target.record.agencyRole || "")
      }
    };
  }

  function mergeProfileRecord(local = {}, imported = {}, replace = false) {
    if (replace) {
      return {
        profile: clone(imported.profile || local.profile || {}),
        topics: clone(imported.topics || {}),
        drafts: clone(imported.drafts || {}),
        agencyRole: String(imported.agencyRole || "")
      };
    }

    const merged = {
      profile: clone(local.profile || imported.profile || {}),
      topics: clone(local.topics || {}),
      drafts: clone(local.drafts || {}),
      agencyRole: String(local.agencyRole || imported.agencyRole || "")
    };

    Object.entries(imported.topics || {}).forEach(([topic, topicData]) => {
      merged.topics[topic] = merged.topics[topic] || { weeks: {} };
      Object.entries(topicData?.weeks || {}).forEach(([week, bucket]) => {
        merged.topics[topic].weeks[week] = merged.topics[topic].weeks[week] || { completions: {} };
        Object.entries(bucket?.completions || {}).forEach(([missionId, completion]) => {
          const prior = merged.topics[topic].weeks[week].completions[missionId];
          if (!prior || itemTime(completion) >= itemTime(prior)) {
            merged.topics[topic].weeks[week].completions[missionId] = clone(completion);
          }
        });
      });
    });

    Object.entries(imported.drafts || {}).forEach(([key, draft]) => {
      const prior = merged.drafts[key];
      if (!prior || itemTime(draft) >= itemTime(prior)) merged.drafts[key] = clone(draft);
    });
    return merged;
  }

  function importProfile(profilePackage, options = {}) {
    const payload = clone(profilePackage || {});
    if (payload.format !== PROFILE_EXPORT_FORMAT || Number(payload.version) !== PROFILE_EXPORT_VERSION) {
      throw new Error("This file is not a compatible Fontaine Mission profile backup.");
    }
    const profile = normalizeProfile(payload.profile || {});
    if (!isCompleteProfile(profile)) throw new Error("The backup does not contain a complete student profile.");
    if (!payload.missionData || typeof payload.missionData !== "object" || Array.isArray(payload.missionData)) {
      throw new Error("The backup is missing its mission data.");
    }

    const data = readData();
    const target = ensureProfile(data, profile);
    const imported = {
      profile,
      topics: payload.missionData.topics && typeof payload.missionData.topics === "object" ? payload.missionData.topics : {},
      drafts: payload.missionData.drafts && typeof payload.missionData.drafts === "object" ? payload.missionData.drafts : {},
      agencyRole: String(payload.missionData.agencyRole || "")
    };
    data.profiles[target.key] = mergeProfileRecord(target.record, imported, options.mode === "replace");
    data.profiles[target.key].profile = profile;
    data.activeProfileKey = target.key;
    writeData(data);
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(profile));
    return {
      profile: clone(profile),
      missions: countCompletions(data.profiles[target.key]),
      drafts: Object.keys(data.profiles[target.key].drafts || {}).length
    };
  }

  function clearProfile(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    if (!target) return false;
    delete data.profiles[target.key];
    if (data.activeProfileKey === target.key) {
      data.activeProfileKey = "";
      localStorage.removeItem(IDENTITY_KEY);
    }
    writeData(data);
    return true;
  }

  function removeLegacyStudentStores() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("fontaineHub:")) keys.push(key);
    }
    [
      "fontaineMissionNetwork:profiles:v1",
      "fontaineMissionNetwork:v1",
      "fontaineAgency:v1"
    ].forEach(key => keys.push(key));
    keys.forEach(key => localStorage.removeItem(key));
  }

  function clearAllProfiles() {
    removeLegacyStudentStores();
    localStorage.removeItem(IDENTITY_KEY);
    const data = emptyData();
    data.migrations.legacyV1 = true;
    writeData(data);
    return true;
  }

  function getAgencyRole(options = {}) {
    const data = readData();
    const target = resolveProfile(data, options.profile);
    return target?.record?.agencyRole || "";
  }

  function setAgencyRole(role, options = {}) {
    const data = readData();
    const target = ensureProfile(data, options.profile || resolveProfile(data)?.record?.profile || {});
    if (!target) return "";
    target.record.agencyRole = String(role || "");
    data.activeProfileKey = target.key;
    writeData(data);
    return target.record.agencyRole;
  }

  initialize();

  window.FontaineMissionStore = Object.freeze({
    DATA_KEY,
    IDENTITY_KEY,
    WEEKLY_ENTRY_CAP,
    getWeekKey,
    normalizeProfile,
    profileKey,
    getActiveProfile,
    setActiveProfile,
    getTopicCompletions,
    getTopicHistory,
    getAllHistory,
    weeklyEntrySummary,
    saveCompletion,
    saveDraft,
    getDraft,
    getDrafts,
    deleteDraft,
    listProfiles,
    exportProfile,
    importProfile,
    clearProfile,
    clearAllProfiles,
    getAgencyRole,
    setAgencyRole,
    xpForEntries
  });
})();
