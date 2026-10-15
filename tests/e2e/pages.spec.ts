import { test, expect } from '@playwright/test';

test('lab lists all experiments with honest live/in-progress status', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const items = page.getByRole('main').getByRole('article');
  await expect(items).toHaveCount(6);
  await expect(items.first().getByRole('heading')).toHaveText('Ensō Generator');
  // Every live experiment links to its page; anything still in progress has no link.
  for (const item of await items.all()) {
    const live = (await item.locator('.lab__badge').textContent())!.trim() === 'live';
    await expect(item.getByRole('link', { name: /try it/i })).toHaveCount(live ? 1 : 0);
    if (live) await expect(item.getByRole('link', { name: /try it/i })).toHaveAttribute('href', /^\/lab\/[a-z-]+$/);
  }
});

test('unknown URL shows branded 404 with recovery links', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '/#work');
  await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/#contact');
});
