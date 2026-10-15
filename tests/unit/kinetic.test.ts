import { test, expect } from 'vitest';
import { layoutWords } from '../../src/lib/kinetic';

test('one item per word, in order, with the longest word emphasised', () => {
  const words = layoutWords('Plan the day, keep distractions out.');
  expect(words.map((w) => w.text)).toEqual(['Plan', 'the', 'day,', 'keep', 'distractions', 'out.']);
  expect(words.filter((w) => w.emphasis).map((w) => w.text)).toEqual(['distractions']);
});

test('the same line always animates the same way', () => {
  expect(layoutWords('Focus, then stop.')).toEqual(layoutWords('Focus, then stop.'));
});

test('words enter on a stagger and the sentence-final word lands last with a hold', () => {
  const words = layoutWords('Make it real.');
  const delays = words.map((w) => w.delay);
  expect(delays).toEqual([...delays].sort((a, b) => a - b));
  const last = words.at(-1)!;
  const prev = words.at(-2)!;
  expect(last.delay - prev.delay).toBeGreaterThan(words[1].delay - words[0].delay);
});

test('Japanese is split into words without spaces', () => {
  const words = layoutWords('意図をもって編集します。', 'ja');
  expect(words.length).toBeGreaterThan(2);
  expect(words.map((w) => w.text).join('')).toBe('意図をもって編集します。');
});

test('empty input gives no words', () => {
  expect(layoutWords('   ')).toEqual([]);
});
