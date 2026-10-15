import { test, expect } from '@playwright/test';
import { runs, totals, formatSeconds, formatCost } from '../../src/data/lab/runs';

const steps = (page: import('@playwright/test').Page) => page.locator('[data-trace] > li');

test('running replays every step in order and counters end at the totals', async ({ page }) => {
  await page.goto('/lab/agent-x-ray');
  await expect(steps(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Run' }).click();
  const run = runs[0];
  await expect(steps(page)).toHaveCount(run.steps.length, { timeout: 15000 });
  await expect(steps(page).locator('.step__label')).toHaveText(run.steps.map((s) => s.label));
  const t = totals(run.steps);
  await expect(page.locator('[data-elapsed]')).toHaveText(formatSeconds(t.ms));
  await expect(page.locator('[data-cost]')).toHaveText(formatCost(t.cents));
});

test('step advances exactly one step; backtracks are marked', async ({ page }) => {
  await page.goto('/lab/agent-x-ray');
  await page.getByLabel(runs[1].question).check();
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Step' }).click();
  await expect(steps(page)).toHaveCount(5);
  await expect(steps(page).nth(4)).toHaveAttribute('data-kind', 'backtrack');
});

test('reduced motion: the whole trace appears at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/agent-x-ray');
  await page.getByRole('button', { name: 'Run' }).click();
  await expect(steps(page)).toHaveCount(runs[0].steps.length);
  await expect(page.locator('[data-elapsed]')).toHaveText(formatSeconds(totals(runs[0].steps).ms));
});

test('labelled as a demo run', async ({ page }) => {
  await page.goto('/lab/agent-x-ray');
  await expect(page.getByText('demo run', { exact: false }).first()).toBeVisible();
});

test('without JavaScript the first run is shown as a static trace', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/agent-x-ray');
  await expect(page.locator('[data-trace] > li')).toHaveCount(runs[0].steps.length);
  await ctx.close();
});
