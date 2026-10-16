# Hero: four camera-physics directions (16mm Nostalgia locked)

Base look stays: warm amber 500T grade, halation, 16mm grain, projected code, focus-pull title.
These four change how shots meet each other and how the page answers. No RGB split, no chromatic
aberration, nothing digital.

## Global upgrades (shipped on the live hero already, in the site's CSS)

| Upgrade | What shipped |
|---|---|
| Filmic typography | Title tracking `-0.05em` (`tracking-tighter`), Hanken Grotesk at 430: a raw grotesque set tight like an indie title card |
| Viewfinder gate | `.hero__gate`: four 1px L-brackets (1.6rem arms) and a small centre cross in stone-500 at 30%, inset to the gutter |
| Halation buttons | Hairline `0.5px` borders (stone-600; stone-700 vanished on night footage), faint smoked fill, and an amber bloom on hover/focus: outer glow, inner glow and a text glow. Book a call keeps a faint gold fill to lead |

Tailwind equivalents, for reference:

```html
<!-- Viewfinder gate -->
<div aria-hidden="true" class="pointer-events-none absolute inset-6 text-stone-500/30">
  <span class="absolute left-0 top-0 h-6 w-6 border-l border-t border-current"></span>
  <span class="absolute right-0 top-0 h-6 w-6 border-r border-t border-current"></span>
  <span class="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-current"></span>
  <span class="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-current"></span>
  <span class="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current"></span>
  <span class="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current"></span>
</div>

<!-- Halation buttons -->
<a href="#contact" class="rounded-full border-[0.5px] border-amber-600/55 bg-amber-500/15 px-6 py-3 text-stone-100 backdrop-blur-sm
   transition-[box-shadow,border-color,text-shadow] duration-700 ease-out
   hover:border-orange-300/85 hover:text-orange-50
   hover:shadow-[0_0_0.6rem_rgb(255_154_60/0.35),0_0_2rem_rgb(200_97_58/0.3),inset_0_0_0.8rem_rgb(255_154_60/0.15)]
   hover:[text-shadow:0_0_0.6em_rgb(255_170_90/0.6)]">Book a call</a>
<a href="#work" class="rounded-full border-[0.5px] border-stone-600 bg-stone-950/35 px-6 py-3 text-stone-100 backdrop-blur-sm
   transition-[box-shadow,border-color,text-shadow] duration-700 ease-out
   hover:border-orange-300/85 hover:shadow-[0_0_0.6rem_rgb(255_154_60/0.35),0_0_2rem_rgb(200_97_58/0.3)]">See the work</a>

<!-- Title -->
<h1 class="font-[Hanken_Grotesk_Variable] text-7xl font-[430] leading-[0.9] tracking-tighter">…</h1>
```

## Shared tailwind.config.js

