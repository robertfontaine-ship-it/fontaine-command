(()=>{
const IMG={
  compete:'https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/6883cc6bfab0e5a5d57a9e35_deca_compete.webp',
  glass:'https://cdn.prod.website-files.com/635c3c9aaccd75594c3f6c08/688a18073e95ba0b4a7b0532_hs_glass.webp',
  sbe:'https://cdn.prod.website-files.com/635c3c9aaccd75594c3f6c08/688a1824ae48b6c0f084d579_hs_sbe.webp',
  icdc:'https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/648080e9c0b3c03e3faefd79_icdc_classroom_connection.webp'
};
const img=(src,alt,cls='')=>'<img class="'+cls+'" src="'+src+'" alt="'+alt+'" loading="lazy" onerror="this.style.display=\'none\'">';
const P=panels();

// Stage 1: hook + real DECA visuals
const hero=P[0].querySelector('.hero');
hero.querySelector('p').textContent='DECA takes marketing and business out of the textbook and turns it into competitions, projects, teamwork, travel, leadership and real-world challenges. You do not need to know anything about DECA yet.';
const advisors=hero.querySelector('.advisors');
advisors.insertAdjacentHTML('beforebegin','<div class="deca-photo-strip">'+img(IMG.compete,'DECA students participating in competitive events')+img(IMG.glass,'DECA students celebrating achievement')+img(IMG.icdc,'DECA conference and classroom connection')+'</div><div class="deca-photo-credit">Real DECA visuals · <a href="https://www.deca.org/hs" target="_blank" rel="noopener">DECA Inc.</a></div>');
hero.querySelector('.paperCue').innerHTML='<b>By the end of this mission, you’ll know:</b><br>🏆 what DECA is &nbsp; · &nbsp; 👀 what competition actually looks like &nbsp; · &nbsp; 🤝 the different ways you can compete &nbsp; · &nbsp; 🎯 which events might fit you &nbsp; · &nbsp; 🧠 what solving a DECA problem feels like';
const heroSpan=hero.querySelector('.actions span'); if(heroSpan) heroSpan.textContent='No DECA experience needed.';

// Stage 2: identity wording + stronger validation
P[1].querySelector('.head p').textContent='Your class gives us a starting point for finding DECA events that connect to things you already know. You can still explore events outside your class.';
saveIdentity=function(){
  const first=document.getElementById('firstName').value.trim();
  const last=document.getElementById('lastInitial').value.trim().toUpperCase();
  const period=document.getElementById('period').value;
  const selected=document.querySelector('[data-q="course"] .choice.sel');
  const course=(selected&&selected.dataset.v)||answers.course||'';
  if(!first){alert('Enter your first name.');return}
  if(last.length!==1){alert('Enter one letter for your last initial.');return}
  if(!period){alert('Choose your class period.');return}
  if(!course){alert('Choose your class.');return}
  answers.course=course;
  const s=readState();
  s.student={firstName:first,lastInitial:last,period,course,teacher:teachers[course]};
  s.cat=course;writeState(s);go(2)
};

// Stage 3: explain AND show DECA
const what=P[2];
what.querySelector('.head .tag').textContent='DECA 101';
what.querySelector('.head h2').textContent='So… what is DECA?';
what.querySelector('.head p').innerHTML='<b>DECA is a student organization where you use marketing, business, leadership and problem-solving skills in real competitions and projects.</b> You do not have to already be “good at business” to start.';
const whatCards=what.querySelectorAll('.grid .card');
const whatData=[
  ['🏆','Compete','Solve business problems and see how your ideas compare with other students.',IMG.compete,'DECA competitive event'],
  ['✈️','Go places','Competition can lead to larger conferences, travel, recognition and awards.',IMG.icdc,'DECA conference experience'],
  ['🤝','Build confidence','Practice speaking, teamwork, leadership and making decisions under pressure.',IMG.glass,'DECA students celebrating'],
  ['💼','Do real business stuff','Branding. Sports. Fashion. Promotion. Selling. Research. Pricing. Events. Customer experience.',IMG.sbe,'DECA real-world business learning']
];
whatCards.forEach((c,i)=>{const d=whatData[i];c.innerHTML=img(d[3],d[4],'deca-card-img')+'<div class="icon">'+d[0]+'</div><h3>'+d[1]+'</h3><p>'+d[2]+'</p>'});
what.querySelector('.grid').insertAdjacentHTML('afterend','<div class="not-just-speaking"><strong>DECA is NOT just public speaking.</strong>You can compete alone, compete with a partner, build a project over time, or run a business simulation.</div><div class="deca-look"><span class="tag dark">WHAT DECA ACTUALLY LOOKS LIKE</span><h3>This is DECA.</h3><p>There is more than one way to compete.</p><div class="deca-look-grid"><div class="deca-look-card">'+img(IMG.compete,'Student solving a competitive-event problem')+'<div><strong>🎤 Solve a problem</strong><span>A judge gives you a business situation. You prepare, then explain what you would do.</span></div></div><div class="deca-look-card">'+img(IMG.glass,'Students working and celebrating together')+'<div><strong>🤝 Work with a partner</strong><span>You both look at one problem and build one stronger solution.</span></div></div><div class="deca-look-card">'+img(IMG.sbe,'Students applying business skills')+'<div><strong>📋 Build something</strong><span>Some events are campaigns, research projects or presentations built over time.</span></div></div><div class="deca-look-card">'+img(IMG.icdc,'DECA conference experience')+'<div><strong>🏅 Compete & advance</strong><span>Students can earn recognition and advance to larger DECA conferences.</span></div></div></div></div>');
const hookQ=what.querySelector('.question');
hookQ.querySelector('h3').textContent='Which part of DECA sounds least intimidating to try first?';
const hookBtns=hookQ.querySelectorAll('.choice');
['🎤 Solve a business problem myself','🤝 Work with a partner','📋 Build a project over time','🎮 Run a business simulation'].forEach((t,i)=>hookBtns[i].textContent=t);
const cp1=what.querySelector('#cp1').closest('.paperCue');
cp1.innerHTML='<b>Writing Checkpoint 1 of 4</b><br>Before this, what did you think DECA was? What do you understand about it now?<textarea id="cp1" maxlength="350" placeholder="Example: I thought DECA was just ____. Now I understand that..."></textarea><div class="checkpointHint">Required: one complete thought, at least 5 words.</div>';

// Stage 4: competition styles in kid language
const styles=P[3];
styles.querySelector('.head h2').textContent='There’s more than one way to compete.';
styles.querySelector('.head p').textContent='You do not have to be great at every type. Pick the one that feels like the best starting point for you.';
const styleCards=styles.querySelectorAll('.grid .card');
const styleData=[
  ['INDIVIDUAL ROLE-PLAY','⚡ Get a problem. Think fast.','Get a business problem, prepare quickly, then explain your solution to one judge.',IMG.compete],
  ['TEAM DECISION','🤝 Solve it together.','You and a partner get one problem and build one solution together.',IMG.glass],
  ['PREPARED EVENT','🧱 Build it over time.','Create a campaign, research project, plan or presentation before competition day.',IMG.sbe],
  ['ONLINE SIMULATION','🎮 Run the business.','Make decisions in a virtual business and try to improve your results.',IMG.icdc]
];
styleCards.forEach((c,i)=>{const d=styleData[i];c.innerHTML=img(d[3],d[2],'deca-card-img')+'<span class="tag">'+d[0]+'</span><h3>'+d[1]+'</h3><p>'+d[2]+'</p>'});
styles.querySelector('.question h3').textContent='If you had to try one first, which would you choose?';
const cp2=styles.querySelector('#cp2').closest('.paperCue');
cp2.innerHTML='<b>Writing Checkpoint 2 of 4</b><br>Why does that option seem like the best starting point for you?<textarea id="cp2" maxlength="350" placeholder="Explain what makes this one feel more doable or more like you..."></textarea><div class="checkpointHint">Required: one complete thought, at least 5 words.</div>';

// Stage 5: matcher language
const matcher=P[4];
matcher.querySelector('.head h2').textContent='Let’s find your fit.';
matcher.querySelector('.head p').textContent='Quick answers. No wrong answers. We’ll use them to turn DECA’s huge event list into three places you could start.';
const mq=matcher.querySelectorAll('.question');
if(mq[0]){mq[0].querySelector('h3').textContent='1. What sounds most interesting?'; const b=mq[0].querySelectorAll('.choice'); ['🎨 Creating ads, promotions, brands or ideas','🧠 Making business decisions and strategy','🛍️ Products, stores, fashion and trends','🎟️ Sports, events, fans and experiences'].forEach((t,i)=>b[i].textContent=t)}
if(mq[1]) mq[1].querySelector('h3').textContent='2. When you get a problem, you would rather…';
if(mq[2]){mq[2].querySelector('h3').textContent='3. Working with a partner sounds…'; const b=mq[2].querySelectorAll('.choice'); ['🤝 Better than working alone','👍 Either is fine','🙋 I would rather work by myself'].forEach((t,i)=>b[i].textContent=t)}
if(mq[3]){mq[3].querySelector('h3').textContent='4. Which sounds most like you?'; const b=mq[3].querySelectorAll('.choice'); ['🗣️ I can explain my ideas','💡 I like creating things','📊 I like figuring things out','🎮 I like making decisions and seeing what happens'].forEach((t,i)=>b[i].textContent=t)}
if(mq[4]){mq[4].querySelector('h3').textContent='5. If you had to explain an idea to one adult judge…'; const b=mq[4].querySelectorAll('.choice'); ['😎 I could do it','😬 I would be nervous, but I could try','🫣 Yeah… not yet'].forEach((t,i)=>b[i].textContent=t)}

const plain={
 PMK:'Marketing basics + real-world business problems',AAM:'Fashion + products + customers',RMS:'Stores + products + customers',BTDM:'Buying + products + partner decisions',BMOR:'Research a real store and recommend improvements',VBCFA:'Run a virtual fashion business',VBCRT:'Run a virtual retail business',SEM:'Sports + fans + promotions',STDM:'Sports marketing + partner problem solving',VBCSP:'Run a virtual sports franchise',SEOR:'Research a sports or entertainment organization',MCS:'Advertising + branding + promotion',BSM:'Marketing businesses that sell services',MTDM:'Marketing strategy + partner decisions',PSE:'Selling + convincing a customer',IMCP:'Build a full campaign for a product',IMCS:'Build a full campaign for a service',IMCE:'Build a full campaign for an event',BOR:'Research a real service business and improve it'
};
const how={solo:'You compete by yourself. You get a business problem, prepare quickly, and explain your solution to one judge.',partner:'You and a partner get one case and build one solution together.',prepared:'You build a project, campaign or research plan over time, then present it.',simulation:'You make business decisions online and try to improve your results.'};
const friendlyReason=r=>r.replace('connects strongly to your course','matches your class').replace('matches your preferred competition style','matches how you said you want to compete').replace('lets you work with a partner','gives you the partner format you picked').replace('fits independent competition','lets you work independently').replace('rewards quick decisions','fits your quick-decision style').replace('gives you time to build','gives you time to build your work').replace('starts without a live judge','lets you start without a live judge').replace('matches your interests','matches what you said interests you').replace('matches your strengths','matches a strength you picked').replace('matches your work style','matches how you like to work').replace('is designed for first-year DECA members','is made for first-year DECA members');

makeMatches=function(){
 let req=['task','pace','team','strength','speaking','experience'];if(req.some(k=>!answers[k]))return alert('Answer all six event-match questions before continuing.');
 let pool=Object.values(events).filter(e=>!(e.code==='PMK'&&answers.experience!=='first'));
 let scored=pool.map(e=>{let score=0,reasons=[];if(e.courses.includes(answers.course)){score+=7;reasons.push('connects strongly to your course')}if(e.format===answers.format){score+=6;reasons.push('matches your preferred competition style')}if(answers.team==='love'&&e.format==='partner'){score+=4;reasons.push('lets you work with a partner')}if(answers.team==='solo'&&e.format==='solo'){score+=4;reasons.push('fits independent competition')}if(answers.pace==='fast'&&e.format==='solo'){score+=3;reasons.push('rewards quick decisions')}if(answers.pace==='build'&&e.format==='prepared'){score+=4;reasons.push('gives you time to build')}if(answers.speaking==='notyet'&&e.format==='simulation'){score+=5;reasons.push('starts without a live judge')}if(answers.speaking==='ready'&&(e.format==='solo'||e.format==='partner'))score+=2;['task','strength','pace'].forEach(k=>{if(e.style.includes(answers[k])){score+=3;reasons.push('matches your '+(k==='task'?'interests':k==='strength'?'strengths':'work style'))}});if(e.code==='PMK'&&answers.experience==='first'){score+=5;reasons.push('is designed for first-year DECA members')}if(answers.course==='strategic'&&e.style.includes('analyze'))score+=2;return {e,score,reasons:[...new Set(reasons)]}}).sort((a,b)=>b.score-a.score);
 topMatches=scored.slice(0,3);favorite='';
 document.getElementById('results').innerHTML=topMatches.map((x,i)=>'<article class="card result"><span class="rank">#'+(i+1)+'</span><span class="tag">'+x.e.code+'</span><h3>'+x.e.name+'</h3><div class="normal-words"><small>IN NORMAL WORDS</small><b>'+esc(plain[x.e.code]||x.e.desc)+'</b></div><div class="pills"><span class="pill">'+x.e.people+' participant'+(x.e.people==='1'?'':'s')+'</span><span class="pill">'+x.e.type+'</span></div><div class="event-how"><b>What competition looks like:</b><br>'+esc(how[x.e.format]||x.e.desc)+'</div><p><b>Why we matched you:</b> '+x.reasons.slice(0,2).map(friendlyReason).join(' + ')+'.</p><a href="'+x.e.url+'" target="_blank" rel="noopener">Official event page ↗</a><button class="secondary eventPick" data-code="'+x.e.code+'" onclick="pickFavorite(\''+x.e.code+'\')">☆ I’d be most willing to try this</button></article>').join('');
 const cue=document.getElementById('cp3').closest('.paperCue');
 cue.innerHTML='<b>Writing Checkpoint 3 of 4</b><br>Even if none of these are perfect, which event would you be most willing to try? Why that one over the other two?<textarea id="cp3" maxlength="400" placeholder="This one seems more doable because..."></textarea><div class="checkpointHint">Required: one complete thought, at least 5 words.</div>';
 go(5)
};
pickFavorite=function(code){favorite=code;document.querySelectorAll('.eventPick').forEach(b=>{let on=b.dataset.code===code;b.classList.toggle('sel',on);b.textContent=on?'★ My pick for now':'☆ I’d be most willing to try this'});let e=events[code];document.getElementById('favoriteNote').innerHTML='<b>Your pick for now:</b> '+e.code+' · '+e.name};

// Stage 7: student-friendly DECA challenge language
challenges.marketing={title:'They Tried It Once… Then Never Came Back',problem:'A smoothie shop gets plenty of students to try it once, but most do not return. The owner wants more repeat customers without constantly lowering prices.',moves:{A:['Reward them for coming back — create a student rewards program where repeat visits earn something free','Good retention idea. A judge might ask what reward would be enough to bring students back without costing the business too much.'],B:['Ask what students actually want — ask about flavors, prices, combos and what would make them return','Good customer-feedback idea. A judge might ask how you would collect the feedback and what you would change first.'],C:['Connect with the school — partner with a school team or club for an after-school promotion','Good community-promotion idea. A judge might ask how you would turn the promotion into repeat visits instead of one-time visits.']}};
challenges.fashion={title:'Nobody Is Buying the New Collection',problem:'A clothing store launched a new collection for teenagers. People are looking at it online, but the clothes are not selling very well.',moves:{A:['Ask the customers — ask teens what styles, prices and products they actually want, then adjust the collection','Good customer-research idea. A judge might ask what you would ask first and what sales result would show the changes worked.'],B:['Make it an experience — hold an after-school launch where students can see, style and try the collection','Good experience idea. A judge might ask how you would get the right students there and turn the event into purchases.'],C:['Show people how to wear it — have student creators make outfits and short videos using the collection','Good content idea. A judge might ask how you would turn views and likes into actual sales.']}};
challenges.sem={title:'Students Aren’t Showing Up',problem:'A local basketball team wants more high-school students at Friday-night games. Students know about the team, but they still are not buying many tickets.',moves:{A:['Student Night — create a student ticket package and promote it through local schools','Good ticket-conversion idea. A judge might ask what the package includes and how you would know it brought in new student fans.'],B:['Build the hype — use student creators, player videos, rivalries and game-day content','Good engagement idea. A judge might ask what would make someone go from watching a video to actually buying a ticket.'],C:['Make the game more fun — create a student section with themes, contests, music and rewards','Good experience idea. A judge might ask how students would hear about it before the game and what would make them come back.']}};
challenges.strategic={title:'Lots of Clicks. Not Many Customers.',problem:'A company gets lots of people to its website from ads, but very few visitors actually buy anything.',moves:{A:['Test the message — try different ads and website messages for different types of customers','Good testing idea. A judge might ask which customer group you would test first and what result would count as improvement.'],B:['Find where people give up — figure out where customers stop and fix the biggest problem','Good diagnostic idea. A judge might ask what data you would look at and what you would change once you find the problem.'],C:['Check where the money is going — move more ad money toward the places producing the strongest results','Good efficiency idea. A judge might ask how you know the advertising channel is the real problem instead of the website or offer.']}};
const challengePanel=P[6];
challengePanel.querySelector('.head h2').textContent='Try a DECA decision.';
challengePanel.querySelector('.head p').textContent='No speech. No judge. Just read the problem, pick a move and defend your thinking. More than one answer can work.';
const cp4=challengePanel.querySelector('#reason').closest('.paperCue');
cp4.innerHTML='<b>Writing Checkpoint 4 of 4</b><br>Which move would you try first? Why do you think it would help solve the problem?<textarea id="reason" maxlength="700" placeholder="Write at least 2 thoughtful sentences explaining your decision..."></textarea><div class="checkpointHint">Required: at least 12 words and a real connection to the problem.</div>';

// Stage 8: make the completion screen feel like a payoff, while making the stopping point clear
const complete=P[7];
complete.querySelector('.head h2').textContent='Rookie Onboarding complete.';
complete.querySelector('.head p').textContent='You’ve seen what DECA is, explored how competition works, found some possible events and made your first DECA-style business decision.';
renderProfile=function(){
 let s=readState(),o=s.onboarding||{},fav=events[o.favorite||favorite],matches=(o.matches||topMatches.map(x=>x.e.code)).map(c=>events[c]).filter(Boolean);
 document.getElementById('profile').innerHTML='<div class="profileTop"><div><span class="tag">DECA ROOKIE</span><h2 style="margin:8px 0">'+(s.student?esc(s.student.firstName)+' '+esc(s.student.lastInitial)+'.':'Rookie')+'</h2><p style="color:var(--m);margin:0">'+(courseNames[o.course]||'')+' · '+esc(o.period||'')+' Period · '+esc(o.teacher||'')+'</p></div><div class="badge"><small>ROOKIE XP</small><strong>'+(s.xp||100)+'</strong>Level '+(Math.floor((s.xp||100)/300)+1)+'</div></div><div class="match fav"><b>★ Event I’d be most willing to try:</b><br>'+(fav?fav.code+' · '+fav.name:'Not selected')+'</div><div class="match"><b>Competition style that felt best:</b> '+esc(formatLabel(o.format))+'</div><div class="match"><b>✓ Writing Checkpoints:</b> '+(o.checkpointsComplete||4)+'/4 complete</div><div class="match"><b>My three starting matches:</b><br>'+matches.map((e,i)=>(i+1)+'. '+e.code+' · '+e.name).join('<br>')+'</div><div class="rookie-note"><b>You are NOT choosing your competition event today.</b><br>This is just your starting point. You can explore, change your mind and try something different later.</div>';
 document.getElementById('syncStatus').textContent=lastSync||'Rookie Passport saved on this Chromebook.'
};
const exploreBtn=[...complete.querySelectorAll('button,.primary')].find(x=>x.textContent.includes('Explore My Event'));if(exploreBtn) exploreBtn.textContent='Next: Explore My Event →';
complete.querySelector('.actions')?.insertAdjacentHTML('beforebegin','<div class="real-deca-source"><b>Your required Rookie Onboarding is complete here.</b> Continue only if your teacher wants you to explore your event next.</div>');
})();