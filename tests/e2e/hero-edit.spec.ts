import { test, expect, type Page } from '@playwright/test';
import { shots } from '../../src/lib/indie-edit';

// Average brightness of the hero canvas (copied through a 2D canvas so WebGL pixels are readable).
const sample = (page: Page) =>
  page.evaluate(() => {
    const src = document.querySelector<HTMLCanvasElement>('[data-hero-edit]')!;
    const c = Object.assign(document.createElement('canvas'), { width: 32, height: 32 });
    const ctx = c.getContext('2d')!;
    ctx.drawImage(src, 0, 0, 32, 32);
    const d = ctx.getImageData(0, 0, 32, 32).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1] + d[i + 2];
    return { mean: sum / (d.length / 4) / 3, sig: Array.from(d.slice(0, 64)).join(',') };
  });

// Headless Chromium renders WebGL in software; real visitors need a GPU. Tests opt in to software rendering.
const allowSoftware = (page: Page) => page.addInitScript(() => ((window as any).__indieEditAllowSoftware = true));

test('the indie edit renders and keeps moving', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const canvas = page.locator('[data-hero-edit]');
  await expect(canvas).toBeVisible();
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 5000 });
  await page.waitForTimeout(800);
  const a = await sample(page);
  expect(a.mean).toBeGreaterThan(4); // not a black frame
  await page.waitForTimeout(700);
  const b = await sample(page);
  expect(b.sig).not.toBe(a.sig);
});

test('pause freezes the edit and play resumes it (WCAG 2.2.2)', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 5000 });
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  const a = await sample(page);
  await page.waitForTimeout(800);
  expect((await sample(page)).sig).toBe(a.sig);
  await page.getByRole('button', { name: 'Play animation' }).click();
  await page.waitForTimeout(600);
  expect((await sample(page)).sig).not.toBe(a.sig);
});

test('reduced motion: a still frame instead of the edit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-hero-edit]')).toBeHidden();
  await expect(page.locator('[data-hero-still]')).toBeVisible();
  await expect(page.getByRole('button', { name: /animation/i })).toBeHidden();
});

test('no WebGL: falls back to the still frame', async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error test override
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      return type.startsWith('webgl') ? null : orig.call(this, type, ...rest);
    };
  });
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeVisible();
  await expect(page.locator('[data-hero-edit]')).toBeHidden();
});

test('without JavaScript the still frame shows', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeVisible();
  await ctx.close();
});

test('software-only graphics: keeps the still frame (protects low-end devices)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.waitForTimeout(2500);
  await expect(page.locator('[data-hero-still]')).toBeVisible();
});

test('footage is fetched only once the edit starts', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const early: string[] = [];
  page.on('request', (r) => r.url().includes('/media/japan/') && early.push(r.url()));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(early).toEqual([]); // nothing competes with first load
  await page.waitForRequest(/\/media\/japan\/\w+\.mp4/, { timeout: 8000 });
});

test('missing footage falls back to the night scene and the edit keeps moving', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/media/japan/**', (r) => r.fulfill({ status: 404 }));
  await page.goto('/');
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 5000 });
  await page.waitForTimeout(800);
  const a = await sample(page);
  expect(a.mean).toBeGreaterThan(4);
  await page.waitForTimeout(700);
  expect((await sample(page)).sig).not.toBe(a.sig);
});

test('the burned-in slate follows the edit: code line, clock and cut track', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const slate = page.locator('[data-hero-slate]');
  await expect(slate).toBeVisible({ timeout: 5000 });
  await expect(slate.locator('[data-shot]')).toHaveCount(shots.length);
  await expect(slate.locator('.is-live')).toHaveCount(1);
  await expect(slate.locator('[data-read="code"]')).toHaveText(/^shots\[\d\] = \['\w+'/);
  const clock = slate.locator('[data-read="clock"]');
  const t = await clock.textContent();
  await expect(clock).not.toHaveText(t!, { timeout: 6000 }); // software WebGL is slow under a full parallel run
});

test('the hero shows no portrait: the still is a frame of the footage', async ({ page }) => {
  await page.goto('/');
  const src = await page.locator('img[data-hero-still]').getAttribute('src');
  expect(src).toMatch(/hero-still/);
});

test('the headline holds still when the edit starts: the slate’s space is kept from the start', async ({ page }) => {
  await allowSoftware(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const y = () => page.locator('#hero .hero__statement').evaluate((e) => Math.round(e.getBoundingClientRect().top + scrollY));
  const before = await y();
  const slate = page.locator('[data-hero-slate]');
  expect(await slate.evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThan(20); // reserved, not yet shown
  await expect(slate).toBeVisible({ timeout: 8000 });
  expect(await y()).toBe(before);
});
