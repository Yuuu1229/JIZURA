/* Future Sky Road Phase 3: local, probabilistic lyric tags. */
(() => {
'use strict';
const st = J.STYLES.futureSkyRoad;
// Multipliers, not forced selections. Aliases cover Japanese, English, simplified /
// traditional Chinese and Korean; this deliberately is not a language model.
st.lyricRules = [
 {tag:'sky', words:['空','sky','cloud','clouds','future','未来','未來','光','blue','tomorrow','明天','天空','云','雲','하늘','미래','빛','내일','구름'], weights:{layout:{fsrOpenSky:3},decor:{fsrCloudHaze:2.8,fsrHorizonGlow:2.5},hold:{fsrRise:2.6},cam:{fsrHorizon:2.3,push:1.4}}},
 {tag:'journey', words:['道','一本道','走','進','进','road','roads','run','running','journey','move','moving','forward','길','달리','달려','앞으로'], weights:{layout:{fsrParallelJourney:3},decor:{fsrRoadLines:3.2,fsrWindTrails:2.5},hold:{fsrTravel:2.8},cam:{fsrHorizon:2.3,push:1.4}}},
 {tag:'together', words:['肩','並べ','支え','一緒','together','shoulder','side by side','support','一起','并肩','並肩','扶持','함께','나란히','어깨','기대'], weights:{layout:{fsrTwinBalance:3},decor:{fsrTwinShadows:3},hold:{fsrTwinSway:2.6},enter:{fadeStagger:1.6}}},
 {tag:'shadow', words:['影','ふらつく','shadow','shadows','sway','unstable','摇晃','搖晃','그림자','흔들'], weights:{layout:{fsrDriftingMemory:2.4},decor:{fsrTwinShadows:2.8},hold:{fsrTwinSway:2.8}}},
 {tag:'blur', words:['滲','涙','泣','memory','memories','blur','tears','泪','淚','模糊','回忆','回憶','눈물','흐릿','기억'], weights:{layout:{fsrDriftingMemory:2.6},decor:{fsrDiffuseBleed:3,fsrCloudHaze:1.8},enter:{fsrSoftIn:1.5},exit:{blur:2.2,dissolve:2,fsrSoftOut:1.3}}},
 {tag:'voice', words:['声','聲','叫','歌','voice','sing','singing','shout','목소리','노래','외치'], weights:{layout:{fsrDriftingMemory:1.5,fsrOpenSky:1.8},decor:{fsrWindTrails:3},hold:{fsrRise:2.6},enter:{fadeStagger:1.4}}},
 {tag:'ground', words:['跪','生きる','疲','ground','survive','survival','live','alive','活着','活著','지친','살아','무릎'], weights:{layout:{fsrLowGround:3.2},decor:{fsrHorizonGlow:2.5},hold:{still:3,breathe:1.5},cam:{fsrHorizon:1.5}}},
 {tag:'wear', words:['pride','錆','過去','old','rust','rusty','memory','memories','过去','锈','鏽','옛','녹슨','과거','기억'], weights:{layout:{fsrDriftingMemory:3},decor:{fsrDiffuseBleed:2},hold:{still:1.8},treat:{softShadow:1.8},exit:{fsrSoftOut:1.5}}},
];
st.recentDecorWeight = 0.15;
st.parts.hold.push('fsrTwinSway');
J.register('hold','fsrTwinSway',{
 name:'ふたりの揺らぎ',tags:['calm','emotional'],styleOnly:'futureSkyRoad',w:0.65,ae:'drift',
 apply(env,it,amt){
  const phase=(it.mi||0)*0.18,t=env.lt*0.65,m=env.fx.motion*amt;
  it.x+=env.W*0.005*m*Math.sin(t+phase);
  it.y+=env.H*0.003*m*Math.sin(t*0.8+phase);
 },
},'futureSkyRoad');
})();
