# Portfolio build: decisions and deferred items

Decisions made during the build (from the execution ledger), each with its cost if wrong.

- - T3→T6: case-study-one needs beforeAfter — Ruling: set beforeAfter on case-study-one in T3 — T6 test depends on it — cost if wrong: none.
- Ruling: site.email = hello@danbierre.dev (public contact via Email Routing), BRIEF_TO left as placeholder until Dan names inbox — Dan's private inbox not known — cost if wrong: one config edit.
- Ruling: site.name = "Dan Bierre" (from domain) — cost if wrong: one config edit.
- Task 1: Ruling: Astro 7.3.8 installed (plan said 6) — latest stable, same content-collection API — cost if wrong: API tweaks in Task 3.
- Task 1: Ruling: approved npm install scripts for esbuild + workerd — required by wrangler/astro — cost if wrong: none.
- Task 2: Ruling: Dan chose "Classic studio" (category canon) over rolled directions; benchmarks Pentagram/Locomotive/Studio Freight/Linear — recorded in PRODUCT.md — cost if wrong: token swap.
- Task 2: Ruling: single family Geist Variable for display+body, moss accent — canon studio look without banned default faces — cost if wrong: font swap in tokens.css.
- Task 2: Ruling: focus-ring test passed before implementation (browser default outline); kept as regression guard — cost if wrong: none.
- Task 3: Ruling: preview videos are .webm (no ffmpeg; generated via Playwright recording in Task 10) — cost if wrong: re-encode to mp4 later.
- Task 4: Ruling: booking links use data-book-call (not data-cal-link) so Cal's embed doesn't double-bind; modal opens only after embed.js loads — cost if wrong: in-page modal untested until Dan's real Cal link exists (link fallback is tested).
- Task 4: Ruling: desktop and mobile nav are separate lists (mobile in <details>), hidden lists use display:none — works without JS — cost if wrong: none.
- Task 4: Ruling: Cal-blocked test stubs the booking URL instead of aborting it, so navigation is assertable — cost if wrong: none.
- Task 5: Ruling: services deliverables and process step lines written from the approved offer (no invented commitments like fixed quotes or timelines beyond spec) — Dan should confirm wording — cost if wrong: copy edit.
- Task 5: Ruling: contact heading uses the approved alt headline "Your pitch promised AI. I make it real." — cost if wrong: copy edit.
- Task 5: Ruling: added site.bio alongside planned proofResult/tools — keeps all hand-edited copy in site.config.ts — cost if wrong: none.
- Task 6: Ruling: Results moved from markdown body to front matter `results: string[]` so the interactive element can sit between Process and Results as the spec orders — cost if wrong: Results can't hold rich markdown.
- Task 6: Ruling: added test 'interactive element sits between Process and Results' and slider --pos assertion beyond plan — pins spec order and visible effect — cost if wrong: none.
- Task 8: Ruling: added 3 unit tests beyond plan (trim, optional fields, 400 json) — 15 total — cost if wrong: none.
- Task 8: Ruling: 303 uses explicit relative Location '/thanks' (Response.redirect forces absolute) — matches contract — cost if wrong: none.
- Task 9: Ruling: astro build.format 'file' + trailingSlash 'never' — avoids a redirect hop on every internal link (/thanks → /thanks/) — cost if wrong: URL shape change before launch only.
- Task 9: Ruling: honeypot test checks aria-hidden + off-viewport + tabindex -1 instead of toBeHidden (off-screen positioning is intentional; display:none is skipped by many bots) — cost if wrong: none.
- Task 9: Ruling: added --error token (light #a3261b 6.7:1, dark #ff8f80 8.7:1), inline field errors from server 400s, and test for them — cost if wrong: none.
- Task 10: Ruling: scroll reveal limited to work imagery (not every section) per impeccable craft floor "one authored moment"; hero headline rise is the authored moment — cost if wrong: add reveals later.
- Task 10: Ruling: added reduced-motion hover test and touch scroll-into-view test beyond plan — cost if wrong: none.
- Task 10: Ruling: reduced-motion tests passed before implementation (nothing animated yet); kept as guards — cost if wrong: none.
- Task 11: Ruling: noindex pages omit canonical; Base gets `noindex` prop (replaces head-slot meta) — cost if wrong: none.
- Task 11: Ruling: SEO test also checks og:image resolves (200), sitemap excludes /thanks, robots points at sitemap — beyond plan — cost if wrong: none.
- Task 11: Ruling: OG default image rendered with Playwright + embedded Geist (headline on brand ground) — cost if wrong: swap the PNG.
- Task 12: Ruling: @lhci/cli replaced by scripts/lighthouse.mjs (Lighthouse API + Playwright Chromium + gzip static server) — chrome-launcher hits "spawn UNKNOWN" in this sandbox — cost if wrong: no lhci upload/history; same budgets enforced. Result: 100/100/100/100 on all 4 pages, LCP ≤1.37s, ≤444KB.
- Task 12: Ruling: quality tests run on desktop project only (they set their own viewports) — cost if wrong: none.
- Task 12: Ruling: long-title check (Review Focus #5) found overflow on homepage card + next-case link; fixed with overflow-wrap on headings/body/next link — cost if wrong: none.
- Final: design finish review (impeccable) → 8 material fixes; applying 1-6 and 8. Final: Ruling: design fix 7 (trim footer) declined — footer is the only email/LinkedIn path on case study, lab, thanks pages and the no-JS quality test requires it on every page — cost if wrong: small repetition on homepage.
- Final: Ruling: hero h1 exceeds craft-floor 6rem display cap (clamp to ~9rem) — the direction contract ("headline set huge, ~10 of 12 columns") and the chosen studio canon override the floor default — cost if wrong: one token.
- Final: Ruling: ctrl-click test asserts our handler doesn't intercept (defaultPrevented) instead of waiting for a real new tab — headless Chromium opens tabs inconsistently for synthetic ctrl-clicks — cost if wrong: none (browser behaviour is native).

## Deferred minors

- no rate limit on /api/brief (needs Workers ratelimit binding; low traffic risk).
- name check only blocks CR/LF, not other control chars (send fails harmlessly).

## Redesign: Gallery Index (feat/gallery-redesign)

- Direction chosen by Dan: "Gallery Index" (Kolkhoze-led), both signature moments (diffusion reveal + pipeline reveal), shoji added mid-round. Cost if wrong: token and section rework.
- Site is dark for every visitor (no device light/dark switching); light moments come from washi bands. Cost if wrong: re-add a light token set.
- Typeface Hanken Grotesk (closest free Suisse/Helvetica-style grotesk, picked from a 3-font specimen); Geist Mono only for pipeline data. Cost if wrong: font swap in tokens.css.
- No accent colour: buttons invert their ground (light pill on dark, dark pill on washi). Cost if wrong: one token.
- Pipeline values (model, steps, seed, render) are [PLACEHOLDER] demonstration data in each case study file; replace with real numbers. Cost if wrong: misleading claims if left in.
- Work index row layout (with the hover reveal) applies from 1280px wide with a mouse; narrower screens show each project open with its image and pipeline data. Cost if wrong: breakpoint tweak.
- Shoji proportions: frames are 1:2 panels (hero and work screens are two-panel 1:1 diptychs). Cost if wrong: aspect-ratio tweaks.
- Washi texture is a vector SVG (public/textures/washi.svg), not a raster scan. Reviewer note (not blocking): rotating one fibre layer slightly off-axis would read more like kozo paper.
- Detector advisories left as-is: before/after overlay colours, focus-ring 2px corner, band backlight are documented exceptions in DESIGN.md.

## Identity layer (live site + Shoji app)

- "Shoji" in the redesign request meant Dan's own app; the paper-screen layer came from a misreading and Dan chose to keep it.
- Hero leads with the live-site headline; "The AI half of your creative team." moves to Services. Headline split into three ragged lines so both gold "with"s align.
- Email switched to bierredan@gmail.com (from the placeholder hello@danbierre.dev).
- FH Enso (live site's display face) not used: the files are a trial ("FHEnsoTest"), so licensing for a live site is unclear. Shippori Mincho (free) is used for numerals.
- Japanese fonts: system fonts (Hiragino Sans / Yu Gothic UI / Meiryo, system Mincho for spine labels) instead of downloading Zen Kaku Gothic New; downloading it pushed the Japanese page to 1.08 MB and 4 s to first content. Cost if wrong: re-add the font and accept the speed hit.
- Japanese copy drafted by Claude; please review. Already adjusted: 相談を予約 (not 通話を予約), removed a repeated 暮らし. Please confirm the katakana of your name: ダン・ビエール.
- Japanese version covers the homepage only (/ja); case studies, Lab, thanks and 404 stay English. The 日本語 switch on those pages goes to the Japanese homepage.
- Light theme uses the live site's palette; bands become dark screens without the washi texture. Dark remains the default for first-time visitors.
- The live site's AKL/TYO clocks were not selected; the reviewer noted they would be a natural home for the serif numerals and the rust "now" marker if you want them later.
- Shoji case study copy is drawn from the live site; please check the role line ("Design, build, Japanese localisation") and the results lines are accurate.

## Lab

- Six Lab ideas added: Ensō Generator (built, live at /lab/enso), Campaign Variant Machine, Kinetic Type from Voice, AI Rough Cut, Agent X-ray, Kanji Develops.
- Every Lab entry carries a status: only built experiments say "live" (rust marker, "Try it" link); the other five say "in progress" so the site never implies unbuilt work is finished. Change `status` to `live` and add a `link` when you build one.
- The five in-progress entries use [PLACEHOLDER] images; the Ensō cover is real (rendered from the generator code).
- Shared button fix: `<button>`-based secondary buttons no longer show the browser's default grey background.
- Homepage first-content time rose to 1.96 s (budget 2 s, was 1.73 s) with the new Lab imagery; worth watching once real images land.

## Hero: indie edit (replaces the hero footage placeholder)

- Live ensō hero tried and dropped at Dan's request; replaced by a Gawx-style "indie edit" (reference: "Japan" by Gawx).
- Built as one WebGL shader: speed ramps (time warp), motion blur + trails, night halation, film burns and flash frames at cuts, grain, gate weave, colour split, vignette. Loops ~11 s across 6 shots: Dan's Fushimi Inari photo (punch-ins, drifts) and a generated Tokyo-night bokeh/streak scene. Real clips can be added as more sources later.
- Runs at 24 fps, starts when the page is idle, only while on screen, and only with hardware graphics: software renderers (no GPU, as in Lighthouse and very low-end devices) and reduced-motion visitors see a graded still of the photo. Pause button kept (WCAG 2.2.2).
- Tests force software rendering on via a window flag (`__indieEditAllowSoftware`); real visitors cannot trigger it accidentally.
- Old placeholder hero video and poster removed (homepage weight 546 KB → 176 KB).
- Real footage added: five Mixkit 1080p clips (Tokyo street, neon signs, fisheye subway, paper lantern, Shibuya crossing), cut to 3 s each and graded into one look by `scripts/cut-japan-clips.sh` (milky blacks, warm highlights, pulled-back saturation; the crossing is pushed from day to dusk). Mixkit's "train at night" (46122) is gone (403). Raw clips live in `media-src/japan/`, cuts in `public/media/japan/` (8.9 MB); both are gitignored, so a fresh clone shows the night scene in their place until the script is re-run. Cost if wrong: host the cuts on R2.
- Footage loads only once the edit starts (idle, GPU, on screen), never during first load: Lighthouse homepage stays 0.99. Playback rate follows the speed ramp.
- The right shoji panel is frosted paper with the edit's own shot list written on it; the playing line lights up and a `frameAt()` readout ticks (rate, blur, burn), so the hero shows code and editing side by side. Hidden on phones, where the panel is too narrow to read.
