---
name: Dan Bierre
description: The AI half of your creative team. A gallery index for generative work, screened like shoji.
colors:
  ground: "#141414"
  ink-light: "#ecebe7"
  surface: "#1e1e1d"
  text-muted: "#9d9b95"
  border: "#2e2e2c"
  lattice: "rgb(236 235 231 / 0.06)"
  error: "#ff8f80"
  washi: "#d8d7d2"
  washi-surface: "#ebe8e1"
  washi-muted: "#4a4843"
  washi-border: "#b9b5ab"
  washi-lattice: "rgb(20 20 20 / 0.07)"
  washi-error: "#8f1f15"
typography:
  statement:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 0.9rem + 8vw, 9.5rem)"
    fontWeight: 430
    lineHeight: 0.9
    letterSpacing: "-0.055em"
  display:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 6vw, 6.5rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 3.4vw, 4.6rem)"
    fontWeight: 440
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  title:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.12rem + 0.4vw, 1.45rem)"
    fontWeight: 480
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem)"
    fontWeight: 450
    lineHeight: 1.35
    letterSpacing: "0.01em"
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
  input-washi:
    backgroundColor: "{colors.washi-surface}"
    textColor: "{colors.ground}"
    rounded: "{rounded.field}"
  work-row-reveal:
    backgroundColor: "{colors.ground}"
    width: "min(22rem, 22vw)"
---

# Design System: Dan Bierre

## Overview

**Creative North Star: "The Screened Gallery Index"**

A collectible-design catalogue for generative work, read through shoji. The ground is near-black and constant for every visitor (the site is dark regardless of device theme). Flat light-grey bands interrupt it as backlit washi: paper with fibre texture and a soft light behind it. Over everything runs a kumiko lattice of faint hairlines at a fixed module, so the page's structure is visible as the grid of a screen.

Type does the composing. One neo-grotesk, Hanken Grotesk, runs from a giant ragged statement at the top of the page down to 12-13px lowercase labels, with almost nothing in between: the contrast in scale is the hierarchy. Counts sit in superscript brackets, hairlines carry a label at each end, buttons are pills, and Geist Mono appears only where the pipeline data is printed. There is no accent colour. Colour comes only from the work, which stays monochrome until hovered or focused.

Motion is about revealing things. The hero headline develops out of displacement noise as if seen through paper, the hero footage slides open like a shoji door, and each work row opens a two-panel screen showing the piece and how it was made. Everything is visible by default, and every motion is skipped under reduced motion.

