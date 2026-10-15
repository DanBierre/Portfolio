import { test, expect } from 'vitest';
import { variants, headlines } from '../../src/data/lab/variants';

const isJapanese = (s: string) => /[぀-ヿ一-龯]/.test(s);

test('the pipeline yields 24 distinct variants', () => {
  const v = variants();
  expect(v).toHaveLength(24);
  expect(new Set(v.map((r) => `${r.shot}|${r.layout}|${r.colourway}`)).size).toBe(24);
});

test('languages are balanced and every headline matches its language', () => {
  const v = variants();
  expect(v.filter((r) => r.lang === 'ja')).toHaveLength(12);
  for (const r of v) {
    expect(isJapanese(r.headline)).toBe(r.lang === 'ja');
    expect(headlines[r.lang]).toContain(r.headline);
  }
});

test('the pipeline is deterministic', () => {
  expect(variants()).toEqual(variants());
});

test('each colourway and each layout appears in both languages', () => {
  const v = variants();
  for (const key of ['colourway', 'layout'] as const)
    for (const value of new Set(v.map((r) => r[key])))
      expect(new Set(v.filter((r) => r[key] === value).map((r) => r.lang)).size, `${key}=${value}`).toBe(2);
});
