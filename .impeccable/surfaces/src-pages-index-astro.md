---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/work","src/pages/lab.astro","src/pages/ja"]
---

Scope: homepage (`/`), mode Persuade; case studies (`/work/*`) and Lab are Experience surfaces in the same world.
Audience/job: agency creative directors and producers deciding whether Dan is a safe, high-craft partner; action is Book a call or Send a brief.
Proof: 2 case studies, Lab experiments (placeholders until Dan supplies). Constraints: spec §3–§8; labels ≥12px; offer and contact path above the fold.
References (user-pinned): Kolkhoze (lead), Vècna (hairlines with end labels), shoji screens (added by Dan mid-round: lattice, washi translucency, sliding panels).

## Direction contract
THESIS: A gallery index for generative work: the page reads like a collectible-design catalogue where every piece shows how it was made. Refuses the AI-startup landing page and the generic light studio template it replaces.
OWN-WORLD: Near-black ground (#141414) with flat light-grey bands (#d8d7d2); ink only white/black, no accent colour; colour comes only from the work (monochrome until hovered). One neo-grotesk (Hanken Grotesk) at extreme scale contrast against 12–13px lowercase labels; [bracket] counts; hairlines with end labels; pill buttons; Geist Mono only for pipeline data. Shoji layer: the grid is drawn as a kumiko lattice of hairlines; the grey bands are backlit washi (fibre texture, soft inner light); frames use tall shoji proportions (1:2).
STORY: The first screen states the offer as a giant ragged sentence and offers a call; the work index proves taste and shows the pipeline behind each piece; the grey band explains services; process removes risk; contact closes on a grey band.
FIRST VIEWPORT: Giant sentence-case statement in ragged, indented lines filling most of the width, with a small "experiences and pipelines" note set inside one line's gap; an off-centre portrait frame of monochrome hero footage at the right; lowercase index nav at the top with a solid "book a call" pill; the headline develops out of noise on load.
FORM: User-pinned direction "Gallery Index" (overrides roll; seed key 882904d9 from earlier round). Signature interactions: diffusion reveal on the hero headline; pipeline reveal (image plus model/steps/seed/render) on work index hover/focus; cover morphs into the case study header. Shoji mechanics: the pipeline reveal slides open as two screen panels; the diffusion reveal reads as a form resolving through paper.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Identity layer (added 2026-10-15, from Dan's live site and his app Shoji)
"Shoji" in the earlier round referred to Dan's own app; the paper-screen layer was a misreading that Dan chose to keep (it fits his Japan story).
- Hero now leads with Dan's live-site headline ("I'm Dan. I build with code and edit with intent.", gold "with"s aligned at the start of lines 2 and 3) plus the offer line; the agency line "The AI half of your creative team." heads Services.
- Spine: a vertical line down the left with Japanese section labels (ダン, 制作, サービス, 工程, ラボ, 自己紹介, 連絡先) and dot markers; the hero marker is a rust "now" diamond (Shoji's now line).
- Accents: gold for key words, rust for live/now markers (breaks the earlier no-accent rule at Dan's request).
- Serif voice (Shippori Mincho, latin) for numerals and counts only, as in Shoji.
- About: real rows and portrait inside a build-time brush ensō (Shoji's renderer).
- Shoji leads the work index as Dan's own product, with real screenshots.
- Toggles: 日本語 (Japanese homepage at /ja) and light/dark (light uses the live site's palette; bands invert to dark). Dark stays the default.
