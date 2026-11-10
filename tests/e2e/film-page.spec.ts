import { test, expect } from '@playwright/test';

// The rest of the page in the reel's language: warm film colours, film-edge print between sections,
// scene-numbered stepped headings, a contact sheet, an edit decision list, labelled reels.
const SECTIONS = ['services', 'process', 'work', 'about', 'lab', 'contact'];

test('palette: warm black ground and cream type', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(18, 16, 14)');
  expect(await page.locator('#work h2').evaluate((e) => getComputedStyle(e).color)).toBe('rgb(236, 228, 212)');
});

test('film-edge print opens every section with a scene number, decorative only', async ({ page }) => {
  await page.goto('/');
  for (const [i, id] of SECTIONS.entries()) {
    const edge = page.locator(`#${id} .edge-print`);
    await expect(edge).toHaveAttribute('aria-hidden', 'true');
    await expect(edge).toContainText(`SC.${String(i + 2).padStart(2, '0')}`);
    expect(await edge.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Geist Mono/);
  }
});

test('section headings develop in stepped frames, not a smooth fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const tf = await page.locator('#services h2').evaluate((e) => getComputedStyle(e).animationTimingFunction);
  expect(tf).toMatch(/steps\(/);
  // A focus pull only: the heading never fades, so its contrast holds before it scrolls in.
  expect(await page.locator('#services h2').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
});

test('work is a contact sheet: sprocket edges, frame numbers, a light leak on hover', async ({ page }, info) => {
  await page.goto('/');
  const first = page.locator('#work article').first();
  await expect(first.locator('.frame-no')).toHaveText(/^\d\dA$/);
  await expect(first.locator('.sprockets')).toHaveCount(1);
  if (info.project.name === 'desktop') {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await first.hover();
    await expect.poll(() => first.locator('.leak').evaluate((e) => getComputedStyle(e).animationName)).toBe('leak-sweep');
  }
});

test('how we work is an edit decision list: event numbers, record timecodes, durations', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#process ol > li');
  await expect(rows).toHaveCount(3);
  await expect(rows.locator('.evt')).toHaveText(['001', '002', '003']);
  expect(await rows.first().locator('.evt').evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Geist Mono/);
  for (const tc of await rows.locator('.tc').allTextContents()) expect(tc).toMatch(/^\d\d:\d\d:\d\d:\d\d$/);
  await expect(rows.locator('.dur')).toHaveCount(3);
});

test('lab pieces are labelled reels', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#lab article .reel-tape')).toHaveText([/REEL 01/, /REEL 02/, /REEL 03/]);
});

test('about portrait carries the reel grade', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('#about img').first().evaluate((e) => getComputedStyle(e).filter)).toMatch(/sepia/);
});

test('hero type is lit by the scene: its glow takes the colour of the footage', async ({ page }) => {
  await page.addInitScript(() => ((window as any).__indieEditAllowSoftware = true));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 8000 });
  await expect
    .poll(() => page.locator('#hero').evaluate((e) => (e as HTMLElement).style.getPropertyValue('--scene')), { timeout: 8000 })
    .toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/);
});
