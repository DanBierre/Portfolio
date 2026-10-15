import { test, expect } from '@playwright/test';

const tiles = (page: import('@playwright/test').Page) => page.locator('[data-tile]');

test('generate fills the grid with 24 variants', async ({ page }) => {
  await page.goto('/lab/variants');
  await expect(tiles(page).first()).toBeHidden();
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(tiles(page)).toHaveCount(24);
  await expect(tiles(page).last()).toBeVisible({ timeout: 6000 });
  await expect(page.locator('[data-tile-count]')).toHaveText('24 / 24');
});

test('each tile shows its recipe on focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/variants');
  await page.getByRole('button', { name: 'Generate' }).click();
  const tile = tiles(page).nth(3);
  await tile.focus();
  const recipe = tile.locator('.recipe');
  await expect(recipe).toBeVisible();
  for (const term of ['layout', 'colourway', 'language', 'shot']) await expect(recipe.locator('dt', { hasText: term })).toHaveCount(1);
});

test('every Japanese tile carries Japanese copy', async ({ page }) => {
  await page.goto('/lab/variants');
  const langs = await tiles(page).evaluateAll((els) =>
    els.map((el) => ({ lang: el.getAttribute('lang'), text: el.querySelector('.tile__headline')!.textContent! })),
  );
  expect(langs.filter((t) => t.lang === 'ja')).toHaveLength(12);
  for (const t of langs) expect(/[぀-ヿ一-龯]/.test(t.text)).toBe(t.lang === 'ja');
});

test('reduced motion: all tiles appear at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/variants');
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(tiles(page).last()).toBeVisible();
  const running = await page.evaluate(() =>
    document.querySelector('[data-grid]')!.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
  );
  expect(running).toBe(0);
});

test('without JavaScript all 24 variants are visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/variants');
  await expect(page.locator('[data-tile]:visible')).toHaveCount(24);
  await ctx.close();
});
