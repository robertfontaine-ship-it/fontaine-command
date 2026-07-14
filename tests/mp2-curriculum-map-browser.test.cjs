const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const PORT=4177;
const BASE=`http://127.0.0.1:${PORT}`;
const viewports=[
 {name:'iPhone 12',width:390,height:844},
 {name:'iPad Mini',width:768,height:1024},
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
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},isMobile:viewport.width<600,hasTouch:viewport.width<900});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
   page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});
   await page.goto(BASE,{waitUntil:'networkidle'});

   const audit=await page.evaluate(()=>FONTaineMP2Audit);
   assert.equal(audit.total,60,`${viewport.name}: MP2 audit total is not 60`);
   assert.equal(audit.byCourse.SEM,20);
   assert.equal(audit.byCourse.Fashion,20);
   assert.equal(audit.byCourse.Entrepreneurship,20);
   await assertNoOverflow(page,`${viewport.name} dashboard`);

   await page.locator('.nav button',{hasText:'Lessons'}).click();
   await page.locator('select[aria-label="Filter lessons by marking period"]').selectOption('MP2');
   await page.waitForTimeout(100);
   assert.equal(await page.locator('article.item').count(),60,`${viewport.name}: MP2 lesson count is not 60`);
   assert.match(await page.locator('.mp2-result-count').textContent(),/60 lessons/);

   await page.locator('select[aria-label="Filter lessons by course"]').selectOption('SEM');
   await page.waitForTimeout(100);
   assert.equal(await page.locator('article.item').count(),20,`${viewport.name}: SEM MP2 lesson count is not 20`);
   const firstCard=page.locator('article.item').first();
   assert.match(await firstCard.textContent(),/SEM-021/);
   const expectedStatus=await page.evaluate(()=>lessons.find(lesson=>lesson.id==='SEM-021').status);
   assert.match(await firstCard.textContent(),new RegExp(expectedStatus));
   await assertNoOverflow(page,`${viewport.name} MP2 lesson list`);

   await firstCard.click();
   await page.waitForSelector('.lesson-header');
   const workspace=await page.locator('.lesson-header').textContent();
   assert.match(workspace,/SEM-021/);
   assert.match(workspace,/MP2/);
   assert.match(workspace,new RegExp(expectedStatus));
   if(expectedStatus==='Complete')assert.match(await page.locator('.lesson-body').textContent(),/promotional mix|awareness|five promotional tools/i);
   await assertNoOverflow(page,`${viewport.name} MP2 lesson workspace`);

   await page.locator('.nav button',{hasText:'Courses'}).click();
   await page.waitForSelector('.mp2-course-card');
   assert.equal(await page.locator('.mp2-course-card').count(),3);
   const cards=await page.locator('.mp2-course-card').allTextContents();
   cards.forEach(text=>assert.match(text,/20\s+MP2/));
   const semCard=page.locator('.mp2-course-card',{hasText:'SEM'});
   const semText=await semCard.textContent();
   assert.match(semText,/20\s+MP1/);
   assert.match(semText,/20\s+MP2/);
   await assertNoOverflow(page,`${viewport.name} courses`);

   await page.locator('.nav button',{hasText:'Build Queue'}).click();
   await page.waitForSelector('.mp2-result-count');
   await page.locator('select[aria-label="Filter build queue by marking period"]').selectOption('MP2');
   await page.waitForTimeout(100);
   const waiting=await page.evaluate(()=>lessons.filter(lesson=>lesson.markingPeriod==='MP2'&&lesson.status!=='Complete').length);
   assert.match(await page.locator('.mp2-result-count').textContent(),new RegExp(`${waiting} mapped lessons awaiting full packages`));
   await assertNoOverflow(page,`${viewport.name} build queue`);

   assert.deepEqual(errors,[],`${viewport.name}: browser errors detected\n${errors.join('\n')}`);
   await context.close();
   console.log(`PASS ${viewport.name}: MP2 audit, filters, lesson workspace, courses, and build queue remain valid with MP3 loaded`);
  }
  console.log(`MP2 curriculum map browser QA passed for ${viewports.length} viewports.`);
 }finally{
  if(browser)await browser.close();
  server.kill('SIGTERM');
 }
})().catch(error=>{console.error(error);process.exit(1);});