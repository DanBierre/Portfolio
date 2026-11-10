import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';

test('touch previews play once instead of looping', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  expect(await page.locator('#work article video').first().evaluate((v: HTMLVideoElement) => v.loop)).toBe(false);
});

test('reduced motion: work card hover does not zoom', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const card = page.locator('#work article').first();
  await card.hover();
  await page.waitForTimeout(1000);
  expect(await card.locator('img.row__thumb').evaluate((i) => getComputedStyle(i).transform)).toBe('none');
});


test('long unbroken headline and card title do not overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/', '/work/japan-reel']) {
    await page.goto(path);
    await page.evaluate(() => {
      const long = 'Supercalifragilisticexpialidociousgenerativepipelineforaglobalretailbrand';
      document.querySelector('h1')!.textContent = long;
      document.querySelectorAll('.work-card__title, .case__next a').forEach((el) => (el.textContent = long));
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(0);
  }
});
