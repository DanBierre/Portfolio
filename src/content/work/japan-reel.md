---
title: "Japan reel"
clientType: "Own project. I directed, edited and graded it"
role: "Direction, edit, real-time build"
timeline: "October 2026"
outcome: "A 26-second 16mm-style film of Japan that plays live in the browser, behind this site's headline."
results:
  - "Nine shots in a 26-second loop, with burns, grain and halation rendered live instead of baked in"
  - "The homepage stays inside its speed budget: main content on screen in about 1.8 s, with no layout shift"
order: 1
year: "2026"
made:
  - { label: footage, value: "Mixkit stock" }
  - { label: shots, value: "9, from a pool of 23 clips" }
  - { label: print, value: "24 fps · 16 fps for crowds" }
  - { label: render, value: "WebGL, live in the browser" }
cover: ../../assets/work/japan-reel/cover.jpg
coverAlt: "A glowing paper lantern with black brushed kanji in a dark Japanese alley, graded warm orange"
preview: /media/japan-reel-preview.webm
beforeAfter:
  before: ../../assets/work/japan-reel/kimono-raw.jpg
  after: ../../assets/work/japan-reel/kimono-graded.jpg
  beforeAlt: "A woman in a kimono in a narrow lane under a paper lantern, in the stock clip's original colour"
  afterAlt: "The same shot in the reel's warm orange grade, with soft contrast and brown shadows"
  caption: "Drag to compare the stock clip with the base grade. Grain and burns are added on top, live in the browser."
---

## Challenge

I wanted this site to open on something that feels like old 16mm film and still reads as a professional coder's site. It had to play behind the headline without slowing the page down.

## My role

I directed the film: the Japan-only idea, the shots and how it should feel. The footage is Mixkit stock, so none of the camera work is mine. The colour grade and the WebGL renderer were built with Claude, to my direction.

## Process

The reel runs a day in Japan from mist to rain, setting calm gardens and shrines against busy crowds. Each shot drifts on a slow camera move and a gentle speed ramp, then dissolves into the next through a warm film burn. The crowds print at 16 fps for a hand-cranked feel.

![A dense crowd blurs through the Asakusa market street under hanging red lanterns](../../assets/work/japan-reel/market.jpg)

Only the base grade is baked into the clips: warm orange, soft contrast and no blue. Halation, grain and burns come from the shader, so they stay live. Text shake, iris wipes, whip cuts, a 4:3 frame and heavier grain all got cut for looking gimmicky or digital.

![The red pillars and giant lanterns of Sensō-ji's gate, with crowds blurring past in warm light](../../assets/work/japan-reel/gate.jpg)
