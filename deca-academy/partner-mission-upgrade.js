(()=>{
let pairCode='';
const P=panels();
const partnerPanel=P[1];
partnerPanel.querySelector('.head p').textContent='Each student uses their own Chromebook. Enter your partner exactly the same way on both devices so your case and team roles match.';
const partnerCard=partnerPanel.querySelector('.grid .card');
partnerCard.insertAdjacentHTML('afterend','<div class="note" style="grid-column:1/-1"><b>Pair sync:</b> Use the same first name + last initial on both Chromebooks. When the case loads, compare your 4-digit Pair Code before you start.</div>');

// Make Day 2 business language readable without removing the business thinking.
banks.marketing[0].moves=[['A','Start a student rewards program that gives people a reason to come back'],['B','Ask teen customers what would make them return, then improve the menu and experience'],['C','Partner with a school group and include an offer that encourages a second visit']];
banks.marketing[0].kpis=['Repeat purchase rate (how many customers come back)','Customer retention (how many customers stay)','Rewards sign-ups','Average amount spent per visit'];
banks.marketing[1].moves=[['A','Figure out which students are most likely to try the snack and what would make them care'],['B','Give out samples with a trackable offer so you can see who buys afterward'],['C','Use student creators to show the product benefits in realistic situations']];
banks.marketing[1].kpis=['Trial rate (how many people try it)','Conversion rate (how many tasters buy)','Offer / promo-code use','Units sold'];

banks.strategic[0].problem='A regional brand gets lots of ad views and website visits, but fewer visitors have been turning into customers for three months.';
banks.strategic[0].moves=[['A','Test different messages and website pages for different customer groups'],['B','Find the exact step where the most customers leave, then fix that problem first'],['C','Move more ad money toward the audiences and channels producing the strongest results']];
banks.strategic[0].kpis=['Conversion rate (visitors who become customers)','Cost to gain each customer','Return on advertising money','Results by customer group'];
banks.strategic[1].moves=[['A','Make the brand’s strongest advantage clearer to younger customers'],['B','Research which group of younger customers is the best fit for the brand'],['C','Add more value instead of automatically matching the competitor’s lower price']];
banks.strategic[1].kpis=['Market share','Preference among younger customers','Customer retention','Brand consideration (people willing to choose us)'];

banks.fashion[0].moves=[['A','Ask teens what styles, prices and products they actually want, then adjust the collection'],['B','Create a student event around the products teens respond to most'],['C','Use student creators to build outfits and show how the collection can actually be worn']];
banks.fashion[0].kpis=['Sell-through rate (how much inventory sells)','Teen collection sales','Conversion rate (shoppers who buy)','Student store traffic'];
banks.fashion[1].moves=[['A','Lower prices only on the slowest-selling items based on sales data'],['B','Bundle slow items with stronger products'],['C','Create a short seasonal clearance event aimed at the right customer']];
banks.fashion[1].kpis=['Sell-through rate (how much inventory sells)','Inventory turnover (how quickly stock moves)','Amount of merchandise marked down','Profit margin'];

banks.sem[0].kpis=['Student ticket sales','Total attendance','Student offer / promo-code use','Repeat student attendance'];
if(banks.sem[1]) banks.sem[1].kpis=['Ticket sales','Student attendance','Social-to-ticket clicks','Repeat attendance'];

// Define KPI before students have to use it.
const specific=P[5];
specific.querySelector('.head h2').textContent='Make the plan real.';
specific.querySelector('.head p').textContent='Add two specific actions. Then pick a number you could track to tell whether the plan actually worked.';
const kpiCard=specific.querySelector('.grid .card:nth-child(2)');
kpiCard.insertAdjacentHTML('afterbegin','<div class="soft"><b>KPI = Key Performance Indicator.</b><br>That just means a number you track to see whether your idea worked.</div>');
const kpiLabel=kpiCard.querySelector('label');if(kpiLabel)kpiLabel.textContent='Why would this number show whether your plan worked?';
const quality=P[6];
const kpiCheck=[...quality.querySelectorAll('.checkline span')].find(x=>x.textContent.includes('KPI'));
if(kpiCheck)kpiCheck.textContent='The number we chose actually measures the original problem.';

function norm(first,last){return (String(first).trim()+'|'+String(last).trim().toUpperCase()).toLowerCase()}
function hashText(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}

setupMission=function(){
  const pf=document.getElementById('partnerFirst').value.trim();
  const pl=document.getElementById('partnerLast').value.trim().toUpperCase();
  if(!pf||!/^[A-Za-z]$/.test(pl))return alert('Enter your partner’s first name and one-letter last initial.');
  if(!identity){
    const first=document.getElementById('firstName').value.trim(),last=document.getElementById('lastInitial').value.trim().toUpperCase(),course=document.getElementById('course').value,period=document.getElementById('period').value;
    if(!first||!/^[A-Za-z]$/.test(last)||!course||!period)return alert('Complete your own student information first.');
    identity={firstName:first,lastInitial:last,course,period,teacher:teachers[course]};let s=state();s.student=identity;s.cat=course;save(s)
  }
  const me=norm(identity.firstName,identity.lastInitial), partner=norm(pf,pl);
  if(me===partner)return alert('You and your partner cannot have the exact same first name + last initial entry. Ask your teacher how to label your pair.');
  const ordered=[me,partner].sort();
  const seed=hashText(ordered.join('||')+'||'+identity.course+'||'+identity.period);
  const bank=banks[identity.course];
  mission=bank[seed%bank.length];
  pairCode=String(1000+(seed%9000));
  myPick=theirPick=sharedPick=kpi='';
  renderScenario();
  document.getElementById('scenarioBox').insertAdjacentHTML('afterbegin','<div class="tag dark" style="margin-bottom:8px">PAIR CODE '+pairCode+'</div><div style="font-size:12px;color:#d5e1f0;margin-bottom:10px">Both Chromebooks should show this same code and case.</div>');
  const meAudience=me===ordered[0];
  const audienceName=meAudience?identity.firstName:pf;
  const actionName=meAudience?pf:identity.firstName;
  document.getElementById('roleA').textContent=audienceName+' · Audience Lead';
  document.getElementById('roleB').textContent=actionName+' · Action Lead';
  document.getElementById('roleA').insertAdjacentHTML('afterend','<div class="tinyRole" style="color:#64748b;font-size:13px;margin:-8px 0 8px">Focus on who the customer/fan is and what they care about.</div>');
  document.getElementById('roleB').insertAdjacentHTML('afterend','<div class="tinyRole" style="color:#64748b;font-size:13px;margin:-8px 0 8px">Focus on exactly what the business/team would do.</div>');
  go(2)
};

// Make the scenario wording feel more like a student challenge.
P[2].querySelector('.head p').textContent='Take about 90 seconds. Pick the move you think would work best before you talk to your partner. Then compare Pair Codes and choices.';
P[4].querySelector('.head p').textContent='Now stop trying to win the argument. Use the best parts of both ideas to build one stronger plan.';
})();