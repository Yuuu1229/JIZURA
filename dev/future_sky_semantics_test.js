// Local semantic weighting, stochastic distribution, overrides and AE regression.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),Module=require('module');
const filename=path.resolve('tools/export_ae_data.js'),loader=new Module(filename,module);
loader.filename=filename;loader.paths=module.paths;
loader._compile(fs.readFileSync(filename,'utf8').replace("fs.writeFileSync(path.join(ROOT, 'ae', 'data.json'), JSON.stringify(data));",'').replace(/console.log\('ok'[\s\S]*$/,''),filename);
const st=J.STYLES.futureSkyRoad,original=JSON.stringify(st);
const analyze=text=>fsrSemantic(st,text);
assert.deepStrictEqual(analyze('trunk delivery behold skylight').tags,[]);
assert.deepStrictEqual(analyze('ＰＲＩＤＥ').tags,['wear']);
assert(analyze('SIDE   BY SIDE').tags.includes('together'));
assert.deepStrictEqual(analyze('sky sky sky').weights,analyze('sky').weights);
assert.strictEqual(analyze('memory 記憶').weights.layout.fsrDriftingMemory,3.2);
for(const t of ['天空 未來 光 一起 支え','하늘 미래 함께 그림자 눈물 살아 녹슨'])assert(analyze(t).tags.length>=2);
const cases=[['sky','fsrOpenSky','fsrCloudHaze'],['road','fsrParallelJourney','fsrRoadLines'],['together','fsrTwinBalance','fsrTwinShadows'],['shadow','fsrDriftingMemory','fsrTwinShadows'],['tears','fsrDriftingMemory','fsrDiffuseBleed'],['voice','fsrOpenSky','fsrWindTrails'],['survive','fsrLowGround','fsrHorizonGlow'],['pride','fsrDriftingMemory','fsrDiffuseBleed']];
function project(lyrics,seed){return Object.assign(J.defaultProject(),{style:'futureSkyRoad',seed,lyrics,overrides:Object.fromEntries(lyrics.split('\n').map((_,i)=>[i,{single:true}]))});}
for(const text of ['We move along a nameless road','Side by side we carry the rain','바람에 노래하며 함께 걸어','窗边的泪模糊了回忆','ふらつく影を支え合いながら'])for(const layout of ['fsrTwinBalance','fsrParallelJourney']){
 const p=project(text,7);p.overrides[0].layout=layout;const c=J.plan(p).cuts[0];
 assert.strictEqual(c.params.items.length,2,'Paired layout must have exactly two groups');
 assert.strictEqual(c.params.items.map(x=>x.text).join('').replace(/\s/g,''),text.replace(/\s/g,''),'Text reordered or lost');
}
const stats=[];let plans=0;
for(const [word,layout,decor] of cases){
 let a=0,b=0,ad=0,bd=0;const choices=new Set();
 for(let seed=1;seed<=400;seed++){
  const p=project(word+' in the evening',seed),c=J.plan(p).cuts[0];plans++;choices.add(c.layout);a+=c.layout===layout;ad+=c.decor.some(d=>d.id===decor);
  const rules=st.lyricRules;delete st.lyricRules;const n=J.plan(p).cuts[0];st.lyricRules=rules;plans++;b+=n.layout===layout;bd+=n.decor.some(d=>d.id===decor);
 }
 assert(choices.size===5,word+' forced a layout');assert(a>b*1.25,word+' layout bias not measurable');assert(ad>bd*1.2,word+' decoration bias not measurable');stats.push({word,layout,weighted:a,neutral:b,decor,weightedDecor:ad,neutralDecor:bd,seeds:400});
}
// Repeated tags still produce variation; compare decor repeats to penalty disabled.
let repeats=0,unpenalized=0,pairs=0;
for(let seed=1;seed<=150;seed++){
 const p=project(Array(10).fill('sky cloud tomorrow').join('\n'),seed);
 for(const penalty of [0.15,1]){
  st.recentDecorWeight=penalty;const cuts=J.plan(p).cuts;plans++;
  for(let i=1;i<cuts.length;i++){const n=cuts[i].decor.filter(d=>cuts[i-1].decor.some(x=>x.id===d.id)).length;if(penalty===0.15){repeats+=n;pairs++;}else unpenalized+=n;}
 }
}
st.recentDecorWeight=0.15;assert(repeats<unpenalized*0.65,'Adjacent suppression ineffective');
const p=project('sky together memory',7);p.overrides[0]={single:true,layout:'fsrLowGround',decor:['fsrRoadLines'],hold:'still'};
const c=J.plan(p).cuts[0];assert(c.layout==='fsrLowGround'&&c.hold==='still'&&c.decor[0].id==='fsrRoadLines');
p.overrides={0:{single:true}};p.enabled.layout.fsrOpenSky=false;p.enabled.decor.fsrCloudHaze=false;
for(let seed=1;seed<100;seed++){p.seed=seed;const c=J.plan(p).cuts[0];assert(c.layout!=='fsrOpenSky');assert(!c.decor.some(d=>d.id==='fsrCloudHaze'));}
assert.deepStrictEqual(st,JSON.parse(original),'Style mutated');
// Shared detector and standalone weighting must work under AE's ES3 runtime.
const AEOM=require('./aeom');
function loadAE(file){const env=AEOM.makeEnv({fonts:()=>true});vm.createContext(env.ctx);vm.runInContext(fs.readFileSync(file,'utf8').replace(/^#target.*\n/,'').replace(/jzUI\(thisObj\);\s*\}\)\(this\);\s*$/,'thisObj.test={plan:jzMakePlan,data:JZ_DATA,semantic:fsrSemantic};})(this);').replace('semantic:fsrSemantic',file.includes('before-phase3')?'semantic:null':'semantic:fsrSemantic'),env.ctx);return env.ctx.test;}
const ae=loadAE('JIZURA_AE.jsx');
for(const text of ['sky road','声上げ続けて','ふらつく影を支え合いながら','天空 未來','하늘 함께'])assert.strictEqual(JSON.stringify(ae.semantic(ae.data.styles.futureSkyRoad,text)),JSON.stringify(analyze(text)));
let aeUnchanged=0;
if(fs.existsSync('/tmp/jizura-ae-before-phase3.jsx')){
 const before=loadAE('/tmp/jizura-ae-before-phase3.jsx');
 for(const style of J.STYLE_ORDER.filter(s=>s!=='futureSkyRoad'))for(const seed of [1,7,42]){
  const o={style,seed,lyrics:'sky road together\n声上げ続けて\n[interlude 4]\n今日も生きる',width:1920,height:1080,fps:24,bpm:100,extra:true,offset:0.4,lineScale:1,fx:{motion:0.7,glitch:0.5,chroma:0.5,decor:0.5,density:0.5,texture:0.5,bgSwitch:0.35}};
  assert.strictEqual(JSON.stringify(ae.plan(o)),JSON.stringify(before.plan(o)),style+' AE regression');aeUnchanged++;
 }
}
const report={plans,stats,repetition:{repeats,unpenalized,pairs},aeUnchanged};
fs.writeFileSync('/tmp/jizura-phase3-statistics.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
