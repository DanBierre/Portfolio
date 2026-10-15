import { test, expect } from 'vitest';
import { shots, LOOP, frameAt, warp, CLIPS, CUT_LENGTH } from '../../src/lib/indie-edit';

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
  expect(frameAt(firstCut + 0.02).burn).toBeGreaterThan(0.6);
  expect(frameAt(firstCut + 0.01).flash).toBeGreaterThan(0.5);
  expect(frameAt(shots[0].duration / 2).burn).toBeLessThan(0.1);
  expect(frameAt(shots[0].duration / 2).flash).toBe(0);
});

test('fast sections blur more than slow ones', () => {
  const fast = shots.findIndex((s) => s.ramp > 0.7);
  let start = 0;
  for (let i = 0; i < fast; i++) start += shots[i].duration;
  const mid = frameAt(start + shots[fast].duration * 0.5).blur;
  const edge = frameAt(start + shots[fast].duration * 0.1).blur;
  expect(Math.max(mid, edge)).toBeGreaterThan(0.3);
});

test('the edit cuts real footage alongside the photo', () => {
  const clips = new Set(shots.filter((s) => s.source === 'clip').map((s) => s.clip));
  expect([...clips].sort()).toEqual([...CLIPS].sort());
  expect(shots.some((s) => s.source === 'photo')).toBe(true);
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
