import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../src/site.config';

const PAGES = ['/', '/ja', '/work/shoji', '/work/case-study-one', '/work/case-study-two', '/lab', '/lab/enso', '/lab/kanji', '/lab/kinetic', '/lab/variants', '/lab/agent-x-ray', '/lab/rough-cut', '/lab/time-warp', '/thanks', '/nope'];

// These checks render every page several times; run once, on the desktop project.
test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop'));

for (const path of PAGES) {
  test(`a11y: ${path} has no axe violations (light + dark)`, async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto(path);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(r.violations.map((v) => `${colorScheme}: ${v.id} (${v.nodes.length})`)).toEqual([]);
    }
  });

  test(`no horizontal scroll: ${path}`, async ({ page }) => {
    for (const width of [360, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test(`readable without JS: ${path}`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(path);
    await expect(p.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(p.getByRole('link', { name: site.email }).first()).toBeAttached();
    await ctx.close();
  });
}

test('every image has alt', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('img:not([alt])'), path).toHaveCount(0);
  }
});

test('no banned words in any page copy', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const text = (await page.locator('body').innerText()).toLowerCase();
    for (const word of ['revolutionary', 'cutting-edge', 'leverage', 'synergy']) expect(text, `${word} on ${path}`).not.toContain(word);
  }
});

for (const path of ['/', '/ja', '/work/shoji']) {
  test(`a11y: ${path} has no axe violations in the light theme`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
  });
}
