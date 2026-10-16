import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';

test('desktop nav order and pinned CTA', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await expect(page.getByRole('navigation').getByRole('link')).toHaveText([
    /Dan/, /^Work/, 'Services', /^Lab/, 'About', '日本語', 'Book a call',
  ]);
  await page.mouse.wheel(0, 3000);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Book a call' })).toBeInViewport();
});

test('mobile bottom bar shows Book a call', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.mouse.wheel(0, 3000);
  await expect(page.getByTestId('mobile-cta').getByRole('link', { name: 'Book a call' })).toBeInViewport();
});

test('mobile menu opens and lists section links', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.getByText('Menu', { exact: true }).click();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Services' })).toBeVisible();
});

test('Book a call falls back to a plain link when Cal.com is blocked', async ({ page }) => {
  await page.route(/app\.cal\.com/, (r) => r.abort());
  await page.route(site.calUrl, (r) => r.fulfill({ contentType: 'text/html', body: '<h1>Booking</h1>' }));
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Book a call' }).first();
  await expect(link).toHaveAttribute('href', site.calUrl);
  await expect(link).toHaveAttribute('data-umami-event', 'book_call_click');
  await link.hover();
  await link.click();
  await expect(page).toHaveURL(site.calUrl);
});

test('copy email button copies the address', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'desktop');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: /copy email/i }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
  await expect(page.getByText('Copied')).toBeVisible();
});

test('footer has mailto and LinkedIn', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
  await expect(footer.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', site.linkedin);
});

test('footer closes the page as end credits: fin mark, credits list, ensō, contact row', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.locator('.credits__fin')).toHaveText('終');
  const terms = await footer.locator('.credits__roll dt').allTextContents();
  expect(terms).toEqual(['Design & code', 'Edit & grade', 'Footage', 'Made in']);
  await expect(footer.locator('.credits__roll dd').nth(2)).toHaveText('Pexels');
  await expect(footer.locator('svg.credits__enso')).toBeVisible();
  await expect(footer.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#main');
  await expect(footer.locator('.footer__mark')).toHaveCount(0); // the giant wordmark is gone
});

test('footer credits are translated on the Japanese page', async ({ page }) => {
  await page.goto('/ja');
  await expect(page.getByRole('contentinfo').locator('.credits__roll dt').first()).toHaveText('デザイン・コード');
});
