# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Dan's agency-facing portfolio: a long-scroll homepage, 2 case study pages, a Lab page, and a brief form that emails Dan.

**Architecture:** Astro 6 builds a fully static site into `dist/`. One small Cloudflare Worker serves those static files and handles a single route, `POST /api/brief`, which validates the form and emails Dan through the Cloudflare Email Service `send_email` binding. Motion uses CSS and native browser features. The only client scripts are small inline progressive-enhancement scripts.

**Tech Stack:** Astro 6 (TypeScript strict), plain CSS custom properties, Cloudflare Workers + static assets (Wrangler), Cloudflare Email Service, Cal.com embed, Umami Cloud analytics, Vitest, Playwright, @axe-core/playwright, @lhci/cli.

**Spec:** `docs/superpowers/specs/2026-10-15-portfolio-site-design.md`

### Deviations from spec (approved by Dan before execution)
1. **Hosting: Workers static assets instead of Cloudflare Pages.** This is Cloudflare's current recommended path, and it's also free. The `send_email` binding is documented for Workers.
2. **Analytics: Umami Cloud (free tier, cookieless) instead of Cloudflare Web Analytics.** Cloudflare Web Analytics can't record custom events, and the spec needs three.

## Global Constraints

- Hero headline exactly: `The AI half of your creative team.`
- Hero sub-line exactly: `Interactive AI experiences for your clients, and the generative pipelines that make your studio faster. Designed and built end to end.`
- Reply promise exactly: `Reply within 1 working day.`
- White-label note exactly: `Happy to work white-label and sign your NDA.`
- Case study CTA exactly: `Have a similar project? Let's talk`
- Banned words in any copy: revolutionary, cutting-edge, leverage, synergy.
- No pop-ups, exit-intent modals, chatbots, newsletter sign-up, cookie banner.
- Nav order: Work · Services · Lab · About · Book a call.
- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO, every page, mobile profile.
- LCP < 2 s mobile. Page weight < 1 MB excluding lazy-loaded video.
- No horizontal scroll from 360 px to 1920 px.
- WCAG 2.2 AA: keyboard navigable, visible focus, AA contrast in both themes, alt text on every image.
- All reading content works with JavaScript disabled. The email fallback is always present.
- Theme follows the device's `prefers-color-scheme` setting (no toggle).
- `prefers-reduced-motion: reduce` turns off non-essential motion, and videos show their poster only.
- Commit messages: short imperative, one line, no prefix, no Co-Authored-By.
- Work on branch `feat/portfolio-site` (ask Dan before creating it). Never push without Dan saying "push".

## Review Focus

1. **Header injection via the form**: a name containing a line break (`\r\n`) must be rejected, never placed in an email header. Owned by Task 8.
2. **Email send fails**: the visitor sees an inline error, their typed text stays in the fields, and Dan's email appears as a fallback. Owned by Tasks 8 and 9.
3. **Cal.com script blocked** (ad blockers, privacy extensions): "Book a call" still works as a normal link to the Cal.com page. Owned by Task 4.
4. **Reduced motion**: no video autoplays and no reveal animation runs. Owned by Task 10.
5. **Narrow phone (360 px) with long headline or long case study title**: no horizontal scroll on any page. Owned by Task 12.

---

## File Structure

```
astro.config.mjs            Astro config (static output, site URL)
wrangler.jsonc              Worker + assets + send_email binding + vars
package.json                scripts: dev, build, preview, test, test:e2e, lhci
vitest.config.ts            unit tests (worker logic)
playwright.config.ts        e2e against `wrangler dev` on :8787
lighthouserc.json           Lighthouse CI budgets
src/site.config.ts          every hand-edited value (email, calUrl, availability, budgets…)
src/content.config.ts       `work` and `lab` collections
src/content/work/*.md       case studies (2)
src/content/lab/*.md        lab items (3–6)
src/styles/tokens.css       design tokens (colour, type, spacing) light + dark
src/styles/global.css       reset, base type, layout utilities, focus styles
src/styles/motion.css       all animation, all wrapped in no-preference media query
src/layouts/Base.astro      <head>, meta, nav, footer, mobile CTA bar, analytics
src/components/Nav.astro
src/components/MobileCta.astro
src/components/Footer.astro
src/components/CopyEmail.astro
src/components/BookCall.astro
src/components/WorkCard.astro
src/components/BeforeAfter.astro
src/components/BriefForm.astro
src/components/sections/{Hero,ProofStrip,FeaturedWork,Services,Process,LabTeaser,About,Contact}.astro
src/pages/index.astro
src/pages/work/[slug].astro
src/pages/lab.astro
src/pages/404.astro
src/pages/thanks.astro      no-JS brief success page
worker/index.ts             router: POST /api/brief → handleBrief, else ASSETS
worker/brief.ts             validateBrief(), handleBrief()
tests/unit/brief.test.ts
tests/e2e/*.spec.ts
```

