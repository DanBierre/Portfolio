// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://danbierre.dev',
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (page) => !/\/(thanks|404)$/.test(page) })],
});