**Key Characteristics:**
- Near-black ground (#141414) with washi bands (#d8d7d2); ink is only light or dark, no accent.
- One family at extreme scale contrast: a 9.5rem statement against 12-13px lowercase labels.
- Kumiko lattice hairlines at the `--kumiko` module (1:2 cells) as visible page structure.
- Pills for actions, hairlines for structure, 1:1 frames made of two 1:2 shoji panels for media.
- Work is grayscale at rest and turns to colour on hover or focus.

## Colors

A two-ink monochrome on two grounds (night and paper), with colour supplied only by the imagery.

### Primary
- **Gallery Night** (ground): the page ground for every visitor, and the dark ink on washi bands and dark-pill buttons.
- **Bone Ink** (ink-light): all primary text on the dark ground, the primary pill fill, the selection highlight, and the focus ring.

### Neutral
- **Lifted Night** (surface): media frames before load, form fields on the dark ground.
- **Ash Label** (text-muted): labels, nav links at rest, secondary copy. 6.6:1 on the ground.
- **Hairline Night** (border): row rules, the hairlines of the hero proof strip, field strokes.
- **Kumiko Ghost** (lattice): the lattice hairlines, at 6% bone ink.
- **Signal Coral** (error): form error text on the dark ground (8.3:1). It is a state colour, not an accent.

### Washi band scope
The `.band` scope redefines the same token names, so every component inside a band flips automatically. Never hard-code band colours in a component.
- **Backlit Washi** (washi): band ground, under a white radial inner light (`rgb(255 255 255 / 0.16)`) and the vector fibre texture `public/textures/washi.svg`.
- **Paper Surface** (washi-surface): fields inside bands.
- **Sumi Muted** (washi-muted): labels and secondary copy on paper (6.4:1).
- **Paper Hairline** (washi-border) and **Paper Kumiko** (washi-lattice): rules and lattice on paper.
- **Oxide** (washi-error): error text on paper (6.2:1).

### Named Rules
**The Colour Comes From the Work Rule.** The interface has no accent hue. Thumbnails and footage are grayscale at rest (`filter: grayscale(1)`) and turn to colour on hover or focus; colour on screen is always the work itself.

**The Scoped Inversion Rule.** Washi bands invert by redefining tokens (`--bg`, `--text`, `--btn-bg`, ...) on `.band`, never by adding per-component overrides. Buttons always invert against their ground: a light pill on night, a dark pill on paper.

**The Documented Overlay Exception.** Three literal colours are sanctioned, each for legibility over imagery, not as palette: the before/after slider's handle and labels (`#fff` with `rgb(0 0 0 / 0.25)` and `rgb(0 0 0 / 0.55)`), and the hero screen's centre divide (`rgb(20 20 20 / 0.85)`). The hero's kumiko overlay locally raises `--lattice` to `rgb(236 235 231 / 0.22)` with a matching 1px inset frame, and the pause toggle sits on `rgb(20 20 20 / 0.7)`. These are sanctioned exceptions, not drift.

## Typography

**Display Font:** Hanken Grotesk Variable (with ui-sans-serif, system-ui)
**Body Font:** Hanken Grotesk Variable
**Label/Mono Font:** Geist Mono Variable, used only for pipeline data values

**Character:** A single Swiss-leaning neo-grotesk, set with tight negative tracking at large sizes and plain lowercase at small ones. The mono is evidence, not decoration.

### Hierarchy
- **Statement** (430, step-6 up to 9.5rem, 0.9, -0.055em): the hero sentence only, in ragged lines with an indent (2.6em) that leaves a gap for the note.
- **Display** (440, step-5, 0.95, -0.045em): page h1s.
- **Headline** (440, step-4, 0.95, -0.045em): section h2s, work-row titles (-0.05em), and the mobile menu links.
- **Title** (480, step-1, 1.15, -0.02em): h3s, service and process item heads.
- **Body** (400, step-0, 1.5): running text, capped at a 62ch measure; `text-wrap: pretty`.
- **Label** (450, step--1 ≈ 12.5-13.4px, 0.01em, lowercase): the second voice for metadata, end labels, nav links, list numbering, captions.
- **Data** (Geist Mono, 0.95em of the label): pipeline values (model, steps, seed, render).
- **Footer mark** (430, min(18vw, 22rem), -0.06em, lowercase): the closing wordmark, used once per page.

### Named Rules
**The Two Voices Rule.** Text is either very large or label-sized. Avoid filling the middle of the scale; when in doubt, go bigger or drop to a label.

**The Label Floor Rule.** Labels are lowercase, muted, and never below 12px (the `--step--1` minimum, 0.78rem).

**The Bracket Count Rule.** Counts appear as superscript brackets after a heading or nav link (`.count`, 0.32em, `[n]`). They count real things (case studies, experiments, process steps).

**The Mono Is Data Rule.** Geist Mono is reserved for machine values in the pipeline readout. Headings, labels, and UI chrome never use it.

## Layout

Content sits in a full-width wrap (max 100rem) with a fluid gutter (1-2.5rem). The hero uses a 12-column grid: the statement spans the full width and sits at the bottom of the first viewport, with the screened footage frame off-centre at the top right (height min(44svh, 34rem)). On narrow screens the frame falls into the flow at 62% width aligned right, the indent collapses, and the note drops below the headline.

The kumiko module (`--kumiko`, 2.5-4.5rem) is the structural unit. `.lattice` draws 1:2 cells at the module; `.lattice-field` draws a section-scale grid (2× module wide, 4× tall) behind hero and contact, offset by the gutter so the lines align with the content edge.

Spacing follows `--space-*` (0.5, 0.75, 1.25, 2rem, then fluid xl and 2xl for section padding). The work index is a stack of hairline-ruled rows; on wide screens with a pointer (≥80em) each row becomes a six-track line (number, thumbnail, title, empty reveal track, meta, year), and the empty track is where the screen opens, so the reveal never covers text. Below that, rows stack and the screen and pipeline readout are shown inline.

Case studies use a hanging-indent title (wrapped lines indent 1.6em, max 18ch), a 16:10 cover that morphs from the work thumbnail through a view transition, prose at the 62ch measure, and close on a washi CTA band with 2xl padding.

## Elevation & Depth

Flat. There are no drop shadows. Depth is a matter of light and layering: washi bands read as lit from behind (a radial white inner light plus fibre texture), the lattice reads as a screen in front of the work, and reveals open by sliding panels apart rather than lifting a card. The only `box-shadow` in the build is a 1px inset hairline framing the hero kumiko overlay, used as a stroke rather than a shadow.

### Named Rules
**The Backlight Not Shadow Rule.** Depth comes from light behind paper and screens sliding apart. Don't add drop shadows to cards, buttons, or popovers.

## Shapes

Mostly rectangles and hairlines (1px). Actions are full pills (999px): buttons, the copy-email chip, the video toggle, the before/after labels. Form fields take a 6px corner. Editorial media inside case studies, the Lab, and the before/after frame take a quiet 4px. Shoji screens (hero frame, work reveal) are square-cornered and 1:1, divided into two 1:2 panels by a centre line, because the panels slide.

## Components

### Buttons
Pills that invert their ground.
- **Shape:** full pill (999px), min-height 2.75rem, 1px border.
- **Primary:** bone-ink fill on night, dark fill on washi (via `--btn-bg`), weight 500, lowercase.
- **Hover / Focus:** primary empties to an outline in the text colour; secondary fills. 0.25s on the out-expo ease. Focus is a 2px ring in `--focus`, offset 3px.
- **Secondary:** 1px outline in the text colour, transparent fill.
- **Nav pill:** the persistent "book a call", label-size, 2.25rem tall, solid.

### Inputs / Fields
- **Style:** surface fill, 1px border stroke, 6px corner, min-height 2.75rem; labels at label size, weight 520, with "(optional)" muted. Custom select with a hairline chevron.
- **Hover / Focus:** stroke goes to muted on hover; on focus the stroke goes to the text colour and the 2px focus ring sits 1px out.
- **Error:** invalid fields take an `--error` stroke with label-size error text below; both flip correctly inside washi bands.

### Navigation
A lowercase index: brand at the left (500, -0.02em), muted links with bracket counts, and a solid nav pill. On narrow screens a native disclosure opens a full-width night panel of headline-size links. On mobile a fixed bottom bar (MobileCta) keeps the call to action in reach.

### Hairline With End Labels
A full-width 1px rule (top and bottom) with a lowercase label at each end and the content centred between them (the proof strip). The end labels hide on mobile.

### Work Row (signature)
An index row: number, grayscale thumbnail, headline title, meta, year, ruled by hairlines. On hover or focus, a night-filled screen (min(22rem, 22vw)) opens in the row's empty track: two 1:2 shoji panels slide apart (0.9s, slide ease, 0.15s delay) to reveal the piece and its looping footage, over a two-column pipeline readout (lowercase muted terms, Geist Mono values). The thumbnail turns to colour as it opens.

### Hero Screen and Diffusion Reveal (signature)
Monochrome footage behind a 22% kumiko overlay with a dark centre divide. It slides open from the middle on load (1.4s). The statement develops from an SVG displacement of 90 down to 0 over 1.6s, with blur and opacity resolving in step; the note and actions follow 700ms later. The footage always has a pause toggle.

### Washi Band
A section wrapper (services, contact, case-study CTA) that redefines the tokens to paper values and adds inner light plus fibre texture. Often paired with a lattice field.

## Do's and Don'ts

### Do:
- **Do** take every colour from tokens; inside a washi band, rely on the `.band` scope to flip them.
- **Do** keep work imagery grayscale at rest and in colour on hover or focus.
- **Do** set labels lowercase at `--step--1` or larger, in `--text-muted`.
- **Do** use bracketed superscript counts only for real counts.
- **Do** size media frames on the shoji module: 1:1 frames made of two 1:2 panels, with the lattice at `--kumiko`.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference`, with content visible by default.
- **Do** give any autoplaying footage a visible pause control.

### Don't:
- **Don't** introduce an accent hue; colour belongs to the work.
- **Don't** add drop shadows; depth comes from backlight and sliding panels.
- **Don't** use Geist Mono outside pipeline data.
- **Don't** fill the middle of the type scale with mid-size headings that weaken the contrast in scale.
- **Don't** let a reveal cover titles or meta; it opens in the empty track.
- **Don't** use colour literals outside the documented overlay exception.