---

### Task 1: Scaffold, config and test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `wrangler.jsonc`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `src/site.config.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `worker/index.ts`, `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `src/site.config.ts` exports
  ```ts
  export const site: {
    name: string; url: string; email: string; linkedin: string;
    calUrl: string;            // full https://cal.com/<user>/20min link
    availability: string;      // e.g. "Taking 1 new agency project for Q1."
    replyPromise: 'Reply within 1 working day.';
    whiteLabel: 'Happy to work white-label and sign your NDA.';
    umamiWebsiteId: string;    // '' disables analytics
  };
  export const BUDGET_OPTIONS: readonly string[]; // ['Under £5k','£5k–£15k','£15k–£40k','£40k+','Not sure yet']
  ```
- Produces: `Base.astro` props `{ title: string; description: string; ogImage?: string }`, with a default `<slot />` inside `<main id="main">`.
- Produces: `worker/index.ts` default export `{ fetch(request, env: Env) }` with
  `interface Env { ASSETS: Fetcher; EMAIL: SendEmail; BRIEF_TO: string; BRIEF_FROM: string }`.

- [ ] **Step 1:** Scaffold with `npm create astro@latest . -- --template minimal --typescript strict --install --no-git`. Add dev dependencies: `vitest @playwright/test @axe-core/playwright @lhci/cli wrangler`. Run `npx playwright install chromium`.
- [ ] **Step 2:** Write `wrangler.jsonc` with `main: "worker/index.ts"`, `compatibility_date: "2026-10-15"`, `assets: { directory: "./dist", binding: "ASSETS", run_worker_first: ["/api/*"], not_found_handling: "404-page" }`, `send_email: [{ name: "EMAIL" }]`, and `vars: { BRIEF_TO: "<Dan's address>", BRIEF_FROM: "brief@<domain>" }`.
- [ ] **Step 3:** For now, `worker/index.ts` returns `env.ASSETS.fetch(request)` for everything (the brief route comes in Task 8).
- [ ] **Step 4:** `playwright.config.ts` uses `webServer: { command: "npm run build && npx wrangler dev --port 8787", url: "http://localhost:8787", reuseExistingServer: true }`, `baseURL: "http://localhost:8787"`, and two projects: `desktop` (1280×800) and `mobile` (`devices['Pixel 7']`).
- [ ] **Step 5: Write the failing smoke test** in `tests/e2e/smoke.spec.ts`:
  ```ts
  test('homepage renders with title and lang', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dan/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main#main')).toBeVisible();
  });
  ```
- [ ] **Step 6:** Run `npx playwright test smoke`. Expected: FAIL (the template page has no `main#main`).
- [ ] **Step 7:** Build `Base.astro` (html lang="en", charset, viewport, title, meta description, skip link to `#main`, `<main id="main"><slot/></main>`) and make `index.astro` use it.
- [ ] **Step 8:** Run `npx playwright test smoke`. Expected: PASS on both projects.
- [ ] **Step 9:** Commit: `git add -A && git commit -m "Scaffold Astro site with Worker and test harness"`

---

### Task 2: Design tokens and base styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/layouts/Base.astro` (import both)
- Test: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Produces CSS custom properties that every later task uses (no hard-coded colours or sizes elsewhere):
  `--bg --surface --text --text-muted --accent --accent-contrast --border --focus`
  `--font-display --font-body`
  `--step--1 --step-0 --step-1 --step-2 --step-3 --step-4 --step-5` (fluid `clamp()` type scale)
  `--space-xs --space-s --space-m --space-l --space-xl --space-2xl`
  `--measure` (max line length, ~65ch) and `--page-max` (max content width)

- [ ] **Step 1:** Invoke the `impeccable` skill to choose the display and body typefaces and the single accent colour, under the spec §5 constraints ("editorial studio", no purple/blue gradients). Self-host fonts with `@fontsource` packages, using `font-display: swap`.
- [ ] **Step 2: Write the failing test**:
  ```ts
  for (const scheme of ['light', 'dark'] as const) {
    test(`${scheme} theme applies tokens`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe(scheme === 'light' ? '<light --bg as rgb()>' : '<dark --bg as rgb()>');
    });
  }
  test('focus ring is visible on skip link', async ({ page }) => {
    await page.goto('/'); await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe('none');
  });
  ```
  Fill in the two `rgb()` values from the tokens chosen in Step 1.
