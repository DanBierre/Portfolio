# Hero: filmic text effects

Shipped on the live hero in the site's CSS (`Hero.astro`, `motion.css`). Tailwind equivalents below,
for reference or a future Tailwind build. All four switch off under `prefers-reduced-motion`.

## 1. Projector gate weave (ambient)

A 0.5px vertical shudder and a 90–100% light flicker on the headline block, irregular and stepped, so the
type never sits perfectly still.

## 2. Chemical halation bloom (highlight / hover)

The gold words carry a `#FFB800` drop-shadow bloom that breathes (0.2 → 0.6 over 3.2 s) and swells to
full on hover. Drop-shadow, not text-shadow, so it sits under the grain fill.

## 3. 24fps stepped reveal

The headline's focus pull runs in 17 steps over 1.4 s (12 fps); the note and buttons develop in 12 steps
over 1 s. No smooth digital fades.

## 4. Film-stock grain mix

Each line is filled with a grain plate (an SVG noise filter: dark speckle over ivory at 96%), clipped to
the letters with `background-clip: text`. The grain drifts at film rate, and the 4% transparency lets
the footage show faintly through the letters.

## tailwind.config.js

```js
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .08 0 0 0 0 .06 0 0 0 0 .04 1.1 0 0 0 -.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

module.exports = {
  theme: {
    extend: {
      backgroundImage: { grain },
      dropShadow: {
        halation: '0 0 0.3em rgb(255 186 110 / 0.25)',
        bloom: ['0 0 0.2em rgb(255 184 0 / 0.35)', '0 0 0.6em rgb(255 184 0 / 0.2)'],
        'bloom-hot': ['0 0 0.3em rgb(255 184 0 / 0.6)', '0 0 1em rgb(255 184 0 / 0.35)'],
      },
      keyframes: {
        'gate-weave': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '13%': { transform: 'translateY(0.3px)', opacity: '.96' },
          '27%': { transform: 'translateY(-0.2px)', opacity: '1' },
          '38%': { transform: 'translateY(0.5px)', opacity: '.92' },
          '52%': { transform: 'translateY(0.1px)', opacity: '.99' },
          '66%': { transform: 'translateY(-0.4px)', opacity: '.94' },
          '79%': { transform: 'translateY(0.2px)', opacity: '1' },
          '91%': { transform: 'translateY(-0.1px)', opacity: '.9' },
        },
        bloom: {
          from: { filter: 'drop-shadow(0 0 0.17em rgb(255 184 0 / 0.32))' },
          to: { filter: 'drop-shadow(0 0 0.27em rgb(255 184 0 / 0.46))' },
        },
        'focus-pull': { from: { filter: 'blur(8px)', transform: 'scale(1.04)', opacity: '0' }, '60%': { opacity: '1' } },
        develop: { from: { filter: 'blur(18px)', opacity: '.15' }, '60%': { opacity: '.9' } },
        'letter-grain': {
          '25%': { backgroundPosition: '37px -21px, 0 0' },
          '50%': { backgroundPosition: '-15px 44px, 0 0' },
          '75%': { backgroundPosition: '52px 9px, 0 0' },
        },
      },
      animation: {
        'gate-weave': 'gate-weave 1.33s steps(1) infinite',
        bloom: 'bloom 3.2s ease-in-out infinite alternate',
        'focus-pull-12': 'focus-pull 1.4s steps(17, end) 0.2s both', // 12 fps
        'develop-12': 'develop 1s steps(12, end) 1.2s both',
        'letter-grain': 'letter-grain 0.42s steps(1) infinite',
      },
    },
  },
};
```

## Markup

```html
<div class="motion-safe:animate-gate-weave">
  <h1 class="group origin-bottom-left font-display text-7xl font-[430] leading-[0.9] tracking-tighter motion-safe:animate-focus-pull-12">
    <span class="block w-fit bg-grain bg-[length:160px] bg-[#ecebe7f5] bg-clip-text text-transparent drop-shadow-halation motion-safe:animate-letter-grain">
      I'm Dan. I build
    </span>
    <span class="block w-fit pl-[2.6em] bg-grain bg-[length:160px] bg-[#ecebe7f5] bg-clip-text text-transparent drop-shadow-halation motion-safe:animate-letter-grain">
      <span class="bg-grain bg-[length:160px] bg-[#c9a24ff2] bg-clip-text text-transparent drop-shadow-bloom motion-safe:animate-bloom group-hover:drop-shadow-bloom-hot">with</span> code and edit
    </span>
    <span class="block w-fit pl-[2.6em] bg-grain bg-[length:160px] bg-[#ecebe7f5] bg-clip-text text-transparent drop-shadow-halation motion-safe:animate-letter-grain">
      <span class="bg-grain bg-[length:160px] bg-[#c9a24ff2] bg-clip-text text-transparent drop-shadow-bloom motion-safe:animate-bloom group-hover:drop-shadow-bloom-hot">with</span> intent.
    </span>
  </h1>
  <p class="text-sm text-stone-300 motion-safe:animate-develop-12">Websites · AI agent workflows · Video editing</p>
</div>
```

Notes: `text-transparent` + `bg-clip-text` needs the shadow as a `drop-shadow` filter (text-shadow
would paint over the grain fill). Keep the accessible name on the `<h1>` (`aria-label`) if the lines
are split for styling.

## Footage (same pass)

- Cuts: every one is a warm film burn; every shot drifts (motion blur) on a gentle speed ramp (0.3–0.5,
  the time-warp); a light four-tap diffusion softens the picture like an old lens. No step, whip or skip.
- Print rate: shrine, umbrellas and neon print at 16 fps (hand-cranked), the rest at 24; grain keeps
  running at 24 over the held frames.
- Shot order: Sensō-ji gate at dusk → inside the gate → rain off a roof → umbrellas → wet street → a red
  light through a rainy window → neon. New Mixkit clips: 4404, 4405, 2716, 2846, graded from overcast
  daylight and grey glass to the warm 500T look; rain (4331), umbrellas (4231) and neon (4447) kept.
