---
name: Dan Bierre
description: I build with code and edit with intent. A gallery index for generative work, screened like shoji, with a spine and two accents from Dan's own world.
colors:
  ground: "#141414"
  ink-light: "#ecebe7"
  surface: "#1e1e1d"
  text-muted: "#9d9b95"
  border: "#2e2e2c"
  lattice: "rgb(236 235 231 / 0.06)"
  spine-line: "rgb(236 235 231 / 0.45)"
  error: "#ff8f80"
  gold: "#c9a24f"
  rust: "#c8613a"
  washi: "#d8d7d2"
  washi-surface: "#ebe8e1"
  washi-muted: "#4a4843"
  washi-border: "#b9b5ab"
  washi-lattice: "rgb(20 20 20 / 0.07)"
  washi-error: "#8f1f15"
  washi-gold: "#6b4c0f"
  washi-rust: "#8a3c21"
  light-ground: "#f4f1ea"
  light-ink: "#1b1b1a"
  light-surface: "#ffffff"
  light-muted: "#6f6a60"
  light-border: "#d9d4c8"
  light-lattice: "rgb(27 27 26 / 0.06)"
  light-error: "#a3261b"
  light-gold: "#8a6316"
  light-rust: "#8a3c21"
  light-band: "#1b1b1a"
  light-band-ink: "#efece4"
  light-band-surface: "#262624"
  light-band-muted: "#a8a59d"
  light-band-border: "#3a3935"
typography:
  statement:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 0.9rem + 6.4vw, 7.5rem)"
    fontWeight: 430
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  display:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 6vw, 6.5rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.4vw, 4.6rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.12rem + 0.4vw, 1.45rem)"
    fontWeight: 480
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Hanken Grotesk Variable', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem)"
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', ui-serif, serif"
    fontWeight: 500
    letterSpacing: "0"
  spine:
    fontFamily: "'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', ui-serif, serif"
    fontSize: "clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem)"
    lineHeight: 1.3
    letterSpacing: "0.2em"
  data:
    fontFamily: "'Geist Mono Variable', ui-monospace, monospace"
    fontSize: "0.95em"
    fontWeight: 400
rounded:
  media: "4px"
  field: "6px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  s: "0.75rem"
  m: "1.25rem"
  l: "2rem"
  xl: "clamp(3rem, 2rem + 4vw, 5rem)"
  2xl: "clamp(5rem, 3rem + 8vw, 10rem)"
  gutter: "clamp(1rem, 0.5rem + 2.2vw, 2.5rem)"
  kumiko: "clamp(2.5rem, 1.5rem + 3vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink-light}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "0.6em 1.35em"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
  button-primary-washi:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.pill}"
  button-primary-light:
    backgroundColor: "{colors.light-ink}"
    textColor: "{colors.light-ground}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.pill}"
    padding: "0.6em 1.35em"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink-light}"
    textColor: "{colors.ground}"
  button-nav:
    backgroundColor: "{colors.ink-light}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.35em 1em"
    height: "2.25rem"
  nav-switch:
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.field}"
    padding: "0.6em 0.8em"
    height: "2.75rem"
  input-washi:
    backgroundColor: "{colors.washi-surface}"
    textColor: "{colors.ground}"
    rounded: "{rounded.field}"
  work-row-reveal:
    backgroundColor: "{colors.ground}"
    width: "min(22rem, 22vw)"
  spine-mark:
    textColor: "{colors.text-muted}"
    typography: "{typography.spine}"
  process-numeral:
    textColor: "{colors.gold}"
    typography: "{typography.numeral}"
  enso-portrait:
    textColor: "{colors.rust}"
    rounded: "{rounded.pill}"
    width: "min(100%, 20rem)"
---

# Design System: Dan Bierre

## Overview

**Creative North Star: "The Screened Gallery Index"**

