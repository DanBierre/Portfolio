// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://danbierre.dev',
  build: { format: 'file' },
  trailingSlash: 'never',
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ filter: (page) => !/\/(thanks|404|concepts)$/.test(page) })],
});
