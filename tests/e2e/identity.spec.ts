import { test, expect } from '@playwright/test';
import { ui, spine } from '../../src/i18n/ui';

const en = ui.en;
const ja = ui.ja;

test('hero leads with Dan’s headline, gold accents and offer line', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.hero.title);
  await expect(page.locator('#hero h1 .accent')).toHaveText(['with', 'with']);
  await expect(page.locator('#hero .hero__note .sep-item')).toHaveText(en.hero.offer.split(' · '));
});

test('agency line moves to services', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#services h2')).toHaveText(en.services.title);
  await expect(page.locator('#services').getByText(en.services.intro)).toBeVisible();
});

test('spine labels every section in Japanese (desktop)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  for (const [id, label] of Object.entries(spine)) {
    await expect(page.locator(`#${id} .spine-mark`)).toHaveText(label);
    await expect(page.locator(`#${id} .spine-mark`)).toBeVisible();
  }
});

test('Shoji leads the work index and has a case study with real screens', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work article').first().locator('h3')).toHaveText('Shoji');
  await expect(page.locator('#work article')).toHaveCount(3);
  await page.goto('/work/shoji');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shoji');
  expect(await page.locator('.prose img').count()).toBeGreaterThanOrEqual(2);
});

test('about uses Dan’s real rows, portrait and brush ensō', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  await expect(about.locator('h2')).toHaveText(en.about.title);
  await expect(about.locator('dt')).toHaveText(en.about.rows.map((r) => r.term));
  await expect(about.getByRole('img', { name: en.about.portraitAlt })).toBeVisible();
  await expect(about.getByText(en.about.caption)).toBeVisible();
  await expect(about.locator('.enso path')).toHaveCount(1);
});

test('numerals use the serif voice', async ({ page }) => {
  await page.goto('/');
  const family = await page.locator('#process .num').first().evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toContain('Shippori Mincho');
});

test('theme toggle switches to light, persists, and defaults to dark', async ({ page }) => {
  await page.goto('/');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe('rgb(20, 20, 20)');
  await page.getByRole('button', { name: en.themeToLight }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(bg).toBe('rgb(244, 241, 234)');
  await page.reload();
  await expect.poll(bg).toBe('rgb(244, 241, 234)');
  await page.getByRole('button', { name: en.themeToDark }).first().click();
  await expect.poll(bg).toBe('rgb(20, 20, 20)');
});

test('Japanese homepage: toggle, lang, translated copy, way back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute('href', 'https://danbierre.dev/ja');
  await page.getByRole('link', { name: en.langSwitchName }).first().click();
  await expect(page).toHaveURL(/\/ja$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ja.hero.title);
  await expect(page.locator('#services h2')).toHaveText(ja.services.title);
  await expect(page.locator('#contact form').getByLabel(ja.form.name)).toBeVisible();
  await page.getByRole('link', { name: ja.langSwitchName }).first().click();
  await expect(page).toHaveURL(/\/$/);
});
