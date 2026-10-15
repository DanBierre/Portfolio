import { test, expect } from 'vitest';
import { segments, actions, applyActions, runtime } from '../../src/data/lab/rough-cut';

test('the full run produces the expected rough cut', () => {
  const s = applyActions(segments, actions);
  expect(s.order).toEqual(['s3', 's4', 's6', 's9', 's7', 's11']);
  expect(runtime(segments, s.order).toFixed(1)).toBe('31.0');
});

test('drops are tracked and never appear in the cut', () => {
  const s = applyActions(segments, actions);
  expect([...s.dropped].sort()).toEqual(['s1', 's10', 's12', 's2', 's5', 's8'].sort());
  for (const id of s.dropped) expect(s.order).not.toContain(id);
});

test('applying a prefix of actions gives the intermediate state', () => {
  expect(applyActions(segments, actions, 0).order).toEqual([]);
  const first = applyActions(segments, actions, 1);
  expect(first.notes).toHaveLength(1);
  expect(first.order).toEqual([]);
});

test('reorder moves a select to the given position', () => {
  const s = applyActions(
    segments,
    [
      { kind: 'select', segment: 's3' },
      { kind: 'select', segment: 's4' },
      { kind: 'reorder', segment: 's4', to: 0 },
    ],
  );
  expect(s.order).toEqual(['s4', 's3']);
});
