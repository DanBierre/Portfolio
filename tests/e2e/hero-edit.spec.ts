import { test, expect, type Page } from '@playwright/test';

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