A collectible-design catalogue for generative work, read through shoji. The default ground is near-black; flat light-grey bands interrupt it as backlit washi: paper with fibre texture and a soft light behind it. Over everything runs a kumiko lattice of faint hairlines at a fixed module, and down the left edge of each section runs a spine: a continuous vertical line carrying a vertical Japanese label and a dot, as on Dan's live site. A light theme (the live site's warm paper and ink) is available from the nav; there the bands invert into dark screens between light rooms. Dark stays the default.

Type does the composing. One neo-grotesk, Hanken Grotesk, runs from a giant ragged statement at the top of the page down to 12-13px lowercase labels, with almost nothing in between: the contrast in scale is the hierarchy. A second, quieter voice, Shippori Mincho, sets only numerals and counts, as in Dan's app Shoji. Hairlines carry a label at each end, buttons are pills, and Geist Mono appears only where pipeline data is printed. Two accents come from Dan's own world and each has exactly one job: gold marks key words, rust marks what is live now. Everything else is two inks, and the work's colour stays withheld until hover or focus.

Motion is about revealing things. The hero headline develops out of displacement noise as if seen through paper, the hero footage slides open like a shoji door, and each work row opens a two-panel screen showing the piece and how it was made. Everything is visible by default, and every motion is skipped under reduced motion. The whole page exists in English and Japanese (`/ja`), and Japanese is set by its own rules rather than by the Latin ones.

