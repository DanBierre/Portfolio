import { test, expect } from '@playwright/test';
import { segments, actions, applyActions, runtime } from '../../src/data/lab/rough-cut';

const finalState = applyActions(segments, actions);
const finalText = finalState.order.map((id) => segments.find((s) => s.id === id)!.text);

test('playing the run ends with the expected rough cut and runtime', async ({ page }) => {
  await page.goto('/lab/rough-cut');
  await page.getByRole('button', { name: 'Play' }).click();
  const cut = page.locator('[data-cut] li');
  await expect(cut).toHaveText(finalText, { timeout: 15000 });
  await expect(page.locator('[data-runtime]')).toHaveText(`${runtime(segments, finalState.order).toFixed(1)} s`);
  await expect(page.locator('[data-transcript] [data-state="dropped"]')).toHaveCount(finalState.dropped.size);
});

test('step applies exactly one action', async ({ page }) => {
  await page.goto('/lab/rough-cut');
  await expect(page.locator('[data-log] li')).toHaveCount(0);
  await page.getByRole('button', { name: 'Step' }).click();
  await expect(page.locator('[data-log] li')).toHaveCount(1);
  await page.getByRole('button', { name: 'Step' }).click();
  await expect(page.locator('[data-transcript] [data-state="dropped"]')).toHaveCount(1);
});

test('reduced motion: play applies the whole run at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/rough-cut');
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.locator('[data-cut] li')).toHaveText(finalText);
});

test('labelled as demo data', async ({ page }) => {
  await page.goto('/lab/rough-cut');
  await expect(page.getByText(/demo data/i).first()).toBeVisible();
});

test('without JavaScript the final rough cut is shown', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/rough-cut');
  await expect(page.locator('[data-cut] li')).toHaveText(finalText);
  await ctx.close();
});
