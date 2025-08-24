import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lccontainer.com',
  compressHTML: true,
  integrations: [tailwind({ config: './tailwind.config.mjs' })],
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          toplevel: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    css: {
      devSourcemap: false,
    },
    optimizeDeps: {
      include: [],
    },
    ssr: {
      noExternal: [],
    },
  },
});
