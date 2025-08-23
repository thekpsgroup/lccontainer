import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://lccontainer.com',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always'
  },
  image: {
    domains: ['lccontainer.com'],
    remotePatterns: [{ protocol: 'https' }],
  }
});
