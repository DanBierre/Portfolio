import { test, expect } from '@playwright/test';
import { site } from '../../src/site.config';

test('hero copy and CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The AI half of your creative team.');
  await expect(
    page.getByText(
      'Interactive AI experiences for your clients, and the generative pipelines that make your studio faster. Designed and built end to end.',
    ),
  ).toBeVisible();
  const hero = page.locator('#hero');
  await expect(hero.getByRole('link', { name: 'Book a call' })).toBeVisible();
  await expect(hero.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '#work');
});

test('sections in spec order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main > section').evaluateAll((s) => s.map((e) => e.id));
  expect(ids).toEqual(['hero', 'proof', 'work', 'services', 'process', 'lab', 'about', 'contact']);
});

test('featured work shows 2 cards linking to case studies', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work article')).toHaveCount(2);
  await expect(page.locator('#work a[href^="/work/"]')).toHaveCount(2);
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
  for (const t of [site.availability, 'Reply within 1 working day.', 'Happy to work white-label and sign your NDA.'])
    await expect(c.getByText(t)).toBeVisible();
  await expect(c.getByRole('link', { name: 'Book a call' })).toBeVisible();
  await expect(c.getByRole('link', { name: site.email })).toBeVisible();
  await expect(page.locator('#process').getByRole('link', { name: 'Book a call' })).toBeVisible();
});

test('lab teaser shows 3 experiments and links to the Lab', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#lab article')).toHaveCount(3);
  await expect(page.locator('#lab').getByRole('link', { name: /see the lab/i })).toHaveAttribute('href', '/lab');
});

test('about has photo with alt and a tools line', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about img[alt]:not([alt=""])')).toHaveCount(1);
  await expect(page.locator('#about').getByText(site.tools)).toBeVisible();
});
