(() => {
  'use strict';

  const store = window.FontaineMissionStore;
  const screen = document.getElementById('screen');
  if (!screen) return;

  function profile() {
    return store?.getActiveProfile?.() || { first: '', last: '', period: '' };
  }

  function history() {
    return store?.getAllHistory?.({ profile: profile() }) || [];
  }

  function startupMissions() {
    return history().filter((item) => item.topic === 'startup-street');
  }

  function latestMission() {
    return [...history()].sort((a, b) => {
      const aTime = Date.parse(a.submittedAt || a.completedAt || 0) || 0;
      const bTime = Date.parse(b.submittedAt || b.completedAt || 0) || 0;
      return bTime - aTime;
    })[0];
  }

  function startupCard(className, count = 0) {
    if (className === 'passport-card') {
      return `<article class="passport-card ${count ? 'completed' : ''}" data-startup-street-card><span class="passport-icon">🚀</span><h3 style="margin-top:16px;">Startup Street</h3><p>${count} ${count === 1 ? 'mission' : 'missions'} completed</p><span class="status-tag ${count ? 'complete' : 'open'}">${count ? 'Stamped' : 'Open'}</span></article>`;
    }
    return `<article class="department-card" data-startup-street-card><span class="department-icon">🚀</span><span class="status-tag open">Live</span><h3>Startup Street</h3><p>Opportunity discovery, customer validation, business models, startup money, ownership, pitching, and launch.</p><a class="mini-button" href="startup-street.html" style="display:inline-block;">Enter Location</a></article>`;
  }

  function enhanceHome() {
    const map = screen.querySelector('.business-city-grid');
    if (!map) return;
    const locked = [...map.querySelectorAll('.city-building.locked')].find((item) => item.textContent.includes('Startup Street'));
    if (locked) {
      const link = document.createElement('a');
      link.className = 'city-building live';
      link.href = 'startup-street.html';
      link.dataset.startupStreetCard = '';
      link.innerHTML = '<span>🚀</span><strong>Startup Street</strong><small>Entrepreneurship District</small>';
      locked.replaceWith(link);
    }
    const status = screen.querySelector('.section-heading .status-tag.open');
    if (status && /Locations Live/.test(status.textContent)) status.textContent = '11 Locations Live';
    const news = [...screen.querySelectorAll('.news-item')].find((item) => item.textContent.includes('locations are open'));
    if (news) news.innerHTML = '<span>🔥</span><div><strong>Eleven locations are open</strong><small>Ten learning districts plus Wolverine Agency.</small></div>';
    const next = [...screen.querySelectorAll('.news-item')].find((item) => item.textContent.includes('Next district'));
    if (next) next.innerHTML = '<span>🧟</span><div><strong>Next district</strong><small>WRS Quest inside the Career Center.</small></div>';
    patchLatestLinks();
  }

  function enhanceMissions() {
    const grid = screen.querySelector('.department-grid');
    if (grid && !grid.querySelector('[data-startup-street-card]')) grid.insertAdjacentHTML('beforeend', startupCard('department-card'));
    patchLatestLinks();
  }

  function enhancePassport() {
    const grid = screen.querySelector('.passport-grid');
    if (!grid || grid.querySelector('[data-startup-street-card]')) return;
    grid.insertAdjacentHTML('beforeend', startupCard('passport-card', startupMissions().length));
  }

  function enhanceAchievements() {
    const grid = screen.querySelector('.achievement-grid');
    if (!grid || grid.querySelector('[data-startup-founder-badge]')) return;
    const count = startupMissions().length;
    const badges = [
      { icon: '💡', name: 'Founder', description: 'Complete your first Startup Street mission.', earned: count >= 1 },
      { icon: '🚀', name: 'Launch Ready', description: 'Complete five Startup Street missions.', earned: count >= 5 }
    ];
    badges.forEach((badge) => {
      grid.insertAdjacentHTML('beforeend', `<article class="achievement-card ${badge.earned ? 'earned' : 'locked'}" data-startup-founder-badge><span class="achievement-icon">${badge.icon}</span><h3 style="margin-top:16px;">${badge.name}</h3><p>${badge.earned ? 'Unlocked and added to your Business World record.' : badge.description}</p><span class="status-tag ${badge.earned ? 'complete' : ''}">${badge.earned ? 'Earned' : 'Locked'}</span></article>`);
    });
    const earned = screen.querySelector('.page-header .status-tag.complete');
    if (earned) {
      const base = Number.parseInt(earned.textContent, 10) || 0;
      earned.textContent = `${base + badges.filter((badge) => badge.earned).length} Earned`;
    }
  }

  function patchLatestLinks() {
    const latest = latestMission();
    if (!latest || latest.topic !== 'startup-street') return;
    const latestId = latest.missionId || latest.id || 'Startup Mission';
    const latestHeading = [...screen.querySelectorAll('h2,h3')].find((item) => item.textContent.includes(latestId) || item.closest('.mission-card')?.textContent.includes('LATEST RECEIPT'));
    const card = latestHeading?.closest('.mission-card');
    if (!card) return;
    const heading = card.querySelector('h2,h3');
    if (heading) heading.textContent = `${latestId} • Startup Street`;
    const link = card.querySelector('a');
    if (link) {
      link.href = 'startup-street.html';
      link.textContent = 'RETURN TO STARTUP STREET';
    }
  }

  let scheduled = false;
  function enhance() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (screen.querySelector('.business-city-grid')) enhanceHome();
      if (screen.querySelector('.department-grid')) enhanceMissions();
      if (screen.querySelector('.passport-grid')) enhancePassport();
      if (screen.querySelector('.achievement-grid')) enhanceAchievements();
    });
  }

  new MutationObserver(enhance).observe(screen, { childList: true, subtree: true });
  window.addEventListener('storage', enhance);
  enhance();
})();
