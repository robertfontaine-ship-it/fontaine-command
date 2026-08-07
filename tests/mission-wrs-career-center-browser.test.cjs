const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const {chromium}=require("playwright");
const PORT=4187;
const BASE=`http://127.0.0.1:${PORT}`;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitForServer(){for(let attempt=0;attempt<40;attempt+=1){try{if((await fetch(`${BASE}/wrs-career-center.html`)).ok)return;}catch{}await wait(250);}throw new Error("WRS Career Center QA server did not start.");}
function errorsFor(page){const errors=[];page.on("pageerror",error=>errors.push(`pageerror: ${error.message}`));page.on("console",message=>{if(message.type()==="error")errors.push(`console: ${message.text()}`);});return errors;}
async function assertNoOverflow(page,label){const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(dimensions.scrollWidth<=dimensions.clientWidth+1,`${label}: horizontal overflow ${dimensions.scrollWidth} > ${dimensions.clientWidth}`);}
async function run(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,permissions:["clipboard-read","clipboard-write"]});
  await context.route("**/favicon.ico",route=>route.fulfill({status:204,body:""}));
  const page=await context.newPage();
  const errors=errorsFor(page);
  await page.goto(`${BASE}/wrs-career-center.html`,{waitUntil:"load"});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:"load"});
  assert.equal(await page.locator(".mission-card").count(),22);
  assert.equal(await page.locator(".wrs-zone-grid article").count(),5);
  await assertNoOverflow(page,"WRS Career Center mobile");
  const shortTargets=await page.locator(".mission-button,.filter-button,.mission-nav a,.transit-controls button,.modal-close").evaluateAll(elements=>elements.filter(element=>getComputedStyle(element).display!=="none"&&element.getClientRects().length).map(element=>({text:element.textContent.trim(),height:element.getBoundingClientRect().height})).filter(item=>item.height>0&&item.height<43));
  assert.deepEqual(shortTargets,[]);

  await page.locator("#transitStart").click();
  await page.locator("#transitRight").click();
  await wait(1250);
  assert.equal(await page.locator("#transitMessage").isHidden(),true);
  assert.ok(Number(await page.locator("#transitTime").innerText())<20);
  assert.ok(Number(await page.locator("#transitScore").innerText())>0);
  assert.match(await page.locator("#transitRunner").getAttribute("style"),/70%/);

  await page.locator('[data-mission-id="WRS-20"]').click();
  await page.locator("#studentFirst").fill("Mia");
  await page.locator("#studentLast").fill("M");
  await page.locator("#studentPeriod").selectOption("3");
  const responses=page.locator("[data-response]");
  for(let index=0;index<await responses.count();index+=1)await responses.nth(index).fill(`Specific professional behavior, workplace evidence, repair decision, and success check for WRS response ${index+1}.`);
  await page.locator("#integrityCheck").check();
  await page.getByRole("button",{name:"Create mission receipt"}).click();
  await page.locator("#receiptView").waitFor({state:"visible"});
  assert.match(await page.locator("#receiptCard").innerText(),/WRS Career Center/);
  const saved=await page.evaluate(()=>window.FontaineMissionStore.getTopicCompletions("wrs-career-center")["WRS-20"]);
  assert.equal(saved.title,"Your Name Is on the Shift");
  assert.equal(saved.entries,1);

  await page.goto(`${BASE}/mission-control.html`,{waitUntil:"load"});
  assert.match(await page.locator("#currentMissionTitle").innerText(),/WRS-20 • WRS Career Center/);
  assert.equal(await page.locator("#currentMissionLink").getAttribute("href"),"wrs-career-center.html");

  await page.goto(`${BASE}/student-mission-id.html`,{waitUntil:"load"});
  assert.equal(await page.locator(".topic-progress-card").count(),12);
  assert.match(await page.locator("#topicProgress").innerText(),/WRS Career Center[\s\S]*1 of 22 competencies/i);
  const badgeText=await page.locator("#badgeGrid").innerText();
  assert.match(badgeText,/Work Ready[\s\S]*Unlocked/i);

  await page.goto(`${BASE}/business-world.html`,{waitUntil:"load"});
  assert.equal(await page.locator('a[href="wrs-career-center.html"]').count()>0,true);
  assert.match(await page.locator(".status-tag.open").first().innerText(),/12 locations live/i);
  await assertNoOverflow(page,"Business World with WRS Career Center mobile");
  await page.locator('[data-nav="passport"]').click();
  assert.match(await page.locator('[data-wrs-career-card]').innerText(),/1 of 22 competencies[\s\S]*Stamped/i);
  await page.locator('[data-nav="achievements"]').click();
  assert.match(await page.locator('[data-wrs-career-badge]').first().innerText(),/Work Ready[\s\S]*Earned/i);
  assert.deepEqual(errors,[]);
  await context.close();
  console.log("PASS WRS mission, zombie transit, receipt, Mission Control, Mission ID, Passport, achievements, and mobile integration");
}
(async()=>{const server=spawn("python3",["-m","http.server",String(PORT),"--bind","127.0.0.1"],{stdio:"ignore"});let browser;try{await waitForServer();const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});await run(browser);}finally{if(browser)await browser.close();server.kill("SIGTERM");}console.log("WRS Career Center browser QA passed.");})().catch(error=>{console.error(error);process.exit(1);});
