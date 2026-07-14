const assert=require('node:assert/strict');
const {chromium}=require('playwright');

const URL='https://robertfontaine-ship-it.github.io/fontaine-command/';
const viewports=[
 {name:'Desktop',width:1440,height:900},
 {name:'iPhone 12',width:390,height:844},
 {name:'iPad Mini',width:768,height:1024}
];

(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const viewport of viewports){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},isMobile:viewport.width<600,hasTouch:viewport.width<900});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
   page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});
   const response=await page.goto(URL,{waitUntil:'networkidle',timeout:60000});
   assert.ok(response&&response.ok(),`${viewport.name}: deployed site returned ${response?.status()}`);
   await page.waitForSelector('.shell',{timeout:30000});
   assert.equal((await page.title()).trim(),'Fontaine Command');
   const nav=await page.locator('.nav button').allTextContents();
   for(const required of ['Dashboard','AI Teacher Assistant','Curriculum Health','Lesson Builder 2.0']){
    assert.ok(nav.includes(required),`${viewport.name}: ${required} is missing from production navigation`);
   }
   for(const required of ['AI Teacher Assistant','Curriculum Health']){
    await page.locator('.nav button',{hasText:required}).click();
    await page.waitForTimeout(100);
    assert.equal((await page.locator('.topbar h1').textContent()).trim(),required,`${viewport.name}: ${required} navigation failed`);
   }
   const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
   assert.ok(dimensions.scrollWidth<=dimensions.clientWidth+1,`${viewport.name}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
   assert.deepEqual(errors,[],`${viewport.name}: browser errors\n${errors.join('\n')}`);
   console.log(`PASS ${viewport.name}: deployed production smoke test`);
   await context.close();
  }
 }finally{await browser.close();}
 console.log('Production smoke test passed for all deployed viewports.');
})().catch(error=>{console.error(error);process.exit(1);});
