import { test, expect } from '@playwright/test';

test('grade: the wipe reveals more of the graded footage as it moves', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/grade');
  const graded = page.locator('[data-graded]');
  const clip = () => graded.evaluate((el) => getComputedStyle(el).clipPath);
  await page.getByLabel('Wipe', { exact: true }).fill('20');
  const narrow = await clip();
  await page.getByLabel('Wipe', { exact: true }).fill('80');
  expect(await clip()).not.toBe(narrow);
});

test('grade: picking a clip swaps raw and graded together', async ({ page }) => {
  await page.goto('/lab/grade');
  await page.getByRole('radio', { name: 'crossing' }).check();
  await expect(page.locator('[data-raw]')).toHaveAttribute('src', /raw\/crossing\.mp4$/);
  await expect(page.locator('[data-graded]')).toHaveAttribute('src', /japan\/crossing\.mp4$/);
  await expect(page.locator('[data-note]')).toContainText(/dusk/i);
});
