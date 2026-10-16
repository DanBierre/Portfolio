import { test, expect } from '@playwright/test';

test('time warp: the ramp slider reshapes the curve and the readout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/time-warp');
  const curve = page.locator('[data-curve]');
  const before = await curve.getAttribute('d');
  await page.getByLabel('Ramp', { exact: true }).fill('0');
  await expect(curve).not.toHaveAttribute('d', before!);
  await expect(page.locator('[data-k]')).toHaveText('0.00');
});

test('time warp: play runs the shot and the playhead moves', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // nothing moves until asked
  await page.goto('/lab/time-warp');
  const head = page.locator('[data-head]');
  const x0 = await head.getAttribute('x1');
  await page.waitForTimeout(400);
  expect(await head.getAttribute('x1')).toBe(x0);
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(head).not.toHaveAttribute('x1', x0!, { timeout: 2000 });
  await expect(page.locator('[data-rate]')).not.toHaveText('');
});

test('time warp: picking a clip swaps the footage', async ({ page }) => {
  await page.goto('/lab/time-warp');
  await page.getByRole('radio', { name: 'lantern' }).check();
  await expect(page.locator('[data-video]')).toHaveAttribute('src', /lantern\.mp4$/);
});
