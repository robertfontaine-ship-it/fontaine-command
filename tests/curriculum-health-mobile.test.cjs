const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const PORT=4174;
const BASE=`http://127.0.0.1:${PORT}`;
const viewports=[
 {name:'iPhone 12',width:390,height:844},
 {name:'iPad Mini',width:768,height:1024},
 {name:'Desktop',width:1366,height:900}
];
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function waitForServer(){for(let i=0;i<40;i++){try{const response=await fetch(BASE);if(response.ok)return;}catch{}await wait(250);}throw new Error('Static server did not start.');}
async function assertNoOverflow(page,label){const size=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(size.scrollWidth<=size.clientWidth+1,`${label}: horizontal overflow ${size.scrollWidth}px > ${size.clientWidth}px`);}

(async()=>{
 const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  for(const viewport of viewports){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},isMobile:viewport.width<600,hasTouch:viewport.width<900,permissions:['clipboard-read','clipboard-write']});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
   page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});
   await page.goto(BASE,{waitUntil:'networkidle'});
   await page.locator('.nav button',{hasText:'Curriculum Health'}).click();
   await page.waitForSelector('.health-dashboard');
   assert.equal((await page.locator('.topbar h1').textContent()).trim(),'Curriculum Health');
   assert.equal(await page.locator('.health-metric-card').count(),4,`${viewport.name}: four domain metrics were not rendered`);
   assert.equal(await page.locator('.health-course-card').count(),2,`${viewport.name}: course comparison cards were not rendered`);
   assert.ok(await page.locator('.health-issue').count()>0,`${viewport.name}: action queue is empty`);
   await assertNoOverflow(page,`${viewport.name} dashboard`);

   const courseFilter=page.locator('.health-hero-actions select');
   await courseFilter.selectOption({label:'SEM'});
   await page.waitForTimeout(50);
   assert.match(await page.locator('.health-hero .pill').textContent(),/SEM curriculum/);
   await assertNoOverflow(page,`${viewport.name} SEM filter`);

   await page.locator('.health-metric-card',{hasText:'Lesson readiness'}).click();
   await page.waitForTimeout(50);
   assert.equal((await page.locator('.topbar h1').textContent()).trim(),'Build Queue',`${viewport.name}: readiness drill-down failed`);

   await page.locator('.nav button',{hasText:'Curriculum Health'}).click();
   await page.waitForSelector('.health-dashboard');
   await page.locator('.health-hero-actions .btn',{hasText:'Ask Assistant'}).click();
   await page.waitForSelector('.ai-response-card');
   assert.equal((await page.locator('.topbar h1').textContent()).trim(),'AI Teacher Assistant',`${viewport.name}: assistant handoff failed`);
   assert.match(await page.locator('.ai-response-card h2').textContent(),/Curriculum health briefing/i);
   await assertNoOverflow(page,`${viewport.name} assistant handoff`);

   assert.deepEqual(errors,[],`${viewport.name}: browser errors detected\n${errors.join('\n')}`);
   await context.close();
   console.log(`PASS ${viewport.name}: dashboard layout, filters, drill-down, and assistant handoff`);
  }
  console.log(`Curriculum Health browser QA passed for ${viewports.length} viewports.`);
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(error=>{console.error(error);process.exit(1);});
