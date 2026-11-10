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

test('motion allowed: the headline racks into focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  expect(
    await page.evaluate(() =>
      document.getAnimations().some((a) => (a.effect as KeyframeEffect).target?.closest?.('h1')),
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

// Refreshing mid-page lands straight back where you were: smooth scrolling is only for in-page links
// (something focused), never for the browser restoring the scroll position after load.
test('refresh restores the scroll position instantly, links still glide', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const behavior = () => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(await behavior()).toBe('auto');
  await page.locator('#hero').getByRole('link', { name: 'See prices' }).focus();
  expect(await behavior()).toBe('smooth');
});

// Every load plays the same: the hero intro waits until the page has settled (loaded, fonts in, the
// edit set up), so load work never stutters it.
test('the hero intro waits for the page to settle, then plays', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/\bloading\b/, { timeout: 3000 });
  await page.evaluate(() => document.documentElement.classList.add('loading'));
  const state = (sel: string) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).animationPlayState);
  expect(await state('#hero h1')).toBe('paused');
  expect(await state('#hero .hero__media')).toBe('paused');
});

// The web fonts swap in without moving anything: the fallbacks are metric-matched.
test('late web fonts swap in without a layout shift', async ({ page }) => {
  await page.route(/\.woff2$/, async (r) => (await new Promise((res) => setTimeout(res, 900)), r.continue()));
  await page.addInitScript(() => {
    (window as any).__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e: any) => ((window as any).__cls += e.value))).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as any).__cls)).toBeLessThan(0.005);
});
