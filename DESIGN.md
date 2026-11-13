---
name: Dan Bierre
description: Websites for Auckland businesses, screened as 16mm film. A warm-black ground, an orange-graded Japan reel behind the hero, and a shoji spine with two accents from Dan's own world.
colors:
  ground: "#12100e"
  ink-light: "#ece4d4"
  surface: "#1c1916"
  text-muted: "#a39b8c"
  border: "#2e2a25"
  lattice: "rgb(236 228 212 / 0.06)"
  spine-line: "rgb(236 228 212 / 0.45)"
  error: "#ff8f80"
  gold: "#c9a24f"
  rust: "#c8613a"
  code: "#b8a98a"
  washi: "#d9d2c4"
  washi-ink: "#161310"
  washi-surface: "#ebe5d8"
  washi-muted: "#4a4339"
  washi-border: "#b8ae9d"
  washi-lattice: "rgb(22 19 16 / 0.07)"
  washi-error: "#8f1f15"
  washi-gold: "#6b4c0f"
  washi-rust: "#8a3c21"
  washi-code: "#5e5139"
  light-ground: "#f4f1ea"
  light-ink: "#1b1b1a"
  light-surface: "#ffffff"
  light-muted: "#6f6a60"
  light-border: "#d9d4c8"
  light-lattice: "rgb(27 27 26 / 0.06)"
  light-error: "#a3261b"
  light-gold: "#8a6316"
  light-rust: "#8a3c21"
  light-code: "#6b5d43"
typography:
  statement:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 0.9rem + 6.4vw, 7.5rem)"
    fontWeight: 430
    lineHeight: 0.9
    letterSpacing: "-0.05em"
  display:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 6vw, 6.5rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.4vw, 4.6rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  title:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.12rem + 0.4vw, 1.45rem)"
    fontWeight: 480
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Fallback', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem)"
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "'Geist Mono Variable', 'Geist Mono Fallback', ui-monospace, monospace"
    fontWeight: 400
    letterSpacing: "0"
  spine:
    fontFamily: "'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', ui-serif, serif"
    fontSize: "clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem)"
    lineHeight: 1.3
    letterSpacing: "0.2em"
  data:
    fontFamily: "'Geist Mono Variable', 'Geist Mono Fallback', ui-monospace, monospace"
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
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.field}"
    padding: "0.6em 0.8em"
    height: "2.75rem"
  work-row-reveal:
    backgroundColor: "{colors.ground}"
    width: "min(22rem, 22vw)"
  spine-mark:
    textColor: "{colors.text-muted}"
    typography: "{typography.spine}"
  edl-event:
    textColor: "{colors.gold}"
    typography: "{typography.numeral}"
  open-spot:
    rounded: "{rounded.media}"
    textColor: "{colors.text-muted}"
  enso-portrait:
    textColor: "{colors.rust}"
    rounded: "{rounded.pill}"
    width: "min(100%, 20rem)"
---

# Design System: Dan Bierre

## Overview

**Creative North Star: "The Reel"**

A web studio for Auckland businesses (flat-price fixes and one-page sites), presented as a 16mm film. The ground is warm black and the type is cream. Behind the hero, an edit of Japan footage plays live in the browser through WebGL, graded orange only. Cuts between pages, themes and languages are film burns, and the page ends on an end-credits roll with a 終 card. The shoji system sits underneath: a kumiko lattice of faint hairlines at a fixed module, warm-paper bands lit like washi, and a spine down the left of each section carrying a vertical Japanese label and a dot. A light theme (warm paper and ink) is in the nav; there the bands become the projection, a dark screen between light rooms. Dark is the default.

Type does the composing. Hanken Grotesk runs from a giant hero statement down to lowercase labels, with almost nothing between. Geist Mono is the code voice: numerals, counts, timecodes, the edit decision list, spec values. Shippori Mincho is left only in the Japanese spine labels. Two accents each have one job: gold marks key words, rust marks what is live now.

Accepted look: warm orange grade, moderate grain, film-burn cuts with a dissolve, a code "beam" behind the headline. Rejected and not to return: text shake, kinetic type, iris wipes, whip cuts, 4:3 framing, heavy grain.

The page exists in English and Japanese (`/ja`), and Japanese is set by its own rules.

