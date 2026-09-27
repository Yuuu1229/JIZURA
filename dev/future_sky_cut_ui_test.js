// Click the real browser controls; no test-only production UI hooks.
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1200}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{localStorage.setItem('jizura.tourDone','1');localStorage.setItem('jizura.mode','pro');});
  await page.goto(pathToFileURL(path.resolve('en/index.html')).href);
  await page.locator('#modePro').click();
  await page.evaluate(()=>{
   window.rerolls=[];const fn=J.rerollFutureSkyCut;
   J.rerollFutureSkyCut=function(p,c,g,f,h){const out=fn(p,c,g,f,h);window.rerolls.push({text:c.text,tags:fsrSemantic(J.STYLES[p.style],c.text).tags,fixed:f,out});return out;};
   const plan=J.plan;J.plan=function(...a){const out=plan(...a);window.latestProject=JSON.parse(JSON.stringify(a[0]));window.latestPlan=out;return out;};
  });
  async function open(text,style='futureSkyRoad',overrides={0:{single:true}}){
   const p=await page.evaluate(({text,style,overrides})=>{const p=J.defaultProject();Object.assign(p,{style,lyrics:text,overrides});p.timing.offset=0;p.timing.snap=false;return p;},{text,style,overrides});
   await page.locator('#fileProject').setInputFiles({name:'cut.jizura.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
   await page.waitForFunction(t=>window.latestProject?.lyrics===t,text);
   await page.locator('#cutInfo button[data-roll="shuffle"]').waitFor();
  }
  const results=[];
  for(const [text,tags] of [['空と未来の光',['sky']],['一本道を走り進む',['journey']],['ふらつく影を支え合う',['together','shadow']],['静かな午後',[]]]){
   await open(text);
   for(const mode of ['shuffle','omakase']){
    const before=await page.evaluate(()=>rerolls.length);
    await page.locator(`#cutInfo button[data-roll="${mode}"]`).click();
    const r=await page.evaluate(()=>rerolls[rerolls.length-1]);
    assert.deepStrictEqual(r.tags,tags);assert.strictEqual(r.text,text);assert(Object.keys(r.out).length);
    assert.strictEqual(await page.evaluate(()=>rerolls.length),before+1);
    results.push({text,mode,tags:r.tags});
   }
  }
  // Normal Create variation, Save/Open and Export for AE controls.
  await open('空と未来の光');
  const seed=await page.evaluate(()=>latestProject.seed);
  await page.locator('#btnShuffle').click();
  assert.strictEqual(await page.evaluate(()=>latestProject.style),'futureSkyRoad');
  assert.notStrictEqual(await page.evaluate(()=>latestProject.seed),seed);
  const [saved]=await Promise.all([page.waitForEvent('download'),page.locator('#btnSave').click()]);
  const bytes=fs.readFileSync(await saved.path()),project=JSON.parse(bytes);
  assert.strictEqual(project.style,'futureSkyRoad');
  await open('静かな午後');
  await page.locator('#fileProject').setInputFiles({name:'saved.jizura.json',mimeType:'application/json',buffer:bytes});
  await page.waitForFunction(seed=>latestProject.seed===seed,project.seed);
  assert.strictEqual(await page.evaluate(()=>latestProject.lyrics),project.lyrics);
  const [exported]=await Promise.all([page.waitForEvent('download'),page.locator('#btnAE').click()]);
  const ae=JSON.parse(fs.readFileSync(await exported.path()));
  assert.strictEqual(ae.styleKey,'futureSkyRoad');assert(ae.cuts.length);assert(ae.cuts[0].semantic.tags.includes('sky'));
  fs.writeFileSync('/tmp/jizura-final-ui.ae.json',JSON.stringify(ae));
  // Dispatch menu selection events directly: test the real handlers, independent
  // of the long thumbnail grid's viewport/scroll positioning.
  // Selecting a component by hand pins it against subsequent automatic rerolls.
  await open('空と未来の光');
  await page.locator('#cutInfo button[data-g="layout"]').click();
  await page.locator('#cutPickGrid button[title="fsrLowGround"]').dispatchEvent('click');
  await page.locator('#cutInfo button[data-roll="omakase"]').click();
  let r=await page.evaluate(()=>({call:rerolls.at(-1),layout:latestPlan.cuts[0].layout}));
  assert(r.call.fixed.includes('layout'));assert(!r.call.out.layout);assert.strictEqual(r.layout,'fsrLowGround');
  // New manual choices override the last automatic result and survive serialization.
  await page.locator('#cutInfo button[data-g="hold"]').click();
  await page.locator('#cutPickGrid button[title="still"]').dispatchEvent('click');
  assert.strictEqual(await page.evaluate(()=>J.plan(JSON.parse(JSON.stringify(latestProject))).cuts[0].hold),'still');
  // Every other style must continue to use the original UI reroll path.
  const styles=await page.evaluate(()=>J.STYLE_ORDER.filter(k=>k!=='futureSkyRoad'));
  for(const style of styles){
   await open('sky road shadow',style);
   const count=await page.evaluate(()=>rerolls.length);
   for(const mode of ['shuffle','omakase'])await page.locator(`#cutInfo button[data-roll="${mode}"]`).click();
   assert.strictEqual(await page.evaluate(()=>rerolls.length),count,style+' entered FSR path');
  }
  assert.deepStrictEqual(errors,[]);console.log(JSON.stringify({results,manualOverrides:'passed',variationSaveOpenAE:'passed',otherStyles:styles.length,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
