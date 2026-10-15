import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    __calls: unknown[][];
    umami: { track: (...a: unknown[]) => void };
  }
}

test('case study template sections and CTA', async ({ page }) => {
  await page.goto('/work/case-study-one');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2 })).toContainText(['Challenge', 'My role', 'Process', 'Results']);
  const cta = page.locator('#case-cta');
  await expect(cta.getByText("Have a similar project? Let's talk")).toBeVisible();
  await expect(cta.getByRole('link', { name: 'Book a call' })).toBeVisible();
  await expect(cta.getByRole('link', { name: 'Send a brief' })).toHaveAttribute('href', '/#contact');
  await expect(page.getByRole('link', { name: /next case study/i })).toHaveAttribute('href', '/work/case-study-two');
});

test('interactive element sits between Process and Results', async ({ page }) => {
  await page.goto('/work/case-study-one');
  const order = await page.evaluate(() => {
    const els = [...document.querySelectorAll('h2, [data-before-after]')];
    return els.map((e) => (e.matches('[data-before-after]') ? 'SLIDER' : e.textContent?.trim()));
  });
  expect(order.indexOf('SLIDER')).toBe(order.indexOf('Process') + 1);
  expect(order.indexOf('Results')).toBe(order.indexOf('SLIDER') + 1);
});

test('last case study links back to the first', async ({ page }) => {
  await page.goto('/work/case-study-two');
  await expect(page.getByRole('link', { name: /next case study/i })).toHaveAttribute('href', '/work/shoji');
});

test('before/after slider is keyboard operable and moves the split', async ({ page }) => {
  await page.goto('/work/case-study-one');
  const s = page.getByRole('slider', { name: 'Reveal before and after' });
  await s.focus();
  await page.keyboard.press('ArrowRight');
  await expect(s).toHaveValue('51');
  const pos = await page.locator('[data-before-after]').evaluate((el) => (el as HTMLElement).style.getPropertyValue('--pos'));
  expect(pos).toBe('51%');
});

test('case_study_completed fires once at the CTA', async ({ page }) => {
  await page.addInitScript(() => {
    window.__calls = [];
    window.umami = { track: (...a) => window.__calls.push(a) };
  });
  await page.goto('/work/case-study-one');
  await page.locator('#case-cta').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#case-cta').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.__calls)).toEqual([['case_study_completed', { slug: 'case-study-one' }]]);
});
