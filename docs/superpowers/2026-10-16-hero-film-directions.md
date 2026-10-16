# Hero: three indie-film directions

Headline stays: "I'm Dan. I build with code and edit with intent."
Rules for all three: organic film artifacts only. No RGB split, no chromatic aberration, no terminal or
matrix text. Code shows up the way light, paper and celluloid would carry it.

Code below is Tailwind v4 (CSS-first `@theme`). The site does not use Tailwind today; building any of
these means either adding `@tailwindcss/vite` or translating the same values into the site's CSS.

## Shared setup (all options)

```css
/* src/styles/film.css */
@import "tailwindcss";

@theme {
  --color-celluloid: #141414;
  --color-paper: #ecebe7;
  --color-amber: #c9a24f;
  --color-ember: #c8613a;
  --font-display: "Hanken Grotesk Variable", system-ui, sans-serif;
  --font-slate: "Geist Mono Variable", ui-monospace, monospace;
  --ease-gate: cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* Grain: an animated noise plate that sits over footage and type alike. */
@utility film-grain {
  position: absolute;
  inset: -50%;
  pointer-events: none;
  background-image: url("/textures/grain.png");
  mix-blend-mode: overlay;
  animation: var(--animate-grain);
}
@theme {
  --animate-grain: grain 0.42s steps(1) infinite;
  @keyframes grain {
    0%, 100% { translate: 0 0; }
    25% { translate: -3% 2%; }
    50% { translate: 2% -4%; }
    75% { translate: -4% -1%; }
  }
}

@media (prefers-reduced-motion: reduce) {
  [class*="animate-"], .film-grain { animation: none !important; }
}
```

Footage pool (Mixkit, free licence, 1080p): rainy night street (4331), rainy street with umbrellas
(4231), night drive from the driver's seat (42039), long-exposure Asakusa market (4452), hand on a
misted window (18308), plus the six cuts already in the hero.

---

## Option 1: The 16mm Nostalgia

**Feel:** a home-movie reel shot on Kodak Vision3 500T and printed warm. Soft, tactile, forgiving.

### 1. Footage and edit treatment
- **Stock and grade:** 500T look. Warm the mids (+amber), keep highlights cream not white, lift blacks
  to a soft brown-black (never pure black). Saturation around 85%.
- **Halation:** red-orange glow bleeding off every light source (neon, lantern, headlights). In ffmpeg:
  split, isolate highlights above ~70% luma, blur 18 px, tint ember, screen back on at 40%.
- **Grain:** 16mm, heavy and slightly soft (grain size 1.4 px at 1080p), re-randomised every frame.
- **Gate weave:** ±0.5 px drift on the *footage only*, never the type.
- **Light leaks as transitions:** every cut is covered by a 6–8 frame burn from a frame edge (warm
  orange to cream, `mix-blend-mode: screen`). Cuts land *inside* the burn, so the edit never hard-cuts.
- **Shots:** lantern (hold), rainy street with umbrellas (4231, drift), misted window (18308), street.
  Long holds of 2.5–3.5 s, 24 fps, 180° shutter (natural motion blur only).

### 2. Organic code integration
- **Code as a projected light texture:** a still of real code (`frameAt()` and the shot list), set huge
  in the slate mono, blurred 6 px and sitting at 8% opacity with `mix-blend-mode: screen`. It reads as
  light falling across the scene, like a projector beam catching dust.
- **Halation on the gold words:** "with" glows the same ember as the neon in the shot.
- **Focus pull reveal:** the headline starts defocused (8 px blur, 1.04 scale) and racks into focus.

### 3. Tailwind and interaction

```css
@theme {
  --animate-focus-pull: focus-pull 1.4s var(--ease-gate) both;
  --animate-leak: leak 0.9s ease-out both;
  @keyframes focus-pull {
    from { filter: blur(8px); scale: 1.04; opacity: 0; }
    60% { opacity: 1; }
  }
  @keyframes leak {
    0% { opacity: 0; translate: -40% 0; }
    20% { opacity: 1; }
    100% { opacity: 0; translate: 60% 0; }
  }
}
@utility halation {
  text-shadow: 0 0 0.3em rgb(200 97 58 / 0.45), 0 0 0.9em rgb(201 162 79 / 0.2);
}
```

