(() => {
  'use strict';
  const store=window.FontaineMissionStore;
  const screen=document.getElementById('screen');
  if(!screen)return;
  const profile=()=>store?.getActiveProfile?.()||{first:'',last:'',period:''};
  const history=()=>store?.getAllHistory?.({profile:profile()})||[];
  const wrsMissions=()=>history().filter(item=>item.topic==='wrs-career-center');
  const latestMission=()=>[...history()].sort((a,b)=>(Date.parse(b.submittedAt||b.completedAt||0)||0)-(Date.parse(a.submittedAt||a.completedAt||0)||0))[0];

  function card(type,count=0){
    if(type==='passport')return `<article class="passport-card ${count?'completed':''}" data-wrs-career-card><span class="passport-icon">🧟</span><h3 style="margin-top:16px;">WRS Career Center</h3><p>${count} of 22 competencies completed</p><span class="status-tag ${count?'complete':'open'}">${count?'Stamped':'Open'}</span></article>`;
    return `<article class="department-card" data-wrs-career-card><span class="department-icon">🧟</span><span class="status-tag open">Live</span><h3>WRS Career Center</h3><p>Twenty-two workplace-readiness missions plus a keyboard-and-touch zombie hallway transit drill.</p><a class="mini-button" href="wrs-career-center.html" style="display:inline-block;">Enter Location</a></article>`;
  }
  function enhanceHome(){
    const map=screen.querySelector('.business-city-grid');
    if(!map)return;
    const locked=[...map.querySelectorAll('.city-building.locked')].find(item=>item.textContent.includes('Career Center'));
    if(locked){
      const link=document.createElement('a');
      link.className='city-building live';link.href='wrs-career-center.html';link.dataset.wrsCareerCard='';
      link.innerHTML='<span>🧟</span><strong>WRS Career Center</strong><small>Workplace Readiness Quest</small>';
      locked.replaceWith(link);
    }
    const status=screen.querySelector('.section-heading .status-tag.open');
    const liveCount=Number.parseInt(status?.textContent,10)||0;
    if(status&&/Locations Live/.test(status.textContent)&&liveCount<12)status.textContent='12 Locations Live';
    const news=[...screen.querySelectorAll('.news-item')].find(item=>item.textContent.includes('locations are open'));
    if(news&&!news.textContent.includes('Twelve locations'))news.innerHTML='<span>🔥</span><div><strong>Twelve locations are open</strong><small>Eleven learning districts plus Wolverine Agency.</small></div>';
    const next=[...screen.querySelectorAll('.news-item')].find(item=>item.textContent.includes('Next district'));
    if(next&&!next.textContent.includes('Course mastery pathways'))next.innerHTML='<span>🔓</span><div><strong>Next system</strong><small>SEM, Fashion, and Entrepreneurship mastery pathways.</small></div>';
    patchLatest();
  }
  function enhanceMissions(){const grid=screen.querySelector('.department-grid');if(grid&&!grid.querySelector('[data-wrs-career-card]'))grid.insertAdjacentHTML('beforeend',card('department'));patchLatest();}
  function enhancePassport(){const grid=screen.querySelector('.passport-grid');if(grid&&!grid.querySelector('[data-wrs-career-card]'))grid.insertAdjacentHTML('beforeend',card('passport',wrsMissions().length));}
  function enhanceAchievements(){
    const grid=screen.querySelector('.achievement-grid');
    if(!grid||grid.querySelector('[data-wrs-career-badge]'))return;
    const count=wrsMissions().length;
    const badges=[
      {icon:'🛡️',name:'Work Ready',description:'Complete your first WRS competency mission.',earned:count>=1},
      {icon:'🧟',name:'Career Survivor',description:'Complete 11 WRS competency missions.',earned:count>=11},
      {icon:'🏅',name:'WRS Master',description:'Complete all 22 WRS competency missions.',earned:count>=22}
    ];
    badges.forEach(badge=>grid.insertAdjacentHTML('beforeend',`<article class="achievement-card ${badge.earned?'earned':'locked'}" data-wrs-career-badge><span class="achievement-icon">${badge.icon}</span><h3 style="margin-top:16px;">${badge.name}</h3><p>${badge.earned?'Unlocked and added to your Business World record.':badge.description}</p><span class="status-tag ${badge.earned?'complete':''}">${badge.earned?'Earned':'Locked'}</span></article>`));
    const earned=screen.querySelector('.page-header .status-tag.complete');
    if(earned&&!earned.dataset.wrsCounted){const base=Number.parseInt(earned.textContent,10)||0;earned.textContent=`${base+badges.filter(b=>b.earned).length} Earned`;earned.dataset.wrsCounted='true';}
  }
  function patchLatest(){
    const latest=latestMission();if(!latest||latest.topic!=='wrs-career-center')return;
    const id=latest.missionId||latest.id||'WRS Mission';
    const heading=[...screen.querySelectorAll('h2,h3')].find(item=>item.textContent.includes(id)||item.closest('.mission-card')?.textContent.includes('LATEST RECEIPT'));
    const missionCard=heading?.closest('.mission-card');if(!missionCard||missionCard.dataset.wrsPatched)return;
    const title=missionCard.querySelector('h2,h3');if(title)title.textContent=`${id} • WRS Career Center`;
    const link=missionCard.querySelector('a');if(link){link.href='wrs-career-center.html';link.textContent='RETURN TO CAREER CENTER';}
    missionCard.dataset.wrsPatched='true';
  }
  let scheduled=false;
  function enhance(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;if(screen.querySelector('.business-city-grid'))enhanceHome();if(screen.querySelector('.department-grid'))enhanceMissions();if(screen.querySelector('.passport-grid'))enhancePassport();if(screen.querySelector('.achievement-grid'))enhanceAchievements();});}
  new MutationObserver(enhance).observe(screen,{childList:true,subtree:true});
  window.addEventListener('storage',enhance);
  enhance();
})();