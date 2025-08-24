import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lccontainer.com',
  compressHTML: true,
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
