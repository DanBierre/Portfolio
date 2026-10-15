import { test, expect } from '@playwright/test';

const pathD = (page: import('@playwright/test').Page) => page.locator('#enso-canvas path').getAttribute('d');

test('ensō generator redraws when the controls change', async ({ page }) => {
  await page.goto('/lab/enso');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ensō Generator');
  const before = await pathD(page);
  await page.getByLabel('Brush width').fill('16');
  await expect.poll(() => pathD(page)).not.toBe(before);
  const afterWidth = await pathD(page);
  await page.getByRole('button', { name: 'New stroke' }).click();
  await expect.poll(() => pathD(page)).not.toBe(afterWidth);
});

test('ensō generator exports an SVG file', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/lab/enso');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download SVG' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^enso-\d+\.svg$/);
  const svg = await (await download.createReadStream()).toArray();
  expect(Buffer.concat(svg).toString()).toContain('<path d="M ');
});

test('ensō generator shows a ring without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/enso');
  await expect(page.locator('#enso-canvas path')).toHaveCount(1);
  await expect(page.getByText(/needs JavaScript/i)).toBeVisible();
  await ctx.close();
});
