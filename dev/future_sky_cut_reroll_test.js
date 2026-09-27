// Engine checks for both per-cut UI actions, using reproducible test RNG only.
const fs=require('fs'),path=require('path'),Module=require('module'),assert=require('assert');
const filename=path.resolve('tools/export_ae_data.js'),loader=new Module(filename,module);
loader.filename=filename;loader.paths=module.paths;
loader._compile(fs.readFileSync(filename,'utf8').replace("fs.writeFileSync(path.join(ROOT, 'ae', 'data.json'), JSON.stringify(data));",'').replace(/console.log\('ok'[\s\S]*$/,''),filename);
const all=['layout','enter','hold','exit','decor','treat','bg','cam','trans'],shuffle=['layout','enter','hold','exit','cam','trans'];
const cases=[['空と未来の光','fsrOpenSky','fsrCloudHaze',['sky']],['一本道を走り進む','fsrParallelJourney','fsrRoadLines',['journey']],['ふらつく影を支え合う','fsrTwinBalance','fsrTwinShadows',['together','shadow']],['静かな午後','', '',[]]];
const report=[];const st=J.STYLES.futureSkyRoad;
const key=(c,g)=>g==='decor'?c.decor.map(d=>d.id).join('|')||'none':c[g]||'none';
const apply=(c,out)=>{c=JSON.parse(JSON.stringify(c));for(const [g,k] of Object.entries(out))c[g]=g==='decor'?(k==='none'?[]:[{id:k}]):k==='none'&&g==='trans'?null:k;return c;};
for(const [text,favored,decor,tags] of cases)for(const [mode,groups] of [['randomize',all],['shuffle',shuffle]]){
 const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'空 road shadow\n'+text,overrides:{0:{single:true},1:{single:true}}});
 const c=J.plan(p).cuts.find(c=>c.line===1);c.lineText='sky road together'; // prove detector reads cut.text only
 assert.deepStrictEqual(fsrSemantic(st,c.text).tags,tags);
 let weighted=0,neutral=0,wd=0,nd=0;const choices=new Set();
 for(let seed=1;seed<=800;seed++){
  const a=J.rerollFutureSkyCut(p,c,groups,[],[],J.rng(seed));
  const rules=st.lyricRules;st.lyricRules=[];const b=J.rerollFutureSkyCut(p,c,groups,[],[],J.rng(seed));st.lyricRules=rules;
  assert(Object.keys(a).some(g=>a[g]!==key(c,g)),'Identical combination');
  if(!tags.length)assert.deepStrictEqual(a,b,'Neutral lyric should not be biased');
  choices.add(a.layout);weighted+=a.layout===favored;neutral+=b.layout===favored;wd+=a.decor===decor;nd+=b.decor===decor;
  for(const [g,k] of Object.entries(a))assert(k==='none'||J.randomOk(p,g,k),'Profile escaped');
 }
 assert(choices.size===5,'Layout became forced');
 if(favored)assert(weighted>neutral*1.2,'Missing layout weighting');
 if(decor&&mode==='randomize')assert(wd>nd*1.2,'Missing decor weighting');
 let last=c;
 for(let i=1;i<=200;i++){const out=J.rerollFutureSkyCut(p,last,groups,[],[],J.rng(i));assert(Object.keys(out).some(g=>out[g]!==key(last,g)));last=apply(last,out);}
 // Manual pins survive; exact recipe may remain only when there is nothing to reroll.
 assert.deepStrictEqual(J.rerollFutureSkyCut(p,c,groups,groups,[],J.rng(1)),{});
 const pinned=J.rerollFutureSkyCut(p,c,groups,['layout','decor'],[],J.rng(3));assert(!('layout' in pinned)&&!('decor' in pinned));
 report.push({text,mode,tags,weightedLayout:weighted,neutralLayout:neutral,weightedDecor:wd,neutralDecor:nd,trials:800});
}
// Exercise the bounded retry fallback, not only ordinary successful draws.
{
 const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'sky'}),c=J.plan(p).cuts[0];
 c.layout='fsrOpenSky';const rng=J.rng(1);rng.wpick=list=>list[0][0];
 assert.notStrictEqual(J.rerollFutureSkyCut(p,c,['layout'],[],[],rng).layout,c.layout);
}
// Typeset mode suppresses treatment under decoration; do not count that as a change.
{
 const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'sky',typeset:true,overrides:{0:{single:true}}});
 let c=J.plan(p).cuts[0];
 for(let i=1;i<=100;i++){
  const out=J.rerollFutureSkyCut(p,c,all,[],[],J.rng(i));
  p.overrides[0].cutTech={0:{...(p.overrides[0].cutTech||{})[0],...out}};
  const next=J.plan(p).cuts[0];assert(all.some(g=>key(c,g)!==key(next,g)),'Rendered typeset recipe repeated');c=next;
 }
}
// Disabled and empty pools cannot introduce unrelated styles or disabled parts.
const p=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'sky',overrides:{0:{single:true}}}),c=J.plan(p).cuts[0];
for(const k of J.LAYOUT_ORDER)p.enabled.layout[k]=false;
assert.deepStrictEqual(J.rerollFutureSkyCut(p,c,['layout'],[],[],J.rng(1)),{});
p.enabled.layout.fsrOpenSky=true;
const only=J.rerollFutureSkyCut(p,{...c,layout:'fsrOpenSky'},['layout'],[],[],J.rng(1));assert.deepStrictEqual(only,{});
for(const style of J.STYLE_ORDER.filter(k=>k!=='futureSkyRoad'))assert.strictEqual(J.rerollFutureSkyCut({...p,style},c,all,[],[],()=>{throw Error('Other style consumed RNG');}),null);
// Per-cut overrides take effect, survive save/open, and leave neighboring cuts alone.
const q=Object.assign(J.defaultProject(),{style:'futureSkyRoad',lyrics:'sky\nroad\nshadow together',overrides:{0:{single:true},1:{single:true},2:{single:true}}});
const before=J.plan(q),cut=before.cuts[1],out=J.rerollFutureSkyCut(q,cut,all,[],before.cuts.slice(0,1),J.rng(98));
q.overrides[1].cutTech={0:out};const after=J.plan(q);
assert.deepStrictEqual(after.cuts[0],before.cuts[0]);assert.deepStrictEqual(after.cuts[2],before.cuts[2]);
assert.deepStrictEqual(J.plan(JSON.parse(JSON.stringify(q))),after);
q.overrides[1].cutTech[0].layout='fsrLowGround';assert.strictEqual(J.plan(q).cuts[1].layout,'fsrLowGround');
console.log(JSON.stringify({report,consecutiveRerolls:1600,otherStyles:J.STYLE_ORDER.length-1,checks:'passed'}));
