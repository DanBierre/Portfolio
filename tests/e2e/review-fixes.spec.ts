import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';

// WCAG 2.2.2: auto-playing looping media needs a pause control.
test('hero video can be paused and resumed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const video = page.locator('#hero video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.getByRole('button', { name: 'Pause background video' }).click();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.getByRole('button', { name: 'Play background video' }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
});

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
  expect(await card.locator('img').evaluate((i) => getComputedStyle(i).transform)).toBe('none');
});

test('modifier-clicks on Book a call are left to the browser after Cal loads', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.route(/app\.cal\.com\/embed\/embed\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: '' }));
  await context.route(site.calUrl, (r) => r.fulfill({ contentType: 'text/html', body: '<h1>Booking</h1>' }));
  await page.goto('/');
  const link = page.locator('#hero').getByRole('link', { name: 'Book a call' });
  await link.hover();
  await page.waitForFunction(() => document.querySelector('script[src*="embed.js"]'));
  await page.waitForTimeout(300);
  // Record whether our handler intercepted each click, then stop the navigation.
  await page.evaluate(() => {
    (window as any).__intercepted = [];
    document.addEventListener('click', (e) => {
      (window as any).__intercepted.push(e.defaultPrevented);
      e.preventDefault();
    });
  });
  await link.dispatchEvent('click', { ctrlKey: true, button: 0 });
  await link.dispatchEvent('click', { metaKey: true, button: 0 });
  await link.dispatchEvent('click', { button: 0 });
  // Modifier clicks go to the browser (new tab); a plain click opens the in-page booking modal.
  expect(await page.evaluate(() => (window as any).__intercepted)).toEqual([false, false, true]);
});

test('long unbroken headline and card title do not overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/', '/work/case-study-one']) {
    await page.goto(path);
    await page.evaluate(() => {
      const long = 'Supercalifragilisticexpialidociousgenerativepipelineforaglobalretailbrand';
      document.querySelector('h1')!.textContent = long;
      document.querySelectorAll('.work-card__title, .case__next a').forEach((el) => (el.textContent = long));
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(0);
  }
});
