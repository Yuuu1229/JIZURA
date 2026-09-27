# Future Sky Road

A quiet, youthful road-trip style: pale cyan/gray skies, distant mist, two paired paths, soft lateral travel and spacious Japanese sans-serif type. Three palettes include a restrained lavender or sunrise-pink secondary tint. It uses JIZURA's existing planner, text pipeline, ghosts, textures, motion, and exports.

## Use

Open an updated browser edition, choose **Advanced → Style → Future Sky Road**, then enter your lyrics and timing. You can select it manually even with **Include new effects** off. That switch controls whether Randomize may choose this additional style.

The style curates automatic picks to gentle fades/blur, drift/breathing, subtle shadow and slow cameras. It caps motion, chroma, density, texture and palette switching, disables flash/HUD/glitch events, and uses smooth frame timing. Saved slider values are preserved, so changing to another style restores their usual behavior. Manually disabled techniques remain disabled; per-cut manual replacements and font/color overrides remain available. Randomize retains the style's own font roles and palette when it chooses this style.

All Future Sky Road parts are excluded from other styles' automatic pools. Phase 2 uses `fsrSkyWash`, a sky-only background, with road lines as an optional decoration. Legacy `fsrPoem` and `fsrSkyRoad` remain registered for saved explicit selections. Backgrounds remain full-frame when **Keep the centre free** is enabled. Normal transparent foreground and color-key export behavior is inherited from JIZURA.

## Phase 3: lyric-aware weights

Future Sky Road now uses a local keyword dictionary for sky, journey, togetherness, shadow, blur, voice, ground and wear. Japanese, English, Chinese and Korean aliases change selection weights without forcing components. No external AI or semantic service is used. The same keyword matcher runs in the browser and AE; exported plans preserve their already-selected components. Existing seed-based reproducibility, manual overrides, disabled parts and locks remain intact. Re-roll the seed for another composition.

See [the Phase 3 evaluation](FUTURE_SKY_ROAD_PHASE3.md) for both test samples, detected tags, every changed weight and selected components. The Phase 2 manual fixture below remains available.

- `src/07c_lyric_weights.js`: shared ES3-compatible matching and bounded multiplier reduction, included by `build_ae.py`.
- `src/11p_futureSkyRoad3.js`: style-local dictionary, repetition tuning and Twin Sway.
- `ae/p_futureSkyRoad3.jsx`: native Twin Sway.
- Browser and AE planners multiply eligible candidates by the local semantic weights. Other styles have no rule table and use multiplier 1.
- Paired layouts preserve exactly two text groups for long English/Korean lines; text is never rewritten by the tagger.

Run `node dev/future_sky_semantics_test.js` for dictionary, stochastic distribution, repetition, override, shared-AE matcher and optional AE baseline tests. `dev/future_sky_phase2_test.js` also covers all five layouts with Japanese, English, Chinese and Korean text in seven aspect ratios. Unified composition mode may reuse section choices; explicit user composition controls take precedence over these probabilistic hints.

### Per-cut randomization

Both **Randomize this cut** and **Shuffle this cut** now use the existing planner's weighted pickers when Future Sky Road is active. Tags come from `cut.text`, not the full lyric line or neighboring cuts. Shuffle keeps its existing scope (layout, entrance, hold, exit, camera and transition); Randomize also includes decoration, treatment and background. The same style caps, semantic multipliers, eligibility and previous-shot novelty apply. No other style uses this path.

Explicit component-menu choices, line overrides and locked cuts stay pinned. Prior automatic reroll choices remain rerollable using the existing `cutQuiet` metadata. A later manual choice still wins and survives Save/Open. When alternatives exist the reroll rejects the current component combination; if everything is pinned or no alternative is enabled, the UI reports that no different automatic choice is available. Seeds for button presses remain random. No external service is used.

`node dev/future_sky_cut_reroll_test.js` checks sky, journey, shadow/togetherness and neutral lyrics, distributions for both actions, 1,600 successive nonidentical rerolls, disabled pools, manual overrides, save/open and neighboring-cut stability. `node dev/future_sky_cut_ui_test.js` clicks the real controls and checks that the new path is skipped for every other style (requires Playwright/Chrome).