- [ ] **Step 3:** Run `npx playwright test theme`. Expected: FAIL.
- [ ] **Step 4:** Write `tokens.css` (light values on `:root`, dark values in `@media (prefers-color-scheme: dark)`, plus `color-scheme: light dark`). Write `global.css` (minimal reset, body uses tokens, `:focus-visible` outline 3px `--focus`, `.wrap` container using `--page-max`, images `max-width:100%`). Every text/background pair must reach AA contrast; check them with a contrast tool and note the ratios in a CSS comment.
- [ ] **Step 5:** Run `npx playwright test theme`. Expected: PASS.
- [ ] **Step 6:** Commit: `Add design tokens and base styles`

---

### Task 3: Content collections and placeholder content

**Files:**
- Create: `src/content.config.ts`, `src/content/work/case-study-one.md`, `src/content/work/case-study-two.md`, `src/content/lab/{experiment-one,experiment-two,experiment-three}.md`, placeholder images in `src/assets/work/` and `src/assets/lab/`
- Test: `tests/e2e/content.spec.ts`

**Interfaces:**
- Produces collection `work`, schema:
  ```ts
  { title: string; clientType: string; role: string; timeline: string; outcome: string;
    order: number;                       // sort key, 1 = first
    cover: ImageMetadata; coverAlt: string;
    preview?: string;                    // path under /public to muted .mp4 loop
    quote?: { text: string; who: string };
    beforeAfter?: { before: ImageMetadata; after: ImageMetadata; beforeAlt: string; afterAlt: string; caption: string } }
  ```
  Body Markdown uses `## Challenge`, `## My role`, `## Process`, `## Results` headings.
- Produces collection `lab`, schema: `{ title: string; summary: string; order: number; image: ImageMetadata; imageAlt: string; link?: string; interactive: boolean }`
- Entry ids (from filenames) become URL slugs: `/work/<id>`.

- [ ] **Step 1:** Write `content.config.ts` using `defineCollection`, `glob({ base: './src/content/work', pattern: '*.md' })`, and `z` from `astro/zod`, with the `({ image }) =>` schema form for image fields.
- [ ] **Step 2:** Write the placeholder entries. Copy is clearly marked `[PLACEHOLDER]` so Dan can find it. Set `interactive: true` on one Lab item.
- [ ] **Step 3: Verify the schema enforces required fields** (pages that render the content are tested in Tasks 5–7):
  Run `npm run build`. Expected: success. Then temporarily delete `coverAlt` from one entry and confirm the build FAILS naming the field. Restore it.
- [ ] **Step 4:** Commit: `Add work and lab content collections`

---

### Task 4: Site chrome: nav, mobile CTA bar, footer, booking, copy email

**Files:**
- Create: `src/components/{Nav,MobileCta,Footer,CopyEmail,BookCall}.astro`
- Modify: `src/layouts/Base.astro`
- Test: `tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `site` from Task 1. Tokens from Task 2.
- Produces: `<BookCall variant="primary" | "secondary" | "nav" label?: string />`. It renders `<a href={site.calUrl} data-umami-event="book_call_click" data-cal-link>`. With JS, the Cal.com embed opens in-page. Without JS, or if the Cal script fails, it's a normal link.
- Produces: `<CopyEmail />`. Renders `<a href="mailto:…">` showing the address, with a button that copies it to the clipboard and shows a "Copied" message (in an `aria-live` region). Without JS, only the mailto link shows.
- Base layout loads Umami (`<script defer src="https://cloud.umami.is/script.js" data-website-id={site.umamiWebsiteId}>`) only when `umamiWebsiteId` is non-empty.

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('desktop nav order and pinned CTA', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop');
    await page.goto('/');
    await expect(page.getByRole('navigation').getByRole('link'))
      .toHaveText([/Dan/, 'Work', 'Services', 'Lab', 'About', 'Book a call']);
    await page.mouse.wheel(0, 3000);
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Book a call' })).toBeInViewport();
  });
  test('mobile bottom bar shows Book a call', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile');
    await page.goto('/'); await page.mouse.wheel(0, 3000);
    await expect(page.getByTestId('mobile-cta').getByRole('link', { name: 'Book a call' })).toBeInViewport();
  });
  test('Book a call falls back to a plain link when Cal.com is blocked', async ({ page }) => {
    await page.route(/cal\.com/, r => r.abort());
    await page.goto('/');
    const link = page.getByRole('link', { name: 'Book a call' }).first();
    await expect(link).toHaveAttribute('href', site.calUrl);
    await expect(link).toHaveAttribute('data-umami-event', 'book_call_click');
  });
  test('copy email button copies the address', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/'); await page.getByRole('button', { name: /copy email/i }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
    await expect(page.getByText('Copied')).toBeVisible();
  });
  ```
