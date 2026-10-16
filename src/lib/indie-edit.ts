// Indie edit timeline: a looping sequence of "shots" with speed ramps (time warp), film burns and
// flash frames at the cuts. Pure, so the renderer and the tests agree on every frame.
export type Source = 'night' | 'clip';
/** Graded 3 s cuts in public/media/japan, made by scripts/cut-japan-clips.sh. */
export const CLIPS = ['garden', 'market', 'kimono', 'shrine', 'gate', 'pagoda', 'lantern', 'building', 'redlight'] as const;
export type Clip = (typeof CLIPS)[number];
export const CUT_LENGTH = 4; // seconds per cut
export type Shot = {
  source: Source;
  clip?: Clip;
  duration: number; // seconds
  ramp: number; // 0 = steady, 1 = hard speed ramp (fast, slow-mo hold, fast)
  from: [x: number, y: number, zoom: number]; // camera start (centre in 0..1, zoom ≥ 1)
  to: [x: number, y: number, zoom: number]; // camera end
  /** Print rate: 24 fps, or 16 for a hand-cranked, old-film stutter. */
  fps: 24 | 16;
};

/** Half-length of the dissolve either side of a cut (seconds). */
const DISSOLVE = 0.4;

/** Which footage frame is on screen at time t for a given print rate; a new index means a new frame. */
export const printIndex = (t: number, fps: number) => Math.floor(t * fps + 1e-6);

// 16mm nostalgia, shot like an old-school camera: every shot drifts (motion blur), runs on a gentle
// speed ramp (time-warp) and dissolves into the next through a warm film burn. The reel runs a day in
// Japan from mist to rain, the calm of gardens and shrines against the rush of crowds: a stone lantern
// in a misted garden, the Asakusa market, a kimono in a Kyoto lane, Sensō-ji's gate and inside it, the
// pagoda at nightfall (vertical, so the camera tilts down it), a paper lantern, a wet building at night,
// a red light through rain on glass, and back to the mist. The crowds print hand-cranked at 16 fps.
export const shots: Shot[] = [
  { source: 'clip', clip: 'garden', duration: 3.2, ramp: 0.25, from: [0.42, 0.52, 1.05], to: [0.52, 0.47, 1.22], fps: 24 },
  { source: 'clip', clip: 'market', duration: 2.4, ramp: 0.5, from: [0.5, 0.6, 1.3], to: [0.5, 0.45, 1.08], fps: 16 },
  { source: 'clip', clip: 'kimono', duration: 3.0, ramp: 0.25, from: [0.38, 0.5, 1.1], to: [0.48, 0.46, 1.25], fps: 24 },
  { source: 'clip', clip: 'shrine', duration: 2.4, ramp: 0.5, from: [0.5, 0.55, 1.3], to: [0.5, 0.45, 1.08], fps: 16 },
  { source: 'clip', clip: 'gate', duration: 3.0, ramp: 0.25, from: [0.4, 0.5, 1.12], to: [0.56, 0.48, 1.22], fps: 24 },
  { source: 'clip', clip: 'pagoda', duration: 3.2, ramp: 0.3, from: [0.5, 0.3, 1.0], to: [0.5, 0.6, 1.0], fps: 24 },
  { source: 'clip', clip: 'lantern', duration: 3.2, ramp: 0.25, from: [0.44, 0.52, 1.0], to: [0.39, 0.48, 1.18], fps: 24 },
  { source: 'clip', clip: 'building', duration: 2.8, ramp: 0.35, from: [0.45, 0.55, 1.15], to: [0.55, 0.48, 1.3], fps: 24 },
  { source: 'clip', clip: 'redlight', duration: 2.8, ramp: 0.35, from: [0.5, 0.5, 1.2], to: [0.44, 0.45, 1.05], fps: 24 },
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
  /** Flash frame 0..1: a soft warm lift for the first ~2 frames after a cut (never a white pop). */
  flash: number;
  /** Dissolve 0..1 around a cut: the outgoing shot ghosts into the incoming one through the burn. */
  dissolve: number;
  /** The shot's print rate (24 or 16 fps). */
  fps: number;
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
  const blur = Math.min(1, (speed(p, s.ramp) * travel) / s.duration) * (0.4 + 0.6 * s.ramp);
  return {
    shot: i,
    source: s.source,
    clip: s.clip,
    rate: Math.min(2.5, Math.max(0.25, speed(p, s.ramp))),
    x: lerp(s.from[0], s.to[0]),
    y: lerp(s.from[1], s.to[1]),
    zoom: lerp(s.from[2], s.to[2]),
    blur,
    dir: [dx / len, dy / len],
    // 16mm: a light leak swells over the last frames of a shot and the cut lands inside it.
    burn: Math.max(Math.exp(-sinceCut / 0.28), Math.exp(-untilCut / 0.18) * 0.9),
    flash: sinceCut < 0.08 ? 0.3 * (1 - sinceCut / 0.08) : 0,
    dissolve: Math.max(0, 1 - Math.min(untilCut, sinceCut) / DISSOLVE) ** 1.5,
    fps: s.fps,
    local: sinceCut,
  };
}
