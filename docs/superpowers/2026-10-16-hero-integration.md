# Hero integration (2026-10-16)

Dan: the edit "doesn't match the vibe of the front page". Built options A + B + D from the proposal.

- **A. Seen through shoji.** The edit is footage only (Dan's portrait removed from the shots and the still). The shader drains most colour into a charcoal-to-gold split tone, lifts blacks to paper grey, adds washi fibres; a washi overlay sits on top. Cuts hold longer (1.6–2.6 s), only two hard ramps, burns at half strength, flash frames are a soft warm lift instead of white. A late clip holds the last frame instead of cutting to the generated night scene.
- **B. Page answers the cut.** On each cut the gold "with" words and the rust "now" diamond catch the light (700 ms glow).
- **D. Code as burn-in.** The frosted code panel is gone; a dailies-style burn-in runs along the foot of the footage: the shot's line of code, `frameAt()` clock and rate, and the cut as a track with the playing shot filling gold. Phones keep the track and clock.
- Still frame (no WebGL, reduced motion, Save-Data, before the edit starts) is a frame of the lantern shot baked with the same tone (`src/assets/hero-still.jpg`). Save-Data visitors now keep the still instead of streaming ~9 MB.
- About portrait: face centred in the ensō (the `<picture>` wrapper was breaking the crop), graded like the hero, washi over it; the ensō brushes itself round on scroll.
- Footer: wordmark spans the content column exactly (container units), one hairline row with a back-to-top link; phones wrap it into two lines.
