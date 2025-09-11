import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lccontainer.com',
  compressHTML: true,
  output: 'static',
  integrations: [tailwind({ config: './tailwind.config.mjs' })],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
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
          manualChunks: {
            vendor: ['astro'],
            ui: ['@astrojs/prefetch', '@vercel/analytics'],
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
    },
    css: {
      devSourcemap: false,
      postcss: {},
    },
    optimizeDeps: {
      exclude: [
        '@fontsource/inter/400.css',
        '@fontsource/inter/500.css',
        '@fontsource/inter/600.css',
        '@fontsource/inter/700.css',
      ],
    },
    ssr: {
      noExternal: ['@fontsource/inter'],
    },
  },
});
