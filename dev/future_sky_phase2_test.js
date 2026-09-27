// Phase 2 component matrix and manual seven-line arrangement; no semantic routing.
// Requires Playwright/Chrome. Build with python3 build.py --dev first.
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage(),problems=[];
  page.on('pageerror',e=>problems.push(e.message));
  page.on('console',m=>{if(m.type()==='warning')problems.push(m.text())});
  await page.goto(pathToFileURL(path.resolve('dev/www/test.html')).href);
  const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/examples/future-sky-road-phase2.jizura.json')));
  const result=await page.evaluate(async fixture=>{
   const fail=m=>{throw new Error(m)},st=J.STYLES.futureSkyRoad;
   await J.ensureFonts(fixture.lyrics,['gothic_med']);
   const cv=document.createElement('canvas'),ctx=cv.getContext('2d',{willReadFrequently:true}),R=new J.Renderer();let frames=0;
   const raw=JSON.stringify(fixture),plan=J.plan(fixture);
   if(JSON.stringify(fixture)!==raw)fail('Project mutated');
   if(JSON.stringify(plan)!==JSON.stringify(J.plan(JSON.parse(raw))))fail('Round trip changed');
   if(plan.cuts.length!==7)fail('Expected seven manually composed shots');
   const roads=plan.cuts.filter(c=>c.decor.some(d=>d.id==='fsrRoadLines')).map(c=>c.line);
   if(JSON.stringify(roads)!=='[3]')fail('Roads must appear only on the journey shot');
   if(plan.events.length||plan.cuts.some(c=>c.trans))fail('Unexpected hard screen effects/transitions');
   if(new Set(plan.cuts.map(c=>c.layout)).size!==5)fail('All five compositions must be represented');
   if(plan.cuts[5].params.items.map(i=>i.text).join('')!==plan.cuts[5].text)fail('Twin layout lost lyrics');
   // Every composition with short, long and mixed-script text in all output aspects.
   const texts=['空','錆び付いた Pride','ふらつく影を支え合いながら今日もまだ知らない明日へ歩いていこう','We move along a nameless road','窗边的泪模糊了回忆','바람에 노래하며 함께 걸어'];
   for(const aspect of ['16:9','9:16','1:1','4:3','3:4','4:5','21:9']) for(const layout of st.parts.layout) for(const text of texts){
    const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',aspect,lyrics:text,seed:7,
      overrides:{0:{single:true,layout,enter:'fsrSoftIn',exit:'fsrSoftOut',hold:'fsrTravel',cam:'fsrHorizon',treat:'none',decor:st.parts.decor}}});
    const q=J.plan(p);await J.ensureFonts(text,['gothic_med']);cv.width=Math.round(q.W*0.25);cv.height=Math.round(q.H*0.25);
    const c=q.cuts[0];
    const restored=c.params.items.map(x=>x.text.replace(/\s/g,'')).join('');
    if(restored!==text.replace(/\s/g,''))fail(layout+' lost text');
    for(const u of [0,0.15,0.5,0.85,0.999]){R.frame(ctx,q,c.start+c.dur*u,{scale:0.25});frames++;}
   }
   // Each optional motif must actually change a rendered frame independently.
   const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'空',overrides:{0:{single:true,layout:'fsrOpenSky',decor:[],hold:'still',cam:'push',treat:'none'}}});
   const q=J.plan(p);q.fx.texture=0;q.fx.chroma=0;cv.width=480;cv.height=270;
   R.frame(ctx,q,1,{scale:0.25});const base=ctx.getImageData(0,0,480,270).data;const visible={};
   for(const id of st.parts.decor){q.cuts[0].decor=[{id,seed:7}];R.frame(ctx,q,1,{scale:0.25});const pixels=ctx.getImageData(0,0,480,270).data;
    let changed=0;for(let i=0;i<pixels.length;i+=4)if(Math.abs(pixels[i]-base[i])+Math.abs(pixels[i+1]-base[i+1])+Math.abs(pixels[i+2]-base[i+2])>2)changed++;
    visible[id]=changed;if(changed<100)fail(id+' is invisible');
   }
   const portrait=J.plan(Object.assign({},fixture,{aspect:'9:16'}));
   const sheet=document.createElement('canvas');sheet.width=1080;sheet.height=1000;const sx=sheet.getContext('2d');sx.fillStyle='#f4f4ef';sx.fillRect(0,0,1080,1000);
   cv.width=270;cv.height=480;
   portrait.cuts.forEach((c,i)=>{R.frame(ctx,portrait,c.start+c.dur*0.5,{scale:0.25});const x=i%4*270,y=Math.floor(i/4)*500;sx.drawImage(cv,x,y);sx.fillStyle='#40585f';sx.font='14px sans-serif';sx.fillText(String(i+1),x+8,y+494);});
   const portraitSheet=sheet.toDataURL('image/png');
   const ae=J.planForAE(plan,fixture);
   return {frames,shots:plan.cuts.length,roads,visible,ae,portraitSheet};
  },fixture);
  assert.deepStrictEqual(problems,[]);
  fs.writeFileSync('/tmp/jizura-phase2-portrait.png',Buffer.from(result.portraitSheet.split(',')[1],'base64'));delete result.portraitSheet;
  const out='/tmp/jizura-phase2-ae.json';fs.writeFileSync(out,JSON.stringify(result.ae));delete result.ae;
  console.log(JSON.stringify({...result,problems,ae:out}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
