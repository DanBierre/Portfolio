import { test, expect, type Page } from '@playwright/test';
import { kanji } from '../../src/data/lab/kanji';

const char = (page: Page) => page.locator('#kanji-char').textContent();

async function watchDevelop(page: Page) {
  await page.addInitScript(() => {
    (window as any).__maxScale = 0;
    new MutationObserver((records) => {
      for (const r of records) {
        const v = Number((r.target as Element).getAttribute('scale'));
        (window as any).__maxScale = Math.max((window as any).__maxScale, v);
      }
    }).observe(document, { attributes: true, attributeFilter: ['scale'], subtree: true });
  });
}

test('next, previous and arrow keys move through the deck', async ({ page }) => {
  await page.goto('/lab/kanji');
  await expect(page.locator('#kanji-char')).toHaveText(kanji[0].char);
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#kanji-char')).toHaveText(kanji[1].char);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#kanji-char')).toHaveText(kanji[2].char);
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.locator('#kanji-char')).toHaveText(kanji[1].char);
  await expect(page.locator('[data-kanji-count]')).toHaveText('02 / 30');
});

test('quiz mode hides meaning and readings until revealed', async ({ page }) => {
  await page.goto('/lab/kanji');
  await page.getByLabel('Quiz mode').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#kanji-meaning')).toBeHidden();
  await page.getByRole('button', { name: 'Reveal' }).click();
  await expect(page.locator('#kanji-meaning')).toHaveText(kanji[1].meanings.join(', '));
  await expect(page.locator('#kanji-meaning')).toBeVisible();
});

test('each kanji develops out of noise when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await watchDevelop(page);
  await page.goto('/lab/kanji');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__maxScale)).toBeGreaterThan(40);
  await expect.poll(() => page.locator('#kanji-develop feDisplacementMap').getAttribute('scale')).toBe('0');
});

test('no noise under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await watchDevelop(page);
  await page.goto('/lab/kanji');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as any).__maxScale)).toBe(0);
  expect(await char(page)).toBe(kanji[1].char);
});

test('without JavaScript the whole deck is a table', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/kanji');
  await expect(page.locator('table tbody tr')).toHaveCount(30);
  await ctx.close();
});