- [ ] **Step 2:** Run `npx playwright test chrome`. Expected: FAIL.
- [ ] **Step 3:** Build the components. On mobile (`max-width: 47.99em`) the nav links collapse into a `<details>`/`<summary>` menu (works without JS), and `MobileCta` is fixed to the bottom of the screen. Add `padding-bottom` to `body` so the bar never covers the footer. The Cal embed loads Cal's official embed snippet lazily on the first pointer or focus on any `[data-cal-link]`, then calls `preventDefault` only if `window.Cal` exists.
- [ ] **Step 4:** Run `npx playwright test chrome`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add nav, mobile CTA bar, footer and booking link`

---

### Task 5: Homepage sections

**Files:**
- Create: `src/components/sections/{Hero,ProofStrip,FeaturedWork,Services,Process,LabTeaser,About,Contact}.astro`, `src/components/WorkCard.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `BookCall`, `CopyEmail` (Task 4), the collections (Task 3), `site` (Task 1).
- Produces: `<WorkCard entry={CollectionEntry<'work'>} />`. It renders an `<article>` containing the cover, a muted `<video preload="none">` when `preview` is set, and title/role/outcome. It links to `/work/${entry.id}` and sets `style="view-transition-name: work-${entry.id}"` on its cover image (Task 6 matches it).
- Section ids: `#work`, `#services`, `#process`, `#lab`, `#about`, `#contact` (nav anchors from Task 4 point to these).
- `Contact.astro` leaves a `<slot name="form" />` where Task 9 inserts `BriefForm`.

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('hero copy and CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The AI half of your creative team.');
    await expect(page.getByText('Interactive AI experiences for your clients, and the generative pipelines that make your studio faster. Designed and built end to end.')).toBeVisible();
    const hero = page.locator('#hero');
    await expect(hero.getByRole('link', { name: 'Book a call' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '#work');
  });
  test('sections in spec order', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('main > section').evaluateAll(s => s.map(e => e.id));
    expect(ids).toEqual(['hero', 'proof', 'work', 'services', 'process', 'lab', 'about', 'contact']);
  });
  test('featured work shows 2 cards linking to case studies', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#work a[href^="/work/"]')).toHaveCount(2);
  });
  test('services has Experiences and Pipelines with 3 items each', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Experiences', 'Pipelines'])
      await expect(page.locator('#services').getByRole('region', { name }).getByRole('listitem')).toHaveCount(3);
  });
  test('process has 4 steps in order', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#process ol > li h3')).toHaveText(['Brief', 'Prototype in 1 week', 'Build', 'Handover']);
  });
  test('contact trust signals and Book a call after process', async ({ page }) => {
    await page.goto('/');
    const c = page.locator('#contact');
    for (const t of [site.availability, 'Reply within 1 working day.', 'Happy to work white-label and sign your NDA.'])
      await expect(c.getByText(t)).toBeVisible();
    await expect(page.locator('#process').getByRole('link', { name: 'Book a call' })).toBeVisible();
  });
  ```
- [ ] **Step 2:** Run `npx playwright test home`. Expected: FAIL.
- [ ] **Step 3:** Build the sections in the order above. Each section is a `<section id aria-labelledby>`. The hero background uses an Astro `<Picture>` poster with `fetchpriority="high"` plus a `<video muted loop playsinline preload="none" poster>` with **no** `autoplay` attribute (Task 10 starts it). The Services columns are `<section aria-label="Experiences">` / `"Pipelines"`. The proof strip renders logos from `src/assets/logos/` if any exist; otherwise it shows a single result line from `site.config.ts` (`proofResult: string`, which you add to the `site` object). The Lab teaser shows the first 3 lab entries by `order`. About shows the bio, a photo with alt text, and one line of tools (`site.tools: string`, which you add to the `site` object). Placeholder copy is marked `[PLACEHOLDER]`.
- [ ] **Step 4:** Run `npx playwright test home`. Expected: PASS.
- [ ] **Step 5:** Commit: `Build homepage sections`

---

### Task 6: Case study page, before/after slider, page transitions

**Files:**
- Create: `src/pages/work/[slug].astro`, `src/components/BeforeAfter.astro`
- Test: `tests/e2e/case-study.spec.ts`

**Interfaces:**
- Consumes: `work` collection (Task 3), `BookCall` (Task 4), `view-transition-name: work-<id>` (Task 5).
- Produces: `<BeforeAfter before after beforeAlt afterAlt caption />`. A native `<input type="range" min=0 max=100 value=50 aria-label="Reveal before and after">` sets the CSS variable `--pos`, and the "after" image uses `clip-path: inset(0 0 0 var(--pos))`.
- The final CTA block has `id="case-cta"`. When it scrolls into view, it calls `window.umami?.track('case_study_completed', { slug })` once.

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('case study template sections and CTA', async ({ page }) => {
    await page.goto('/work/case-study-one');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toContainText(['Challenge', 'My role', 'Process', 'Results']);
    const cta = page.locator('#case-cta');
    await expect(cta.getByText("Have a similar project? Let's talk")).toBeVisible();
    await expect(cta.getByRole('link', { name: 'Book a call' })).toBeVisible();
    await expect(cta.getByRole('link', { name: 'Send a brief' })).toHaveAttribute('href', '/#contact');
    await expect(page.getByRole('link', { name: /next case study/i })).toHaveAttribute('href', '/work/case-study-two');
  });
  test('last case study links back to the first', async ({ page }) => {
    await page.goto('/work/case-study-two');
    await expect(page.getByRole('link', { name: /next case study/i })).toHaveAttribute('href', '/work/case-study-one');
  });
  test('before/after slider is keyboard operable', async ({ page }) => {
    await page.goto('/work/case-study-one');
    const s = page.getByRole('slider', { name: 'Reveal before and after' });
    await s.focus(); await page.keyboard.press('ArrowRight');
    await expect(s).toHaveValue('51');
  });
  test('case_study_completed fires once at the CTA', async ({ page }) => {
    await page.addInitScript(() => { (window as any).__calls = []; (window as any).umami = { track: (...a: any[]) => (window as any).__calls.push(a) }; });
    await page.goto('/work/case-study-one');
    await page.locator('#case-cta').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, -500); await page.locator('#case-cta').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => (window as any).__calls)).toEqual([['case_study_completed', { slug: 'case-study-one' }]]);
  });
  ```
  (`case-study-one` has `beforeAfter` set in Task 3. Add it there if it's missing.)
- [ ] **Step 2:** Run `npx playwright test case-study`. Expected: FAIL.
- [ ] **Step 3:** Build the route: `getStaticPaths` from `getCollection('work')` sorted by `order`. "Next" wraps around to the first. The header cover image carries `view-transition-name: work-${entry.id}`. Add `@view-transition { navigation: auto; }` to `global.css` (native cross-page transitions; browsers that don't support it simply skip the effect). Render the quote only when it's present. Place `BeforeAfter` after the Process section when `beforeAfter` is set.
- [ ] **Step 4:** Run `npx playwright test case-study`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add case study template with before/after slider`

---

### Task 7: Lab page and 404

**Files:**
- Create: `src/pages/lab.astro`, `src/pages/404.astro`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `lab` collection, `Base`, `BookCall`.

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('lab lists all experiments and marks interactive ones', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.getByRole('article')).toHaveCount(3);
    await expect(page.getByText('Interactive', { exact: true })).toHaveCount(1);
  });
  test('unknown URL shows branded 404 with recovery links', async ({ page }) => {
    const res = await page.goto('/nope');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '/#work');
    await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/#contact');
  });
  ```
- [ ] **Step 2:** Run `npx playwright test pages`. Expected: FAIL.
- [ ] **Step 3:** Build both pages. Each Lab item is an `<article>`. Items with `interactive: true` show an "Interactive" badge and link to `link`.
- [ ] **Step 4:** Run `npx playwright test pages`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add lab and 404 pages`

---

### Task 8: Brief endpoint (Worker)

**Files:**
- Create: `worker/brief.ts`, `tests/unit/brief.test.ts`
- Modify: `worker/index.ts`

**Interfaces:**
- Consumes: `BUDGET_OPTIONS` from `src/site.config.ts`, `Env` from Task 1.
- Produces:
  ```ts
  export type Brief = { name: string; email: string; project: string; timeline: string; budget: string };
  export function validateBrief(input: Record<string, string>):
    { ok: true; data: Brief } | { ok: false; errors: Partial<Record<keyof Brief, string>> };
  export function handleBrief(request: Request, env: Env): Promise<Response>;
  ```
- HTTP contract for `POST /api/brief` (form-encoded body, fields `name email project timeline budget company_website`):

  | Case | `Accept: application/json` | Otherwise (no-JS form post) |
  |---|---|---|
  | Success | 200 `{"ok":true}` | 303 → `/thanks` |
  | Honeypot `company_website` filled | same as success, **no email sent** | same as success |
  | Invalid | 400 `{"ok":false,"errors":{…}}` | 400 HTML page: errors + their text echoed (HTML-escaped) + Dan's email |
  | Send throws | 502 `{"ok":false,"error":"send_failed"}` | 502 HTML page: their text echoed (escaped) + Dan's email |
  | Body > 20 000 bytes | 413 | 413 |
  | Not POST | 405 | 405 |

- Validation rules (trim every field first): `name` 1–100 chars with no `\r` or `\n`; `email` ≤ 254 chars matching `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; `project` 1–5000 chars; `timeline` 0–200 chars; `budget` empty or in `BUDGET_OPTIONS`.
- Email: `env.EMAIL.send({ to: env.BRIEF_TO, from: env.BRIEF_FROM, replyTo: data.email, subject: \`New brief from ${data.name}\`, text })`, where `text` lists all five fields.

- [ ] **Step 1: Write the failing tests** in `tests/unit/brief.test.ts`:
  ```ts
  const good = { name: 'Ana', email: 'ana@studio.co', project: 'AI campaign', timeline: 'March', budget: BUDGET_OPTIONS[1] };
  const env = (send = vi.fn().mockResolvedValue({ messageId: 'x' })) =>
    ({ EMAIL: { send }, BRIEF_TO: 'dan@x.com', BRIEF_FROM: 'brief@x.com' } as any);
  const req = (body: Record<string, string>, json = true) => new Request('https://x/api/brief', {
    method: 'POST', body: new URLSearchParams(body),
    headers: json ? { accept: 'application/json' } : {} });

  test('valid brief passes', () => expect(validateBrief(good)).toEqual({ ok: true, data: good }));
  test('rejects newline in name (header injection)', () =>
    expect(validateBrief({ ...good, name: 'Ana\r\nBcc: x@y.z' })).toMatchObject({ ok: false, errors: { name: expect.any(String) } }));
  test('rejects missing required fields', () => {
    const r = validateBrief({ ...good, name: ' ', email: 'nope', project: '' });
    expect(r.ok).toBe(false);
    expect(Object.keys((r as any).errors).sort()).toEqual(['email', 'name', 'project']);
  });
  test('rejects project over 5000 chars', () => expect(validateBrief({ ...good, project: 'a'.repeat(5001) }).ok).toBe(false));
  test('rejects unknown budget', () => expect(validateBrief({ ...good, budget: '£1m' }).ok).toBe(false));
  test('sends email with replyTo and subject', async () => {
    const e = env(); const res = await handleBrief(req(good), e);
    expect(res.status).toBe(200);
    expect(e.EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({ to: 'dan@x.com', replyTo: 'ana@studio.co', subject: 'New brief from Ana' }));
  });
  test('honeypot: success response, nothing sent', async () => {
    const e = env(); const res = await handleBrief(req({ ...good, company_website: 'spam.io' }), e);
    expect(res.status).toBe(200); expect(e.EMAIL.send).not.toHaveBeenCalled();
  });
  test('send failure returns 502 json', async () => {
    const res = await handleBrief(req(good), env(vi.fn().mockRejectedValue(new Error('boom'))));
    expect(res.status).toBe(502); expect(await res.json()).toEqual({ ok: false, error: 'send_failed' });
  });
  test('no-JS success redirects', async () => {
    const res = await handleBrief(req(good, false), env());
    expect(res.status).toBe(303); expect(res.headers.get('location')).toBe('/thanks');
  });
  test('no-JS failure echoes escaped text and email', async () => {
    const res = await handleBrief(req({ ...good, project: '<b>hi</b>' }, false), env(vi.fn().mockRejectedValue(new Error())));
    const html = await res.text();
    expect(res.status).toBe(502); expect(html).toContain('&lt;b&gt;hi&lt;/b&gt;'); expect(html).not.toContain('<b>hi</b>');
  });
  test('oversize body is 413', async () =>
    expect((await handleBrief(req({ ...good, project: 'a'.repeat(20001) }), env())).status).toBe(413));
  test('GET is 405', async () =>
    expect((await handleBrief(new Request('https://x/api/brief'), env())).status).toBe(405));
  ```
- [ ] **Step 2:** Run `npx vitest run`. Expected: FAIL ("validateBrief is not defined").
- [ ] **Step 3:** Implement `worker/brief.ts`. Check size with `Content-Length` when present, and otherwise by reading the body text length before parsing. In `worker/index.ts`, route `url.pathname === '/api/brief'` to `handleBrief`.
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS (12 tests).
- [ ] **Step 5:** Commit: `Add brief form endpoint with validation and email`

---

### Task 9: Brief form component

**Files:**
- Create: `src/components/BriefForm.astro`, `src/pages/thanks.astro`, `tests/e2e/brief-form.spec.ts`
- Modify: `src/components/sections/Contact.astro` (fill the `form` slot)

**Interfaces:**
- Consumes: `POST /api/brief` contract (Task 8), `BUDGET_OPTIONS`, `site.email`.
- Produces: `<form method="post" action="/api/brief">` with labelled fields `Name`, `Email`, `What's the project?` (textarea), `Timeline`, `Budget range` (select with an empty "Choose…" option followed by `BUDGET_OPTIONS`), and a visually hidden `company_website` input (`tabindex="-1" autocomplete="off" aria-hidden="true"`). HTML attributes mirror Task 8's rules (`required`, `maxlength`, `type="email"`).
- With JS: `fetch` using `Accept: application/json`. On 200 it shows "Thanks, I'll reply within 1 working day. Or book a call now." (with a `BookCall` link), resets the form, and calls `window.umami?.track('brief_submitted')`. On any other result it shows an inline error with a `mailto:` link to `site.email` **and does not clear the fields**. Status messages go in an `aria-live="polite"` region.
- Without JS: the native form post gets a 303 to `/thanks`, a static page (`<meta name="robots" content="noindex">`) with the same thanks message, a `BookCall` link, and a link back home.

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('successful send shows thanks and tracks event', async ({ page }) => {
    await page.addInitScript(() => { (window as any).__calls = []; (window as any).umami = { track: (...a: any[]) => (window as any).__calls.push(a) }; });
    await page.route('/api/brief', r => r.fulfill({ status: 200, json: { ok: true } }));
    await page.goto('/#contact');
    await page.getByLabel('Name').fill('Ana'); await page.getByLabel('Email').fill('ana@studio.co');
    await page.getByLabel("What's the project?").fill('AI campaign');
    await page.getByRole('button', { name: 'Send brief' }).click();
    await expect(page.getByText(/Thanks, I'll reply within 1 working day/)).toBeVisible();
    expect(await page.evaluate(() => (window as any).__calls)).toEqual([['brief_submitted']]);
  });
  test('send failure keeps typed text and shows email fallback', async ({ page }) => {
    await page.route('/api/brief', r => r.fulfill({ status: 502, json: { ok: false, error: 'send_failed' } }));
    await page.goto('/#contact');
    await page.getByLabel('Name').fill('Ana'); await page.getByLabel('Email').fill('ana@studio.co');
    await page.getByLabel("What's the project?").fill('Keep me');
    await page.getByRole('button', { name: 'Send brief' }).click();
    await expect(page.locator('#contact').getByRole('link', { name: site.email })).toBeVisible();
    await expect(page.getByLabel("What's the project?")).toHaveValue('Keep me');
  });
  test('works without JavaScript (real endpoint, local email simulated)', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false }); const page = await ctx.newPage();
    await page.goto('/#contact');
    await page.getByLabel('Name').fill('Ana'); await page.getByLabel('Email').fill('ana@studio.co');
    await page.getByLabel("What's the project?").fill('No JS');
    await page.getByRole('button', { name: 'Send brief' }).click();
    await expect(page).toHaveURL(/\/thanks$/);
    await expect(page.getByText(/Thanks, I'll reply within 1 working day/)).toBeVisible();
    await ctx.close();
  });
  ```
- [ ] **Step 2:** Run `npx playwright test brief-form`. Expected: FAIL.
- [ ] **Step 3:** Implement `BriefForm.astro` with a single inline `<script>`, and `thanks.astro` using `Base`.
- [ ] **Step 4:** Run `npx playwright test brief-form`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add brief form with inline success and error states`

---

### Task 10: Motion pass

**Files:**
- Create: `src/styles/motion.css`
- Modify: `src/layouts/Base.astro`, `src/components/sections/Hero.astro`, `src/components/WorkCard.astro`
- Test: `tests/e2e/motion.spec.ts`

**Interfaces:**
- Consumes: tokens, the hero `<video>` (Task 5), and `WorkCard` (Task 5, which gets `preview` from the schema).
- Rule: every animation and transition in `motion.css` sits inside `@media (prefers-reduced-motion: no-preference)`. The only JS is two inline scripts: (a) the hero video calls `play()` if reduced motion is not set; (b) on `pointerenter`/`pointerleave` (when `(hover: hover)`), or when a card scrolls into view (when `(hover: none)`), work card previews play and pause. Both do nothing under reduced motion.

| Effect | Implementation |
|---|---|
| Hero headline reveal | Each line in its own `<span class="line">`; keyframe slide-up + fade with `animation-delay: calc(var(--i) * 80ms)` |
| Hero video fade | `opacity` transition when `playing` fires (add class) |
| Scroll reveals | `animation-timeline: view()` inside `@supports (animation-timeline: view())`; no JS fallback needed |
| Page transitions | Already native (Task 6); add `::view-transition-old/new(root)` crossfade duration 250ms |

- [ ] **Step 1: Write the failing tests**:
  ```ts
  test('reduced motion: no autoplay, no animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await page.locator('#hero video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    const running = await page.evaluate(() => document.getAnimations().length);
    expect(running).toBe(0);
  });
  test('motion allowed: hero video plays and headline animates', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect.poll(() => page.locator('#hero video').evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);
  });
  test('work card preview plays on hover (desktop)', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop');
    await page.goto('/'); const card = page.locator('#work article').first();
    await card.hover();
    await expect.poll(() => card.locator('video').evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  });
  ```
  (Placeholder `preview` .mp4 files go in `public/media/`. Use a 2-second, very small file.)
- [ ] **Step 2:** Run `npx playwright test motion`. Expected: FAIL.
- [ ] **Step 3:** Implement per the table above.
- [ ] **Step 4:** Run `npx playwright test motion`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add motion with reduced-motion support`

---

### Task 11: SEO and social metadata

**Files:**
- Modify: `src/layouts/Base.astro`, every page, `astro.config.mjs` (`site`)
- Create: `public/og-default.png` (1200×630), `public/robots.txt`, `public/favicon.svg`; add `@astrojs/sitemap`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- `Base` props from Task 1 now produce: `<title>`, `meta description`, `link rel=canonical`, `og:title/description/image/url/type`, and `twitter:card=summary_large_image`. `ogImage` defaults to `/og-default.png`; case studies pass their cover image URL (`getImage({ src: cover, width: 1200, height: 630 })`).

- [ ] **Step 1: Write the failing test**:
  ```ts
  test('every page has unique title, description and og image', async ({ page }) => {
    const seen = new Set<string>();
    for (const path of ['/', '/work/case-study-one', '/work/case-study-two', '/lab']) {
      await page.goto(path);
      const title = await page.title();
      expect(seen.has(title)).toBe(false); seen.add(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
    }
  });
  ```
- [ ] **Step 2:** Run `npx playwright test seo`. Expected: FAIL.
- [ ] **Step 3:** Implement. Absolute URLs come from `Astro.site`.
- [ ] **Step 4:** Run `npx playwright test seo`. Expected: PASS.
- [ ] **Step 5:** Commit: `Add SEO and social metadata`

---

### Task 12: Quality gates and deploy

**Files:**
- Create: `tests/e2e/quality.spec.ts`, `lighthouserc.json`
- Modify: `package.json` (scripts `lhci`, `deploy`)

**Interfaces:**
- Consumes: every page.

- [ ] **Step 1: Write the quality tests**:
  ```ts
  const PAGES = ['/', '/work/case-study-one', '/work/case-study-two', '/lab', '/thanks', '/nope'];
  for (const path of PAGES) {
    test(`a11y: ${path} has no axe violations (light + dark)`, async ({ page }) => {
      for (const colorScheme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme }); await page.goto(path);
        const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
        expect(r.violations).toEqual([]);
      }
    });
    test(`no horizontal scroll: ${path}`, async ({ page }) => {
      for (const width of [360, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 800 }); await page.goto(path);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    });
    test(`readable without JS: ${path}`, async ({ browser }) => {
      const ctx = await browser.newContext({ javaScriptEnabled: false }); const p = await ctx.newPage();
      await p.goto(path); await expect(p.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(p.getByRole('link', { name: site.email }).first()).toBeAttached();
      await ctx.close();
    });
  }
  test('every image has alt', async ({ page }) => {
    for (const path of PAGES) { await page.goto(path); await expect(page.locator('img:not([alt])')).toHaveCount(0); }
  });
  ```
  Before running, temporarily give one case study a 90-character unbroken title so the 360 px check really exercises long-title wrapping (Review Focus #5). Revert it afterwards.
- [ ] **Step 2:** Run `npx playwright test quality`. Fix every failure in the component that owns it. Expected: PASS.
- [ ] **Step 3:** Write `lighthouserc.json`: `collect.staticDistDir: "./dist"`, URLs for every page, `settings.preset` mobile (default), and assertions `categories:performance|accessibility|best-practices|seo` `minScore: 0.95`, `largest-contentful-paint` `maxNumericValue: 2000`, `total-byte-weight` `maxNumericValue: 1000000`.
- [ ] **Step 4:** Run `npm run build && npx lhci autorun`. Expected: all assertions pass.
- [ ] **Step 5:** Run the full suite: `npx vitest run && npx playwright test`. Expected: all PASS.
- [ ] **Step 6:** Commit: `Add quality gates and Lighthouse budgets`
- [ ] **Step 7 (Dan does this; needs his accounts):** Add the domain to Cloudflare, enable Email Service / Email Routing and verify `BRIEF_TO`, create the Cal.com 20-minute event, create the Umami site and paste its ID into `site.config.ts`. Then `npx wrangler deploy`. After deploying, send one real brief and confirm it arrives with Reply-To set to the sender.

---

## Content Dan must supply before launch (spec §9)
Replace every `[PLACEHOLDER]`: 2 case studies (copy, visuals, results, quote, permission), 3–6 Lab items, 10–15 s hero loop, logos or one quantified result, bio + photo, Cal.com link, availability line. Check with `grep -r "\[PLACEHOLDER\]" src` → no output.
