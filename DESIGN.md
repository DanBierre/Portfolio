---
name: Dan Bierre
description: The AI half of your creative team. A classic studio portfolio, played straight.
colors:
  ground: "#f2f3f4"
  surface: "#ffffff"
  ink: "#121314"
  ink-muted: "#585b5f"
  moss: "#3e4a26"
  on-moss: "#ffffff"
  hairline: "#d6d9dc"
  error: "#a3261b"
  ground-dark: "#12100d"
  surface-dark: "#1c1a16"
  ink-dark: "#ecebe6"
  ink-muted-dark: "#a6a197"
  moss-dark: "#c2cd92"
  on-moss-dark: "#12100d"
  hairline-dark: "#2e2b26"
  error-dark: "#ff8f80"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.5rem + 5.4vw, 6rem)"
    fontWeight: 560
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 3vw, 4.2rem)"
    fontWeight: 560
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title-large:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.73rem, 1.45rem + 1.4vw, 2.8rem)"
    fontWeight: 560
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.44rem, 1.28rem + 0.8vw, 2rem)"
    fontWeight: 560
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.12rem + 0.4vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'ss01'"
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem)"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  focus: "2px"
  image: "4px"
  field: "6px"
  pill: "999px"
spacing:
  xs: "0.5rem"
  s: "0.75rem"
  m: "1.25rem"
  l: "2rem"
  xl: "clamp(3rem, 2rem + 4vw, 5rem)"
  2xl: "clamp(5rem, 3rem + 8vw, 10rem)"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.on-moss}"
    rounded: "{rounded.pill}"
    padding: "0.6em 1.25em"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.6em 1.25em"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  button-nav:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.on-moss}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.4em 1em"
    height: "2.25rem"
  chip-utility:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.2em 0.7em"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.6em 0.8em"
    height: "2.75rem"
  work-media:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.image}"
---

# Design System: Dan Bierre

## Overview

**Creative North Star: "The Work Is the Page"**

A classic high-end studio portfolio, played straight. A neutral ground (cool off-white in light, warm near-black in dark), one variable grotesk set at extreme scale contrast, full-bleed project media, and almost no chrome. The type and the work carry everything; the interface recedes into hairlines and muted grey.

Density is low and vertical: sections are separated by very large air (5–10rem), not by containers. Structure comes from 1px rules above columns and between list rows, never from cards, fills, or shadows. One muted moss accent marks the path to contact (primary buttons, focus, selection) and nothing else.

Motion is a single authored moment (the hero headline rising into place), a scroll-driven unveil on work imagery, and a cross-document view transition where the work cover morphs into the case-study header. Everything is visible without motion and without JavaScript.

**Key Characteristics:**
- One family (Geist Variable), weight 560 for headings, extreme size jump from body to display.
- Neutral ground, one moss accent, light and dark themes both WCAG AA.
- Hairline rules as the only structure; no cards, no shadows on surfaces.
- Edge-to-edge 16:9 work media (no corner; meta stays on the page grid); pill-shaped actions.
- Motion only enhances, always gated by `prefers-reduced-motion`.

## Colors

A near-monochrome neutral ground with a single muted olive-moss voice.

