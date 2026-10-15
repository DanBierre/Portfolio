import { test, expect } from '@playwright/test';

// Elements created by the experiments' scripts must still get the page's styles.
test('kinetic: the emphasised word is set larger than the others', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/kinetic');
  await page.getByRole('button', { name: 'Animate' }).click();
  const size = (sel: string) => page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(await size('[data-stage] .word.accent')).toBeGreaterThan((await size('[data-stage] .word:not(.accent)')) * 1.8);
});

test('agent x-ray: replayed steps are drawn as boxes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/agent-x-ray');
  await page.getByRole('button', { name: 'Run' }).click();
  const step = page.locator('[data-trace] > li').first();
  expect(await step.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('1px');
  expect(await step.evaluate((el) => getComputedStyle(el).display)).toBe('grid');
});

test('rough cut: timeline clips are drawn as blocks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/rough-cut');
  await page.getByRole('button', { name: 'Play' }).click();
  const clip = page.locator('[data-track] .rc__clip').first();
  expect(await clip.evaluate((el) => getComputedStyle(el).display)).toBe('grid');
  expect(await clip.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
});
