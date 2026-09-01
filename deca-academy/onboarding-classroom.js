(()=>{
const P=panels();
const allowExtension=(()=>{try{return new URLSearchParams(window.parent.location.search).get('extension')==='1'}catch(e){return false}})();

const style=document.createElement('style');
style.textContent=`
.gateHelp{background:#fff3cd;border:2px solid #e5b70b;color:#5c4500;border-radius:13px;padding:12px 14px;margin:14px 0;font-weight:750}
.gateHelp strong{display:block;color:#3d2d00;margin-bottom:2px}
.needsAnswer{outline:3px solid #f5b82e;outline-offset:5px;border-radius:12px}
.stopHere{background:#fff;border:4px solid #f5b82e;border-radius:20px;padding:22px;margin:20px 0;box-shadow:0 8px 24px #07152f12;text-align:center}
.stopHere .stopBadge{display:inline-block;background:#07152f;color:#fff;border-radius:999px;padding:7px 13px;font-size:13px;font-weight:950;letter-spacing:.5px}
.stopHere h2{font-size:32px;line-height:1.05;margin:12px 0 8px;color:#07152f}
.stopHere p{font-size:18px;margin:6px auto;max-width:760px;color:#334155}
.stopHere .screenShot{background:#e7f7eb;border:1px solid #9dd5aa;color:#14532d;border-radius:12px;padding:12px 14px;margin:15px auto 0;max-width:760px;font-weight:850}
`;
document.head.appendChild(style);

function clearGate(panel){
 panel.querySelectorAll('.gateHelp').forEach(x=>x.remove());
 panel.querySelectorAll('.needsAnswer').forEach(x=>x.classList.remove('needsAnswer'));
}
function showGate(panel,msg,target){
 clearGate(panel);
 const box=document.createElement('div');box.className='gateHelp';box.innerHTML='<strong>Almost there.</strong>'+msg;
 const actions=panel.querySelector('.actions');(actions||panel).insertAdjacentElement(actions?'beforebegin':'beforeend',box);
 if(target){target.classList.add('needsAnswer');target.scrollIntoView({behavior:'smooth',block:'center'})}else box.scrollIntoView({behavior:'smooth',block:'center'});
}
function remainingWords(text,min){return Math.max(0,min-countWords(text))}

// Make the first screen validation visible and specific instead of a generic browser alert.
saveIdentity=function(){
 const panel=P[1],first=document.getElementById('firstName').value.trim(),last=document.getElementById('lastInitial').value.trim().toUpperCase(),period=document.getElementById('period').value;
 const selected=document.querySelector('[data-q="course"] .choice.sel');
 const course=(selected&&selected.dataset.v)||answers.course||'';
 clearGate(panel);
 if(!first)return showGate(panel,'Enter your first name.',document.getElementById('firstName'));
 if(last.length!==1)return showGate(panel,'Enter exactly one letter for your last initial.',document.getElementById('lastInitial'));
 if(!period)return showGate(panel,'Choose your class period.',document.getElementById('period'));
 if(!course)return showGate(panel,'Choose your class before continuing.',panel.querySelector('[data-q="course"]'));
 answers.course=course;
 const s=readState();s.student={firstName:first,lastInitial:last,period,course,teacher:teachers[course]};s.cat=course;writeState(s);go(2)
};

saveCheckpoint1=function(){
 const panel=P[2],text=document.getElementById('cp1').value.trim();clearGate(panel);
 if(!answers.hook)return showGate(panel,'Choose one option in the question above, then try again.',panel.querySelector('[data-q="hook"]'));
 if(countWords(text)<5)return showGate(panel,'Your response needs '+remainingWords(text,5)+' more word'+(remainingWords(text,5)===1?'':'s')+'.',document.getElementById('cp1'));
 answers.cp1=text;saveWritingDraft('cp1',text);go(3)
};

saveCheckpoint2=function(){
 const panel=P[3],text=document.getElementById('cp2').value.trim();clearGate(panel);
 if(!answers.format)return showGate(panel,'Choose one competition style above, then try again.',panel.querySelector('[data-q="format"]'));
 if(countWords(text)<5)return showGate(panel,'Your response needs '+remainingWords(text,5)+' more word'+(remainingWords(text,5)===1?'':'s')+'.',document.getElementById('cp2'));
 answers.cp2=text;saveWritingDraft('cp2',text);go(4)
};

const baseMakeMatches=makeMatches;
makeMatches=function(){
 const panel=P[4],keys=['task','pace','team','strength','speaking','experience'];clearGate(panel);
 const missing=keys.filter(k=>!answers[k]);
 if(missing.length){
   const labels={task:'1',pace:'2',team:'3',strength:'4',speaking:'5',experience:'6'};
   const first=panel.querySelector('[data-q="'+missing[0]+'"]');
   return showGate(panel,'Finish event-matcher question'+(missing.length>1?'s ':' ')+missing.map(k=>labels[k]).join(', ')+'.',first);
 }
 baseMakeMatches()
};

continueMatches=function(){
 const panel=P[5],text=document.getElementById('cp3').value.trim();clearGate(panel);
 if(!favorite)return showGate(panel,'Choose one event by clicking “I’d be most willing to try this.”',document.getElementById('results'));
 if(countWords(text)<5)return showGate(panel,'Your response needs '+remainingWords(text,5)+' more word'+(remainingWords(text,5)===1?'':'s')+'.',document.getElementById('cp3'));
 answers.cp3=text;saveWritingDraft('cp3',text);go(6)
};

// Checkpoint 4 now matches the visible requirement: 12 words. No hidden 55-character rule.
finishChallenge=async function(){
 const panel=P[6],reason=document.getElementById('reason').value.trim(),words=countWords(reason);clearGate(panel);
 const draft=(readState().onboardingDraft||{});answers.cp1=answers.cp1||draft.cp1||'';answers.cp2=answers.cp2||draft.cp2||'';answers.cp3=answers.cp3||draft.cp3||'';
 if(!answers.cp1||!answers.cp2||!answers.cp3)return showGate(panel,'One of your earlier writing checkpoints is missing. Use Back and complete the checkpoint marked incomplete.');
 if(!challengeChoice)return showGate(panel,'Choose A, B, or C before writing your explanation.',document.getElementById('challengeChoices'));
 if(words<12)return showGate(panel,'Your explanation needs '+remainingWords(reason,12)+' more word'+(remainingWords(reason,12)===1?'':'s')+'. Connect your choice to the problem.',document.getElementById('reason'));
 answers.cp4=reason;saveWritingDraft('cp4',reason);
 const course=answers.course,c=challenges[course],feedback=c.moves[challengeChoice][1];
 document.getElementById('challengeFeedback').innerHTML='<div class="success"><b>DECA thinking:</b> '+feedback+'</div>';
 const s=readState();if(!s.student)return showGate(panel,'Your student information is missing. Return to the beginning and enter it again.');
 if(!s.onboardingComplete){s.xp=(s.xp||0)+100;s.onboardingComplete=true}
 const totalWriting=[answers.cp1,answers.cp2,answers.cp3,reason].reduce((n,v)=>n+v.length,0);
 s.onboarding={course,teacher:teachers[course],period:s.student.period,format:answers.format,firstYear:answers.experience==='first',matches:topMatches.map(x=>x.e.code),favorite,challenge:challengeChoice,responseChars:totalWriting,checkpointsComplete:4};
 delete s.onboardingDraft;s.cat=course;writeState(s);
 const btn=document.getElementById('finishBtn');btn.disabled=true;btn.textContent='Saving Rookie Passport…';
 lastSync=await submitProgress(s,totalWriting);go(7);btn.disabled=false;btn.textContent='Complete Rookie Onboarding →'
};

// Default student link ends at Rookie Onboarding. Extension remains available only with ?extension=1.
const complete=P[7];
const actions=complete.querySelector('.actions');
const oldStop=complete.querySelector('.stopHere');if(oldStop)oldStop.remove();
const stop=document.createElement('div');stop.className='stopHere';
stop.innerHTML='<div class="stopBadge">🛑 STOP HERE</div><h2>Rookie Onboarding is finished.</h2><p>Do not continue to another section. Your required onboarding is complete.</p><div class="screenShot">📸 Take a screenshot of this page showing your name and 100 Rookie XP, then upload the screenshot to Canvas.</div>';
if(actions)actions.insertAdjacentElement('beforebegin',stop);
if(actions&&!allowExtension)actions.style.display='none';
if(actions&&allowExtension){actions.style.display='flex';stop.querySelector('p').textContent='Pause here. Your required onboarding is complete. Continue only when your teacher tells you to.'}

const baseGo=go;
go=function(n){
 baseGo(n);
 if(n===7){
   document.getElementById('progress').style.width='100%';
   document.getElementById('stage').textContent='ROOKIE ONBOARDING COMPLETE · STOP HERE';
   if(actions&&!allowExtension)actions.style.display='none';
 }
};
})();