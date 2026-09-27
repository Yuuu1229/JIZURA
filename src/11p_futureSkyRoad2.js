/* Future Sky Road, Phase 2. Curated visual vocabulary; no lyric keyword detection.
   The Phase 1 parts remain registered for saved manual picks. */
(() => {
'use strict';
const K = 'futureSkyRoad', st = J.STYLES[K];
const reg = (g, k, d) => J.register(g, k, Object.assign({ tags: ['calm', 'emotional'], styleOnly: K, w: 1 }, d), K);
const layouts = ['fsrOpenSky', 'fsrParallelJourney', 'fsrTwinBalance', 'fsrLowGround', 'fsrDriftingMemory'];
const decors = ['fsrRoadLines', 'fsrHorizonGlow', 'fsrCloudHaze', 'fsrWindTrails', 'fsrTwinShadows', 'fsrDiffuseBleed'];
st.parts.layout = layouts;
st.parts.bg = ['none', 'fsrSkyWash']; st.background = 'fsrSkyWash';
st.parts.decor = decors;
st.parts.enter = ['fsrSoftIn', 'fadeStagger']; st.parts.exit = ['fsrSoftOut', 'blur', 'dissolve'];
st.parts.hold = ['still', 'fsrTravel', 'fsrRise', 'breathe'];
st.parts.cam = ['fsrHorizon', 'push', 'driftDiag'];
st.bias.layout = Object.fromEntries(layouts.map(k => [k, 1]));
st.bias.enter = { fsrSoftIn: 3, fadeStagger: 1 }; st.bias.exit = { fsrSoftOut: 3, blur: 1, dissolve: 0.5 };
st.bias.cam = { fsrHorizon: 2, push: 1, driftDiag: 0.7 };
st.decor = { fsrCloudHaze: 1.3, fsrWindTrails: 1, fsrHorizonGlow: 1, fsrRoadLines: 0.35, fsrTwinShadows: 0.7, fsrDiffuseBleed: 0.7 };

// Split by a user-authored space, otherwise balance existing text line breaking.
// This is typesetting, not semantic matching; nothing examines lyric keywords.
const split = text => {
  const words = text.trim().split(/\s+/);
  if (words.length > 1) {
    let best = 1, distance = Infinity;
    for (let i = 1; i < words.length; i++) {
      const d = Math.abs(J.glyphCount(words.slice(0,i).join(' ')) - J.glyphCount(words.slice(i).join(' ')));
      if (d < distance) { best = i; distance = d; }
    }
    return [words.slice(0,best).join(' '), words.slice(best).join(' ')];
  }
  const n = J.glyphCount(text);
  if (n < 2) return [text];
  const lines = J.splitLines(text, Math.ceil(n / 2)).split('\n');
  if (lines.length <= 2) return lines;
  const mid = Math.ceil(lines.length / 2);
  return [lines.slice(0,mid).join(''), lines.slice(mid).join('')];
};
function recipe(kind, rng, cut, style) {
  const right = rng.chance(0.5), port = cut.H > cut.W;
  const font = rng.pick(style.fonts.display), track = rng.range(0.09, 0.13);
  const item = (text, x, y, w, h, size, align = 'left', mi = 0, rot = 0) => ({ text, x, y, w, h, size, align, mi, rot, track });
  let items;
  if (kind === 'fsrOpenSky') {
    items = [item(J.splitLines(cut.text, port ? 8 : 18), right ? 0.86 : 0.14, right ? 0.72 : 0.64, 0.7, 0.25, 0.071, right ? 'right' : 'left')];
  } else if (kind === 'fsrLowGround') {
    items = [item(J.splitLines(cut.text, port ? 8 : 12), right ? 0.84 : 0.16, 0.78, 0.68, 0.25, 0.066, right ? 'right' : 'left')];
    items[0].track = 0.065;
  } else if (kind === 'fsrDriftingMemory') {
    items = [item(J.splitLines(cut.text, port ? 8 : 17), right ? 0.84 : 0.16, right ? 0.37 : 0.43, 0.66, 0.3, 0.073, right ? 'right' : 'left')];
    items[0].track = 0.15; items[0].memory = true;
  } else {
    const parts = split(cut.text);
    items = parts.map((t, i) => kind === 'fsrParallelJourney'
      ? item(J.splitLines(t, port ? 7 : 13), i ? 0.27 : 0.17, i ? 0.62 : 0.4, 0.58, 0.17, 0.069, 'left', i * 4, -1.2)
      : item(J.splitLines(t, port ? 6 : 11), i ? 0.59 : 0.37, i ? 0.59 : 0.42, port ? 0.61 : 0.47, 0.18, 0.068, 'center', i * 4, i ? -1.0 : 1.3));
  }
  return { font, right, items };
}
const names = ['ひらけた空', '並んで進む道', '支え合う文字', '低い地平', '漂う記憶'];
layouts.forEach((kind, i) => reg('layout', kind, {
  name: names[i], ae: 'center', fits: n => n > 0, treat: 'safe',
  plan: (rng, cut, style) => recipe(kind, rng, cut, style),
  render(env) {
    const { W, H, cut, sc } = env, P = cut.params, U = Math.min(W, H);
    let bb = null;
    if (kind === 'fsrParallelJourney') {
      const a = J.E.inOutSine(J.clamp(env.lt / 0.8)) * (1 - J.E.inOutSine(env.pOut));
      [[0.13, 0.47, 0.76], [0.23, 0.69, 0.86]].forEach(([x, y, x2]) => env.line([[W*x,H*y],[W*x2,H*y-H*0.015]], sc.sub, U*0.0008, 0.19*a, false));
    }
    for (const p of P.items || []) {
      const font = cut.emph ? 'gothic_bold' : P.font;
      const size = Math.min(U*p.size, J.fitSize(p.text, font, W*p.w, H*p.h, {track:p.track,lead:1.65}));
      const it = { text:p.text, font, size, x:W*p.x, y:H*p.y, track:p.track, lead:1.65,
        align:p.align, mi:p.mi, rot:p.rot, color:sc.fg };
      if (p.memory && env.pass === 'main') J.mainDraw(env, Object.assign({}, it, {
        x:it.x-W*0.014, y:it.y+H*0.026, alpha:0.065, blur:U*0.003, color:sc.sub, plain:true, ghost:false }));
      bb = J.unionBB(bb, J.mainDraw(env, it));
    }
    return bb;
  },
}));

reg('bg', 'fsrSkyWash', {
  name:'淡い空', subtle:true, ae:'gradientSweep',
  draw({ctx,W,H,sc}) {
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,J.mix(sc.bg,sc.accent,0.32));g.addColorStop(0.7,sc.bg);g.addColorStop(1,J.mix(sc.bg,sc.accent2,0.15));
    ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
  },
});
// Bounded radial washes, no image assets or per-frame canvas allocation.
function haze(env,x,y,rx,ry,color,alpha,rot=0) {
  const c=env.ctx;c.save();c.translate(x,y);c.rotate(rot);c.scale(rx,ry);
  const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,J.rgba(color,alpha));g.addColorStop(0.48,J.rgba(color,alpha*0.48));g.addColorStop(1,J.rgba(color,0));
  c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore();
}
const decorNames=['道の線','地平の光','薄い雲','風の軌跡','ふたりの影','淡い滲み'];
decors.forEach((kind,i)=>reg('decor',kind,{
  name:decorNames[i],layer:'back',subtle:true,ae:'blobs',
  draw(env,bb,P) {
    if(env.pass!=='main')return;
    const {ctx:c,W,H,sc}=env,U=Math.min(W,H),m=env.fx.motion||0;
    const a=J.E.inOutSine(J.clamp(env.lt/0.85))*(1-J.E.inOutSine(env.pOut));
    const t=env.ltb||env.lt, flow=Math.sin(t*0.24)*W*0.018*m;
    c.save();c.globalAlpha*=a;
    if(kind==='fsrRoadLines') {
      const vx=W*0.56,hy=H*0.72;
      c.strokeStyle=J.rgba(sc.sub,0.3);c.lineWidth=U*0.0012;
      for(const side of [-1,1])for(const off of [0,0.019]){c.beginPath();c.moveTo(vx+side*W*0.008,hy);c.lineTo(vx+side*W*(0.29+off),H*1.04);c.stroke();}
    } else if(kind==='fsrHorizonGlow') {
      haze(env,W*0.55,H*0.77,W*0.7,H*0.09,sc.accent2,0.27);
      haze(env,W*0.55,H*0.75,W*0.56,H*0.033,J.mix(sc.bg,'#FFFFFF',0.6),0.55);
    } else if(kind==='fsrCloudHaze') {
      for(let j=0;j<3;j++){
        const x=W*([0.16,0.49,0.81][j])+flow,y=H*([0.21,0.28,0.18][j]);
        haze(env,x,y+H*0.04,W*0.18,H*0.046,sc.sub,0.055);
        haze(env,x,y,W*(0.18+j%2*0.02),H*(0.07+j%2*0.015),J.mix(sc.bg,'#FFFFFF',0.72),0.72);
      }
    } else if(kind==='fsrWindTrails') {
      c.strokeStyle=J.rgba(sc.sub,0.2);c.lineWidth=U*0.0008;
      for(let j=0;j<4;j++){
        const x=W*(0.05+j*0.18)+flow,y=H*([0.29,0.32,0.82,0.85][j]);
        c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+W*0.08,y-H*0.018,x+W*0.19,y+H*0.014,x+W*0.29,y-H*0.006);c.stroke();
      }
    } else if(kind==='fsrTwinShadows') {
      const d=Math.sin(t*0.4)*W*0.008*m;
      haze(env,W*0.46+d,H*0.54,W*0.033,H*0.17,sc.sub,0.23,-0.36);
      haze(env,W*0.54+d,H*0.6,W*0.033,H*0.16,sc.accent,0.26,0.28);
    } else if(kind==='fsrDiffuseBleed') {
      const grow=1+J.E.inOutSine(J.clamp(t/Math.max(0.1,env.cut.dur)))*0.15*m;
      for(let j=0;j<4;j++)haze(env,W*(0.38+j*0.09),H*(0.57+j%2*0.09),W*0.13*grow,H*0.09*grow,j%2?sc.accent2:sc.accent,0.105);
    }
    c.restore();
  },
}));
reg('enter','fsrSoftIn',{
  name:'そっと現れる',ae:'blur',inDur:dur=>Math.min(0.85,dur*0.36),
  apply(env,it,p){const e=J.E.inOutSine(p);it.alpha=(it.alpha??1)*e;it.y+=(1-e)*env.H*0.014;it.blur=(it.blur||0)+(1-e)*5;},
});
reg('exit','fsrSoftOut',{
  name:'静かにほどける',ae:'blur',outDur:dur=>Math.min(0.7,dur*0.3),
  apply(env,it,p){const e=J.E.inOutSine(p);it.alpha=(it.alpha??1)*(1-e);it.blur=(it.blur||0)+e*7;},
});
reg('hold','fsrTravel',{
  name:'静かな横移動',ae:'drift',
  apply(env,it,amt){it.x+=env.W*0.018*env.fx.motion*J.clamp(env.lt/env.cut.dur)*amt;},
});
reg('hold','fsrRise',{
  name:'ゆっくり見上げる',ae:'drift',
  apply(env,it,amt){it.y-=env.H*0.022*env.fx.motion*J.clamp(env.lt/env.cut.dur)*amt;},
});
reg('cam','fsrHorizon',{
  name:'地平へ寄る',ae:'push',
  get(env){const u=J.E.inOutSine(J.clamp(env.lt/env.cut.dur)),m=env.fx.motion||0;return{s:1+0.035*m*u,y:-env.H*0.007*m*u};},
});
})();