All four options extend this. Delays and durations are set per element with `[animation-delay:…]`.

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{astro,html,ts}'],
  theme: {
    extend: {
      colors: { celluloid: '#141414', paper: '#ecebe7', amber: { film: '#c9a24f' }, ember: '#c8613a' },
      fontFamily: { display: ['"Hanken Grotesk Variable"', 'system-ui', 'sans-serif'], slate: ['"Geist Mono Variable"', 'monospace'] },
      transitionTimingFunction: { gate: 'cubic-bezier(.2,.7,.2,1)', swing: 'cubic-bezier(.7,0,.2,1)' },
      keyframes: {
        // Option 1, step-printed time warp
        'print-8': { from: { clipPath: 'inset(0 100% 0 0)', opacity: '.6' }, to: { clipPath: 'inset(0)', opacity: '1' } },
        'print-12': { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0)' } },
        'step-hold': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.82' } },
        // Option 2, whip-pan
        'whip-out': { to: { transform: 'translateX(-14vw) skewX(-8deg)', filter: 'blur(14px)', opacity: '0' } },
        'whip-in': { from: { transform: 'translateX(14vw) skewX(8deg)', filter: 'blur(14px)', opacity: '0' }, '60%': { filter: 'blur(1px)', opacity: '1' }, to: { transform: 'none', filter: 'none' } },
        // Option 3, J-cut focus pull
        'defocus': { to: { filter: 'blur(14px)', transform: 'scale(1.06)', opacity: '0' } },
        'refocus': { from: { filter: 'blur(14px)', transform: 'scale(.97)', opacity: '0' }, '55%': { opacity: '1' }, to: { filter: 'none', transform: 'none' } },
        // Option 4, reel-skip
        'gate-slip': { '0%': { transform: 'translateY(0)', filter: 'brightness(1)' }, '12%': { transform: 'translateY(-1.2%)', filter: 'brightness(1.5)' }, '30%': { transform: 'translateY(.4%)', filter: 'brightness(1.15)' }, '100%': { transform: 'translateY(0)', filter: 'brightness(1)' } },
        'frame-line': { from: { transform: 'translateY(-110%)' }, to: { transform: 'translateY(110vh)' } },
        'overexpose': { '0%': { opacity: '0' }, '8%': { opacity: '.9' }, '100%': { opacity: '0' } },
      },
      animation: {
        'print-8': 'print-8 1s steps(8,end) both',
        'print-12': 'print-12 .75s steps(9,end) both',
        'step-hold': 'step-hold .25s steps(2) 3',
        'whip-out': 'whip-out .22s cubic-bezier(.7,0,.2,1) both',
        'whip-in': 'whip-in .5s cubic-bezier(.2,.7,.2,1) both',
        'defocus': 'defocus .35s ease-in both',
        'refocus': 'refocus .7s cubic-bezier(.2,.7,.2,1) both',
        'gate-slip': 'gate-slip .28s steps(6) both',
        'frame-line': 'frame-line .12s linear both',
        'overexpose': 'overexpose .17s steps(4) both',
      },
    },
  },
};
```

Every option toggles one class on the hero for each cut (`data-cut` changes, a class is removed, forced
reflow, re-added), exactly as the current edit already fires `--burn`. Reduced motion: all of these off,
cuts become straight cuts.

---

## Option 1: The step-printed time warp (Wong Kar-wai)

**Footage & edit.** Conform the street and rain clips to 24 fps, then step-print: hold every frame 3
times (8 fps cadence) and blend each held frame with the next at 50%, so movement smears and stutters
while still things stay sharp (`ffmpeg: fps=8,tmix=frames=3:weights='1 1 1',fps=24`). Drop the shutter
(270–360°): headlights and puddle reflections pull into long streaks. Time-remap: rush in at 2×, hang at
0.33×, rush out. Moving shots: rain, umbrellas, street. Hold shots (lantern, window) stay at 24 fps,
180°, so the contrast between stutter and calm is the rhythm.

**Lens & UI.** Text prints in at the footage's cadence: the headline at 8 fps steps, the note and slate
at 12 fps, never a smooth fade. On each step-printed shot the gold words "hold" (opacity steps twice).
Buttons answer hover in two hard steps (dim → bloom), not a tween.

```html
<h1 class="font-display text-7xl font-[430] leading-[0.9] tracking-tighter">
  <span class="block animate-print-8">I'm Dan. I build</span>
  <span class="block animate-print-8 [animation-delay:1s]"><span class="text-amber-film">with</span> code and edit</span>
  <span class="block animate-print-8 [animation-delay:2s]"><span class="text-amber-film">with</span> intent.</span>
</h1>
<p class="animate-print-12 [animation-delay:2.9s] font-slate text-xs tracking-wide text-stone-400">shots[2] = ['rain', 2.8, .40]</p>
<a class="… transition-[box-shadow] duration-[250ms] [transition-timing-function:steps(2)] hover:shadow-[0_0_2rem_rgb(200_97_58/0.35)]">See the work</a>
```

## Option 2: The whip-pan acceleration (the camera swipe)

**Footage & edit.** Each cut is a whip-pan: the last 6 frames of the outgoing shot get a horizontal
directional blur ramping 0 → 80 px and a fast push sideways; the first 6 frames of the incoming shot
mirror it from the other side. Built in the shader as a 1-D blur along `uDir` driven by a `whip`
value (0 → 1 → 0 across the cut), with the camera's x accelerating into the cut. Pair shots by screen
direction: street (pan right) → umbrellas (pan right) → rain (pan right), so the momentum carries.

**Lens & UI.** On every cut, the title, slate and viewfinder gate swing with the camera: they slide
out left with a skew and a horizontal smear, then swing back in and settle sharp. On scroll, section
headings enter from the side the camera last moved. The gate brackets lag by 2 frames, like a matte
box catching up.

```html
<div class="group" data-cut-anim>
  <h1 class="font-display tracking-tighter group-[.is-cut]:animate-whip-in">…</h1>
  <div aria-hidden="true" class="absolute inset-6 text-stone-500/30 group-[.is-cut]:animate-whip-in group-[.is-cut]:[animation-delay:80ms]">…brackets…</div>
