# danbierre.dev

Dan Bierre's portfolio site: a film editor's showreel, styled as 16mm film with an orange-graded Japan reel and film-burn transitions.

Built with [Astro](https://astro.build) and deployed to Cloudflare Workers at https://danbierre.dev. The brief form is handled by a small Worker in `worker/`.

## Run it

```sh
npm install
npm run dev        # local site at http://localhost:4321
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Build, then run it locally the way Cloudflare serves it |
| `npm test` | Unit tests |
| `npm run test:e2e` | Browser tests (Playwright) |
| `npm run lighthouse` | Build and score speed and accessibility |
| `npm run deploy` | Build and publish to Cloudflare |

## Where things live

- `src/pages/` the pages; `src/components/` the building blocks
- `src/content/work/` and `src/content/lab/` the case studies and lab experiments, one text file each
- `worker/` the brief form's backend
- `public/media/` published video; the large stock footage (`public/media/japan/`, `media-src/`) is not in git
- `PRODUCT.md` and `DESIGN.md` the brief and the design system

Private repository.