## Phase 2: curated compositions

The five layouts are Open Sky, Parallel Journey, Twin Balance, Low Ground and Drifting Memory. Six independent decorations provide Road Lines, Horizon Glow, Soft Cloud Haze, Wind Trails, Twin Shadows and Diffuse Bleed. Soft entrances/exits, horizontal travel, upward rise and a slow horizon push reuse JIZURA's existing animation pipeline. Paired text groups have slightly staggered entrances.

Import `docs/examples/future-sky-road-phase2.jizura.json` for the seven-line demonstration. Assignments are explicit per-line overrides; the manual assignments take precedence over Phase 3 keyword weighting. Timing is illustrative, without audio.

| Lyric | Layout | Decorations |
| --- | --- | --- |
| 声上げ続けて | Open Sky, low-left | Wind Trails, Cloud Haze |
| 錆び付いた Pride | Drifting Memory, upper-right | Diffuse Bleed; layout includes a faint type echo |
| 捨ててけ | Low Ground, low-right | Wind Trails |
| 肩を並べ走った 一本道の | Parallel Journey | Road Lines, Wind Trails |
| 途中見上げた空が滲んで | Open Sky, low-right | Cloud Haze, Horizon Glow, Diffuse Bleed |
| ふらつく影を支え合いながら | Twin Balance | Twin Shadows, Diffuse Bleed |
| ただただ跪いて今日も生きる | Low Ground, low-left | Horizon Glow |

Road perspective occurs only in the fourth shot. Automatic selections have a low road-decoration weight but do not enforce sequence-level alternation; this demonstration evaluates manually curated visual language first.

## Source and compatibility

- `src/11p_futureSkyRoad.js`: style, curated part lists, effect limits, poetic layout and sky/road background.
- `src/11p_futureSkyRoad2.js`: Phase 2 layouts, independent decorations, sky-only background and soft motion; updates the existing style profile.
- `ae/p_futureSkyRoad2.jsx`: native Phase 2 components using matching IDs and layout parameters.
- `ae/p_futureSkyRoad.jsx`: native AE equivalents using the same IDs and parameters; atmospheric gradients/mist are approximated with AE ramps and feathered masks.
- `src/11q_sets.js` / `ae/05_reg.jsx`: optional style-scoped eligibility. Profiles opt in; old styles have no profile.
- Browser/AE planners: optional intensity limits and preferred background. Explicit per-cut overrides still take precedence.
- `tools/export_ae_data.js`: exports `styleOnly` metadata alongside existing metadata. Style profile fields are serialized with the style.

The project and AE JSON versions are unchanged. The style appears automatically in browser, ScriptUI and CEP selectors. No new rendering system, assets, fonts, or production dependencies are required. Rebuild browser pages, `ae/data.json`, both AE scripts and both CEP packages together when changing it.

## Verification

After `python3 build.py --dev`, run `node dev/future_sky_test.js` with Playwright available on Node's module path and Chrome installed. It checks seven aspect ratios, multiple seeds, optional unified/typeset modes, deterministic project round trips, absence of aggressive effects, disabled backgrounds, isolation from other styles and the actual English style picker. It writes landscape/portrait previews and an AE JSON example to `/tmp/jizura-future-sky` by default.

After `npm ci --prefix dev` and rebuilding AE:

```sh
node dev/ae_test.js /tmp/jizura-future-sky/future-sky-road.ae.json
node dev/ae_check.js --group layout --ids fsrPoem
node dev/ae_check.js --group bg --ids fsrSkyRoad
```

AE's mock checks validate construction and expressions; visual fidelity and playback still require real After Effects.

Phase 2 checks: `node dev/future_sky_phase2_test.js` verifies all seven explicit assignments, road isolation, project round trips, decoration visibility, and 1,050 multilingual layout frames across seven aspect ratios. The broader Future Sky Road suite rendered 2,632 frames across 42 plans. Existing-style regression comparison found no changes in 162 plans. AE mock validation completed 90 builds plus the demo JSON import with no warnings, expression errors, or import fallbacks. Browser export was decoded successfully as a 1920×1080, 24 fps H.264 video.
