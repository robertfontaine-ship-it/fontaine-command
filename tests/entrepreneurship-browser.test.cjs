const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const PORT=4174;
const BASE=`http://127.0.0.1:${PORT}`;
const viewports=[{name:'Desktop',width:1440,height:900},{name:'iPhone 12',width:390,height:844},{name:'iPad Mini',width:768,height:1024}];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitForServer(){for(let i=0;i<40;i++){try{const response=await fetch(BASE);if(response.ok)return;}catch{}await wait(250);}throw new Error('Static server did not start.');}
async function noOverflow(page,label){const size=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));assert.ok(size.scrollWidth<=size.clientWidth+1,`${label}: overflow ${size.scrollWidth}px > ${size.clientWidth}px`);}

(async()=>{
 const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{stdio:'ignore'});
 let browser;
 try{
  await waitForServer();
  browser=await chromium.launch({headless:true});
  for(const viewport of viewports){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},isMobile:viewport.width<600,hasTouch:true});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
   page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});
   await page.goto(BASE,{waitUntil:'networkidle'});
   await page.waitForSelector('.shell');
   assert.match(await page.locator('.topbar .muted').first().textContent(),/Entrepreneurship 9093/);

   await page.locator('.nav button',{hasText:'Courses'}).click();
   assert.equal(await page.locator('.card h2',{hasText:'Entrepreneurship'}).count(),1,`${viewport.name}: Entrepreneurship course card missing`);
   await noOverflow(page,`${viewport.name} courses`);

   await page.locator('.nav button',{hasText:'Lessons'}).click();
   const courseOptions=await page.locator('.filters select').first().locator('option').allTextContents();
   assert.ok(courseOptions.includes('Entrepreneurship'),`${viewport.name}: lesson course filter missing Entrepreneurship`);
   await page.locator('.filters select').first().selectOption({label:'Entrepreneurship'});
   assert.equal(await page.locator('article.item').count(),20,`${viewport.name}: Entrepreneurship lesson count`);
   await page.locator('article.item',{hasText:'ENT-001'}).click();
   assert.match(await page.locator('.lesson-header h2').textContent(),/ENT-001/);
   assert.match(await page.locator('.lesson-body').textContent(),/Entrepreneurial Mindset|course systems/i);
   await noOverflow(page,`${viewport.name} lesson workspace`);

   await page.locator('.nav button',{hasText:'Standards'}).click();
   const standardsCourses=await page.locator('.standards-toolbar select').nth(1).locator('option').allTextContents();
   assert.ok(standardsCourses.includes('Entrepreneurship'),`${viewport.name}: standards filter missing Entrepreneurship`);
   await page.locator('.standards-toolbar select').nth(1).selectOption({label:'Entrepreneurship'});
   assert.equal(await page.locator('.standard-card').count(),8,`${viewport.name}: Entrepreneurship standards count`);

   await page.locator('.nav button',{hasText:'Google Drive'}).click();
   const driveCourses=await page.locator('.filters select').first().locator('option').allTextContents();
   assert.ok(driveCourses.includes('Entrepreneurship'),`${viewport.name}: Drive filter missing Entrepreneurship`);
   await page.locator('.filters select').first().selectOption({label:'Entrepreneurship'});
   assert.ok(await page.locator('.resource-library-card').count()>=8,`${viewport.name}: Entrepreneurship Drive resources missing`);

   await page.locator('.nav button',{hasText:'Curriculum Health'}).click();
   const healthCourses=await page.locator('.health-hero-actions select option').allTextContents();
   assert.ok(healthCourses.includes('Entrepreneurship'),`${viewport.name}: health filter missing Entrepreneurship`);
   await page.locator('.health-hero-actions select').selectOption({label:'Entrepreneurship'});
   assert.match(await page.locator('.health-hero .pill').textContent(),/Entrepreneurship/);
   await noOverflow(page,`${viewport.name} curriculum health`);

   assert.deepEqual(errors,[],`${viewport.name}: browser errors\n${errors.join('\n')}`);
   console.log(`PASS ${viewport.name}: Entrepreneurship migration integration`);
   await context.close();
  }
 }finally{if(browser)await browser.close();server.kill('SIGTERM');}
 console.log('Entrepreneurship browser QA passed for all viewports.');
})().catch(error=>{console.error(error);process.exit(1);});
