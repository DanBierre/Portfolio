import { test, expect, type Page } from '@playwright/test';
import { site } from '../../src/site.config';

declare global {
  interface Window {
    __calls: unknown[][];
    umami: { track: (...a: unknown[]) => void };
  }
}

async function fill(page: Page, project = 'AI campaign') {
  const form = page.locator('#contact form');
  await form.getByLabel('Name').fill('Ana');
  await form.getByLabel('Email').fill('ana@studio.co');
  await form.getByLabel("What's the project?").fill(project);
  return form;
}

test('form fields match the spec', async ({ page }) => {
  await page.goto('/#contact');
  const form = page.locator('#contact form');
  await expect(form).toHaveAttribute('action', '/api/brief');
  await expect(form.getByLabel('Name')).toHaveAttribute('required', '');
  await expect(form.getByLabel('Email')).toHaveAttribute('type', 'email');
  await expect(form.getByLabel('Timeline')).toBeVisible();
  await expect(form.getByLabel('Budget range').locator('option')).toHaveCount(6);
  const trap = form.locator('.brief__trap');
  await expect(trap).toHaveAttribute('aria-hidden', 'true');
  await expect(trap).not.toBeInViewport();
  await expect(trap.locator('input')).toHaveAttribute('tabindex', '-1');
});

test('successful send shows thanks and tracks event', async ({ page }) => {
  await page.addInitScript(() => {
    window.__calls = [];
    window.umami = { track: (...a) => window.__calls.push(a) };
  });
  await page.route('/api/brief', (r) => r.fulfill({ status: 200, json: { ok: true } }));
  await page.goto('/#contact');
  const form = await fill(page);
  await form.getByRole('button', { name: 'Send brief' }).click();
  await expect(page.getByText(/Thanks, I.ll reply within 1 working day/)).toBeVisible();
  expect(await page.evaluate(() => window.__calls)).toEqual([['brief_submitted']]);
});

test('send failure keeps typed text and shows email fallback', async ({ page }) => {
  await page.route('/api/brief', (r) => r.fulfill({ status: 502, json: { ok: false, error: 'send_failed' } }));
  await page.goto('/#contact');
  const form = await fill(page, 'Keep me');
  await form.getByRole('button', { name: 'Send brief' }).click();
  const status = page.locator('#contact [role="status"]');
  await expect(status.getByRole('link', { name: site.email })).toBeVisible();
  await expect(form.getByLabel("What's the project?")).toHaveValue('Keep me');
});

test('server validation errors show next to the field', async ({ page }) => {
  await page.route('/api/brief', (r) =>
    r.fulfill({ status: 400, json: { ok: false, errors: { email: 'Please add a valid email address.' } } }),
  );
  await page.goto('/#contact');
  const form = await fill(page);
  await form.getByRole('button', { name: 'Send brief' }).click();
  await expect(form.getByText('Please add a valid email address.')).toBeVisible();
  await expect(form.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
});

test('works without JavaScript (real endpoint, local email simulated)', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/#contact');
  const form = await fill(page, 'No JS');
  await form.getByRole('button', { name: 'Send brief' }).click();
  await expect(page).toHaveURL(/\/thanks$/);
  await expect(page.getByText(/Thanks, I.ll reply within 1 working day/)).toBeVisible();
  await ctx.close();
});
