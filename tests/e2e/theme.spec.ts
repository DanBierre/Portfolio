import { test, expect } from '@playwright/test';

const BG = { light: 'rgb(242, 243, 244)', dark: 'rgb(18, 16, 13)' } as const;

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
