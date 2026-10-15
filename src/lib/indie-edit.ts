// Indie edit timeline: a looping sequence of "shots" with speed ramps (time warp), film burns and
// flash frames at the cuts. Pure, so the renderer and the tests agree on every frame.
export type Source = 'photo' | 'night' | 'clip';
/** Graded 3 s cuts in public/media/japan, made by scripts/cut-japan-clips.sh. */
export const CLIPS = ['street', 'neon', 'subway', 'lantern', 'crossing'] as const;
export type Clip = (typeof CLIPS)[number];
export const CUT_LENGTH = 3; // seconds per cut
export type Shot = {
  source: Source;
  clip?: Clip;
  duration: number; // seconds
  ramp: number; // 0 = steady, 1 = hard speed ramp (fast, slow-mo hold, fast)
  from: [x: number, y: number, zoom: number]; // camera start (centre in 0..1, zoom ≥ 1)
  to: [x: number, y: number, zoom: number]; // camera end
};

// Mixkit Japan footage cut with Dan's Fushimi Inari photo and a generated neon stinger.
// Rhythm: open on a hold, then tighten into fast ramps, breathe on the lantern, hit hard to the loop.
export const shots: Shot[] = [
  { source: 'clip', clip: 'street', duration: 2.0, ramp: 0.35, from: [0.5, 0.5, 1.0], to: [0.54, 0.47, 1.15] },
  { source: 'clip', clip: 'neon', duration: 1.0, ramp: 1.0, from: [0.42, 0.5, 1.3], to: [0.6, 0.5, 1.45] },
  { source: 'photo', duration: 1.7, ramp: 0.6, from: [0.5, 0.5, 1.05], to: [0.5, 0.42, 1.35] },
  { source: 'clip', clip: 'subway', duration: 1.3, ramp: 0.85, from: [0.3, 0.5, 1.35], to: [0.7, 0.5, 1.35] },
  { source: 'clip', clip: 'lantern', duration: 2.2, ramp: 0.3, from: [0.45, 0.5, 1.0], to: [0.42, 0.5, 1.2] },
  { source: 'clip', clip: 'crossing', duration: 1.2, ramp: 1.0, from: [0.5, 0.6, 1.5], to: [0.5, 0.45, 1.15] },
  { source: 'night', duration: 0.7, ramp: 1.0, from: [0.2, 0.5, 1.4], to: [0.85, 0.5, 1.4] },
  { source: 'photo', duration: 1.4, ramp: 0.9, from: [0.52, 0.4, 1.6], to: [0.5, 0.38, 2.1] },
];

export const LOOP = shots.reduce((s, x) => s + x.duration, 0);

/** Speed ramp: maps shot progress 0..1 to camera progress 0..1. With ramp > 0 the camera rushes in,
 *  hangs in slow motion through the middle, then rushes out. Always monotonic. */
export function warp(p: number, ramp: number): number {
  const k = 0.95 * ramp; // < 1 keeps the derivative ≥ 0
  return p + (k * Math.sin(2 * Math.PI * p)) / (2 * Math.PI);
}
/** Camera speed (derivative of warp), used for motion blur. 0 at slow-mo, up to ~2 at the rush. */
export const speed = (p: number, ramp: number) => 1 + 0.95 * ramp * Math.cos(2 * Math.PI * p);

export type Frame = {
  shot: number;
  source: Source;
  clip?: Clip;
  /** Footage playback rate: the speed ramp applied to time, clamped to what browsers play smoothly. */
  rate: number;
  /** Camera centre and zoom after the speed ramp. */
  x: number;
  y: number;
  zoom: number;
  /** Motion blur amount 0..1 and its direction (screen space). */
  blur: number;
  dir: [number, number];
  /** Film burn 0..1: blooms at each cut, decays over ~0.6 s. */
  burn: number;
  /** Flash frame 0..1: a white pop for the first ~3 frames after a cut. */
  flash: number;
  /** Seconds since the cut, for per-shot noise seeds. */
  local: number;
};

export function frameAt(time: number): Frame {
  let t = ((time % LOOP) + LOOP) % LOOP;
  let i = 0;
  while (t >= shots[i].duration) t -= shots[i++].duration;
  const s = shots[i];
  const p = t / s.duration;
  const w = warp(p, s.ramp);
  const lerp = (a: number, b: number) => a + (b - a) * w;
  const dx = s.to[0] - s.from[0];
  const dy = s.to[1] - s.from[1];
  const len = Math.hypot(dx, dy) || 1;
  const travel = Math.hypot(dx, dy) + Math.abs(s.to[2] - s.from[2]) * 0.3;
  const sinceCut = t;
  const untilCut = s.duration - t;
  return {
    shot: i,
    source: s.source,
    clip: s.clip,
    rate: Math.min(2.5, Math.max(0.25, speed(p, s.ramp))),
    x: lerp(s.from[0], s.to[0]),
    y: lerp(s.from[1], s.to[1]),
    zoom: lerp(s.from[2], s.to[2]),
    blur: Math.min(1, (speed(p, s.ramp) * travel) / s.duration) * (0.4 + 0.6 * s.ramp),
    dir: [dx / len, dy / len],
    // Burn on the way out of a shot and into the next, so it masks the cut.
    burn: Math.max(Math.exp(-sinceCut / 0.18), Math.exp(-untilCut / 0.12) * 0.6),
    flash: sinceCut < 0.06 ? 1 - sinceCut / 0.06 : 0,
    local: sinceCut,
  };
}
