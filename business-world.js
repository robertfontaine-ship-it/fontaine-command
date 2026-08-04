(() => {
  'use strict';

  const ID_KEY = 'fontaineMissionIdentity:v1';
  const PREF_KEY = 'woodsideBusinessWorld:preferences:v1';
  const missionStore = window.FontaineMissionStore;
  const RANKS = [
    { name: 'Marketing Rookie', xp: 0 },
    { name: 'Campaign Specialist', xp: 75 },
    { name: 'Brand Strategist', xp: 175 },
    { name: 'Marketing Director', xp: 325 },
    { name: 'Vice President', xp: 525 },
    { name: 'Chief Marketing Officer', xp: 800 },
    { name: 'Industry Legend', xp: 1200 }
  ];

  const TOPICS = {
    branding: { name: 'Brand Studio', short: 'Branding Boulevard', icon: '🎨', href: 'branding-hub.html', description: 'Identity, positioning, voice, and brand equity.' },
    'target-market': { name: 'Consumer Intelligence Center', short: 'Target Market Mall', icon: '🎯', href: 'target-market-hub.html', description: 'Segmentation, personas, and customer evidence.' },
    'four-ps': { name: 'Strategy War Room', short: '4 Ps Plaza', icon: '🧩', href: 'four-ps-hub.html', description: 'Product, price, place, and promotion decisions.' },
    functions: { name: 'Marketing Operations HQ', short: 'Functions HQ', icon: '🏢', href: 'marketing-functions-hub.html', description: 'How departments cooperate to create value.' },
    promotion: { name: 'Campaign Command Center', short: 'Promotion Plaza', icon: '📣', href: 'promotional-mix-hub.html', description: 'Advertising, PR, selling, and direct marketing.' },
    agency: { name: 'Wolverine Marketing Agency', short: 'Agency Floor', icon: '💼', href: 'wolverine-agency.html', description: 'Career roles, client briefs, and portfolio work.' }
  };

  const DAILY = [
    { title: 'Brand Detective', brief: 'Choose a real brand and identify three clues that reveal its personality and target customer.', topic: 'branding', level: 'Quick Mission', minutes: '8–10 minutes' },
    { title: 'Audience Undercover', brief: 'Study one advertisement and build the most specific target-market profile the evidence supports.', topic: 'target-market', level: 'Quick Mission', minutes: '10 minutes' },
    { title: 'Marketing Mix Repair', brief: 'Find one Product, Price, Place, or Promotion decision that does not fit its customer and repair it.', topic: 'four-ps', level: 'Skill Mission', minutes: '15–20 minutes' },
    { title: 'Department Breakdown', brief: 'Choose a business action and explain which marketing functions must cooperate to make it work.', topic: 'functions', level: 'Skill Mission', minutes: '15–20 minutes' },
    { title: 'Campaign Decision Room', brief: 'Choose the best promotional tool for a specific audience, goal, message, and required action.', topic: 'promotion', level: 'Quick Mission', minutes: '10 minutes' },
    { title: 'Weekend Boss Preview', brief: 'Build a mini launch strategy using one specific target customer and all four marketing-mix decisions.', topic: 'four-ps', level: 'Boss Preview', minutes: '25–35 minutes' },
    { title: 'Sunday Strategy Reset', brief: 'Review your completed missions and choose the department where your next skill upgrade should happen.', topic: 'branding', level: 'Reflection', minutes: '5 minutes' }
  ];

  const screen = document.getElementById('screen');
  const modalRoot = document.getElementById('modal-root');
  const toast = document.getElementById('toast');
  const VIEW_TITLES = { home: 'City Hall', missions: 'Missions', passport: 'Business Passport', achievements: 'Achievement Gallery' };
  let currentView = 'home';
  let toastTimer;
  let modalReturnFocus = null;

  function readJSON(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function preferences() {
    return { avatar: 'FI', sound: true, ...readJSON(PREF_KEY, {}) };
  }

  function identity() {
    return { first: '', last: '', period: '', ...(missionStore?.getActiveProfile() || readJSON(ID_KEY, {})) };
  }

  function weekKey() {
    const date = new Date();
    const day = date.getDay();
    date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 10);
  }

  function xpFor(entries) {
    const value = Number(entries || 0);
    return value >= 4 ? 50 : value >= 2 ? 25 : value >= 1 ? 10 : 0;
  }

  function collectProgress() {
    if (missionStore) {
      const profile = identity();
      const missions = missionStore.getAllHistory({ profile }).sort((a, b) => {
        const aTime = Date.parse(a.submittedAt || a.completedAt || 0) || 0;
        const bTime = Date.parse(b.submittedAt || b.completedAt || 0) || 0;
        return bTime - aTime;
      });
      const topicData = {};
      missions.forEach((item) => {
        const topic = item.topic;
        const missionId = item.missionId || item.id;
        topicData[topic] = topicData[topic] || { missions: new Map(), weekly: 0 };
        topicData[topic].missions.set(missionId, item);
        if (item.week === missionStore.getWeekKey()) topicData[topic].weekly += Number(item.entries || 0);
      });
      const xp = missions.reduce((sum, item) => sum + Number(item.xp ?? missionStore.xpForEntries(item.requestedEntries ?? item.entries)), 0);
      const weekly = missionStore.weeklyEntrySummary({ profile }).total;
      return { topicData, missions, xp, weekly, inferredIdentity: profile };
    }

    const topicData = {};
    let inferredIdentity = null;
    const addCompletion = (topic, missionId, item, week) => {
      topicData[topic] = topicData[topic] || { missions: new Map(), weekly: 0 };
      topicData[topic].missions.set(missionId, item);
      if (week === weekKey()) topicData[topic].weekly += Number(item.entries || 0);
    };

    Object.keys(localStorage).filter((key) => key.startsWith('fontaineHub:')).forEach((key) => {
      const topic = key.split(':')[1];
      const all = readJSON(key, {});
      Object.entries(all).forEach(([week, data]) => {
        if (data?.profile?.first) inferredIdentity = data.profile;
        Object.entries(data?.completions || {}).forEach(([missionId, item]) => addCompletion(topic, missionId, item, week));
      });
    });

    const legacy = readJSON('fontaineMissionNetwork:v1', {});
    if (legacy.profile?.first) inferredIdentity = legacy.profile;
    Object.entries(legacy.completions || {}).forEach(([week, missions]) => {
      Object.entries(missions || {}).forEach(([missionId, item]) => addCompletion('branding', missionId, item, week));
    });

    const master = readJSON('fontaineMissionNetwork:profiles:v1', {});
    Object.values(master.profiles || {}).forEach((profile) => {
      if (profile?.profile?.first) inferredIdentity = profile.profile;
      Object.entries(profile?.completions || {}).forEach(([week, missions]) => {
        Object.entries(missions || {}).forEach(([missionId, item]) => addCompletion('branding', missionId, item, week));
      });
    });

    const unique = new Map();
    Object.entries(topicData).forEach(([topic, data]) => {
      data.missions.forEach((item, missionId) => unique.set(`${topic}:${missionId}`, { ...item, topic, id: missionId }));
    });

    const missions = [...unique.values()].sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
    const xp = missions.reduce((sum, item) => sum + xpFor(item.entries), 0);
    const weekly = Math.min(10, Object.values(topicData).reduce((sum, data) => sum + data.weekly, 0));
    return { topicData, missions, xp, weekly, inferredIdentity };
  }

  function rankFor(xp) {
    return [...RANKS].reverse().find((rank) => xp >= rank.xp) || RANKS[0];
  }

  function nextRank(xp) {
    return RANKS.find((rank) => xp < rank.xp) || null;
  }

  function unlockedBadges(data) {
    const count = data.missions.length;
    const topics = Object.values(data.topicData).filter((item) => item.missions.size).length;
    return [
      { icon: '🚀', name: 'First Mission', description: 'Complete your first mission.', earned: count >= 1 },
      { icon: '⚡', name: 'Mission Streak', description: 'Complete five missions.', earned: count >= 5 },
      { icon: '🏆', name: 'Ten Deep', description: 'Complete ten missions.', earned: count >= 10 },
      { icon: '🧭', name: 'Explorer', description: 'Work in three departments.', earned: topics >= 3 },
      { icon: '💼', name: 'Agency Rookie', description: 'Complete your first client project.', earned: (data.topicData.agency?.missions.size || 0) >= 1 },
      { icon: '🌐', name: 'Networked', description: 'Work in all five departments and the agency.', earned: topics >= 6 },
      { icon: '🧠', name: 'Strategy Mind', description: 'Reach Brand Strategist rank.', earned: data.xp >= 175 },
      { icon: '🎯', name: 'Focused Marketer', description: 'Reach Marketing Director rank.', earned: data.xp >= 325 },
      { icon: '👑', name: 'Industry Legend', description: 'Reach 1,200 XP.', earned: data.xp >= 1200 }
    ];
  }

  function profileName(profile) {
    return profile.first ? `${profile.first}${profile.last ? ` ${profile.last}.` : ''}` : 'New Hire';
  }

  function initials(profile) {
    if (!profile.first) return 'FI';
    return `${profile.first[0]}${profile.last || ''}`.toUpperCase();
  }

  function syncHeader(data = collectProgress()) {
    const profile = identity();
    const rank = rankFor(data.xp);
    const pref = preferences();
    document.querySelectorAll('[data-profile-name]').forEach((item) => { item.textContent = profileName(profile); });
    document.querySelectorAll('[data-profile-avatar]').forEach((item) => { item.textContent = pref.avatar || initials(profile); });
    document.querySelectorAll('[data-profile-rank]').forEach((item) => { item.textContent = rank.name; });
    const soundIcon = document.querySelector('[data-sound-icon]');
    if (soundIcon) soundIcon.textContent = pref.sound ? '🔊' : '🔇';
    const soundButton = document.querySelector('[data-action="toggle-sound"]');
    if (soundButton) {
      soundButton.setAttribute('aria-pressed', String(pref.sound));
      soundButton.setAttribute('aria-label', `Turn sound effects ${pref.sound ? 'off' : 'on'}`);
    }
  }

  function rankProgress(data) {
    const current = rankFor(data.xp);
    const next = nextRank(data.xp);
    if (!next) return 100;
    return Math.max(0, Math.min(100, ((data.xp - current.xp) / (next.xp - current.xp)) * 100));
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function playTone(frequency = 680, duration = 0.08) {
    if (!preferences().sound) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      const context = new Context();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.04, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
      oscillator.addEventListener('ended', () => context.close());
    } catch { /* Sound is optional. */ }
  }

  function setActiveNav(view) {
    document.querySelectorAll('[data-nav]').forEach((button) => {
      const active = button.dataset.nav === view;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.title = view === 'home' ? 'Woodside Business World' : `${VIEW_TITLES[view]} | Woodside Business World`;
  }

  function navigate(view) {
    currentView = view;
    render();
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    requestAnimationFrame(() => screen.focus({ preventScroll: true }));
  }

  function render() {
    const data = collectProgress();
    const profile = identity();
    if (!profile.first && data.inferredIdentity?.first) {
      const inferredProfile = {
        first: data.inferredIdentity.first || '',
        last: String(data.inferredIdentity.last || '').slice(0, 1).toUpperCase(),
        period: data.inferredIdentity.period || ''
      };
      if (missionStore) missionStore.setActiveProfile(inferredProfile);
      else writeJSON(ID_KEY, inferredProfile);
    }
    syncHeader(data);
    if (currentView === 'missions') renderMissions(data);
    else if (currentView === 'passport') renderPassport(data);
    else if (currentView === 'achievements') renderAchievements(data);
    else renderHome(data);
    setActiveNav(currentView);
    if (!identity().first) requestAnimationFrame(() => openProfileModal(true));
  }

  function renderHome(data) {
    const profile = identity();
    const rank = rankFor(data.xp);
    const next = nextRank(data.xp);
    const badges = unlockedBadges(data);
    const earnedBadges = badges.filter((badge) => badge.earned).length;
    const daily = DAILY[new Date().getDay()];
    const dailyTopic = TOPICS[daily.topic];
    const latest = data.missions[0];
    const latestTopic = latest ? TOPICS[latest.topic] : null;

    screen.innerHTML = `
      <div class="page">
        <section class="hero-grid">
          <article class="hero-card">
            <p class="eyebrow">A202 Operations Briefing</p>
            <h1>Welcome to<br>Business World.</h1>
            <p class="hero-copy">You work for Fontaine Industries. Complete missions, solve real business problems, earn reputation, and help build the city one district at a time.</p>
            <div class="hero-actions">
              <a class="primary-button" href="${dailyTopic.href}">START TODAY'S MISSION</a>
              <button class="secondary-button" data-action="open-passport">VIEW BUSINESS PASSPORT</button>
            </div>
          </article>

          <aside class="panel profile-panel">
            <p class="eyebrow">Employee ID</p>
            <div class="employee-id">
              <div class="big-avatar">${preferences().avatar || initials(profile)}</div>
              <div><strong>${escapeHtml(profileName(profile))}</strong><small>${profile.period ? `Period ${profile.period}` : 'Period not set'} • Fontaine Industries</small><small>Rank: ${rank.name}</small></div>
            </div>
            <div class="stat-row">
              <div class="stat-card"><strong>${data.xp}</strong><span>XP</span></div>
              <div class="stat-card"><strong>${data.weekly}</strong><span>Entries</span></div>
              <div class="stat-card"><strong>${earnedBadges}</strong><span>Badges</span></div>
            </div>
            <div class="progress-label"><span>${rank.name}</span><span>${next ? `${next.xp - data.xp} XP to ${next.name}` : 'Maximum rank'}</span></div>
            <div class="progress-track"><span style="width:${rankProgress(data)}%"></span></div>
            <button class="secondary-button" data-action="open-profile" style="width:100%;margin-top:18px;">EDIT EMPLOYEE PROFILE</button>
          </aside>
        </section>

        <div class="section-heading">
          <div><p class="eyebrow">Interactive City Map</p><h2>Choose your destination.</h2><p>Every live building connects to the same Mission ID, XP, badges, and weekly entry system.</p></div>
          <span class="status-tag open">6 Locations Live</span>
        </div>

        <section class="dashboard-grid">
          <article class="map-card">
            <div class="business-city-grid" aria-label="Interactive map of Woodside Business World">
              <a class="city-building live" href="branding-hub.html"><span>🎨</span><strong>Branding Boulevard</strong><small>Brand Studio</small></a>
              <a class="city-building live" href="target-market-hub.html"><span>🎯</span><strong>Target Market Mall</strong><small>Consumer Intelligence</small></a>
              <a class="city-building live" href="four-ps-hub.html"><span>🧩</span><strong>4 Ps Plaza</strong><small>Strategy War Room</small></a>
              <a class="city-building live" href="promotional-mix-hub.html"><span>📣</span><strong>Promotion Plaza</strong><small>Campaign Command</small></a>
              <button class="city-hall-building" data-action="go-home"><span>🏛️</span><strong>CITY HALL</strong><small>A202 Headquarters</small></button>
              <a class="city-building live" href="marketing-functions-hub.html"><span>🏢</span><strong>Functions HQ</strong><small>Marketing Operations</small></a>
              <a class="city-building live" href="wolverine-agency.html"><span>💼</span><strong>Agency Floor</strong><small>Client Projects</small></a>
              <button class="city-building locked" data-action="locked-district"><span>🧟</span><strong>Career Center</strong><small>WRS Quest • Locked</small></button>
              <button class="city-building locked" data-action="locked-district"><span>🚀</span><strong>Startup Street</strong><small>Entrepreneurship • Locked</small></button>
            </div>
          </article>

          <aside class="side-stack">
            <article class="mission-card">
              <span class="mission-number">MISSION OF THE DAY</span>
              <h3 style="margin-top:16px;">${daily.title}</h3>
              <p>${daily.brief}</p>
              <div class="reward-row"><span class="reward-pill">${daily.level}</span><span class="reward-pill">⏱ ${daily.minutes}</span><span class="reward-pill">${dailyTopic.icon} ${dailyTopic.name}</span></div>
              <a class="primary-button" href="${dailyTopic.href}" style="display:block;text-align:center;">OPEN MISSION</a>
            </article>

            <article class="mission-card">
              <p class="eyebrow">Continue Working</p>
              ${latest ? `<h3>${escapeHtml(latest.id)} • ${latestTopic?.name || 'Marketing Department'}</h3><p>Your latest receipt is saved. Reopen the department to review, revise, or choose another mission.</p><a class="secondary-button" href="${latestTopic?.href || 'topic-hubs.html'}" style="display:block;text-align:center;">RETURN TO DEPARTMENT</a>` : `<h3>No mission history yet</h3><p>Open a live district, select a mission that fits your time, and follow every step in order.</p><a class="secondary-button" href="topic-hubs.html" style="display:block;text-align:center;">BROWSE ALL DEPARTMENTS</a>`}
            </article>

            <article class="mission-card">
              <p class="eyebrow">Company News</p>
              <div class="news-list">
                <div class="news-item"><span>🔥</span><div><strong>Six locations are open</strong><small>Five departments plus Wolverine Agency.</small></div></div>
                <div class="news-item"><span>🎟️</span><div><strong>Friday Mystery Drop</strong><small>${data.weekly}/10 provisional entries this week.</small></div></div>
                <div class="news-item"><span>🔒</span><div><strong>Next district</strong><small>Entrepreneurship's Startup Street.</small></div></div>
              </div>
            </article>
          </aside>
        </section>
      </div>`;
  }

  function renderMissions(data) {
    const daily = DAILY[new Date().getDay()];
    const topic = TOPICS[daily.topic];
    const latest = data.missions[0];
    const latestTopic = latest ? TOPICS[latest.topic] : null;
    screen.innerHTML = `
      <div class="page">
        <header class="page-header"><div><p class="eyebrow">Mission Control</p><h1 style="font-size:clamp(2.4rem,5vw,4.2rem);">Your assignments.</h1><p>Finish required class work first. Then choose a Quick, Skill, Boss, or Agency mission that fits your remaining time.</p></div><a class="secondary-button" href="mission-control.html">OPEN FULL MISSION CONTROL</a></header>
        <section class="dashboard-grid">
          <article class="mission-card"><span class="mission-number">MISSION OF THE DAY</span><h2 style="margin-top:16px;">${daily.title}</h2><p>${daily.brief}</p><div class="reward-row"><span class="reward-pill">${daily.level}</span><span class="reward-pill">${daily.minutes}</span><span class="reward-pill">${topic.name}</span></div><a class="primary-button" href="${topic.href}" style="display:inline-block;">START MISSION</a></article>
          <article class="mission-card"><span class="mission-number">LATEST RECEIPT</span>${latest ? `<h2 style="margin-top:16px;">${escapeHtml(latest.id)}</h2><p>${latestTopic?.name || 'Marketing Department'} • ${latest.entries || 0} provisional entries</p><a class="secondary-button" href="${latestTopic?.href || 'topic-hubs.html'}" style="display:inline-block;">REOPEN DEPARTMENT</a>` : `<h2 style="margin-top:16px;">No mission completed yet</h2><p>Your latest receipt will appear here after you finish a mission.</p><a class="secondary-button" href="topic-hubs.html" style="display:inline-block;">BROWSE DEPARTMENTS</a>`}</article>
        </section>
        <div class="section-heading"><div><p class="eyebrow">Live Work Areas</p><h2>Pick a department.</h2></div></div>
        <section class="department-grid">${Object.values(TOPICS).map((item) => `<article class="department-card"><span class="department-icon">${item.icon}</span><span class="status-tag open">Live</span><h3>${item.name}</h3><p>${item.description}</p><a class="mini-button" href="${item.href}" style="display:inline-block;">Enter Location</a></article>`).join('')}</section>
      </div>`;
  }

  function renderPassport(data) {
    screen.innerHTML = `
      <div class="page">
        <header class="page-header"><div><p class="eyebrow">Business Passport</p><h1 style="font-size:clamp(2.4rem,5vw,4.2rem);">Your mastery record.</h1><p>Each district stamp shows where you have completed at least one saved mission or client project.</p></div><a class="secondary-button" href="student-mission-id.html">OPEN FULL MISSION ID</a></header>
        <section class="passport-grid">${Object.entries(TOPICS).map(([id, item]) => {
          const count = data.topicData[id]?.missions.size || 0;
          return `<article class="passport-card ${count ? 'completed' : ''}"><span class="passport-icon">${item.icon}</span><h3 style="margin-top:16px;">${item.short}</h3><p>${count} ${id === 'agency' ? (count === 1 ? 'client project' : 'client projects') : (count === 1 ? 'mission' : 'missions')} completed</p><span class="status-tag ${count ? 'complete' : 'open'}">${count ? 'Stamped' : 'Open'}</span></article>`;
        }).join('')}</section>
      </div>`;
  }

  function renderAchievements(data) {
    const badges = unlockedBadges(data);
    const earned = badges.filter((badge) => badge.earned).length;
    screen.innerHTML = `
      <div class="page">
        <header class="page-header"><div><p class="eyebrow">Achievement Gallery</p><h1 style="font-size:clamp(2.4rem,5vw,4.2rem);">Build your reputation.</h1><p>Badges recognize mission completion, exploration, strategy, career work, and long-term consistency.</p></div><span class="status-tag complete">${earned} Earned</span></header>
        <section class="achievement-grid">${badges.map((badge) => `<article class="achievement-card ${badge.earned ? 'earned' : 'locked'}"><span class="achievement-icon">${badge.icon}</span><h3 style="margin-top:16px;">${badge.name}</h3><p>${badge.earned ? 'Unlocked and added to your Mission ID.' : badge.description}</p><span class="status-tag ${badge.earned ? 'complete' : ''}">${badge.earned ? 'Earned' : 'Locked'}</span></article>`).join('')}</section>
      </div>`;
  }

  function openProfileModal(required = false) {
    const profile = identity();
    const pref = preferences();
    const avatarOptions = [
      { value: 'FI', label: 'Fontaine initials' },
      { value: '📣', label: 'Megaphone' },
      { value: '🎯', label: 'Target' },
      { value: '🚀', label: 'Rocket' },
      { value: '👗', label: 'Fashion' },
      { value: '💼', label: 'Briefcase' }
    ];
    if (!modalRoot.innerHTML) modalReturnFocus = required ? null : document.activeElement;
    modalRoot.innerHTML = `
      <div class="modal-backdrop" ${required ? '' : 'data-action="close-modal"'}>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" aria-describedby="profile-description">
          <div class="modal-header"><div><p class="eyebrow">New Hire Orientation</p><h2 id="profile-title">Set your employee profile.</h2><p id="profile-description">Use the same name and period on every Mission Network page. Progress remains on this browser.</p></div>${required ? '' : '<button type="button" class="close-button" data-action="close-modal" aria-label="Close profile editor">✕</button>'}</div>
          <form id="profile-form" class="form-grid">
            <label>First name<input name="first" maxlength="20" value="${escapeHtml(profile.first)}" placeholder="First name" required /></label>
            <label>Last initial<input name="last" maxlength="1" value="${escapeHtml(profile.last)}" placeholder="Last initial" required /></label>
            <label>Class period<select name="period" required><option value="">Choose a period</option>${['1','2','3','4','5','6','7'].map((period) => `<option value="${period}" ${profile.period === period ? 'selected' : ''}>Period ${period}</option>`).join('')}</select></label>
            <label>Employee badge style<div class="avatar-picker" role="group" aria-label="Employee badge style">${avatarOptions.map((avatar) => `<button type="button" class="avatar-option ${pref.avatar === avatar.value ? 'selected' : ''}" data-action="select-avatar" data-avatar="${avatar.value}" aria-label="Select ${avatar.label} badge" aria-pressed="${pref.avatar === avatar.value}">${avatar.value}</button>`).join('')}</div><input type="hidden" name="avatar" value="${escapeHtml(pref.avatar)}" /></label>
            <button class="primary-button" type="submit">${profile.first ? 'SAVE PROFILE' : 'CLOCK IN'}</button>
          </form>
        </section>
      </div>`;
    document.getElementById('app').inert = true;
    document.querySelector('.skip-link').inert = true;
    document.body.classList.add('modal-open');
    const first = modalRoot.querySelector('input[name="first"]');
    if (first) setTimeout(() => first.focus(), 30);
  }

  function closeModal() {
    if (!modalRoot.innerHTML) return;
    const returnFocus = modalReturnFocus;
    modalReturnFocus = null;
    modalRoot.innerHTML = '';
    document.getElementById('app').inert = false;
    document.querySelector('.skip-link').inert = false;
    document.body.classList.remove('modal-open');
    requestAnimationFrame(() => {
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
  }

  function modalFocusableElements() {
    return [...modalRoot.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
  }

  function escapeHtml(value) {
    return String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action], [data-nav]');
    if (!target) return;
    if (target.dataset.nav) { navigate(target.dataset.nav); return; }
    const action = target.dataset.action;
    if (action === 'go-home') navigate('home');
    if (action === 'open-passport') navigate('passport');
    if (action === 'open-profile') openProfileModal(false);
    if (action === 'close-modal' && (event.target === target || target.classList.contains('close-button'))) closeModal();
    if (action === 'locked-district') showToast('This district is under construction.');
    if (action === 'toggle-sound') {
      const pref = preferences();
      pref.sound = !pref.sound;
      writeJSON(PREF_KEY, pref);
      syncHeader();
      showToast(`Sound effects ${pref.sound ? 'on' : 'off'}.`);
      if (pref.sound) playTone();
    }
    if (action === 'select-avatar') {
      const picker = target.closest('.avatar-picker');
      picker.querySelectorAll('.avatar-option').forEach((button) => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
      });
      target.classList.add('selected');
      target.setAttribute('aria-pressed', 'true');
      target.closest('label').querySelector('input[name="avatar"]').value = target.dataset.avatar;
    }
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'profile-form') return;
    event.preventDefault();
    const formData = new FormData(event.target);
    const first = String(formData.get('first') || '').trim();
    const last = String(formData.get('last') || '').trim().slice(0, 1).toUpperCase();
    const period = String(formData.get('period') || '');
    if (!first || !last || !period) return;
    if (missionStore) missionStore.setActiveProfile({ first, last, period });
    else writeJSON(ID_KEY, { first, last, period });
    writeJSON(PREF_KEY, { ...preferences(), avatar: String(formData.get('avatar') || initials({ first, last })) });
    closeModal();
    render();
    playTone(790, 0.1);
    showToast(`Welcome to Fontaine Industries, ${first}.`);
  });

  document.addEventListener('keydown', (event) => {
    if (!modalRoot.innerHTML) return;
    if (event.key === 'Escape' && identity().first) {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = modalFocusableElements();
    if (!items.length) return;
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

  window.addEventListener('storage', render);
  render();
})();
