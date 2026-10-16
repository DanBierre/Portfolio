import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';
import { ui } from '../../src/i18n/ui';

const en = ui.en;

test('hero CTAs', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#hero');
  await expect(hero.getByRole('link', { name: 'Book a call' })).toBeVisible();
  await expect(hero.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '#work');
});

test('sections in spec order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main > section').evaluateAll((s) => s.map((e) => e.id));
  expect(ids).toEqual(['hero', 'proof', 'work', 'about', 'services', 'process', 'lab', 'contact']);
});

test('featured work: one card per project, each linking to its case study', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work article')).toHaveCount(3);
  await expect(page.locator('#work a[href^="/work/"]')).toHaveCount(3);
});

test('services has Experiences and Pipelines with 3 items each', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Experiences', 'Pipelines'])
    await expect(page.locator('#services').getByRole('region', { name }).getByRole('listitem')).toHaveCount(3);
});

test('process has 4 steps in order', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#process ol > li h3')).toHaveText(['Brief', 'Prototype in 1 week', 'Build', 'Handover']);
});

test('contact trust signals and Book a call after process', async ({ page }) => {
  await page.goto('/');
  const c = page.locator('#contact');
  for (const t of [en.contact.availability, en.contact.reply, en.contact.whiteLabel]) await expect(c.getByText(t)).toBeVisible();
  await expect(c.getByRole('link', { name: 'Book a call' })).toBeVisible();
  await expect(c.getByRole('link', { name: site.email })).toBeVisible();
  await expect(page.locator('#process').getByRole('link', { name: 'Book a call' })).toBeVisible();
});

test('lab teaser shows 3 experiments and links to the Lab', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#lab article')).toHaveCount(3);
  await expect(page.locator('#lab').getByRole('link', { name: /see the lab/i })).toHaveAttribute('href', '/lab');
});