### Primary
- **Moss** (light #3e4a26 / dark #c2cd92): primary buttons, the nav "Book a call" pill, focus outlines, text selection, caret, and the Lab status badge outline. It marks the route to an enquiry.

### Neutral
- **Cool Paper Ground** (#f2f3f4 / dark #12100d): page background, nav and mobile CTA bar (mixed at 88–92% with backdrop blur), hero scrim target.
- **White Surface** (#ffffff / dark #1c1a16): form fields and the placeholder fill behind media while it loads.
- **Ink** (#121314 / dark #ecebe6): text, strong 1px rules above service, contact and quote columns, secondary button outline, and the hover fill for every button.
- **Muted Ink** (#585b5f / dark #a6a197): sub-lines, metadata, nav links at rest, captions, process numerals.
- **Hairline** (#d6d9dc / dark #2e2b26): quiet dividers (nav bottom, proof strip, list rows, footer top, field borders).
- **Error** (#a3261b / dark #ff8f80): invalid field border and error text only.

### Named Rules
**The One Voice Rule.** Moss appears only on the contact path, focus, and selection. It is never a background panel, never decoration, never a text-link colour.

**The Two Rules Rule.** A divider is either Ink (heading a column of content: services, contact paths, case quote) or Hairline (separating rows and chrome). Nothing in between.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Body Font:** Geist Variable (same family; stylistic set `ss01` on)

**Character:** A single neutral grotesk does all the work; hierarchy comes from size and tight negative tracking, not from a second family or weight drama.

### Hierarchy
- **Hero Display** (560, 2.9–9.5rem fluid, 0.95, -0.045em): the hero headline only, the single scale peak of the site (deliberately above the 6rem display default; the contract asks for a headline spanning ~10 of 12 columns).
- **Display** (560, 2.6–6rem fluid, 1.05, -0.04em): case-study title. Max 18ch, `text-wrap: balance`. The contact closer steps down to Headline so the hero stays the peak.
- **Headline** (560, 2.2–4.2rem fluid, 1.05, -0.035em): section headings ("Selected work", "What I do for agencies").
- **Title Large** (560, 1.73–2.8rem, -0.035em): service column titles, case-study prose h2, "next case" link.
- **Title** (560, 1.44–2rem, -0.03em): work card titles, Lab item titles, case outcome and pull quote (at weight 400, line-height 1.25–1.3).
- **Lead** (400, 1.2–1.45rem, 1.45): hero sub-line (40ch, ink over the footage tint), about bio, proof strip result, 404/thanks copy.
- **Body** (400, 1–1.125rem, 1.55): running text, capped at 65ch.
- **Label** (400–520, 0.83–0.9rem): metadata, captions, form labels (520), footer, nav button, process numerals. Sentence case, no tracking.

### Named Rules
**The No-Shouting Rule.** No uppercase, no letter-spaced small labels. Small text is sentence case at the label size and muted grey.

**The Negative Tracking Rule.** Tracking tightens as size grows: -0.015em at lead, -0.03em at title, -0.035em at headline, -0.04em at display. Body is untracked.

## Layout

One centred column, max 90rem, with a fluid gutter (1–2.5rem). Sections stack with `--space-2xl` (5–10rem) above them and no bottom padding; headings sit `--space-xl` above their content. Prose is capped at 65ch.

Grids are content-proportioned rather than a fixed 12-column: work card meta splits 7fr/5fr at 64em; about splits 5fr/7fr at 48em; contact paths split 3fr/6fr/3fr at 64em; services 2 columns at 48em; process 2 then 4 columns (48em, 72em); Lab 3 columns on the home page, 2 on the Lab page.

Breakpoints in use: 40em (form rows), 48em (nav collapse, most grids), 64em (work meta, contact, Lab page), 72em (process). Below 48em the nav links collapse to a native `<details>` menu and a fixed bottom CTA bar appears.

The hero is bottom-weighted: full viewport height minus the 3.75rem nav, headline anchored to the bottom left, footage filling the whole hero under an even 68% ground tint (no gradient scrim). A round pause/play control sits bottom-right whenever the footage plays (WCAG 2.2.2).

## Elevation & Depth

Flat. Surfaces have no shadows; depth comes from tonal layering only where chrome overlays content (sticky nav and mobile CTA bar: translucent ground plus 12px backdrop blur) and from the hero footage sitting under an even 68% ground tint. Work imagery responds to hover with a slow 1.02 scale (only when motion is welcome), not a lift.

### Shadow Vocabulary
None. The before/after handle stays legible with a solid white line and a white knob ringed by a 1px rgb(0 0 0 / 0.25) hairline.

### Named Rules
**The Flat Ground Rule.** No shadow anywhere: not on cards, buttons, fields, panels, or controls over imagery.

## Shapes

Three radii, each tied to a material. Images and media frames: a barely-there 4px corner. Form fields: 6px. Actions and small tags: full pill (999px). Focus rings carry a 2px radius. Rules are always 1px and full-width of their column. No circles except the before/after knob, no clipped silhouettes beyond the scroll unveil (inset clip with a 4px round that opens to full frame).

## Components

### Buttons
Quiet pills that turn to Ink on hover.
- **Shape:** full pill (999px), min height 2.75rem (2.25rem in the nav).
- **Primary:** Moss fill, white (dark: near-black) text, weight 520, padding 0.6em 1.25em. Used for "Book a call" and "Send brief".
- **Secondary:** transparent with a 1px Ink outline. Used for "See the work" and alternate paths.
- **Hover:** every variant fills Ink with ground-coloured text; 0.25s on the house ease-out.
- **Focus:** 3px Moss outline, 3px offset, global.
- **Disabled:** 60% opacity, progress cursor.

### Chips
- **Utility pill** ("Copy email"): transparent, 1px Hairline border, muted label text; hover raises border and text to Ink.
- **Status badge** (Lab): transparent, 1px Moss outline, Moss label text.
- **Image label** (before/after): 55% black pill with white label text, over imagery only.

### Cards / Containers
There are no cards. A "work card" is media plus meta on the bare ground.
- **Corner Style:** 4px on the media only.
- **Background:** White Surface behind media while loading; otherwise the page ground.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none on media; Ink or Hairline top rules above column content.
- **Internal Padding:** none; `--space-m` rule-to-content.

### Inputs / Fields
- **Style:** White Surface fill, 1px Hairline border, 6px radius, min height 2.75rem; labels above at label size, weight 520; "(optional)" muted.
- **Hover:** border to Muted Ink.
- **Focus:** global Moss ring at 1px offset plus Ink border.
- **Error:** Error-colour border and an error line below; placeholders in Muted Ink.

### Navigation
One sticky hairline row, 3.75rem tall: name at left (weight 600), muted links at right turning Ink on hover, Moss "Book a call" pill pinned far right. Translucent ground with backdrop blur. Below 48em the links and pill move into a native `<details>` menu of large (title-size) links, and a fixed bottom bar carries a note plus the primary action.

### Work Card (signature)
Edge-to-edge 16:9 media frame (max 88svh, no radius), cover image with a muted preview video that fades in on hover (mouse) or plays once when in view (touch); hover scales media to 1.02 over 0.9s, motion-gated. The media unveils on scroll (inset clip and 1.04 scale resolving to full frame). Its cover morphs into the case-study header via cross-document view transition (450ms, ease-out). Meta beneath: title at Title size spanning two rows at 64em, context in muted label, outcome at body size.

### Before/After Comparison
16:10 frame, 4px radius, draggable solid white divider with a hairline-ringed 2.75rem knob (no shadow), pill labels in the bottom corners; the native range input covers the frame and the frame takes the focus ring.

### Motion
House ease `cubic-bezier(0.16, 1, 0.3, 1)` for every transition. The hero headline lines, sub-line and actions rise 0.35em from 8px blur over 1.1s, staggered 0/90/220/320ms. All of it sits inside `prefers-reduced-motion: no-preference`; reduced motion disables view transitions too.

### Imagery & Raster Provenance
All shipped rasters are generated placeholders, not photography or client work, and must be replaced before launch:
- `src/assets/**/*.jpg` (hero poster, portrait, work covers and before/after, Lab images): sharp-rendered gradient placeholders.
- `public/media/*.webm` (hero and case-study preview loops): Playwright-recorded animated gradients.
- `public/og-default.png`: Playwright screenshot of the headline set in Geist.

Their gradient look is placeholder provenance, not the system's imagery style. Real imagery is full-bleed project footage and stills, muted enough to sit under the hero scrim.

## Do's and Don'ts

### Do:
- **Do** set headings in Geist Variable at weight 560 with the negative tracking ladder (-0.015em to -0.04em).
- **Do** separate content with 1px rules (Ink above a column, Hairline between rows) and 5–10rem of section air.
- **Do** keep Moss for primary actions, focus (3px outline, 3px offset) and selection.
- **Do** frame work media at 16:10 (4:3 for Lab, 4:5 for the portrait) with a 4px corner.
- **Do** gate every animation behind `prefers-reduced-motion: no-preference` and use the house ease-out.
- **Do** verify both themes: every colour token has a dark counterpart.

### Don't:
- **Don't** put content in cards, filled panels, or anything with a drop shadow; the system has no shadows.
- **Don't** use uppercase or letter-spaced labels above headings; small text stays sentence case and muted.
- **Don't** introduce a second typeface or a second accent colour.
- **Don't** use decorative gradients or glow; the hero scrim exists only to dissolve media into the ground.
- **Don't** treat the generated gradient placeholder rasters as an imagery style to imitate.