**Key Characteristics:**
- Warm-black ground (#12100e), cream ink (#ece4d4), warm-paper bands (#d9d2c4); light theme (#f4f1ea / #1b1b1a).
- Home order: Hero, About, Work, Redesigns, Services, Process, Clients, Contact.
- Two accents (gold key words, rust live/now) plus a parchment `--code` ink for mono metadata.
- Hanken Grotesk at extreme scale contrast, Geist Mono as code voice, Mincho for spine labels only.
- Kumiko lattice, section spine, pills for actions, hairlines for structure.
- A film layer (grade, grain, burns, timecode, credits), all decorative and skipped for reduced motion.

## Colors

Cream on warm black, warm paper bands, two narrow accents and a parchment code ink. Every neutral is warm.

### Primary
- **Projection Black** (ground): page ground, and the dark ink on paper bands' buttons.
- **Cream Ink** (ink-light): primary text, primary pill fill, selection, focus ring.

### Secondary
- **Kintsugi Gold** (gold): key words, EDL event numbers, work row numbers, the hero shot track, slate scene numbers. 7.7:1 on the ground. **Deep Gold** (washi-gold) on paper bands, **Ochre Ink** (light-gold) in the light theme.

### Tertiary
- **Now Rust** (rust): live/now markers. The hero and contact availability diamonds, the spine "now" diamond, the scroll playhead, EDL reel names, the ensō rings. 4.6:1 on the ground. **Fired Rust** (washi-rust, light-rust) on paper.

### Neutral
- **Lifted Black** (surface), **Ash Label** (text-muted, 6.6:1), **Hairline** (border), **Kumiko Ghost** (lattice, 6% ink), **Spine Line** (45% ink), **Signal Coral** (error; a state colour, not an accent).
- **Parchment Code** (code): mono metadata ink (timecodes, EDL times, slates). Warm, never blue. Darkens to washi-code on paper and light-code in the light theme.

### Washi band scope
`.band` redefines the same token names (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--lattice`, `--focus`, `--error`, `--btn-bg`, `--btn-text`, `--gold`, `--rust`, `--spine-line`, `--code`), so components inside flip on their own. Services and Contact are bands: warm print paper under a white radial inner light and the fibre texture `public/textures/washi.svg`. Never hard-code band colours in a component.

### Light theme scope
`:root[data-theme='light']` redefines the root tokens (Live Paper, Live Ink, white surface, Warm Ash 4.8:1, Brick for errors). Inside it `.band` becomes the projection: warm black and cream, no washi texture or inner light.

### Named Rules
**The Two Accents Rule.** Gold marks key words; rust marks what is live now. Neither is a fill, a button, a link colour or decoration, and no third hue joins them. Film light (amber, orange) lives only on film surfaces: the hero, the burn, the work-row leak.

**The Warm Grade Rule.** Anything that looks like footage, grain or light is warm. No blue, cyan or cool grey, including shadows and overlays.

**The Scoped Inversion Rule.** Bands and themes invert by redefining tokens on `.band` and `:root[data-theme='light']`, never by per-component overrides. Buttons invert against their ground.

**The Documented Overlay Exception.** Literal colours are sanctioned only where an element sits on imagery: the before/after handle and labels (`#fff`, `rgb(0 0 0 / 0.25)`, `rgb(0 0 0 / 0.55)`); the hero, which is always a dark screen and redefines its own tokens (projector black #0d0c0b, scrim, burn and halation glows, text and pause toggle in cream in both themes); the burn overlay in `motion.css`; the work-row sprocket strip and light leak. Exceptions, not palette.

## Typography

**Display and Body:** Hanken Grotesk Variable (Japanese falls to Hiragino Sans, Yu Gothic UI, Meiryo), with a metric-matched Arial stand-in while it loads.
**Code voice:** Geist Mono Variable, with a metric-matched Courier stand-in.
**Serif:** Shippori Mincho, latin 500, used for the spine labels only (Japanese falls to Hiragino Mincho ProN / Yu Mincho). The footer 終 uses system Mincho.

### Hierarchy
- **Statement** (430, up to 7.5rem, 0.9, -0.05em): the hero sentence only, set as numbered code-editor lines with a 2.6em indent leaving a gap for the note.
- **Display** (440, step-5, 0.95, -0.04em): page h1s. **Headline** (440, step-4): section h2s and work-row titles. Service h3s use step-3.
- **Title** (480, step-1, 1.15, -0.02em): h3s; EDL step heads are 500.
- **Body** (400, step-0, 1.5): 62ch measure, `text-wrap: pretty`.
- **Label** (450, step--1, lowercase): metadata, nav links, captions.
- **Numeral and count** (Geist Mono 400, tabular, tracking 0): `.num` and every `[n]` bracket count.
- **Spine** (Mincho, step--1, 0.2em, vertical-rl): Japanese section labels.
- **Credits** (names step-1; roles step--1, uppercase, 0.12em): the end roll.

### Japanese
`:lang(ja)` sets `line-break: strict` and `word-break: auto-phrase`. Headings drop to letter-spacing 0, line-height 1.2 (hero 1.1) and weight 600. The Japanese hero is smaller (clamp(2.2rem, 0.8rem + 5vw, 5.5rem)). All copy lives in `src/i18n/ui.ts`.

### Named Rules
**The Two Voices Rule.** Text is very large or label-sized. Avoid the middle of the scale.

**The Tracking Floor Rule.** Display tracking is -0.04em, and -0.05em only on the hero statement. Never tighter. Japanese is never negatively tracked.

**The Label Floor Rule.** Labels are lowercase, muted, and at least `--step--1` (0.78rem).

**The Code Voice Rule.** Mono carries what a machine or a film lab would print: timecodes, counts, EDL fields, spec values, the shot code. It never sets running copy or headings.

**The Bracket Count Rule.** Counts are superscript brackets (`.count`, 0.32em, `[n]`) after a heading or nav link, and count real things.

**The Clean Separator Rule.** Inline lists use the `.sep-list` middle dot, clipped at line starts. Never type " · " into wrapping copy.

## Layout

Content sits in a full-width wrap (max 100rem) with a fluid gutter (1-2.5rem). The hero is a 12-column grid at least `100svh - 3.75rem` tall, content on the bottom: statement full width, actions below, burn-in slate at the right. On narrow screens the note drops below the headline and the indent collapses.

The kumiko module (`--kumiko`, 2.5-4.5rem) is the structural unit. `.lattice` draws 1:2 cells; `.lattice-field` draws a section-scale grid offset by the gutter (Services, Contact).

From 64em, `.spined` sections draw a 1px line at `--spine-x` (gutter + 2.25rem) and push their wraps right by 2.5rem. Each section carries one spine mark. Below 64em the spine, marks and page timecode are hidden. Sections below the hero use `content-visibility: auto`.

Sections take `--space-2xl` padding. Redesigns, Services and Clients open with an h2 and a 44ch lede. The work index is a stack of hairline-ruled rows; from 80em with a pointer each is a six-track line (number, thumbnail, title, empty reveal track, meta, year). Process is an edit decision list: one hairline per event, six columns from 64em (event, reel, rec in, rec out, step, duration and output), stacked below. Clients shows open spots as three dashed 16:10 cards.

## Elevation & Depth

Flat UI, lit scenes. Cards, buttons, fields and sections carry no shadows. Depth is paper lit from behind, lattice in front of work, and panels sliding apart. Glow belongs to film surfaces only: the hero headline bloom, halation on hero buttons, the caret and projector gate, and the work-row burn. A soft warm lamp follows the pointer (screen-blended, lightens only).

### Named Rules
**The Backlight Not Shadow Rule.** No drop shadows on UI. Blooms and sliding screens are the depth.

## Shapes

Rectangles and hairlines (1px). Actions are pills (999px); fields 6px; editorial media and open-spot cards 4px. Work screens are square, two 1:2 panels. The hero frame is a rounded projector gate with L-bracket viewfinder marks. The one circle is the portrait inside a hand-drawn ensō; a small ensō also closes the footer. Markers: a 7px dot on the spine, a 45° square for "now".

## Components

### Buttons
Pills that invert their ground, min-height 2.75rem, lowercase, weight 500. Primary empties to an outline on hover; secondary fills. Focus is a 2px ring, offset 3px. The nav pill ("book a call") is 2.25rem. In the hero, buttons are translucent hairline halation buttons that bloom amber on hover.

### Inputs / Fields (BriefForm)
Surface fill, 1px border, 6px corner, min-height 2.75rem, label-size labels, "(optional)" muted. Hover strokes to muted; focus to the text colour with a ring. Errors use `--error` with text below.

### Navigation
Brand left, muted links (About, Work with a count, Services, ...), language and theme switches, the nav pill. A native disclosure menu and a fixed MobileCta bar serve narrow screens. Switching theme or language plays a film burn (`motion.css`, `Nav`, `Base`): warm light burns out from the switch, the swap happens under the peak, then it burns back in; opacity only. Page navigation is a 90ms cut-out and a flash-frame cut-in; the work thumbnail morphs into the case study.

### Spine Mark (signature)
One per section, a vertical Japanese label in the Mincho with a dot on the line, written downwards on scroll. From `spine` in `ui.ts` (Japanese in both languages): ダン (hero, rust "now" diamond), 自己紹介 (about), 制作 (work), リニューアル (redesigns), サービス (services), 工程 (process), お客様 (clients), 連絡先 (contact). Decorative, `aria-hidden`, desktop only.

### Hero Reel (signature)
A projected 16mm frame. Layers, bottom to top: graded still, WebGL canvas (`src/lib/indie-renderer`, `indie-edit`: a looping cut of the Japan clips with speed ramps, motion blur and film burns at each cut), washi paper in soft-light, a charcoal scrim, the code beam (the current shot's code line, huge, blurred, drifting), the projector gate. Over the type sit the viewfinder gate and a grain plate. The headline is filled with grain and takes the cut's burn light and the footage's hue. The gold words bloom with halation, a caret blinks after the last line, and mono line numbers sit in the margin from 64em. A code comment above the headline and a burn-in slate (shot track, `frameAt(clock) ×rate`) annotate the playing shot. The headline focus-pulls in 12fps steps over 1.4s; the note and actions develop at 1.2s.
The reel runs only when motion is welcome, WebGL exists and Save-Data is off, and only while on screen. Otherwise the still stays. It always has a pause toggle.

### Film Layer (Playhead, section slates, credits)
`Playhead`: a rust bar across the top fills with scroll, a fixed 24fps scroll timecode (desktop), and the pointer lamp. Section h2s rack focus in 10 steps as they scroll in; service lines clip in like clips on a timeline; on 72em and wider a rust playhead sweeps the Process events, each number cutting in with a flash. The footer is an end roll: 終 between hairlines, role and name rows rolling up on scroll, a small rust ensō, then contact, the studio link, back to top and ©.

### Work Row (signature)
Number (mono, gold), grayscale thumbnail, title, meta, year. On hover or focus a screen opens in the empty track: two 1:2 panels slide apart (0.9s) to show the piece, lightly sepia with grain, a sprocket strip, a light-leak sweep and a short flicker, over a "made" readout (muted labels, mono values). The thumbnail turns to colour as it opens. Touch plays the clip once.

### Before/After (Redesigns)
A 16:10 frame with a native range input driving a clip-path divider (`--pos`). Handle and labels are the documented overlay exception. Keyboard operable with a focus outline.

### Process as EDL
Each step is an event: three-digit number (gold), reel (rust), record in and out timecodes from 01:00:00:00 (code ink), the step in the grotesk, and its duration and output.

### Ensō Portrait
The portrait sits in a brush ring generated at build time (`src/lib/enso.ts`), stroked in rust, up to 20rem wide.

### Washi Band
Services and Contact: tokens flip to paper, with inner light and fibre texture; flat dark in the light theme. Paired with a lattice field.

## Do's and Don'ts

### Do:
- **Do** take colour from tokens and let `.band` and the theme scope flip it.
- **Do** keep every film effect warm (orange, amber, cream, parchment).
- **Do** use gold on key words and rust on live/now markers only.
- **Do** give each homepage section `.spined` and a SpineMark with a Japanese label.
- **Do** put all copy in `src/i18n/ui.ts` and check `/ja`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`, with content visible by default.
- **Do** give autoplaying footage a visible pause control.
- **Do** build inline lists with `.sep-list`.

### Don't:
- **Don't** add a third accent or any cool tone.
- **Don't** use text shake, kinetic type, iris wipes, whip cuts, 4:3 framing or heavy grain.
- **Don't** add UI drop shadows; glow lives on film surfaces only.
- **Don't** track display type tighter than -0.05em, or track Japanese negatively.
- **Don't** set running copy or headings in mono, or use the Mincho beyond spine labels.
- **Don't** let a reveal cover titles or meta.
- **Don't** put washi texture on light-theme bands.
- **Don't** use colour literals outside the documented overlay exception.
