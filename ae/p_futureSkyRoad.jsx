// Future Sky Road: native AE counterparts, shared keys/parameters with the browser.
jzReg('layout', 'fsrPoem', {
    plan: function (rng, cut, st) { return { font: rng.pick(st.fonts.display), x: rng.pick([0.44, 0.5, 0.56]), y: rng.pick([0.43, 0.48, 0.54]), track: rng.range(0.09, 0.14) }; },
    build: function (ctx) {
        var text = jzSplitLines(ctx.cut.text, ctx.W < ctx.H ? 9 : 18), U = jzU(ctx);
        var L = jzMain(ctx, text, { font: ctx.cut.emph ? 'gothic_bold' : jzP(ctx, 'font', 'gothic_med'),
            size: U * 0.085, color: ctx.sc.fg, x: ctx.W * jzP(ctx, 'x', 0.5), y: ctx.H * jzP(ctx, 'y', 0.48),
            track: jzP(ctx, 'track', 0.11), maxW: ctx.W * 0.7, maxH: ctx.H * 0.32, maxSize: U * 0.085 });
        jzTextDoc(L, function (td) { td.autoLeading = false; td.leading = td.fontSize * 1.6; });
        jzFit(L, ctx.W * 0.7, ctx.H * 0.32, U * 0.085); jzAnchor(L);
        return jzBB(L);
    }
});

jzReg('bg', 'fsrSkyRoad', {
    plan: function (rng) { return { seed: rng.int(1, 999999999), horizon: rng.range(0.69, 0.75), vanish: rng.range(0.46, 0.54) }; },
    build: function (b, P) {
        var W = b.W, H = b.H, U = jzU(b), sc = b.sc, vx = W * (P.vanish || 0.5), hy = H * (P.horizon || 0.72);
        var motion = b.plan.fx.motion || 0, i, side, off;
        // Ramp plus a feathered lower tint approximates the browser's three-stop sky.
        var sky = bg1_solid(b, sc.bg, 'Future Sky Road - sky', W, H);
        var ramp = jzEffect(sky, 'ADBE Ramp', 'Pale sky');
        jzEP(ramp, 1, [W / 2, 0]); jzEP(ramp, 2, jzHex(jzMixHex(sc.bg, sc.accent, 0.32)));
        jzEP(ramp, 3, [W / 2, H * 0.7]); jzEP(ramp, 4, jzHex(sc.bg));
        var lower = bg1_solid(b, sc.accent2, 'Future Sky Road - horizon light', W, H);
        bg1_mask(lower, 0, hy - H * 0.025, W, hy + H * 0.025, { f: [0, H * 0.14] });
        jzXf(lower, 'ADBE Opacity').setValue(12);
        for (i = 0; i < 3; i++) {
            var mist = bg1_solid(b, sc.bg, 'Future Sky Road - mist ' + i, W * 2, H);
            bg1_mask(mist, W * 0.62, H * 0.48, W * 1.38, H * 0.52, { f: [W * 0.22, H * 0.055] });
            jzXf(mist, 'ADBE Opacity').setValue(40);
            jzSetExpr(jzXf(mist, 'ADBE Position'), bg1_hd(b) + '[' + jzN(W) + '*(' + jzN(0.18 + i * 0.32) + '+Math.sin(T*0.055+' + i + ')*0.025*' + jzN(motion) + '),' + jzN(H * (0.2 + i * 0.09)) + ']');
        }
        var road = jzShapeLayer(b, 'Future Sky Road - paired paths', 0, 0), group = jzGrp(road, 'paths');
        for (side = -1; side <= 1; side += 2) for (off = 0; off < 2; off++) {
            jzAddPath(group, [[vx + side * W * 0.012, hy], [vx + side * W * (0.3 + off * 0.016), H * 1.03]], false);
        }
        jzAddStroke(group, sc.sub, Math.max(0.7, U * 0.001)); jzXf(road, 'ADBE Opacity').setValue(20);
        for (i = 0; i < 5; i++) {
            var wind = jzShapeLayer(b, 'Future Sky Road - wind ' + i, 0, 0), wg = jzGrp(wind, 'trail');
            jzAddPath(wg, [[0, 0], [W * 0.045, 0]], false); jzAddStroke(wg, sc.sub, Math.max(0.7, U * 0.001));
            jzXf(wind, 'ADBE Opacity').setValue(8);
            jzSetExpr(jzXf(wind, 'ADBE Position'), bg1_hd(b) + '[wr(' + jzN(bg1_r(P.seed, i, 1)) + '+T*0.006*' + jzN(motion) + ',1)*' + jzN(W) + ',' + jzN(H * (0.79 + bg1_r(P.seed, i, 2) * 0.16)) + ']');
        }
    }
});
