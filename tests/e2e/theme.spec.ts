import { test, expect } from '@playwright/test';

// Gallery Index is one dark world for every visitor, whatever their device theme.
const BG = { light: 'rgb(20, 20, 20)', dark: 'rgb(20, 20, 20)' } as const;

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
