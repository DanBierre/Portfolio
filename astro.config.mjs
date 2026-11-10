// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://danbierre.dev',
  build: { format: 'file' },
  trailingSlash: 'never',
  // The Lab was removed on 11 November 2026; old links land on the homepage.
  redirects: { '/lab': '/', '/lab/agent-x-ray': '/', '/lab/enso': '/', '/lab/grade': '/', '/lab/kanji': '/', '/lab/kinetic': '/', '/lab/rough-cut': '/', '/lab/time-warp': '/', '/lab/variants': '/' },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ filter: (page) => !/\/(thanks|404|concepts)$/.test(page) })],
});
