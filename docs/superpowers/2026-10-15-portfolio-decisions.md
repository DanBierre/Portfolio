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
