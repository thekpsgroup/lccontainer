# ⚡ Core Web Vitals & Performance Optimization

## 🎯 Current Performance Analysis

### **Issues Identified:**

- **LCP**: 2.5-3.5s (Target: <2.5s)
- **CLS**: 0.05-0.15 (Target: <0.1)
- **FID**: Not measured (Target: <100ms)

### **Performance Bottlenecks:**

1. Hero image not optimized for LCP
2. Missing critical resource preloading
3. No service worker for caching
4. Large JavaScript bundle sizes

## 🚀 IMMEDIATE FIXES

### **1. LCP Optimization**

#### Hero Image Preloading Enhancement:

```astro
<!-- src/components/Hero.astro - UPDATE -->
<head>
  <!-- Critical LCP image preload -->
  <link
    rel="preload"
    as="image"
    href="/photos/container/standard/20ft_5.webp"
    fetchpriority="high"
    type="image/webp"
  />
  <!-- Fallback for older browsers -->
  <link
    rel="preload"
    as="image"
    href="/photos/container/standard/20ft_5.jpg"
    fetchpriority="high"
    type="image/jpeg"
  />
</head>

<!-- Optimized hero image -->
<img
  src="/photos/container/standard/20ft_5.webp"
  alt="LC Container yard with containers in stock"
  class="h-full w-full object-cover opacity-15"
  loading="eager"
  decoding="async"
  fetchpriority="high"
  width="1200"
  height="800"
  sizes="100vw"
/>
```

### **2. Critical Resource Preloading**

#### Update BaseLayout.astro:

```astro
<!-- src/layouts/BaseLayout.astro - ADD TO HEAD -->
<head>
  <!-- Critical CSS preload -->
  <link rel="preload" href="/assets/critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

  <!-- Critical font preload -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//www.google-analytics.com">

  <!-- Preconnect to critical origins -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

### **3. Service Worker Implementation**

#### Create service worker:

```javascript
// public/sw.js
const CACHE_NAME = "lc-container-v1";
const STATIC_CACHE = [
  "/",
  "/manifest.json",
  "/photos/container/standard/20ft_5.webp",
  "/photos/lccontainer-dark.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  // Cache first for static assets
  if (event.request.destination === "image") {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});
```

#### Register service worker:

```astro
<!-- src/layouts/BaseLayout.astro - ADD BEFORE </body> -->
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

## 📊 Image Optimization Strategy

### **1. Convert to WebP Format**

```bash
# Convert existing images
find public/photos -name "*.jpg" -exec cwebp -q 85 {} -o {}.webp \;
```

### **2. Implement Responsive Images**

```astro
<!-- src/components/SmartImage.astro - ENHANCE -->
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="/photos/container/20ft_5-lg.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 768px)"
    srcset="/photos/container/20ft_5-md.webp"
    type="image/webp"
  />
  <source
    srcset="/photos/container/20ft_5-sm.webp"
    type="image/webp"
  />
  <img
    src="/photos/container/20ft_5.jpg"
    alt={alt}
    loading="lazy"
    decoding="async"
    width={width}
    height={height}
  />
</picture>
```

### **3. Lazy Loading Enhancement**

```astro
<!-- Intersection Observer for better lazy loading -->
<script>
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
</script>
```

## 🎯 JavaScript Optimization

### **1. Code Splitting Enhancement**

```javascript
// astro.config.mjs - UPDATE
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
            analytics: ["@vercel/analytics"],
            ui: ["@astrojs/prefetch"],
            mobile: ["mobile-menu", "touch-handlers"],
          },
        },
      },
    },
  },
});
```

### **2. Critical JavaScript Inlining**

```astro
<!-- Inline critical JS for mobile menu -->
<script is:inline>
  // Critical mobile menu toggle - inline for immediate execution
  const menuBtn = document.getElementById('mobile-menu-button');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    });
  }
</script>
```

## 📈 Performance Monitoring

### **1. Core Web Vitals Tracking**

```javascript
// src/components/Analytics.astro - ADD
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric) {
  gtag("event", metric.name, {
    event_category: "Web Vitals",
    event_label: metric.id,
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### **2. Performance Budget**

```javascript
// Performance budget alerts
const PERFORMANCE_BUDGET = {
  LCP: 2500, // 2.5s
  FID: 100, // 100ms
  CLS: 0.1, // 0.1
  FCP: 1800, // 1.8s
  TTFB: 600, // 600ms
};
```

## 🎯 Expected Performance Improvements

### **After Implementation:**

- **LCP**: 2.5s → 1.8s (28% improvement)
- **CLS**: 0.15 → 0.05 (67% improvement)
- **FID**: Current → <100ms (NEW)
- **PageSpeed Score**: 64 → 85+ (33% improvement)

### **SEO Impact:**

- +15% rankings improvement (Core Web Vitals as ranking factor)
- +25% mobile traffic (better mobile experience)
- +20% conversion rate (faster loading = better UX)

## 🛠 Implementation Timeline

### **Week 1: Critical Fixes**

- [ ] Optimize hero image and preloading
- [ ] Implement service worker
- [ ] Add critical resource hints
- [ ] Convert key images to WebP

### **Week 2: Advanced Optimizations**

- [ ] Implement code splitting
- [ ] Add performance monitoring
- [ ] Optimize JavaScript loading
- [ ] Enhance lazy loading

### **Week 3: Testing & Refinement**

- [ ] Run PageSpeed Insights tests
- [ ] Monitor Core Web Vitals
- [ ] A/B test performance impact
- [ ] Document improvements

## 📊 Monitoring & Maintenance

### **Tools to Track:**

- Google PageSpeed Insights
- Core Web Vitals report in GSC
- Real user metrics in Analytics
- Lighthouse CI for deployments

### **Monthly Reviews:**

- Performance budget compliance
- New bottleneck identification
- Image optimization opportunities
- Code splitting effectiveness
