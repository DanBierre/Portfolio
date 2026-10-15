import { test, expect } from '@playwright/test';

const BG = { light: 'rgb(244, 244, 241)', dark: 'rgb(15, 15, 14)' } as const;

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
