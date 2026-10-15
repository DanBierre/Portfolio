// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://danbierre.dev',
  build: { format: 'file' },
  trailingSlash: 'never',
});
