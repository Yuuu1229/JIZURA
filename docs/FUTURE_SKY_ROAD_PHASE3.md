# Future Sky Road — Phase 3 evaluation

Both previews use seed 7 with only `single: true` line overrides. No component assignments or seed searching. The second sample is original test text, unrelated to the song.

Multipliers below modify selection weights, not probabilities directly. Final selection also applies eligibility, duration and novelty. Duplicate keywords count once per tag; combined boosts are capped at 3.2×. Unlisted components retain 1×. Decorations in the previous two shots receive 0.15×; the existing layout/motion novelty penalties also apply. Manual overrides and locks take precedence.

## Original seven lyrics

### 1. 声上げ続けて

**Detected:** voice.
**Matches:** voice: 声.
**Selected:** Parallel Journey; no decoration; Gentle Rise.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Drifting Memory | 1 | 1.5× | 1.5 |
| layout | Open Sky | 1 | 1.8× | 1.8 |
| decor | Wind Trails | 1 | 3× | 3 |
| hold | Gentle Rise | 1 | 2.6× | 2.6 |
| enter | Staggered Fade | 1 | 1.4× | 1.4 |

### 2. 錆び付いた Pride

**Detected:** wear.
**Matches:** wear: pride, 錆.
**Selected:** Twin Balance; Wind Trails; Horizontal Drift.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Drifting Memory | 1 | 3× | 3 |
| decor | Diffuse Bleed | 0.7 | 2× | 1.4 |
| hold | Still | 1 | 1.8× | 1.8 |
| treat | Soft Shadow | 1 | 1.8× | 1.8 |
| exit | Soft Departure | 3 | 1.5× | 4.5 |

### 3. 捨ててけ

**Detected:** none.
**Matches:** none.
**Selected:** Drifting Memory; Horizon Glow; Breathing.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| — | All components unchanged | — | 1× | — |

### 4. 肩を並べ走った 一本道の

**Detected:** journey, together.
**Matches:** journey: 道, 一本道, 走; together: 肩, 並べ.
**Selected:** Parallel Journey; Twin Shadows; Twin Sway.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Parallel Journey | 1 | 3× | 3 |
| layout | Twin Balance | 1 | 3× | 3 |
| decor | Road Lines | 0.35 | 3.2× | 1.12 |
| decor | Wind Trails | 1 | 2.5× | 2.5 |
| decor | Twin Shadows | 0.7 | 3× | 2.1 |
| hold | Horizontal Drift | 1 | 2.8× | 2.8 |
| hold | Twin Sway | 0.65 | 2.6× | 1.69 |
| cam | Slow Horizon Push | 2 | 2.3× | 4.6 |
| cam | Slow Push | 1 | 1.4× | 1.4 |
| enter | Staggered Fade | 1 | 1.6× | 1.6 |

### 5. 途中見上げた空が滲んで

**Detected:** sky, blur.
**Matches:** sky: 空; blur: 滲.
**Selected:** Open Sky; Soft Cloud Haze; Horizontal Drift.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Open Sky | 1 | 3× | 3 |
| layout | Drifting Memory | 1 | 2.6× | 2.6 |
| decor | Soft Cloud Haze | 1.3 | 3.2× | 4.16 |
| decor | Horizon Glow | 1 | 2.5× | 2.5 |
| decor | Diffuse Bleed | 0.7 | 3× | 2.1 |
| hold | Gentle Rise | 1 | 2.6× | 2.6 |
| cam | Slow Horizon Push | 2 | 2.3× | 4.6 |
| cam | Slow Push | 1 | 1.4× | 1.4 |
| enter | Soft Arrival | 3 | 1.5× | 4.5 |
| exit | Blur | 1 | 2.2× | 2.2 |
| exit | Dissolve | 0.5 | 2× | 1 |
| exit | Soft Departure | 3 | 1.3× | 3.9 |

### 6. ふらつく影を支え合いながら

**Detected:** together, shadow.
**Matches:** together: 支え; shadow: 影, ふらつく.
**Selected:** Low Ground; Horizon Glow; Gentle Rise.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Twin Balance | 1 | 3× | 3 |
| layout | Drifting Memory | 1 | 2.4× | 2.4 |
| decor | Twin Shadows | 0.7 | 3.2× | 2.24 |
| hold | Twin Sway | 0.65 | 3.2× | 2.08 |
| enter | Staggered Fade | 1 | 1.6× | 1.6 |

### 7. ただただ跪いて今日も生きる

**Detected:** ground.
**Matches:** ground: 跪, 生きる.
**Selected:** Low Ground; Wind Trails; Still.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Low Ground | 1 | 3.2× | 3.2 |
| decor | Horizon Glow | 1 | 2.5× | 2.5 |
| hold | Still | 1 | 3× | 3 |
| hold | Breathing | 0.7 | 1.5× | 1.05 |
| cam | Slow Horizon Push | 2 | 1.5× | 3 |

## Unrelated multilingual sample

### 1. Old letters wait beside my cup

