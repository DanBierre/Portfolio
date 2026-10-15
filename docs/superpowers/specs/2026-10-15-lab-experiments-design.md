# Lab Experiments: Design Spec

Date: 2026-10-15 · Branch: `feat/gallery-redesign` · Status: awaiting Dan's approval

## Goal
Build five interactive Lab experiments that prove Dan's offer to agencies, each on its own page, in the Gallery Index world. Together with the existing Ensō Generator that makes six live Lab pieces.

## Shared rules (every experiment)
- Route `/lab/<slug>`, built with `Base`, English only (like the rest of the Lab), "← Lab" back link, closing `BookCall` with a one-line pitch.
- Visual language: near-black ground, Hanken Grotesk, 12px+ lowercase labels, serif numerals (`.num`), gold for key words, rust only for live/"now" markers, hairlines, no new colours.
- **Honesty:** anything made up for demonstration carries a visible `demo data` label until Dan replaces it. No invented clients, results or metrics.
- **Without JavaScript:** a meaningful static version (never a blank box), plus a one-line note that the interactive part needs JavaScript.
- **Reduced motion:** no noise, slides or staggered movement; content appears instantly.
- **Accessibility:** every control is keyboard operable with a visible focus ring; live updates are announced politely (`aria-live`); no axe violations.
- **Performance:** no new font downloads, no client framework; each page stays inside the existing Lighthouse budgets (≥95 on all four categories, first content < 2 s, < 1 MB).
- **Lab entry:** each experiment's entry in `src/content/lab/` becomes `status: live` with `link: /lab/<slug>` when its tests pass.
- Data lives in typed files under `src/data/lab/` so Dan can swap demo content without touching code.

## 1. Kanji Develops (`/lab/kanji`)
- **Data:** `kanji.ts`, 30 N2-level kanji: `{ char, meanings[], on[], kun[] }`, drafted by Claude and **flagged for Dan to check**. Labelled "N2-level (approximate)".
- **Experience:** one kanji, huge, in system Mincho. It *develops* out of noise (the homepage's SVG displacement plus blur reveal), then its meaning and readings fade in below.
- **Controls:** Next / Previous (buttons and ← →), **Quiz mode** toggle (hides meaning and readings until you press Reveal or Space), Shuffle. A counter shows `07 / 30` in serif numerals.
- **No JS:** a full table of all 30 kanji with meanings and readings.
- **Tests:** next/prev and arrow keys change the kanji; quiz mode hides readings until Reveal; the reveal animates with motion allowed and is skipped under reduced motion; the no-JS table has 30 rows.

## 2. Kinetic Type from Voice (`/lab/kinetic`)
- **Input:** hold-to-talk button using the browser's speech recognition (English or Japanese toggle). **A text box is always there too**, as the fallback for browsers without speech recognition (Safari and Firefox) and for anyone who prefers typing. The button only appears where speech is supported.
- **Animation (Web Animations API, no library):** words enter one by one on a stagger. Size, offset and weight vary by word length and position; the longest word is set in gold as the emphasis; sentence-final punctuation lands last with a hold. Built from rules, so the same line always animates the same way. **Replay** button.
- **Reduced motion:** words appear without movement (opacity only, no transforms).
- **No JS:** a static example line already set in the kinetic layout, and the note.
- **Tests:** typing a line and pressing Animate renders one element per word with the longest word in gold; Replay re-runs it; the speech button is hidden when speech recognition is unavailable; under reduced motion, word animations use no transforms.
- **Out of scope:** video export.

## 3. Campaign Variant Machine (`/lab/variants`)
- **Campaign:** the launch of **Shoji**, using real Shoji screenshots and factual copy only.
- **Pipeline (honest framing):** a *rule-based* variant pipeline; no image model is involved, and the page says so. Inputs: 3 screenshots × 4 layouts × 2 colourways (ink, washi) × English or Japanese, giving a curated **24 variants** rendered as HTML/CSS ad cards at build time.
- **Copy:** 4 English and 4 Japanese headlines, all factual about Shoji (for example "Plan the day in blocks." / 「一日をブロックで計画。」), drafted by Claude for Dan to check.
- **Experience:** the source inputs at the top (one shot, one headline, a brand swatch). Pressing **Generate** fills a 6×4 grid tile by tile; hovering or focusing a tile shows its *recipe* (layout, colourway, language, shot, headline) in the site's "how it was made" panel style.
- **No JS:** all 24 tiles shown at once.
- **Tests:** Generate fills 24 tiles; each tile exposes its recipe on focus; every tile's headline matches its language; under reduced motion all tiles appear at once.

## 4. Agent X-ray (`/lab/agent-x-ray`)
- **Data:** `runs.ts`, **2 demo runs** (for example *"Find three reference images for a summer drinks campaign"* and *"Turn this brief into a shot list"*). Each run is a list of steps `{ id, kind: think | tool | result | backtrack, label, tool?, ms, cents }`. **Labelled "demo run"** until Dan records real traces in the same format.
- **Experience:** pick a run, press **Run**. A vertical trace draws step by step: thinking as plain text, tool calls as boxes with the tool's name, backtracks branching off and greyed out, the final answer last. Two serif-numeral counters tick up: elapsed time and cost. Pause/Resume and Step buttons work from the keyboard.
- **Reduced motion:** steps appear instantly in order; counters show their final values.
- **No JS:** the full trace of the first run, rendered statically.
- **Tests:** running replays every step in order; counters end at the run's totals; Step advances exactly one step; the backtrack step is marked; the static trace renders without JS.

## 5. AI Rough Cut (`/lab/rough-cut`)
- **Data:** `rough-cut.ts`, a **demo** transcript of about 12 segments `{ id, start, end, text }` plus an agent run of about 15 actions `{ kind: select | drop | reorder | note, segment?, to?, note? }`. Labelled "demo data: footage coming". Each segment has an optional `src` for Dan's clips later.
- **Experience:** a split view. On the left, the transcript (selected lines highlight gold, dropped lines strike through). On the right, a timeline track where selected segments appear as blocks sized by duration and snap into the agent's order. The agent's notes ("cut the pause, keep the laugh") appear in a log. It ends with the **rough cut**: the ordered list and total runtime in serif numerals. Play/Pause and Step controls.
- **Footage:** placeholder blocks now; when `src` is set, a segment shows its clip.
- **Reduced motion:** steps apply instantly; no snapping animation.
- **No JS:** the final rough cut (ordered segments and total runtime) shown statically.
- **Tests:** playing the run ends with the expected ordered selects and total; dropped segments are marked; Step applies one action; the no-JS version shows the final cut.

## Build order
Smallest and most self-contained first, so each lands green before the next: **Kanji → Kinetic → Variants → Agent X-ray → Rough Cut.** One commit per experiment, each with its tests, a Lab entry flip to `live`, and an a11y and Lighthouse pass.

## Acceptance (definition of done)
1. Five new routes, each passing its own tests, plus the quality suite (axe in dark and light, no horizontal scroll from 360 to 1920px, readable without JS).
2. Lighthouse ≥95 on every category for every new page; first content < 2 s.
3. Lab page: six live entries, each linking to its experiment; every demo or drafted content item is labelled, with no `[PLACEHOLDER]` left on the experiment pages except the Rough Cut footage note.
4. The full existing suite stays green.
5. A design review pass (impeccable) on the five pages, and DESIGN.md updated with any new patterns.

## Dan to review after build
The kanji meanings and readings, the Japanese and English Shoji headlines, and the demo run and transcript content (replace with real traces and footage when ready).