**Key Characteristics:**
- Near-black ground (#141414) with washi bands (#d8d7d2); a light theme (#f4f1ea / #1b1b1a) with inverted dark bands.
- Two inks plus two single-purpose accents: gold for key words, rust for live/now.
- One grotesk at extreme scale contrast, a Mincho for numerals, mono only for data.
- Kumiko lattice at the `--kumiko` module and a section spine with Japanese labels (desktop).
- Pills for actions, hairlines for structure, 1:1 frames made of two 1:2 shoji panels for media.
- Work is grayscale at rest and turns to colour on hover or focus.

## Colors

Two inks on two grounds (night and paper, or paper and night in the light theme), with two narrow accents and the rest of the colour supplied by the imagery.

### Primary
- **Gallery Night** (ground): the page ground in the default theme, and the dark ink on washi bands and dark-pill buttons.
- **Bone Ink** (ink-light): all primary text on the dark ground, the primary pill fill, the selection highlight, and the focus ring.

### Secondary
- **Kintsugi Gold** (gold): key words only. The two "with"s in the hero line and the process numerals. 7.7:1 on night; it darkens to **Deep Gold** (washi-gold, 5.5:1) on washi and **Ochre Ink** (light-gold, 4.8:1) in the light theme.

### Tertiary
- **Now Rust** (rust): live/now markers only. The hero live-status diamond, the contact availability diamond, the spine's "now" diamond, and the brush ensō around the portrait. 4.6:1 on night; **Fired Rust** (washi-rust / light-rust) on paper grounds.

### Neutral
- **Lifted Night** (surface): media frames before load, form fields on the dark ground.
- **Ash Label** (text-muted): labels, nav links and switches at rest, spine labels, secondary copy. 6.6:1 on the ground.
- **Hairline Night** (border): row rules, proof-strip hairlines, field strokes.
- **Kumiko Ghost** (lattice): lattice hairlines at 6% ink.
- **Spine Line** (spine-line): the spine at 45% ink, redefined per scope so it always reads against its ground.
- **Signal Coral** (error): form error text on the dark ground (8.3:1). A state colour, not an accent.

### Washi band scope
The `.band` scope redefines the same token names, so every component inside a band flips automatically. Never hard-code band colours in a component.
- **Backlit Washi** (washi): band ground, under a white radial inner light (`rgb(255 255 255 / 0.16)`) and the vector fibre texture `public/textures/washi.svg`.
- **Paper Surface** (washi-surface), **Sumi Muted** (washi-muted, 6.4:1), **Paper Hairline** (washi-border), **Paper Kumiko** (washi-lattice), **Oxide** (washi-error, 6.2:1).

### Light theme scope
`:root[data-theme='light']` redefines the root tokens from the live site's palette: **Live Paper** (light-ground), **Live Ink** (light-ink, 15.3:1), white surface, **Warm Ash** (light-muted, 4.8:1), **Paper Rule** (light-border), and **Brick** (light-error, 6.5:1). Inside it, `.band` becomes a dark screen (light-band, light-band-ink, light-band-surface, light-band-muted, light-band-border) with the night accents and **no washi texture or inner light**.

### Named Rules
**The Two Accents Rule.** Gold marks key words; rust marks what is live now. Neither is ever a fill, a button, a link colour, or decoration, and no third hue joins them. If a gold or rust element does not point at a key word or a live state, it is wrong.

**The Colour Comes From the Work Rule.** Beyond the two accents the interface is two inks. Thumbnails and footage are grayscale at rest (`filter: grayscale(1)`) and turn to colour on hover or focus.

**The Scoped Inversion Rule.** Bands and themes invert by redefining tokens (`--bg`, `--text`, `--btn-bg`, `--gold`, `--rust`, `--spine-line`, ...) on `.band` and `:root[data-theme='light']`, never by per-component overrides. Buttons always invert against their ground.

**The Documented Overlay Exception.** These literal colours are sanctioned, each for legibility over imagery, not as palette: the before/after slider's handle and labels (`#fff` with `rgb(0 0 0 / 0.25)` and `rgb(0 0 0 / 0.55)`), and the hero screen's centre divide (`rgb(20 20 20 / 0.85)`). The hero's kumiko overlay locally raises `--lattice` to `rgb(236 235 231 / 0.22)` with a matching 1px inset frame, and the pause toggle sits on `rgb(20 20 20 / 0.7)` with a `rgb(236 235 231 / 0.3)` stroke and `#ecebe7` text, always light in both themes because it sits on the footage. These are sanctioned exceptions, not drift.

## Typography

**Display Font:** Hanken Grotesk Variable (Japanese falls to Hiragino Sans, Yu Gothic UI, Meiryo)
**Body Font:** Hanken Grotesk Variable (same Japanese fallbacks)
**Numeral Font:** Shippori Mincho, latin subset at 500 only (Japanese spine labels fall to Hiragino Mincho ProN / Yu Mincho)
**Mono Font:** Geist Mono Variable, pipeline data values only

**Character:** A single Swiss-leaning neo-grotesk, set with tight tracking at large sizes and plain lowercase at small ones, with a brushed Mincho for numbers. The mono is evidence, not decoration. Japanese uses system faces for speed.

### Hierarchy
- **Statement** (430, up to 7.5rem, 0.9, -0.04em): the hero sentence only, ragged lines with a 2.6em indent leaving a gap for the note.
- **Display** (440, step-5, 0.95, -0.04em): page h1s.
- **Headline** (440, step-4, 0.95, -0.04em): section h2s, work-row titles, mobile menu links.
- **Title** (480, step-1, 1.15, -0.02em): h3s, process item heads. Service heads step up to step-3 at -0.04em.
- **Body** (400, step-0, 1.5): running text at a 62ch measure; `text-wrap: pretty`.
- **Label** (450, step--1 ≈ 12.5-13.4px, 0.01em, lowercase): metadata, end labels, nav links, captions.
- **Numeral** (Shippori Mincho 500, tracking 0): process numerals (step-3, gold), lab indices, and every bracket count.
- **Spine** (Mincho, step--1, 1.3, 0.2em, vertical-rl): the Japanese section labels.
- **Data** (Geist Mono, 0.95em): pipeline values.
- **Footer mark** (430, min(18vw, 22rem), 0.8, -0.04em, lowercase): the closing wordmark, once per page.

### Japanese
`:lang(ja)` sets `line-break: strict` and `word-break: auto-phrase`. Japanese headings drop to letter-spacing 0, line-height 1.2 (the hero 1.1), weight 600. The Japanese hero uses a smaller size (clamp(2.2rem, 0.8rem + 5vw, 5.5rem)) so each line holds. All copy lives in `src/i18n/ui.ts`.

### Named Rules
**The Two Voices Rule.** Text is either very large or label-sized. Avoid the middle of the scale; when in doubt, go bigger or drop to a label.

**The Tracking Floor Rule.** Display tracking never goes tighter than -0.04em, at any size, including the statement and footer mark. Japanese is never negatively tracked.

**The Label Floor Rule.** Labels are lowercase, muted, and never below 12px (the `--step--1` minimum, 0.78rem).

**The Serif Is Numerals Rule.** Shippori Mincho sets numerals, counts, and the spine's Japanese labels, nothing else. Only the latin 500 subset is loaded.

**The Bracket Count Rule.** Counts appear as superscript brackets after a heading or nav link (`.count`, 0.32em, `[n]`, in the Mincho). They count real things.

**The Mono Is Data Rule.** Geist Mono is reserved for machine values in the pipeline readout and case-study specs.

**The Clean Separator Rule.** Inline lists join with a middle dot that sits in the gap before each item and is clipped whenever that item starts a line, so a dot never leads or trails a line in either language. Never type " · " into wrapping copy.

## Layout

Content sits in a full-width wrap (max 100rem) with a fluid gutter (1-2.5rem). The hero uses a 12-column grid: the statement spans the full width and sits at the bottom of the first viewport, with the screened footage frame off-centre at the top right (height min(44svh, 34rem)). On narrow screens the frame falls into the flow at 62% width aligned right, the indent collapses, and the note drops below the headline.

The kumiko module (`--kumiko`, 2.5-4.5rem) is the structural unit. `.lattice` draws 1:2 cells at the module; `.lattice-field` draws a section-scale grid (2× module wide, 4× tall) offset by the gutter so the lines align with the content edge.

From 64em, spined sections draw a 1px line at `--spine-x` (gutter + 2.25rem) and push their wraps right by a further 2.5rem. Each section carries one spine mark at `--spine-top` (default the 2xl section padding). Below 64em the spine and marks are hidden and the layout is unchanged.

Spacing follows `--space-*` (0.5, 0.75, 1.25, 2rem, then fluid xl and 2xl for section padding). The work index is a stack of hairline-ruled rows, led by Shoji; on wide screens with a pointer (≥80em) each row becomes a six-track line (number, thumbnail, title, empty reveal track, meta, year), and the screen opens in the empty track. Below that, rows stack and the screen and pipeline readout are shown inline.

Case studies use a hanging-indent title, a 16:10 cover that morphs from the work thumbnail through a view transition, prose at the 62ch measure, a label/value "made" spec list, and close on a washi CTA band with 2xl padding.

## Elevation & Depth

Flat. There are no drop shadows. Depth is light and layering: washi bands read as lit from behind (radial white inner light plus fibre texture), the lattice reads as a screen in front of the work, and reveals open by sliding panels apart. In the light theme the bands are flat dark screens with no texture. The only `box-shadow` is a 1px inset hairline framing the hero kumiko overlay, a stroke rather than a shadow.

### Named Rules
**The Backlight Not Shadow Rule.** Depth comes from light behind paper and screens sliding apart. Don't add drop shadows to cards, buttons, or popovers.

## Shapes

Mostly rectangles and hairlines (1px). Actions are full pills (999px): buttons, the copy-email chip, the video toggle, the before/after labels. Form fields take a 6px corner; editorial media a quiet 4px. Shoji screens (hero frame, work reveal) are square-cornered 1:1, divided into two 1:2 panels. The portrait is the one circle, set inside a hand-drawn ensō. Markers are small: a 7px dot on the spine, and a 45°-rotated square (7-9px) for every "now" diamond.

## Components

### Buttons
Pills that invert their ground.
- **Shape:** full pill (999px), min-height 2.75rem, 1px border.
- **Primary:** `--btn-bg` fill (bone on night, dark on washi, dark on light paper), weight 500, lowercase.
- **Hover / Focus:** primary empties to an outline in the text colour; secondary fills. 0.25s on the out-expo ease. Focus is a 2px ring in `--focus`, offset 3px.
- **Secondary:** 1px outline in the text colour, transparent fill.
- **Nav pill:** the persistent "book a call", label-size, 2.25rem tall, solid.

### Inputs / Fields
- **Style:** surface fill, 1px border stroke, 6px corner, min-height 2.75rem; labels at label size, weight 520, with "(optional)" muted.
- **Hover / Focus:** stroke to muted on hover; on focus the stroke goes to the text colour with the 2px ring 1px out.
- **Error:** `--error` stroke with label-size text below; flips correctly in bands and themes.

### Navigation
A lowercase index: brand at the left (500, -0.02em), muted links with Mincho bracket counts, two text switches (日本語/English and light/dark, muted, text on hover), and the solid nav pill. The theme switch is hidden until script runs and remembers the choice. On narrow screens a native disclosure opens a full-width ground panel of headline-size links; a fixed bottom bar (MobileCta) keeps the call to action in reach.

### Spine Mark (signature)
One per spined section: a vertical Japanese label (ダン, 制作, サービス, 工程, ラボ, 自己紹介, 連絡先) in the Mincho at label size, muted, with a 7px text-colour dot on the line. The hero's mark is the rust "now" diamond (9px, rotated 45°). Decorative and `aria-hidden`; desktop only.

### Hairline With End Labels
A full-width 1px rule (top and bottom) with a lowercase label at each end and the content centred between them (the proof strip). The end labels hide on mobile.

### Work Row (signature)
An index row: number, grayscale thumbnail, headline title, meta, year, ruled by hairlines. On hover or focus a night-filled screen (min(22rem, 22vw)) opens in the empty track: two 1:2 shoji panels slide apart (0.9s, slide ease, 0.15s delay) to reveal the piece, over a "made" readout of label/value pairs (lowercase muted labels, Geist Mono values, dot-separated lists). The thumbnail turns to colour as it opens.

### Hero Screen and Diffusion Reveal (signature)
Monochrome footage behind a 22% kumiko overlay with a dark centre divide; it slides open from the middle on load (1.4s). The statement develops from an SVG displacement of 90 to 0 over 1.6s; the offer note and actions follow 700ms later. A rust live-status diamond sits beside the actions. The footage always has a pause toggle.

### Ensō Portrait (signature)
The circular portrait (inset 10%) inside a brush ring generated at build time (`src/lib/enso.ts`, ported from Shoji), stroked in `--rust`. Up to 20rem wide.

### Washi Band
A section wrapper (services, contact, case-study CTA) that redefines the tokens to paper values and adds inner light plus fibre texture; in the light theme it becomes a flat dark screen. Often paired with a lattice field.

## Do's and Don'ts

### Do:
- **Do** take every colour from tokens; inside a band or the light theme, rely on the scopes to flip them.
- **Do** use gold only on key words and rust only on live/now markers.
- **Do** keep work imagery grayscale at rest and in colour on hover or focus.
- **Do** set labels lowercase at `--step--1` or larger, in `--text-muted`.
- **Do** set numerals and bracket counts in the Mincho, and use counts only for real counts.
- **Do** give every new homepage section `.spined` and one spine mark with a Japanese label.
- **Do** put all copy in `src/i18n/ui.ts` and check it in Japanese at `/ja`.
- **Do** build inline lists with the middle-dot separator list.
- **Do** size media frames on the shoji module: 1:1 frames made of two 1:2 panels, with the lattice at `--kumiko`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`, with content visible by default.
- **Do** give any autoplaying footage a visible pause control.

### Don't:
- **Don't** add a third accent, or use gold or rust as a fill, link colour, or decoration.
- **Don't** track display type tighter than -0.04em, or track Japanese negatively.
- **Don't** add drop shadows; depth comes from backlight and sliding panels.
- **Don't** use Geist Mono outside pipeline and spec data, or the Mincho outside numerals and spine labels.
- **Don't** fill the middle of the type scale with mid-size headings.
- **Don't** let a reveal cover titles or meta; it opens in the empty track.
- **Don't** put washi texture on light-theme bands.
- **Don't** use colour literals outside the documented overlay exception.
