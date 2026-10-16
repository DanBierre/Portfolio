import { test, expect } from 'vitest';
import { shots, LOOP, frameAt, warp, CLIPS, CUT_LENGTH, printIndex } from '../../src/lib/indie-edit';

test('the loop is the sum of the shots and wraps around', () => {
  expect(LOOP).toBeCloseTo(shots.reduce((s, x) => s + x.duration, 0));
  expect(frameAt(LOOP + 0.5).shot).toBe(frameAt(0.5).shot);
});

test('each moment belongs to exactly one shot, in order', () => {
  let t = 0;
  shots.forEach((s, i) => {
    expect(frameAt(t + s.duration / 2).shot).toBe(i);
    t += s.duration;
  });
});

test('speed ramp (time warp) is monotonic and hits both ends', () => {
  for (const ramp of [0, 0.5, 1]) {
    expect(warp(0, ramp)).toBeCloseTo(0);
    expect(warp(1, ramp)).toBeCloseTo(1);
    let prev = -1;
    for (let p = 0; p <= 1; p += 0.05) {
      const v = warp(p, ramp);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  }
});

test('film burn and flash peak at the cuts and are quiet mid-shot', () => {
  const firstCut = shots[0].duration;
  expect(frameAt(firstCut + 0.02).burn).toBeGreaterThan(frameAt(firstCut / 2).burn * 5);
  expect(frameAt(firstCut + 0.01).flash).toBeGreaterThan(0.15);
  expect(frameAt(shots[0].duration / 2).burn).toBeLessThan(0.1);
  expect(frameAt(shots[0].duration / 2).flash).toBe(0);
});

test('moving shots blur more than still ones', () => {
  const startOf = (k: number) => shots.slice(0, k).reduce((t, s) => t + s.duration, 0);
  const peak = (k: number) =>
    Math.max(...[0.1, 0.5, 0.9].map((p) => frameAt(startOf(k) + shots[k].duration * p).blur));
  const byRamp = shots.map((s, i) => [s.ramp, i]).sort((a, b) => a[0] - b[0]);
  expect(peak(byRamp.at(-1)![1])).toBeGreaterThan(peak(byRamp[0][1]));
});

test('the edit is all footage: every clip, no portrait', () => {
  const clips = new Set(shots.filter((s) => s.source === 'clip').map((s) => s.clip));
  expect([...clips].sort()).toEqual([...CLIPS].sort());
  expect(shots.every((s) => s.source !== ('photo' as string))).toBe(true);
});

test('16mm pacing: long holds of 2.4 s and up', () => {
  for (const s of shots) expect(s.duration).toBeGreaterThanOrEqual(2.4);
});

test('light leaks cover the cuts: the burn is already rising before each cut', () => {
  const firstCut = shots[0].duration;
  expect(frameAt(firstCut - 0.05).burn).toBeGreaterThan(0.5);
  expect(frameAt(firstCut + 0.1).burn).toBeGreaterThan(0.5);
});

test('flash frames are soft: a warm lift, never a white pop', () => {
  const firstCut = shots[0].duration;
  expect(frameAt(firstCut + 0.01).flash).toBeLessThanOrEqual(0.35);
});

test('clip playback rate follows the speed ramp within browser-safe bounds', () => {
  let start = 0;
  for (const s of shots) {
    const rates = [0.05, 0.5, 0.95].map((p) => frameAt(start + s.duration * p).rate);
    for (const r of rates) expect(r).toBeGreaterThanOrEqual(0.25), expect(r).toBeLessThanOrEqual(2.5);
    if (s.ramp > 0.5) expect(rates[0]).toBeGreaterThan(rates[1]); // rush in, slow-mo hold
    start += s.duration;
  }
});

test('no shot plays past the end of its cut', () => {
  // Footage consumed = integral of the playback rate over the shot; must fit in the 3 s cut.
  let start = 0;
  for (const s of shots) {
    let used = 0;
    for (let t = 0; t < s.duration; t += 0.01) used += frameAt(start + t).rate * 0.01;
    if (s.source === 'clip') expect(used).toBeLessThan(CUT_LENGTH);
    start += s.duration;
  }
});

test('no generated filler in the cut: every shot is real footage', () => {
  expect(shots.every((s) => s.source === 'clip')).toBe(true);
  expect(new Set(shots.map((s) => s.clip)).size).toBe(shots.length);
});

// Old-school camera: every shot gets a film burn at its cut, motion blur from a moving camera and a bit
// of time-warp (a gentle speed ramp). No step-printing, whips or skips.
test('every shot carries a gentle time-warp', () => {
  for (const s of shots) {
    expect(s.ramp).toBeGreaterThanOrEqual(0.25);
    expect(s.ramp).toBeLessThanOrEqual(0.5);
  }
});

test('every shot moves the camera, so there is always some motion blur', () => {
  let t = 0;
  for (const s of shots) {
    const peak = Math.max(...[0.1, 0.5, 0.9].map((p) => frameAt(t + s.duration * p).blur));
    expect(peak).toBeGreaterThan(0.02);
    t += s.duration;
  }
});

test('every cut lands inside a film burn', () => {
  let t = 0;
  for (const s of shots) {
    t += s.duration;
    expect(frameAt(t - 0.03).burn).toBeGreaterThan(0.5);
    expect(frameAt(t + 0.03).burn).toBeGreaterThan(0.5);
  }
});

// Frame rate: footage prints at 24 fps, and some shots drop to 16 fps (hand-cranked) for an old-film
// feel. The renderer only puts a new footage frame up when the shot's frame index changes.
test('every shot runs at 24 fps or drops to 16, and both are used', () => {
  for (const s of shots) expect([16, 24]).toContain(s.fps);
  expect(new Set(shots.map((s) => s.fps)).size).toBe(2);
});

test('frame printing follows the shot cadence: 24 or 16 new frames a second', () => {
  for (const fps of [24, 16] as const) {
    let prints = 0;
    let lastIndex = -1;
    for (let t = 0; t < 1; t += 1 / 60) {
      const idx = printIndex(t, fps);
      if (idx !== lastIndex) (prints += 1), (lastIndex = idx);
    }
    expect(prints).toBeGreaterThanOrEqual(fps - 1);
    expect(prints).toBeLessThanOrEqual(fps + 1);
  }
});

test('cuts dissolve through the burn: frames ghost into each other around the cut, sharp mid-shot', () => {
  const cut = shots[0].duration;
  expect(frameAt(cut / 2).dissolve).toBe(0);
  expect(frameAt(cut - 0.05).dissolve).toBeGreaterThan(0.6);
  expect(frameAt(cut + 0.05).dissolve).toBeGreaterThan(0.6);
  expect(frameAt(cut + 0.5).dissolve).toBe(0);
});

// Calm against rush: the crowd shots run short, hand-cranked and harder; everything else holds.
const BUSY = ['market', 'shrine'];
test('crowd shots run short at 16 fps on a harder ramp; calm shots hold at 24', () => {
  const busy = shots.filter((s) => BUSY.includes(s.clip!));
  const calm = shots.filter((s) => !BUSY.includes(s.clip!));
  expect(busy.length).toBeGreaterThanOrEqual(2);
  for (const s of busy) expect(s.fps).toBe(16);
  for (const s of calm) expect(s.fps).toBe(24);
  expect(Math.max(...busy.map((s) => s.duration))).toBeLessThan(Math.min(...calm.map((s) => s.duration)));
  expect(Math.min(...busy.map((s) => s.ramp))).toBeGreaterThan(Math.max(...calm.map((s) => s.ramp)));
});

test('the reel runs from mist to rain: the garden opens it, the rain on glass closes it', () => {
  expect(shots[0].clip).toBe('garden');
  expect(shots.at(-1)!.clip).toBe('redlight');
});
