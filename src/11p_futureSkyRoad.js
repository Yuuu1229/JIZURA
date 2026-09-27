/* Future Sky Road — quiet typography, a pale horizon and two paths forward.
   All drawing uses the normal JIZURA layout/background pipeline. */
(() => {
'use strict';
const key = 'futureSkyRoad';
const scheme = (bg, fg, sub, accent, accent2) => ({ bg, fg, sub, accent, accent2,
  ink: fg, dim: J.mix(bg, sub, 0.12), ghostA: J.mix(bg, accent, 0.3), ghostB: J.mix(bg, accent2, 0.24) });
J.STYLES[key] = {
  name: 'Future Sky Road', desc: '淡い空とふたりの道。余白、静かな風、ほろ苦い希望。穏やかな演出に絞ったスタイル。',
  moods: ['calm', 'emotional'],
  schemes: [
    scheme('#EDF2F1', '#40585F', '#82999E', '#83B6BD', '#B7BECF'),
    scheme('#E4ECEF', '#40535F', '#879AA6', '#91B8C6', '#B4C8C4'),
    scheme('#F5F2ED', '#52616A', '#9BA5AA', '#A1BFBD', '#D7BDC6'),
  ],
  fonts: { display: ['gothic_med'], serif: ['gothic_med'], body: ['gothic_light'], mono: ['mono'] },
  texture: { grain: 0.18, paper: 0, scan: 0 }, ghost: 0.12, glow: 0, hud: false,
  bias: { layout: { fsrPoem: 1 }, enter: { fadeStagger: 2, blur: 1 },
    exit: { blur: 2, dissolve: 0.7 }, cam: { push: 1, driftDiag: 1 }, treat: { softShadow: 1 } },
  decor: {},
  // Opt-in profile: other styles retain their original pools and effect values.
  // Per-cut manual choices still work; explicitly disabled techniques stay off.
  parts: { layout: ['fsrPoem'], enter: ['cut', 'blur', 'fadeStagger'],
    hold: ['still', 'drift', 'breathe'], exit: ['cut', 'blur', 'dissolve'],
    decor: [], treat: ['none', 'softShadow'], bg: ['none', 'fsrSkyRoad'],
    cam: ['push', 'driftDiag'], fx: [], trans: [] },
  background: 'fsrSkyRoad',
  fxMax: { motion: 0.38, glitch: 0, chroma: 0.12, decor: 0.25, density: 0.2, texture: 0.3, bgSwitch: 0.12 },
  fxFixed: { flash: false, hud: 'off', koma: 0, onTwos: false },
};
J.STYLE_ORDER.push(key);

J.register('layout', 'fsrPoem', {
  name: '空の余白', tags: ['calm', 'emotional'], styleOnly: key, ae: 'center', w: 1,
  fits: n => n > 0, treat: 'safe',
  plan: (rng, cut, st) => ({ font: rng.pick(st.fonts.display), x: rng.pick([0.44, 0.5, 0.56]),
    y: rng.pick([0.43, 0.48, 0.54]), track: rng.range(0.09, 0.14) }),
  render(env) {
    const { W, H, cut, sc } = env, P = cut.params;
    const text = J.splitLines(cut.text, W < H ? 9 : 18);
    const font = cut.emph ? 'gothic_bold' : P.font;
    const size = Math.min(Math.min(W, H) * 0.085,
      J.fitSize(text, font, W * 0.7, H * 0.32, { track: P.track, lead: 1.6 }));
    return J.mainDraw(env, { text, font, size, x: W * P.x, y: H * P.y,
      color: sc.fg, track: P.track, lead: 1.6 });
  },
}, key);

J.register('bg', 'fsrSkyRoad', {
  name: '未来の空と道', tags: ['calm', 'emotional'], styleOnly: key, ae: 'gradientSweep', subtle: true, w: 1,
  plan: rng => ({ seed: rng.int(1, 999999999), horizon: rng.range(0.69, 0.75), vanish: rng.range(0.46, 0.54) }),
  draw(env, P) {
    const { ctx, W, H, sc } = env, U = Math.min(W, H), t = env.t || 0;
    const motion = env.fx.motion || 0, vx = W * (P.vanish || 0.5), hy = H * (P.horizon || 0.72);
    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, J.mix(sc.bg, sc.accent, 0.32));
    sky.addColorStop(0.7, sc.bg);
    sky.addColorStop(1, J.mix(sc.bg, sc.accent2, 0.15));
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    // Broad mist, deliberately away from the text; no sharp cloud silhouettes.
    for (let i = 0; i < 3; i++) {
      const x = W * (0.18 + i * 0.32 + Math.sin(t * 0.055 + i) * 0.025 * motion);
      const y = H * (0.2 + i * 0.09), r = W * 0.38;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.15);
      const mist = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      mist.addColorStop(0, J.rgba(sc.bg, 0.65)); mist.addColorStop(1, J.rgba(sc.bg, 0));
      ctx.fillStyle = mist; ctx.fillRect(-r, -r, r * 2, r * 2); ctx.restore();
    }
    const glow = ctx.createLinearGradient(0, hy - H * 0.14, 0, hy + H * 0.14);
    glow.addColorStop(0, J.rgba(sc.accent2, 0)); glow.addColorStop(0.5, J.rgba(sc.accent2, 0.12)); glow.addColorStop(1, J.rgba(sc.accent2, 0));
    ctx.fillStyle = glow; ctx.fillRect(0, hy - H * 0.14, W, H * 0.28);
    // Two neighbouring paths: four very faint lines, not a wireframe grid.
    ctx.lineWidth = Math.max(0.7, U * 0.001); ctx.strokeStyle = J.rgba(sc.sub, 0.2);
    for (const side of [-1, 1]) for (const offset of [0, 0.016]) {
      ctx.beginPath(); ctx.moveTo(vx + side * W * 0.012, hy);
      ctx.lineTo(vx + side * W * (0.3 + offset), H * 1.03); ctx.stroke();
    }
    // Quiet lateral wind trails; sparse and always below the lyric zone.
    for (let i = 0; i < 5; i++) {
      const x = ((J.r(P.seed, i, 1) + t * 0.006 * motion) % 1) * W;
      const y = H * (0.79 + J.r(P.seed, i, 2) * 0.16);
      ctx.strokeStyle = J.rgba(sc.sub, 0.08); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + W * 0.045, y); ctx.stroke();
    }
    ctx.restore();
  },
}, key);
})();
