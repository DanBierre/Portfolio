import { test, expect } from '@playwright/test';

test('lab lists all experiments and marks interactive ones', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('main').getByRole('article')).toHaveCount(3);
  await expect(page.getByText('Interactive', { exact: true })).toHaveCount(1);
});

test('unknown URL shows branded 404 with recovery links', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '/#work');
  await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/#contact');
});
