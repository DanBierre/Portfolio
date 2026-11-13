// Hand-edited, language-independent settings. All visible copy lives in src/i18n/ui.ts.
export const site = {
  name: 'Dan Bierre',
  url: 'https://danbierre.dev',
  // Needs Cloudflare Email Routing on danbierre.dev (hello@ → Dan's inbox) before deploying.
  email: 'hello@danbierre.dev',
  umamiWebsiteId: '',
} as const;

// Values sent to the server; labels per language are in ui.ts (budget).
export const BUDGET_OPTIONS = ['A fix · $150', 'A one-page site · $450', 'A few pages', 'Not sure yet'] as const;
