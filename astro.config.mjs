import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lccontainer.com',
  compressHTML: true,
  integrations: [tailwind({ config: './tailwind.config.mjs' })],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      devSourcemap: false,
    },
  },
});
