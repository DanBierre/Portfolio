import { test, expect } from '@playwright/test';

// Gallery Index is one dark world for every visitor, whatever their device theme.
const BG = { light: 'rgb(18, 16, 14)', dark: 'rgb(18, 16, 14)' } as const;

for (const scheme of ['light', 'dark'] as const) {
  test(`${scheme} theme applies tokens`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(BG[scheme]);
  });
}

test('focus ring is visible on skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

// Switching theme or language is a film burn: the frame burns out to warm light through a gaussian
// blur, the switch happens at the peak, and it burns back in. Instant with reduced motion.
const burnOf = (page) => page.evaluate(() => {
  const c = getComputedStyle(document.documentElement, '::after');
  return { cls: document.documentElement.className, blend: c.mixBlendMode, backdrop: c.backdropFilter, anim: c.animationName };
});

test('theme switch burns out and back in, swapping at the peak', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop'); // the switch lives in the mobile menu on phones
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('[data-theme-toggle]').first().click();
  const up = await burnOf(page);
  expect(up.cls).toMatch(/burn-up/);
  expect(up.anim).toBe('burn-up');
  expect(up.blend).toBe('screen');
  expect(await page.locator('html').getAttribute('data-theme')).toBeNull(); // not yet: it swaps under the burn
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveClass(/burn-down/);
  expect((await burnOf(page)).backdrop).toMatch(/blur/);
});

test('language switch burns out, and the new page burns in', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('nav a[hreflang="ja"]').click();
  expect((await burnOf(page)).cls).toMatch(/burn-up/);
  await expect(page.locator('html')).toHaveClass(/burn-hold/); // keeps flickering while the next page loads
  await page.waitForURL(/\/ja$/);
  // Arrives fully burnt, holds until the page has settled, then burns in.
  await expect(page.locator('html')).toHaveClass(/burn-down/, { timeout: 3000 });
  expect(await page.evaluate(() => sessionStorage.getItem('burn'))).toBeNull(); // used once
  // Only opacity animates (the blur is fixed), so the browser can run it off the main thread.
  expect(await page.evaluate(() => getComputedStyle(document.documentElement, '::after').backdropFilter)).toBe('blur(16px)');
});

test('theme and language switches are instant with reduced motion', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('[data-theme-toggle]').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect((await burnOf(page)).cls).not.toMatch(/burn/);
  await page.locator('nav a[hreflang="ja"]').click();
  await page.waitForURL(/\/ja$/);
  expect((await burnOf(page)).cls).not.toMatch(/burn/);
});
