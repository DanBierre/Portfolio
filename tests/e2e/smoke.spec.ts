import { test, expect } from '@playwright/test';

test('homepage renders with title and lang', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Dan/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main#main')).toBeVisible();
});
