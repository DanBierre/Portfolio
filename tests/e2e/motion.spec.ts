import { test, expect } from '@playwright/test';

const paused = (sel: string) => (page: import('@playwright/test').Page) =>
  page.locator(sel).first().evaluate((v: HTMLVideoElement) => v.paused);

test('reduced motion: no autoplay, no animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('reduced motion: work previews stay paused on hover', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#work article').first().hover();
  await page.waitForTimeout(500);
  expect(await paused('#work article video')(page)).toBe(true);
});

test('motion allowed: the headline moves with the film (gate weave)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  expect(
    await page.evaluate(() =>
      document.getAnimations().some((a) => (a.effect as KeyframeEffect).target?.querySelector?.('h1')),
    ),
  ).toBe(true);
});

test('work card preview plays on hover (desktop)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.locator('#work article:has(video)').first();
  await card.hover();
  await expect.poll(() => card.locator('video').evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.mouse.move(0, 0);
  await expect.poll(() => card.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('work card preview plays when scrolled into view (touch)', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.locator('#work article:has(video)').first();
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => card.locator('video').evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
});
