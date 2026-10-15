import { test, expect, type Page } from '@playwright/test';

// Records the largest noise displacement the headline went through, and whether it ended crisp.
async function watchDiffusion(page: Page) {
  await page.addInitScript(() => {
    (window as any).__maxScale = 0;
    new MutationObserver((records) => {
      for (const r of records) {
        const v = Number((r.target as Element).getAttribute('scale'));
        (window as any).__maxScale = Math.max((window as any).__maxScale, v);
      }
    }).observe(document, { attributes: true, attributeFilter: ['scale'], subtree: true });
  });
}

test('diffusion reveal: headline develops out of noise and ends crisp', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await watchDiffusion(page);
  await page.goto('/');
  const title = page.locator('#hero h1');
  await expect(title).not.toHaveClass(/is-developing/, { timeout: 4000 });
  expect(await page.evaluate(() => (window as any).__maxScale)).toBeGreaterThan(40);
  expect(await page.locator('#develop feDisplacementMap').getAttribute('scale')).toBe('0');
});

test('diffusion reveal: skipped entirely under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await watchDiffusion(page);
  await page.goto('/');
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => (window as any).__maxScale)).toBe(0);
  await expect(page.locator('#hero h1')).not.toHaveClass(/is-developing/);
});

test('pipeline reveal: each project lists how it was made', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#work article');
  await expect(rows).toHaveCount(2);
  for (const i of [0, 1]) {
    const specs = rows.nth(i).locator('dl.pipeline');
    for (const term of ['model', 'steps', 'seed', 'render']) await expect(specs.locator('dt', { hasText: term })).toHaveCount(1);
  }
});

test('pipeline reveal: screens slide open on hover and on keyboard focus', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const row = page.locator('#work article').first();
  const door = row.locator('.screen__panel').first();
  const closed = await door.evaluate((d) => getComputedStyle(d).transform);
  await row.hover();
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).not.toBe(closed);
  await expect(row.locator('dl.pipeline')).toBeVisible();

  await page.mouse.move(0, 0);
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).toBe(closed);
  await row.getByRole('link').focus();
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).not.toBe(closed);
});

test('pipeline reveal: on touch the work is shown open, no hover needed', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const row = page.locator('#work article').first();
  await row.scrollIntoViewIfNeeded();
  await expect(row.locator('img.screen__img')).toBeVisible();
  await expect(row.locator('dl.pipeline')).toBeVisible();
});