```astro
<section class="relative isolate min-h-svh overflow-hidden bg-celluloid text-paper">
  <video class="absolute inset-0 size-full object-cover" autoplay muted loop playsinline src="/media/japan/lantern.mp4"></video>
  <!-- projected code: light, not text -->
  <pre aria-hidden="true"
       class="pointer-events-none absolute -right-20 top-10 font-slate text-[9vw] leading-none text-amber/10 mix-blend-screen blur-md select-none">frameAt(t)</pre>
  <!-- light leak, retriggered on every cut -->
  <span aria-hidden="true" class="animate-leak absolute inset-0 bg-[radial-gradient(40%_70%_at_0%_60%,#ff9a3c,transparent_70%)] mix-blend-screen"></span>
  <span aria-hidden="true" class="film-grain opacity-25"></span>

  <h1 class="animate-focus-pull absolute bottom-24 left-6 font-display text-7xl leading-[0.9] tracking-tight">
    I'm Dan. I build<br>
    <span class="halation text-amber">with</span> code and edit<br>
    <span class="halation text-amber">with</span> intent.
  </h1>

  <a href="#contact"
     class="group absolute bottom-8 left-6 rounded-full bg-paper px-6 py-3 text-celluloid
            transition-[filter,box-shadow] duration-500 ease-(--ease-gate)
            hover:shadow-[0_0_2rem_rgb(255_154_60/0.45)] hover:[filter:blur(0.4px)_brightness(1.08)]">
    Book a call
  </a>
</section>
```

Hover is a **burn-in**: the button warms and softens as if light were over-exposing it.

---

## Option 2: The Avant-Garde Time Warp

**Feel:** Wong Kar-wai's *Chungking Express* and *Fallen Angels*: step-printed motion, smeared
neon, time that stutters and then runs.

### 1. Footage and edit treatment
- **Step-printing:** shoot (or conform) at 24 fps, then print each frame 2–3 times with a slow shutter.
  Movement smears and stutters; still things stay sharp. ffmpeg:
  `fps=8,tmix=frames=3:weights='1 1 1',fps=24`, or `minterpolate` off and `framestep=3` + `tblend=all_mode=average`.
- **Shutter angle:** 270–360° (long motion blur) on the moving shots, 45° (crisp, staccato) on the
  stills. The contrast between the two is the look.
- **Time-remap:** the existing speed ramps, sharper. Rush (2–3×), hang in slow-motion (0.25×), rush out.
- **Colour:** split green-teal shadows and warm skin; neon saturated but never clipped.
- **Shots:** night drive (42039, step-printed), long-exposure market (4452), rainy street reflections
  (4331), crossing. Short: 0.8–1.6 s each.

### 2. Organic code integration
- **Code printed at the wrong frame rate:** code lines appear like a step-printed shot, frozen frames
  advancing at 8 or 12 fps against 24 fps footage. Each "frame" of the line holds, then jumps.
- **Code as a double exposure:** the shot list of the edit, set large in white, multiplied over the
  footage for 3–4 frames at each cut (`mix-blend-mode: multiply` on a light plate, so it reads as a
  dissolve of two negatives, not a screen overlay).
- **Motion-smeared type:** on hover, the gold word gets a directional blur trail (stacked text shadows
  offset along the camera direction), not a glitch.

### 3. Tailwind and interaction

```css
@theme {
  --animate-step-12: step-in 0.9s steps(11, end) both;
  --animate-step-8: step-in 1.2s steps(9, end) both;
  --animate-cutaway: cutaway 0.12s steps(1) both;
  @keyframes step-in {
    from { clip-path: inset(0 100% 0 0); filter: blur(2px); }
    to { clip-path: inset(0); filter: none; }
  }
  @keyframes cutaway {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
}
@utility smear {
  text-shadow: -0.06em 0 0 rgb(236 235 231 / 0.35), -0.14em 0 0.04em rgb(236 235 231 / 0.18), -0.26em 0 0.08em rgb(236 235 231 / 0.08);
}
```

```astro
<h1 class="font-display text-7xl leading-[0.9] tracking-tight">
  <span class="block animate-step-12">I'm Dan. I build</span>
  <span class="block animate-step-8 [animation-delay:0.9s]">
    <span class="text-amber transition-[text-shadow] duration-0 hover:smear">with</span> code and edit
  </span>
  <span class="block animate-step-12 [animation-delay:2.1s]">
    <span class="text-amber hover:smear">with</span> intent.
  </span>
</h1>

<!-- Hover is a hard cut-away: the label is swapped for one frame, then back (no ease). -->
<a href="#work" class="group relative inline-flex border border-paper/40 px-6 py-3">
  <span class="group-hover:animate-cutaway">See the work</span>
</a>
```

Interactions are **cuts, never fades**: state changes happen in one frame (`duration-0`, `steps(1)`).

---

## Option 3: The Bleach Bypass / Film Lab

**Feel:** *Se7en*, *Saving Private Ryan*, a contact sheet on a light table. Silver left in the print:
high contrast, colour almost gone, blacks like ink.

### 1. Footage and edit treatment
- **Bleach bypass:** overlay a desaturated copy of the shot on itself (`blend=all_mode=overlay`), drop
  saturation to ~35%, crush blacks hard, keep a hint of amber only in practical lights.
- **Scratches and dust:** a real scanned-film scratch plate (vertical scratches, dust specks), screened
  on at 30%. Scratches drift, they don't flash.
