import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lccontainer.com',
  viewTransitions: true,
  integrations: [
    tailwind(),
  ],
  prefetch: true, // Built-in prefetch (replaces @astrojs/prefetch)
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' }, // built-in sharp
    domains: ['lccontainer.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    build: { cssMinify: true }
  },
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always'
  }
});
