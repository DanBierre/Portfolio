import { test, expect } from '@playwright/test';
import { segments, actions, applyActions, runtime } from '../../src/data/lab/rough-cut';

// Elements created by the experiments' scripts must still get the page's styles.
test('kinetic: the emphasised word is set larger than the others', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/kinetic');
  await page.getByRole('button', { name: 'Animate' }).click();
  const size = (sel: string) => page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(await size('[data-stage] .word.accent')).toBeGreaterThan((await size('[data-stage] .word:not(.accent)')) * 1.8);
});

test('agent x-ray: only tool calls are boxed; thinking sits on the spine', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/agent-x-ray');
  await page.getByRole('button', { name: 'Run' }).click();
  const border = (kind: string) => page.locator(`[data-trace] > li[data-kind="${kind}"]`).first().evaluate((el) => getComputedStyle(el).borderTopWidth);
  expect(await border('tool')).toBe('1px');
  expect(await border('think')).toBe('0px');
  const backtrack = page.locator('[data-trace] > li[data-kind="backtrack"]').first();
  expect(await backtrack.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('rough cut: no side stripe on selects; the timeline is a labelled hairline track', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/rough-cut');
  await page.getByRole('button', { name: 'Play' }).click();
  const selected = page.locator('[data-transcript] [data-state="selected"]').first();
  expect(await selected.evaluate((el) => getComputedStyle(el).borderLeftWidth)).toBe('0px');
  const first = segments.find((s) => s.id === applyActions(segments, actions).order[0])!;
  await expect(page.locator('[data-track] .rc__clip').first()).toContainText(first.text.split(' ').slice(0, 3).join(' '));
  await expect(page.locator('[data-track-start]')).toHaveText('0.0 s');
  await expect(page.locator('[data-track-end]')).toHaveText(`${runtime(segments, applyActions(segments, actions).order).toFixed(1)} s`);
});

test('variants: Japanese headlines break only at phrase boundaries', async ({ page }) => {
  await page.goto('/lab/variants');
  const ja = page.locator('[data-tile][lang="ja"] .tile__headline').first();
  expect(await ja.evaluate((el) => getComputedStyle(el).wordBreak)).toBe('keep-all');
  expect(await ja.locator('wbr').count()).toBeGreaterThan(0);
});

test('kanji: the space-to-reveal hint only shows in quiz mode', async ({ page }) => {
  await page.goto('/lab/kanji');
  await expect(page.getByText('Space to reveal')).toBeHidden();
  await page.getByLabel('Quiz mode').check();
  await expect(page.getByText('Space to reveal')).toBeVisible();
});

test('rough cut: the end label sits at the right end of the track', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/lab/rough-cut');
  const right = (sel: string) => page.locator(sel).evaluate((el) => Math.round(el.getBoundingClientRect().right));
  expect(Math.abs((await right('[data-track-end]')) - (await right('[data-track]')))).toBeLessThanOrEqual(2);
});

test('variants: no Japanese headline line is a lone full stop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/lab/variants');
  const lone = await page.locator('[data-tile][lang="ja"] .tile__headline').evaluateAll((els) =>
    els.filter((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()];
      // the last line box is narrower than one character pair → only 。 sits there
      return rects.length > 1 && rects.at(-1)!.width < parseFloat(getComputedStyle(el).fontSize) * 1.2;
    }).length,
  );
  expect(lone).toBe(0);
});