- **Projector flicker:** exposure breathing ±3% at 24 fps, and a one-frame white-out at each cut (the
  shutter catching the lamp).
- **Shots:** misted window (18308), rainy street (4331), subway, crossing. Hard cuts; 2–3 s each.

### 2. Organic code integration
- **Code as edge code:** film negatives carry printed edge numbers (key codes) along the sprocket edge.
  Here, the code is that edge print: the shot list and `frameAt()` timecode run vertically down the
  frame edge in tiny amber mono, as if exposed onto the stock.
- **Contact-sheet framing:** the headline sits inside a viewfinder frame with corner crop marks and a
  frame counter ("24 ▸ 25"), the way a lab marks selects with grease pencil.
- **Grease-pencil select:** the gold words are circled in a hand-drawn stroke (SVG path drawn on).

### 3. Tailwind and interaction

```css
@theme {
  --animate-shutter: shutter 0.18s steps(2, jump-none) both;
  --animate-flicker: flicker 0.083s steps(1) infinite;
  --animate-pencil: pencil 0.7s ease-out 1s both;
  @keyframes shutter {
    0% { background: #fff; opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes flicker {
    0% { filter: brightness(1); }
    50% { filter: brightness(1.03); }
  }
  @keyframes pencil { from { stroke-dashoffset: 1; } }
}
@utility viewfinder {
  background:
    linear-gradient(var(--color-paper) 0 0) top left / 1.25rem 1px no-repeat,
    linear-gradient(var(--color-paper) 0 0) top left / 1px 1.25rem no-repeat,
    linear-gradient(var(--color-paper) 0 0) top right / 1.25rem 1px no-repeat,
    linear-gradient(var(--color-paper) 0 0) top right / 1px 1.25rem no-repeat,
    linear-gradient(var(--color-paper) 0 0) bottom left / 1.25rem 1px no-repeat,
    linear-gradient(var(--color-paper) 0 0) bottom left / 1px 1.25rem no-repeat,
    linear-gradient(var(--color-paper) 0 0) bottom right / 1.25rem 1px no-repeat,
    linear-gradient(var(--color-paper) 0 0) bottom right / 1px 1.25rem no-repeat;
}
```

```astro
<section class="relative isolate min-h-svh overflow-hidden bg-black text-paper">
  <video class="absolute inset-0 size-full object-cover saturate-[.35] contrast-[1.35] animate-flicker" autoplay muted loop playsinline src="/media/japan/window.mp4"></video>
  <span aria-hidden="true" class="absolute inset-0 bg-[url(/textures/scratches.png)] mix-blend-screen opacity-30"></span>
  <!-- edge code, printed down the sprocket edge -->
  <p aria-hidden="true" class="absolute right-3 top-6 font-slate text-[10px] tracking-[0.3em] text-amber/70 [writing-mode:vertical-rl]">
    KJ 24 ▸ shots[3] = ['subway', 2.4, .50] ▸ frameAt(06.80)
  </p>
  <div class="viewfinder absolute bottom-20 left-6 p-8">
    <h1 class="font-display text-7xl leading-[0.9] tracking-tight">
      I'm Dan. I build<br>
      <span class="relative text-amber">with
        <svg class="absolute -inset-3 overflow-visible" viewBox="0 0 100 40" aria-hidden="true">
          <path pathLength="1" class="animate-pencil fill-none stroke-ember [stroke-dasharray:1]" d="M8 22 C 10 4, 90 2, 94 18 S 40 40, 6 26" />
        </svg>
      </span> code and edit<br>
      with intent.
    </h1>
  </div>
  <!-- one-frame shutter flash, retriggered on every cut and on page change -->
  <span aria-hidden="true" class="pointer-events-none absolute inset-0 animate-shutter"></span>
</section>

<a href="#contact" class="relative border border-paper/60 px-6 py-3 transition-none hover:bg-paper hover:text-black active:animate-shutter">
  Book a call
</a>
```

Hover is a **hard negative flip** (paper ↔ black in one frame); press fires a shutter flash.

---

## Footage to add (Mixkit, 1080p)

| Clip | Mixkit id | Size | Best for |
|---|---|---|---|
| Traffic on a rainy night (reflections, bikes) | 4331 | 49.4 MB | Options 1, 2, 3 |
| Pedestrian walk in Tokyo (rain, umbrellas, signage) | 4231 | 55.4 MB | Option 1 |
| View from inside a car in night traffic | 42039 | 58.8 MB | Option 2 |
| Tokyo's busy outdoor market (long exposure) | 4452 | 26.4 MB | Option 2 |
| Drawing on a foggy window on a rainy day | 18308 | 69.9 MB | Options 1, 3 |

Raw total 259.9 MB (kept out of git, in `media-src/`); cut to 3 s graded web clips like the others
(~1–2 MB each).