**Detected:** wear.
**Matches:** wear: old.
**Selected:** Low Ground; no decoration; Gentle Rise.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Drifting Memory | 1 | 3× | 3 |
| decor | Diffuse Bleed | 0.7 | 2× | 1.4 |
| hold | Still | 1 | 1.8× | 1.8 |
| treat | Soft Shadow | 1 | 1.8× | 1.8 |
| exit | Soft Departure | 3 | 1.5× | 4.5 |

### 2. Tomorrow a blue sky opens

**Detected:** sky.
**Matches:** sky: sky, blue, tomorrow.
**Selected:** Open Sky; Soft Cloud Haze; Gentle Rise.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Open Sky | 1 | 3× | 3 |
| decor | Soft Cloud Haze | 1.3 | 2.8× | 3.64 |
| decor | Horizon Glow | 1 | 2.5× | 2.5 |
| hold | Gentle Rise | 1 | 2.6× | 2.6 |
| cam | Slow Horizon Push | 2 | 2.3× | 4.6 |
| cam | Slow Push | 1 | 1.4× | 1.4 |

### 3. We move along a nameless road

**Detected:** journey.
**Matches:** journey: road, move.
**Selected:** Twin Balance; Horizon Glow; Horizontal Drift.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Parallel Journey | 1 | 3× | 3 |
| decor | Road Lines | 0.35 | 3.2× | 1.12 |
| decor | Wind Trails | 1 | 2.5× | 2.5 |
| hold | Horizontal Drift | 1 | 2.8× | 2.8 |
| cam | Slow Horizon Push | 2 | 2.3× | 4.6 |
| cam | Slow Push | 1 | 1.4× | 1.4 |

### 4. Side by side we carry the rain

**Detected:** together.
**Matches:** together: side by side.
**Selected:** Twin Balance; Twin Shadows; Twin Sway.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Twin Balance | 1 | 3× | 3 |
| decor | Twin Shadows | 0.7 | 3× | 2.1 |
| hold | Twin Sway | 0.65 | 2.6× | 1.69 |
| enter | Staggered Fade | 1 | 1.6× | 1.6 |

### 5. 窗边的泪模糊了回忆

**Detected:** blur.
**Matches:** blur: 泪, 模糊, 回忆.
**Selected:** Parallel Journey; Soft Cloud Haze; Breathing.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Drifting Memory | 1 | 2.6× | 2.6 |
| decor | Diffuse Bleed | 0.7 | 3× | 2.1 |
| decor | Soft Cloud Haze | 1.3 | 1.8× | 2.34 |
| enter | Soft Arrival | 3 | 1.5× | 4.5 |
| exit | Blur | 1 | 2.2× | 2.2 |
| exit | Dissolve | 0.5 | 2× | 1 |
| exit | Soft Departure | 3 | 1.3× | 3.9 |

### 6. 바람에 노래하며 함께 걸어

**Detected:** together, voice.
**Matches:** together: 함께; voice: 노래.
**Selected:** Low Ground; Horizon Glow; Gentle Rise.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Twin Balance | 1 | 3× | 3 |
| layout | Drifting Memory | 1 | 1.5× | 1.5 |
| layout | Open Sky | 1 | 1.8× | 1.8 |
| decor | Twin Shadows | 0.7 | 3× | 2.1 |
| decor | Wind Trails | 1 | 3× | 3 |
| hold | Twin Sway | 0.65 | 2.6× | 1.69 |
| hold | Gentle Rise | 1 | 2.6× | 2.6 |
| enter | Staggered Fade | 1 | 2× | 2 |

### 7. 지친 무릎으로 오늘도 살아

**Detected:** ground.
**Matches:** ground: 지친, 살아, 무릎.
**Selected:** Drifting Memory; Wind Trails; Still.

| Group | Component | Base weight | Multiplier | Boosted weight |
| --- | --- | ---: | ---: | ---: |
| layout | Low Ground | 1 | 3.2× | 3.2 |
| decor | Horizon Glow | 1 | 2.5× | 2.5 |
| hold | Still | 1 | 3× | 3 |
| hold | Breathing | 0.7 | 1.5× | 1.05 |
| cam | Slow Horizon Push | 2 | 1.5× | 3 |

## Checks

6,700 distribution/repetition plans. Across 400 seeds per category every layout remains possible, and each favored layout and decoration is selected more often than with keyword weighting disabled. Adjacent decoration repeats: 33 with the new penalty versus 168 without it across 1,350 adjacent pairs.

Existing styles: 162 browser plans and 81 standalone AE plans match their pre-change baselines. AE uses the same ES3 matcher and exported rule table as the browser. Actual AE visual playback still requires After Effects.

A keyword dictionary cannot infer negation or metaphor. Neutral text keeps the normal style pool. The primary seed-7 preview happens to repeat Low Ground in shots 6–7 and picks no Road Lines; those outcomes are allowed, not manually corrected.

Browser verification: 2,632 frames across 42 integration plans plus 1,050 multilingual layout frames across seven aspect ratios, all passing. The 1080p/24 fps H.264 preview decoded successfully without browser warnings. AE construction/expression suite: 90 builds and one browser JSON import, no errors or fallbacks; paired layouts and Twin Sway also pass individual checks.
