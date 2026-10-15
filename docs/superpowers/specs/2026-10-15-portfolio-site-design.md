# Portfolio Site — Design Spec

Date: 2026-10-15
Owner: Dan
Status: Draft, awaiting review

## 1. Goal

Turn agency and studio visitors into qualified enquiries for Dan's AI creative technologist services.

Success = booked calls and submitted briefs from agencies, not traffic volume.

## 2. Audience and positioning

**Primary buyer:** creative agencies and studios that have won (or are pitching) AI-led briefs but lack the people to deliver them.

**Offer:** one combined "AI creative technologist" offer:
- **Experiences**: client-facing interactive AI experiences (campaigns, installations, AI features in client sites/apps).
- **Pipelines**: custom generative image/video/copy workflows that speed up the agency's own production.

**Positioning statement (internal, not shown verbatim):**
> For creative agencies who've won AI-flavoured briefs but don't have the people to deliver them, I'm the AI creative technologist who designs and builds the experience *and* the pipeline behind it. Unlike a dev shop, I think like a creative. Unlike a creative, I ship working systems.

**Hero headline:** "The AI half of your creative team."
**Hero sub-line:** "Interactive AI experiences for your clients, and the generative pipelines that make your studio faster. Designed and built end to end."

**Three repeated messages** (every section supports at least one):
1. Creative-grade taste: work that's good enough to put in front of their clients.
2. Engineering you can trust: ships, scales, doesn't break on launch day.
3. Easy to work with: fits agency process, white-label friendly, clear handover.

**Voice:** confident, plain English, agency-to-partner ("your client", "your team", "your pitch"). Banned: "revolutionary", "cutting-edge", "leverage", "synergy", and similar buzzwords.

**Excluded:** long skills lists, tool-logo walls, CV timeline. A single tools line may appear in About.

## 3. Site structure

Proof constraint: 1–2 deep client case studies today. The site wins on depth, plus a Lab of self-initiated work.

### Pages
| Route | Purpose |
|---|---|
| `/` | Long-scroll homepage (sections below) |
| `/work/<slug>` | One page per case study (2 at launch) |
| `/lab` | 3–6 small experiments, at least one interactive |
| `/404` | Branded not-found page with links to Work and Contact |

Services, About and Contact are homepage sections (anchor links), not separate pages.

### Navigation
Logo/name · Work · Services · Lab · About · **Book a call** (button).
- Desktop: sticky top bar; Book a call pinned top-right.
- Mobile: hamburger menu for links; Book a call becomes a slim bar fixed to the bottom of the screen.

### Homepage sections (in order)
1. **Hero**: headline, sub-line, primary button "Book a call", secondary "See the work". Background: short muted loop of real project footage (poster image first, video lazy-loaded).
2. **Proof strip**: agency/client logos (where permitted) or one quantified result.
3. **Featured work**: 2 large cards. Each shows title, client type, Dan's role, one-line outcome, links to `/work/<slug>`.
4. **What I do for agencies**: two columns, *Experiences* and *Pipelines*, each with 3 example deliverables.
5. **How we work together**: 4 steps: Brief → Prototype in 1 week → Build → Handover.
6. **Lab teaser**: 3 experiments, link to `/lab`.
7. **About**: short human bio, photo, one tools line.
8. **Contact**: three paths (see §4), availability line, reply promise, white-label/NDA note.
9. **Footer**: email copy button, LinkedIn, copyright.

### Case study page template
1. Title, client type, role, timeline, one-line outcome
2. Challenge
3. Dan's role
4. Process, with real in-progress visuals
5. Interactive element: before/after slider or live demo (one per study)
6. Results (numbers where possible)
7. Client/agency quote (if available)
8. CTA: "Have a similar project? Let's talk" → Book a call / Send a brief
9. Next case study link

Case studies are authored as content files (Markdown/MDX), one file per study.

## 4. Conversion

| Visitor intent | Path | Mechanism |
|---|---|---|
| Ready to talk | **Book a 20-min call** (primary) | Cal.com embed, opens in-page (no reload) |
| Has a brief | **Send a brief** | 3-field form: Project (text), Timeline (text), Budget range (select). Plus name + email. |
| Browsing | Email / LinkedIn | One-click copy-email button; LinkedIn link |

**Button placements:** nav (pinned), hero, end of every case study, after "How we work together", Contact section. Every scroll position is at most one screen away from a Book a call button.

**Trust signals beside CTAs:**
- Availability line, hand-edited in one config value (e.g. "Taking 1 new agency project for Q1").
- "Reply within 1 working day."
- "Happy to work white-label and sign your NDA."

**Brief form behaviour:**
- Required: name, email, project. Validated in the browser and again on the server.
- Spam protection: honeypot field (hidden field that bots fill in).
- On success: inline thank-you message with "Or book a call now" link.
- On failure: inline error that keeps the typed text and shows Dan's email as a fallback. No data is lost.

**Excluded:** pop-ups, exit-intent modals, chatbots, newsletter sign-up.

**Measurement:** privacy-friendly analytics, no cookie banner. Track three events:
1. `book_call_click`
2. `brief_submitted`
3. `case_study_completed` (scrolled to final CTA)

## 5. Visual direction

"Editorial studio", not "AI startup".
- Avoid: purple/blue gradients, glowing brains, particle networks, stock AI imagery.
- Do: large confident type, generous white space, one accent colour, real project work as the imagery.
- Type: characterful display face for headlines + clean sans for body. Final pick during build.
- Light and dark mode, following the device setting.

## 6. Motion

| Where | Effect |
|---|---|
| Hero | Headline reveals line by line; background video fades in |
| Work cards | Desktop: hover plays short muted preview. Mobile: plays when scrolled into view |
| Page transitions | Crossfade; featured image morphs from card into case study header (View Transitions API) |
| Case studies | Images ease in on scroll; one interactive slider/demo per study |
| Global | `prefers-reduced-motion` disables non-essential motion; videos show poster only |

Rule: CSS and native browser features first. An animation library is added only when a specific effect can't be done natively.

## 7. Tech stack

| Need | Choice |
|---|---|
| Framework | Astro (static output), content collections for case studies and Lab items |
| Styling | Plain CSS with custom properties (design tokens) |
| Hosting | Cloudflare Pages |
| Brief form | Cloudflare Pages Function that emails Dan |
| Booking | Cal.com embed |
| Analytics | Cloudflare Web Analytics |

Considered and rejected: Framer (faster to launch, but limits custom interactions and costs monthly; the hand-built site doubles as proof of engineering skill).

## 8. Quality targets (definition of done)

- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO, on every page (mobile profile).
- Largest Contentful Paint < 2 s on mobile.
- Page weight < 1 MB excluding lazy-loaded video.
- Responsive from 360 px to 1920 px wide, no horizontal scroll.
- WCAG 2.2 AA: keyboard navigable, visible focus, AA contrast in both themes, alt text on all images, captions on any video with speech.
- Works with JavaScript disabled for all reading content. Booking embed and form enhancements may need JS; email fallback always present.
- Each page has a unique title, meta description and social share image.

## 9. Content Dan must supply

- 2 case studies: visuals, process material, results, quote (if possible), permission to show.
- 3–6 Lab experiments (at least 1 interactive).
- Hero footage (10–15 s loop).
- Logos or one quantified result for the proof strip.
- Bio + photo.
- Cal.com account and event link.

## 10. Out of scope (v1)

Blog, CMS, multi-language, client login, pricing page, testimonials carousel, newsletter.
