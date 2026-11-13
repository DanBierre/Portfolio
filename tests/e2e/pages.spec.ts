import { test, expect } from '@playwright/test';

test('unknown URL shows branded 404 with recovery links', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '/#work');
  await expect(page.getByRole('main').getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/#contact');
});

test('old Lab links land on the homepage', async ({ page }) => {
  for (const path of ['/lab', '/lab/enso']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
  }
});
