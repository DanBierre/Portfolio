import { test, expect, type Page } from '@playwright/test';
import { shots } from '../../src/lib/indie-edit';

// 16mm nostalgia: the headline racks into focus like a lens focus pull, the gold words carry the same
// halation as the neon, and the code is projected into the scene as blurred light. Nothing shakes.
test('16mm: the headline racks into focus (focus pull), in the display face', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const h1 = page.locator('#hero h1');
  expect(await h1.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Hanken/);
  expect(await h1.evaluate((e) => getComputedStyle(e).animationName)).toBe('focus-pull');
  await expect.poll(() => h1.evaluate((e) => getComputedStyle(e).filter), { timeout: 4000 }).toMatch(/^(none|blur\(0px\))$/);
  await expect(h1).toHaveAccessibleName(/I’m Dan/);
});

test('chemical halation: the gold words bloom amber (#FFB800) through the emulsion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const accent = page.locator('#hero h1 .accent').first();
  const s = await accent.evaluate((e) => ({ filter: getComputedStyle(e).filter, anim: getComputedStyle(e).animationName }));
  expect(s.filter).toMatch(/drop-shadow\(rgba?\(255, 184, 0/);
  expect(s.anim).toBe('bloom');
});

test('16mm: code is projected into the footage as light, decorative only', async ({ page }) => {
  await page.goto('/');
  const beam = page.locator('#hero .hero__beam');
  await expect(beam).toHaveAttribute('aria-hidden', 'true');
  const s = await beam.evaluate((e) => ({ blend: getComputedStyle(e).mixBlendMode, filter: getComputedStyle(e).filter }));
  expect(s.blend).toBe('screen');
  expect(s.filter).toMatch(/blur/);
});

test('no shake: the headline block stays still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  expect(await page.locator('#hero .hero__statement').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
});

test('film burn in the type: a burn light layer sits in the letter fill and follows each cut', async ({ page }) => {
  await page.addInitScript(() => ((window as any).__indieEditAllowSoftware = true));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const bg = await page.locator('#hero h1 .line').first().evaluate((e) => getComputedStyle(e).backgroundImage);
  expect(bg).toMatch(/radial-gradient/);
  await expect(page.locator('[data-hero-still]')).toBeHidden({ timeout: 8000 });
  const xs = new Set<string>();
  for (let i = 0; i < 30; i++) { // ~12 s: the first shot holds 3.2 s, slower still on software WebGL
    xs.add(await page.locator('#hero').evaluate((e) => (e as HTMLElement).style.getPropertyValue('--bx')));
    await page.waitForTimeout(400);
  }
  expect(xs.size).toBeGreaterThan(1); // the burn moves to a new side at each cut
});

test('code in the type: line numbers, a live comment per shot, a caret', async ({ page }) => {
  await page.addInitScript(() => ((window as any).__indieEditAllowSoftware = true));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const nums = await page.locator('#hero h1 .line').evaluateAll((els) => els.map((e) => getComputedStyle(e, '::before').content));
  expect(nums).toEqual(['"01"', '"02"', '"03"']); // generated content: shown in the spine margin on wide screens
  const comment = page.locator('#hero .hero__comment');
  await expect(comment).toHaveAttribute('aria-hidden', 'true');
  await expect(comment).toHaveText(new RegExp(`^// 01 ${shots[0].clip}`));
  await expect(comment).toHaveText(new RegExp(`^// 02 ${shots[1].clip}`), { timeout: 15000 }); // software WebGL is slow under a full parallel run
  const caret = await page.locator('#hero h1 .line').last().evaluate((e) => getComputedStyle(e, '::after').content);
  expect(caret).not.toBe('none');
  await expect(page.locator('#hero h1')).toHaveAccessibleName(/I’m Dan/);
});

test('24fps stepped reveal: the headline focus pull is stepped, not a smooth fade', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  expect(await page.locator('#hero h1').evaluate((e) => getComputedStyle(e).animationTimingFunction)).toMatch(/steps\(/);
  expect(await page.locator('#hero .hero__note').evaluate((e) => getComputedStyle(e).animationTimingFunction)).toMatch(/steps\(/);
});

test('film-stock grain: the letters are filled with grain, and the footage shows a little through', async ({ page }) => {
  await page.goto('/');
  const s = await page.locator('#hero h1 .line').first().evaluate((e) => {
    const c = getComputedStyle(e);
    return { clip: c.webkitBackgroundClip || c.backgroundClip, image: c.backgroundImage, color: c.color, bg: c.backgroundColor };
  });
  expect(s.clip).toMatch(/^text(, text)*$/); // one value per background layer
  expect(s.image).toMatch(/url\(/);
  expect(s.color).toBe('rgba(0, 0, 0, 0)');
  expect(s.bg).toMatch(/rgba\(236, 235, 231, 0\.9\d*\)/);
});

test('16mm: reduced motion shows the finished, sharp headline', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('#hero h1').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await page.locator('#hero .hero__grain').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await page.locator('#hero h1 .accent').first().evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
});

test('each cut’s film burn lights the headline', async ({ page }) => {
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

test('the footage is the hero background, full bleed, behind the headline', async ({ page }) => {
  await page.goto('/');
  const hero = (await page.locator('#hero').boundingBox())!;
  const media = (await page.locator('.hero__media').boundingBox())!;
  expect(media.width).toBeGreaterThanOrEqual(hero.width - 1);
  expect(media.height).toBeGreaterThanOrEqual(hero.height - 1);
});

test('pipeline reveal: each project lists how it was made', async ({ page }) => {
  await page.goto('/');
  const rows = page.locator('#work article');
  await expect(rows).toHaveCount(2);
  for (const i of [0, 1]) {
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

test('viewfinder gate: L-bracket corners frame the hero, decorative only', async ({ page }) => {
  await page.goto('/');
  const gate = page.locator('#hero .hero__gate');
  await expect(gate).toHaveAttribute('aria-hidden', 'true');
  expect(await gate.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
  const bg = await gate.evaluate((e) => getComputedStyle(e).backgroundImage);
  expect(bg.match(/linear-gradient/g)!.length).toBe(8); // two strokes per corner
});

test('filmic title: tracking tightened to -0.05em', async ({ page }) => {
  await page.goto('/');
  const ls = await page.locator('#hero h1').evaluate((e) => parseFloat(getComputedStyle(e).letterSpacing) / parseFloat(getComputedStyle(e).fontSize));
  expect(ls).toBeCloseTo(-0.05, 2);
});

test('halation buttons: hairline borders, no flat fill, amber bloom on hover', async ({ page }, info) => {
  await page.goto('/');
  for (const name of ['Get in touch', 'See prices']) {
    const btn = page.locator('#hero').getByRole('link', { name });
    const s = await btn.evaluate((e) => ({ w: parseFloat(getComputedStyle(e).borderTopWidth), bg: getComputedStyle(e).backgroundColor }));
    expect(s.w).toBeLessThanOrEqual(1);
    expect(s.bg).not.toBe('rgb(236, 235, 231)');
    if (info.project.name === 'desktop') {
      await btn.hover();
      await expect.poll(() => btn.evaluate((e) => getComputedStyle(e).boxShadow)).toMatch(/rgba?\(255, 1[45]\d/);
    }
  }
});
