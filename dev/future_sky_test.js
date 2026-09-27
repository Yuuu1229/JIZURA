// Browser integration / rendering checks. Requires Playwright and Chrome.
// node dev/future_sky_test.js [output directory (default /tmp/jizura-future-sky)]
const fs = require('fs'), path = require('path'), assert = require('assert');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
(async () => {
  const out = process.argv[2] || '/tmp/jizura-future-sky'; fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage(); const problems = [];
    page.on('pageerror', e => problems.push(e.message));
    page.on('console', m => { if (m.type() === 'warning') problems.push(m.text()); });
    await page.goto(pathToFileURL(path.resolve('dev/www/test.html')).href);
    const result = await page.evaluate(async () => {
      const fail = msg => { throw new Error(msg); };
      const st = J.STYLES.futureSkyRoad;
      await J.ensureFonts('未来の空へ ふたりで歩こう', ['gothic_med', 'gothic_light', 'gothic_bold']);
      const r = new J.Renderer(), cv = document.createElement('canvas'), ctx = cv.getContext('2d');
      let frames = 0, plans = 0;
      for (const aspect of ['16:9','9:16','4:3','3:4','1:1','4:5','21:9']) for (const seed of [1,7,42]) for (const extra of [false,true]) {
        const p = Object.assign(J.defaultProject(), { style:'futureSkyRoad', aspect, seed, extra,
          unify: seed === 7, typeset: seed === 42,
          lyrics:'空\n未来の空へ/ふたりで歩こう\n*明日*をまだ知らなくても!\n[interlude 4]\nWe keep moving toward the morning\n振り返れば懐かしい道の向こうにもまだ知らない景色が続いている' });
        const saved = JSON.stringify(p), plan = J.plan(p);
        if (JSON.stringify(p) !== saved) fail('Planning mutated the project');
        if (JSON.stringify(plan) !== JSON.stringify(J.plan(JSON.parse(saved)))) fail('Non-deterministic round trip');
        if (plan.events.length || plan.hud || plan.fx.glitch || plan.fx.flash || plan.fx.koma) fail('Aggressive effects escaped profile');
        cv.width = Math.round(plan.W * 0.25); cv.height = Math.round(plan.H * 0.25);
        for (const c of plan.cuts) {
          if (c.layout !== 'interlude' && !st.parts.layout.includes(c.layout)) fail('Unexpected layout: '+c.layout);
          if (c.bg !== st.background) fail('Missing sky background');
          for (const g of ['enter','exit','hold','cam','treat']) if (c.layout !== 'interlude' && c[g] && !st.parts[g].includes(c[g]) && !(c[g] === 'cut' && ((g === 'enter' && c.morph) || (g === 'exit' && plan.cuts[plan.cuts.indexOf(c)+1]?.morph)))) fail('Unexpected '+g+': '+c[g]);
          for (const t of [c.start, c.start+c.dur*0.2, c.start+c.dur*0.5, c.end-0.001]) {
            r.frame(ctx,plan,t,{scale:0.25}); frames++;
          }
        }
        plans++;
      }
      for (const style of J.STYLE_ORDER.filter(k => k !== 'futureSkyRoad')) {
        const p = Object.assign(J.defaultProject(),{style,extra:true});
        for (const g of J.GROUP_KEYS) for (const k of J.order(g)) if (J.registry(g)[k].styleOnly === 'futureSkyRoad' && J.randomOk(p,g,k)) fail('Style-only part leaked');
      }
      const disabled = Object.assign(J.defaultProject(),{style:'futureSkyRoad'});
      disabled.enabled.bg[st.background]=false;
      if (J.plan(disabled).cuts.some(c=>c.bg===st.background)) fail('Disabled background ignored');
      const special = Object.assign(J.defaultProject(),{style:'futureSkyRoad',centerFree:true,aspect:'9:16'});
      for (const mode of ['off','green','black']) {
        special.keyBg=mode; const plan=J.plan(special);
        cv.width=Math.round(plan.W*0.25);cv.height=Math.round(plan.H*0.25);
        for (const transparent of [false,true]) r.frame(ctx,plan,1,{scale:0.25,transparent});
      }
      const p = Object.assign(J.defaultProject(), { style:'futureSkyRoad', seed:7,
        lyrics:'未来の空へ、ふたりで\n知らない明日も歩いていこう',
        overrides:{0:{single:true},1:{single:true}}, timing:{bpm:0,offset:0,snap:false,tail:0.5,lineTimes:{0:0,1:5},lineScale:1} });
      const plan = J.plan(p); cv.width=1920;cv.height=1080;
      r.frame(ctx,plan,2,{scale:1}); const preview=cv.toDataURL('image/png');
      const ae=J.planForAE(plan,p);
      p.aspect='9:16'; const portrait=J.plan(p);cv.width=1080;cv.height=1920;
      r.frame(ctx,portrait,2,{scale:1}); const portraitImage=cv.toDataURL('image/png');
      return {plans,frames,preview,portraitImage,ae,project:p};
    });
    assert.deepStrictEqual(problems, []);
    fs.writeFileSync(path.join(out,'future-sky-road.png'),Buffer.from(result.preview.split(',')[1],'base64'));
    fs.writeFileSync(path.join(out,'future-sky-road-portrait.png'),Buffer.from(result.portraitImage.split(',')[1],'base64'));
    fs.writeFileSync(path.join(out,'future-sky-road.ae.json'),JSON.stringify(result.ae));
    fs.writeFileSync(path.join(out,'future-sky-road.jizura.json'),JSON.stringify({...result.project,aspect:'16:9'},null,2));
    // Verify the real English editor discovers the new style automatically.
    await page.addInitScript(() => { localStorage.setItem('jizura.tourDone','1'); localStorage.setItem('jizura.mode','pro'); });
    await page.goto(pathToFileURL(path.resolve('en/index.html')).href);
    const skip=page.locator('.tour-skip'); if (await skip.isVisible()) await skip.click();
    await page.locator('#modePro').click();
    await page.locator('[data-tab="style"]').click();
    const button=page.locator('button.stile[data-k="futureSkyRoad"]');
    await button.click(); await page.waitForFunction(()=>document.querySelector('button.stile[data-k="futureSkyRoad"]').getAttribute('aria-pressed')==='true');
    assert.deepStrictEqual(problems, []);
    console.log(JSON.stringify({plans:result.plans,frames:result.frames,errors:problems,stylePicker:'passed',out}));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