</div>
<a class="… hover:-translate-x-0.5 hover:[filter:blur(0.3px)] transition-[transform,filter,box-shadow] duration-300 ease-swing">Book a call</a>
```

## Option 3: The J-cut focus pull (optical desync)

**Footage & edit.** The next shot's text arrives before its picture, like a J-cut where the sound
leads. 400 ms before each cut the outgoing clip racks completely out of focus (shader disc blur
0 → 40 px, highlights blooming into soft bokeh circles); the cut happens inside the bokeh; the new shot
racks back to sharp over 600 ms. Best on shots full of points of light: lantern, neon, rain reflections,
window.

**Lens & UI.** 450 ms before each cut, the slate's code line and a one-line shot caption (for
example "rain · Shinjuku · 2.8 s") soften, grow and blur out (`animate-defocus`), then the next shot's
line blurs into focus (`animate-refocus`) while the old picture is still on screen. The headline itself
stays sharp: the focus plane is the type, the world behind it is what drifts.

```html
<p class="font-slate text-xs tracking-wide text-stone-300" data-caption>
  <span class="block data-[out]:animate-defocus">lantern · Asakusa · 3.2 s</span>
  <span class="block animate-refocus [animation-delay:.35s]">umbrellas · Shinjuku · 3.0 s</span>
</p>
```

## Option 4: The reel-skip flash (mechanical jump cut)

**Footage & edit.** Cuts become projector hitches: drop 4–6 frames forward in time on the same shot
(a jump cut), with one over-exposed frame (warm white, 70% screen) and a dark frame-line (the gap
between frames, 6% of the height, soft edges) passing vertically through the picture once. Every
third cut also slips the picture 1% upward for 2 frames, as the strip jumps a sprocket.

**Lens & UI.** The whole hero container flashes `brightness-150 → brightness-100` and slips vertically
(`animate-gate-slip`) on the hitch. A 1px frame-line crosses the viewfinder gate. Buttons on press do
the same micro-slip.

```html
<section class="relative isolate overflow-hidden [&.is-hitch]:animate-gate-slip">
  <span aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-[6%] bg-gradient-to-b from-transparent via-black/80 to-transparent [.is-hitch_&]:animate-frame-line"></span>
  <span aria-hidden="true" class="pointer-events-none absolute inset-0 bg-orange-50 mix-blend-screen opacity-0 [.is-hitch_&]:animate-overexpose"></span>
  …
</section>
<a class="… active:animate-gate-slip">Book a call</a>
```

---

## Footage shortlist for 16mm Nostalgia (not downloaded)

Mixkit, free licence. Sizes are the source files. Clips marked 720p have no 1080p file; the hero renders
at 60% resolution with grain, so 720p reads fine.

| Fit | Clip | Id | Size | Why |
|---|---|---|---|---|
| ★★★ | Window on a rainy day: a red light blurred through rain-streaked glass | 2846 | 70.1 MB (1080p) | Bokeh, rain and halation in one frame; perfect for the J-cut focus pull |
| ★★★ | Sensō-ji entrance: giant red lanterns, crowd in long exposure | 4404 | 16.1 MB (1080p) | Lanterns and motion blur; warm grade sings |
| ★★★ | Sensō-ji, inside the gate: red lantern close | 4405 | 21.8 MB (1080p) | Intimate, tactile, pairs with the existing paper lantern |
| ★★ | Rain falling from a roof, soft bokeh | 2716 | 31.4 MB (1080p) | Quiet cutaway, gives the edit a breath |
| ★★ | Golden sunrise in autumn | 21168 | 5.2 MB (720p) | The "day clearing" ending, amber already |
| ★★ | Gentle breeze as the day dawns | 21143 | 3.1 MB (720p) | Same, softer clouds |
| ★★ | Soft rain and sunshine through leaves | 25375 | 14.2 MB (720p) | Rain turning to sun, a natural bridge |
| ★★ | Kiyomizu-dera stairs, Kyoto (time-lapse) | 20168 | 2.3 MB (720p) | Temple, motion-blurred visitors; grade overcast to warm |
| ★ | Kyoto crossroad at night (time-lapse) | 20161 | 2.4 MB (720p) | Night streaks for the whip-pan option |
