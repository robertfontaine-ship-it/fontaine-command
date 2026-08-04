const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const test=require("node:test");
const vm=require("node:vm");
const ROOT=path.resolve(__dirname,"..");
const read=file=>fs.readFileSync(path.join(ROOT,file),"utf8");
function config(){const window={};vm.runInNewContext(read("wrs-career-center.js"),{window});return window.HUB_CONFIG;}

const official=[
"Creativity and Innovation","Critical Thinking and Problem Solving","Initiative and Self-Direction","Integrity","Work Ethic","Conflict Resolution","Listening and Speaking","Respect for Diversity","Customer Service","Teamwork","Big-Picture Thinking","Career and Life Management","Continuous Learning and Adaptability","Efficiency and Time and Resource Management","Information Literacy","Information Security","Information Technology","Job-Specific Tools and Technologies","Mathematics","Professionalism","Reading and Writing","Workplace Safety"
];

test("WRS Career Center launches all 22 workplace readiness competencies",()=>{
  const data=config();
  assert.equal(data.id,"wrs-career-center");
  assert.equal(data.title,"WRS Career Center");
  assert.equal(data.missions.length,22);
  assert.deepEqual(Array.from(data.missions.map(m=>m.competency)),official);
  assert.deepEqual(Array.from(data.missions.reduce((map,m)=>map.set(m.level,(map.get(m.level)||0)+1),new Map()).entries()),[["Quick",7],["Skill",10],["Boss",5]]);
  assert.equal(new Set(data.missions.map(m=>m.id)).size,22);
  data.missions.forEach((mission,index)=>{
    assert.equal(mission.id,`WRS-${String(index+1).padStart(2,"0")}`);
    assert.ok(mission.prompts.length>=3,`${mission.id} has a complete workplace decision workflow`);
    assert.ok(mission.outcomes.length>=2,`${mission.id} has measurable outcomes`);
    assert.ok([1,2,4].includes(mission.entries),`${mission.id} uses the protected reward scale`);
    assert.ok(mission.minutes>=10,`${mission.id} includes a realistic completion time`);
    assert.ok(mission.zone,`${mission.id} belongs to a career zone`);
  });
});

test("WRS missions cover the complete work-ready skill system",()=>{
  const source=read("wrs-career-center.js");
  [/root cause/i,/initiative/i,/integrity/i,/work ethic/i,/conflict/i,/customer/i,/team/i,/career/i,/adapt/i,/time/i,/information security/i,/technology/i,/job-specific/i,/break-even/i,/professional/i,/standard operating procedure/i,/workplace safety/i].forEach(pattern=>assert.match(source,pattern));
  assert.match(source,/elimination, substitution, engineering controls, administrative controls, or personal protective equipment/i);
  assert.match(source,/venue takes 12% of ticket revenue/i);
});

test("WRS Career Center inherits the full Mission Network workflow and Periods 1 through 7",()=>{
  const html=read("wrs-career-center.html");
  const scripts=["mission-data-store.js","mission-autosave.js","mission-accessibility.js","wrs-career-center.js","mission-hub-engine.js","student-review-packet.js","wrs-career-center-game.js"];
  let last=-1;
  scripts.forEach(script=>{const index=html.indexOf(`src="${script}"`);assert.ok(index>last,`${script} loads in the protected order`);last=index;});
  for(let period=1;period<=7;period+=1)assert.match(html,new RegExp(`<option>${period}</option>`));
  assert.match(html,/id="missionGrid"/);
  assert.match(html,/id="missionModal"/);
  assert.match(html,/Zombie Hallway Transit Drill/);
  assert.match(html,/id="transitLeft"/);
  assert.match(html,/id="transitRight"/);
  assert.match(html,/keyboard and touch|Keyboard \+ Touch/i);
});

test("WRS Career Center is connected throughout Business World",()=>{
  ["business-world.html","mission-control.js","student-mission-id.js","topic-hubs.html"].forEach(file=>assert.match(read(file),/wrs-career-center\.html|wrs-career-center/,file));
  const expansion=read("wrs-career-center-expansion.js");
  assert.match(expansion,/12 Locations Live/);
  assert.match(expansion,/Work Ready/);
  assert.match(expansion,/Career Survivor/);
  assert.match(expansion,/WRS Master/);
  assert.match(read("startup-street-expansion.js"),/liveCount < 11/);
});

test("zombie transit supports keyboard, touch, score, and nonacademic play",()=>{
  const game=read("wrs-career-center-game.js");
  assert.doesNotThrow(()=>new vm.Script(game));
  assert.match(game,/ArrowLeft/);
  assert.match(game,/ArrowRight/);
  assert.match(game,/transitLeft/);
  assert.match(game,/transitRight/);
  assert.match(game,/fontaineWrsTransitBest/);
  assert.match(read("wrs-career-center.html"),/does not award entries/i);
});