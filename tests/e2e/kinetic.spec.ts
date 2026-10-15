import { test, expect } from '@playwright/test';

test('typing a line animates one element per word, longest word in gold', async ({ page }) => {
  await page.goto('/lab/kinetic');
  await page.getByLabel('Your line').fill('Keep distractions out.');
  await page.getByRole('button', { name: 'Animate' }).click();
  const words = page.locator('[data-stage] .word');
  await expect(words).toHaveText(['Keep', 'distractions', 'out.']);
  await expect(page.locator('[data-stage] .word.accent')).toHaveText('distractions');
});

test('replay runs the animation again', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/lab/kinetic');
  await page.getByRole('button', { name: 'Animate' }).click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Replay' }).click();
  const running = await page.evaluate(() =>
    document.querySelector('[data-stage]')!.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
  );
  expect(running).toBeGreaterThan(0);
});

test('speech button only appears where speech recognition exists', async ({ browser }) => {
  const without = await browser.newContext();
  await without.addInitScript(() => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });
  const p1 = await without.newPage();
  await p1.goto('/lab/kinetic');
  await expect(p1.getByRole('button', { name: /hold to talk/i })).toBeHidden();
  await without.close();

  const withSpeech = await browser.newContext();
  await withSpeech.addInitScript(() => {
    (window as any).webkitSpeechRecognition = class {
      start() {}
      stop() {}
    };
  });
  const p2 = await withSpeech.newPage();
  await p2.goto('/lab/kinetic');
  await expect(p2.getByRole('button', { name: /hold to talk/i })).toBeVisible();
  await withSpeech.close();
});

test('reduced motion: words fade in without movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lab/kinetic');
  await page.getByRole('button', { name: 'Animate' }).click();
  const usesTransform = await page.evaluate(() =>
    document
      .querySelector('[data-stage]')!
      .getAnimations({ subtree: true })
      .some((a) => (a.effect as KeyframeEffect).getKeyframes().some((k) => 'transform' in k)),
  );
  expect(usesTransform).toBe(false);
});

test('without JavaScript a static example line is shown', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/lab/kinetic');
  await expect(page.locator('[data-stage] .word').first()).toBeVisible();
  await expect(page.getByText(/needs JavaScript/i)).toBeVisible();
  await ctx.close();
});
