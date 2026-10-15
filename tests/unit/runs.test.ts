import { test, expect } from 'vitest';
import { runs, totals, formatSeconds, formatCost } from '../../src/data/lab/runs';

test('totals add up every step', () => {
  for (const run of runs) {
    const t = totals(run.steps);
    expect(t.ms).toBe(run.steps.reduce((s, x) => s + x.ms, 0));
    expect(t.cents).toBeCloseTo(run.steps.reduce((s, x) => s + x.cents, 0));
  }
});

test('every run ends with an answer and contains at least one backtrack', () => {
  for (const run of runs) {
    expect(run.steps.at(-1)!.kind).toBe('result');
    expect(run.steps.some((s) => s.kind === 'backtrack')).toBe(true);
  }
});

test('counters format as seconds and dollars', () => {
  expect(formatSeconds(12340)).toBe('12.3 s');
  expect(formatCost(2.4)).toBe('$0.024');
});
