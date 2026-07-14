const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const PORT=4175;
const BASE=`http://127.0.0.1:${PORT}`;
const viewports=[
 {name:'iPhone 12',width:390,height:844},
 {name:'Desktop',width:1366,height:900}
];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
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
   await page.locator('.nav button',{hasText:'Companion Resources'}).click();
   await page.waitForSelector('.companion-dashboard');
   assert.equal((await page.locator('.topbar h1').textContent()).trim(),'Companion Resources');
   assert.equal((await page.locator('[data-companion-metric="generated"] strong').textContent()).trim(),'300');
   assert.equal((await page.locator('[data-companion-metric="verified"] strong').textContent()).trim(),'12');
   assert.equal((await page.locator('[data-companion-metric="keys"] strong').textContent()).trim(),'3');
   assert.equal((await page.locator('[data-companion-metric="lessons"] strong').textContent()).trim(),'60');
   await assertNoOverflow(page,`${viewport.name} companion dashboard`);

   const selects=page.locator('.companion-toolbar select');
   await selects.nth(0).selectOption({label:'SEM'});
   await selects.nth(1).selectOption({label:'Student Organizer'});
   await selects.nth(2).selectOption({label:'Generated'});
   await page.waitForTimeout(80);
   assert.equal(await page.locator('.companion-card').count(),20,`${viewport.name}: SEM organizer filter should show 20 resources`);
   await page.locator('.companion-card').first().locator('button',{hasText:'Preview'}).click();
   await page.waitForSelector('.companion-printable');
   assert.match(await page.locator('.companion-printable h1').textContent(),/SEM-\d{3} Student Organizer/);
   assert.ok(await page.locator('.companion-writing-space').count()>=5,'Generated organizer should include response sections.');
   await assertNoOverflow(page,`${viewport.name} companion preview`);
   await page.locator('button',{hasText:'Back to resources'}).click();

   await page.locator('.companion-toolbar button',{hasText:'Clear'}).click();
   await selects.nth(2).selectOption({label:'Teacher Review Required'});
   await page.waitForTimeout(80);
   assert.equal(await page.locator('.companion-card').count(),60,'Review-required list should be capped at 60 visible resources.');
   assert.ok(await page.locator('.companion-review-flag').count()>0,'Review-required resources need a visible warning.');
   assert.deepEqual(errors,[],`${viewport.name}: browser errors detected\n${errors.join('\n')}`);
   await context.close();
   console.log(`PASS ${viewport.name}: companion resources, filters, preview, and review labeling`);
  }
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(error=>{console.error(error);process.exit(1);});