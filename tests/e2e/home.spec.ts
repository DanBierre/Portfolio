import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';
import { ui } from '../../src/i18n/ui';

const en = ui.en;

test('hero CTAs', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#hero');
  await expect(hero.getByRole('link', { name: 'Get in touch' })).toBeVisible();
  await expect(hero.getByRole('link', { name: 'See prices' })).toHaveAttribute('href', '#services');
});

test('sections in spec order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main > section').evaluateAll((s) => s.map((e) => e.id));
  expect(ids).toEqual(['hero', 'about', 'work', 'redesigns', 'services', 'process', 'clients', 'contact']);
});

test('redesigns: my own site before and after, with a way to get in touch', async ({ page }) => {
  await page.goto('/');
  const s = page.locator('#redesigns');
  await expect(s.getByRole('heading', { level: 2 })).toHaveText(en.redesigns.title);
  await expect(s.getByRole('slider', { name: 'Reveal before and after' })).toBeVisible();
  await expect(s.getByRole('img', { name: /old website/i })).toHaveCount(1);
  await expect(s.getByRole('img', { name: /current website/i })).toHaveCount(1);
  await expect(s.getByRole('link', { name: en.redesigns.cta })).toHaveAttribute('href', '#contact');
});

test('Mimitori is listed as in progress, on the card and its case study', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#work article').filter({ hasText: 'Mimitori' });
  await expect(card.getByText('In progress')).toBeVisible();
  await page.goto('/work/mimitori');
  await expect(page.locator('.case__header').getByText('In progress')).toBeVisible();
  await expect(page.locator('.case__header')).toContainText('mimitori.com');
});

test('featured work: one card per project, each linking to its case study', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work article')).toHaveCount(3);
  await expect(page.locator('#work a[href^="/work/"]')).toHaveCount(3);
});

test('services has Light Fix and Light Page with 3 items each', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Light Fix · $150', 'Light Page · $450'])
    await expect(page.locator('#services').getByRole('region', { name }).getByRole('listitem')).toHaveCount(3);
});

test('process has 3 steps in order', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#process ol > li h3')).toHaveText(['Tell me', 'Fixed price', 'Review']);
});

test('contact trust signals, the form, and Get in touch after process', async ({ page }) => {
  await page.goto('/');
  const c = page.locator('#contact');
  for (const t of [en.contact.availability, en.contact.reply, en.contact.whiteLabel]) await expect(c.getByText(t)).toBeVisible();
  await expect(c.locator('form')).toBeVisible();
  await expect(c.getByRole('link', { name: site.email })).toBeVisible();
  await expect(page.locator('#process').getByRole('link', { name: 'Get in touch' })).toBeVisible();
});

test('client websites: three honest open spots and a way to get in touch', async ({ page }) => {
  await page.goto('/');
  const s = page.locator('#clients');
  await expect(s.getByRole('heading', { level: 2 })).toHaveText(en.clients.title);
  await expect(s.getByRole('listitem')).toHaveCount(3);
  await expect(s.getByRole('listitem').first()).toContainText(en.clients.slot);
  await expect(s.getByRole('link', { name: en.clients.cta })).toHaveAttribute('href', '#contact');
});
