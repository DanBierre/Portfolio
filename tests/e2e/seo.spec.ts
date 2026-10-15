import { test, expect } from '@playwright/test';

test('every page has unique title, description, canonical and og image', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of ['/', '/ja', '/work/shoji', '/work/case-study-one', '/work/case-study-two', '/lab']) {
    await page.goto(path);
    const title = await page.title();
    expect(seen.has(title), `duplicate title on ${path}`).toBe(false);
    seen.add(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://danbierre.dev${path === '/' ? '/' : path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toMatch(/^https:\/\/danbierre\.dev\//);
    // The image must actually exist in the build.
    const res = await request.get(new URL(og!).pathname);
    expect(res.status(), `og image for ${path}`).toBe(200);
  }
});

test('thanks and 404 are not indexed; sitemap and robots exist', async ({ page, request }) => {
  await page.goto('/thanks');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await page.goto('/nope');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://danbierre.dev/sitemap-index.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  const xml = await sitemap.text();
  expect(xml).toContain('https://danbierre.dev/work/case-study-one');
  expect(xml).not.toContain('/thanks');
});
