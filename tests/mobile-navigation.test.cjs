const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');

const PORT=4173;
const BASE=`http://127.0.0.1:${PORT}`;
const viewports=[
  {name:'iPhone 12',width:390,height:844},
  {name:'iPhone 14 Pro Max',width:430,height:932},
  {name:'iPad Mini',width:768,height:1024}
];

function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function waitForServer(){
  for(let i=0;i<40;i++){
    try{const response=await fetch(BASE);if(response.ok)return;}catch{}
    await wait(250);
  }
  throw new Error('Static server did not start.');
}
async function assertNoDocumentOverflow(page,label){
  const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
  assert.ok(dimensions.scrollWidth<=dimensions.clientWidth+1,`${label}: horizontal document overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
}

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
      await assertNoDocumentOverflow(page,`${viewport.name} dashboard`);

      const navTitles=await page.locator('.nav button').allTextContents();
      assert.ok(navTitles.includes('AI Teacher Assistant'),`${viewport.name}: AI Teacher Assistant missing from navigation`);
      assert.ok(navTitles.includes('Lesson Builder 2.0'),`${viewport.name}: Lesson Builder 2.0 missing from navigation`);
      const navStyle=await page.locator('.nav').evaluate(element=>({display:getComputedStyle(element).display,overflowX:getComputedStyle(element).overflowX}));
      assert.equal(navStyle.display,'flex',`${viewport.name}: mobile navigation is not the horizontal flex layout`);
      assert.ok(['auto','scroll'].includes(navStyle.overflowX),`${viewport.name}: mobile navigation is not horizontally scrollable`);
      const shortTargets=await page.locator('.nav button').evaluateAll(buttons=>buttons.map(button=>button.getBoundingClientRect().height).filter(height=>height<43));
      assert.equal(shortTargets.length,0,`${viewport.name}: navigation contains touch targets below 44px`);

      for(const title of navTitles){
        const button=page.locator('.nav button',{hasText:title}).first();
        await button.click();
        await page.waitForTimeout(30);
        assert.equal((await page.locator('.topbar h1').textContent()).trim(),title,`${viewport.name}: navigation failed for ${title}`);
        assert.ok(await button.evaluate(element=>element.classList.contains('active')),`${viewport.name}: active state missing for ${title}`);
        await assertNoDocumentOverflow(page,`${viewport.name} ${title}`);
      }

      await page.locator('.nav button',{hasText:'AI Teacher Assistant'}).click();
      await page.waitForSelector('.ai-teacher-layout');
      const aiColumns=await page.locator('.ai-teacher-layout').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length);
      assert.equal(aiColumns,1,`${viewport.name}: AI Teacher Assistant did not collapse to one column`);
      assert.ok(await page.locator('#aiTeacherInput').isVisible(),`${viewport.name}: assistant prompt is not visible`);
      assert.ok(await page.locator('.ai-context-panel select').first().isVisible(),`${viewport.name}: course selector is not visible`);
      await page.locator('.ai-suggestions button',{hasText:'Create a sub plan for SEM-008'}).click();
      await page.waitForSelector('.ai-response-card');
      assert.match(await page.locator('.ai-response-card h2').textContent(),/SEM-008 independent substitute plan/i,`${viewport.name}: assistant suggestion did not produce the expected response`);
      await assertNoDocumentOverflow(page,`${viewport.name} assistant response`);

      await page.locator('.nav button',{hasText:'Dashboard'}).click();
      const mainSearch=page.locator('#askInput');
      await mainSearch.fill('Create a sub plan for SEM-008');
      await page.locator('.ask button').click();
      await page.waitForSelector('.ai-response-card');
      assert.equal((await page.locator('.topbar h1').textContent()).trim(),'AI Teacher Assistant',`${viewport.name}: main search did not route to AI Teacher Assistant`);
      assert.match(await page.locator('.ai-response-card h2').textContent(),/SEM-008 independent substitute plan/i,`${viewport.name}: routed command returned the wrong response`);
      await assertNoDocumentOverflow(page,`${viewport.name} routed assistant command`);

      assert.deepEqual(errors,[],`${viewport.name}: browser errors detected\n${errors.join('\n')}`);
      await context.close();
      console.log(`PASS ${viewport.name}: layout, navigation, assistant workflow, and routing`);
    }
    console.log(`Mobile layout and navigation QA passed for ${viewports.length} viewports.`);
  }finally{
    if(browser)await browser.close();
    server.kill('SIGTERM');
  }
})().catch(error=>{console.error(error);process.exit(1);});
