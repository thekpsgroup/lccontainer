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
    // Advanced image optimization
    quality: 80, // Optimize quality vs file size
    format: ['webp', 'avif', 'jpeg'], // Modern formats with fallbacks
    densities: [1, 2], // Generate 1x and 2x for retina displays
    // Responsive image sizes
    sizes: {
      'hero': '100vw',
      'thumbnail': '300px',
      'gallery': '(max-width: 768px) 100vw, 50vw',
      'inventory': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    }
  },
  vite: {
    build: { 
      cssMinify: true,
      rollupOptions: {
        output: {
          // Optimize chunk splitting for better caching
          manualChunks: {
            'vendor': ['astro'],
            'images': ['sharp']
          }
        }
      }
    },
    // Optimize image loading
    assetsInclude: ['**/*.webp', '**/*.avif'],
    // Enable image optimization
    plugins: []
  },
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always'
  }
});
