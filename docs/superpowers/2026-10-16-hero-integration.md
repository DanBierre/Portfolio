# Hero integration (2026-10-16)

Dan: the edit "doesn't match the vibe of the front page". Built options A + B + D from the proposal.

- **A. Seen through shoji.** The edit is footage only (Dan's portrait removed from the shots and the still). The shader drains most colour into a charcoal-to-gold split tone, lifts blacks to paper grey, adds washi fibres; a washi overlay sits on top. Cuts hold longer (1.6–2.6 s), only two hard ramps, burns at half strength, flash frames are a soft warm lift instead of white. A late clip holds the last frame instead of cutting to the generated night scene.
- **B. Page answers the cut.** On each cut the gold "with" words and the rust "now" diamond catch the light (700 ms glow).
- **D. Code as burn-in.** The frosted code panel is gone; a dailies-style burn-in runs along the foot of the footage: the shot's line of code, `frameAt()` clock and rate, and the cut as a track with the playing shot filling gold. Phones keep the track and clock.
- Still frame (no WebGL, reduced motion, Save-Data, before the edit starts) is a frame of the lantern shot baked with the same tone (`src/assets/hero-still.jpg`). Save-Data visitors now keep the still instead of streaming ~9 MB.
- About portrait: face centred in the ensō (the `<picture>` wrapper was breaking the crop), graded like the hero, washi over it; the ensō brushes itself round on scroll.
- Footer: wordmark spans the content column exactly (container units), one hairline row with a back-to-top link; phones wrap it into two lines.

## Footage as the hero background, kinetic intro

- The footage is now the hero's full-bleed background (no shoji panel), under washi, a kumiko lattice and a scrim that falls to charcoal in the headline corner so the type always reads. The hero is a dark screen in both themes (its own token overrides).
- Kinetic intro replaces the diffusion reveal: each headline word hard-cuts in with a horizontal smear and settles, beats 0.1 s apart with a held beat before each gold word (which flashes like a burn), the last word lands on a letter-spacing speed ramp. Then the footage slides open like a shoji door and the note, actions and burn-in slate come in. The edit starts only once the doors are open, so the lantern shot plays in full. Pure CSS, so it runs without JavaScript; reduced motion gets the finished frame.
- The slate sits bottom right of the frame. Canvas renders at 0.6 of CSS size (full bleed: softer and cheaper). The still ships at 480/800/1080 px under the scrim; homepage LCP ~1.97 s, inside the 2 s budget but close. Cost if it tips over: drop the still to 800 px max.
