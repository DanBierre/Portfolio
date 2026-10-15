import { test, expect, type Page } from '@playwright/test';

// Title card: the headline sits in the film from the first frame, with the film's grain over it,
// the gate weave moving it and each cut's burn lighting it.
test('title card: the headline is there from the first frame, no word-by-word intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('#hero h1 .kw')).toHaveCount(0);
  expect(await page.locator('#hero h1').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  await expect(page.locator('#hero h1')).toHaveAccessibleName(/I’m Dan/);
});

test('title card: film grain runs over the type, decorative only', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const grain = page.locator('#hero .hero__grain');
  await expect(grain).toHaveAttribute('aria-hidden', 'true');
  expect(await grain.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
  const z = (sel: string) => page.locator(sel).evaluate((e) => Number(getComputedStyle(e).zIndex) || 0);
  expect(await z('#hero .hero__grain')).toBeGreaterThan(await z('#hero .hero__grid'));
  expect(await grain.evaluate((e) => getComputedStyle(e).animationName)).not.toBe('none');
});

test('title card: each cut’s film burn lights the headline', async ({ page }) => {
  await page.addInitScript(() => ((window as any).__indieEditAllowSoftware = true));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 8000 });
  const burns = new Set<string>();
  for (let i = 0; i < 12; i++) {
    burns.add(await page.locator('#hero').evaluate((e) => (e as HTMLElement).style.getPropertyValue('--burn')));
    await page.waitForTimeout(250);
  }
  expect(burns.size).toBeGreaterThan(2);
});

test('title card: still under reduced motion (no grain flicker, no weave)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('#hero .hero__grain').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await page.locator('#hero .hero__statement').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
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
