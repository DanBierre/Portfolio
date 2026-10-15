import { test, expect } from 'vitest';
import { brushRing } from '../../src/lib/enso';

test('brush ring is a single closed path inside the 100x100 box', () => {
  const d = brushRing({ r: 40, width: 9, seed: 2 });
  expect(d.startsWith('M ')).toBe(true);
  expect(d.endsWith(' Z')).toBe(true);
  const nums = d.match(/-?\d+\.\d+/g)!.map(Number);
  expect(Math.min(...nums)).toBeGreaterThanOrEqual(-1);
  expect(Math.max(...nums)).toBeLessThanOrEqual(101);
});

test('different seeds give different brush strokes', () => {
  expect(brushRing({ r: 40, width: 9, seed: 2 })).not.toBe(brushRing({ r: 40, width: 9, seed: 3 }));
});

test('defaults are unchanged: wobble 1 and sweep 338 reproduce the original stroke', () => {
  expect(brushRing({ r: 40, width: 9, seed: 2, wobble: 1, sweep: 338 })).toBe(brushRing({ r: 40, width: 9, seed: 2 }));
});

test('wobble and sweep shape the stroke', () => {
  const base = brushRing({ r: 40, width: 9, seed: 2 });
  expect(brushRing({ r: 40, width: 9, seed: 2, wobble: 0 })).not.toBe(base);
  expect(brushRing({ r: 40, width: 9, seed: 2, sweep: 300 })).not.toBe(base);
});
