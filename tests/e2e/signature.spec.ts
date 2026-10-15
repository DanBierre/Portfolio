import { test, expect, type Page } from '@playwright/test';

// Kinetic intro: the headline cuts in word by word on the edit's beats, then the footage opens.
const words = (page: Page) => page.locator('#hero h1 .kw');

test('kinetic intro: words cut in one after another and all land', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const n = await words(page).count();
  expect(n).toBeGreaterThanOrEqual(7);
  const delays = await words(page).evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).animationDelay)));
  for (let i = 1; i < delays.length; i++) expect(delays[i]).toBeGreaterThan(delays[i - 1]);
  expect(delays.at(-1)!).toBeLessThan(1.6); // the headline is fully in well inside the LCP budget
  await expect
    .poll(() => words(page).evaluateAll((els) => els.every((e) => getComputedStyle(e).opacity === '1')), { timeout: 4000 })
    .toBe(true);
  await expect(page.locator('#hero h1')).toHaveAccessibleName(/I’m Dan/);
});

test('kinetic intro: the footage opens after the words', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const media = page.locator('.hero__media');
  const delay = await media.evaluate((e) => parseFloat(getComputedStyle(e).animationDelay));
  const last = await words(page).last().evaluate((e) => parseFloat(getComputedStyle(e).animationDelay));
  expect(delay).toBeGreaterThanOrEqual(last);
});

test('kinetic intro: skipped entirely under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const names = await words(page).evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
  expect(names.every((n) => n === 'none')).toBe(true);
  expect(await page.locator('.hero__media').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
});

test('the footage is the hero background, behind the headline', async ({ page }) => {
  await page.goto('/');
  const hero = await page.locator('#hero').boundingBox();
  const media = await page.locator('.hero__media').boundingBox();
  expect(media!.width).toBeGreaterThanOrEqual(hero!.width - 1);
  expect(media!.height).toBeGreaterThanOrEqual(hero!.height - 1);
});

test('pipeline reveal: each project lists how it was made', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#work article');
  await expect(rows).toHaveCount(3);
  for (const i of [0, 1, 2]) {
    const specs = rows.nth(i).locator('dl.pipeline');
    expect(await specs.locator('dt').count()).toBeGreaterThanOrEqual(2);
  }
});

test('pipeline reveal: screens slide open on hover and on keyboard focus', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const row = page.locator('#work article').first();
  const door = row.locator('.screen__panel').first();
  const closed = await door.evaluate((d) => getComputedStyle(d).transform);
  await row.hover();
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).not.toBe(closed);
  await expect(row.locator('dl.pipeline')).toBeVisible();

  await page.mouse.move(0, 0);
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).toBe(closed);
  await row.getByRole('link').focus();
  await expect.poll(() => door.evaluate((d) => getComputedStyle(d).transform)).not.toBe(closed);
});

test('pipeline reveal: on touch the work is shown open, no hover needed', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const row = page.locator('#work article').first();
  await row.scrollIntoViewIfNeeded();
  await expect(row.locator('img.screen__img')).toBeVisible();
  await expect(row.locator('dl.pipeline')).toBeVisible();
});
