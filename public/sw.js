// Service Worker for LC Container - Image Optimization & Caching
const CACHE_NAME = 'lccontainer-v1';
const IMAGE_CACHE_NAME = 'lccontainer-images-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for API calls
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for images
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/styles/tokens.css',
  '/photos/lccontainer-dark.png',
  '/inventory',
  '/contact',
  '/about'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different types of requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.includes('/photos/') ||
         /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(request.url);
}

// Check if request is for API
function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('lead') ||
         request.url.includes('email');
}

// Check if request is for static asset
function isStaticAsset(request) {
  return request.destination === 'style' ||
         request.destination === 'script' ||
         request.url.includes('/styles/') ||
         request.url.includes('/_astro/');
}

// Handle image requests with stale-while-revalidate strategy
async function handleImageRequest(request) {
  const imageCache = await caches.open(IMAGE_CACHE_NAME);
  
  // Try to get from cache first
  const cachedResponse = await imageCache.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately
    const fetchPromise = fetch(request)
      .then((response) => {
        if (response.ok) {
          // Update cache with fresh version
          imageCache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => {
        // If network fails, keep using cached version
        return cachedResponse;
      });
    
    return cachedResponse;
  } else {
    // No cache, fetch from network
    try {
      const response = await fetch(request);
      if (response.ok) {
        // Cache the response
        imageCache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      // Return a placeholder image if network fails
      return new Response(
        `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial" font-size="16">
            Image not available
          </text>
        </svg>`,
        {
          headers: { 'Content-Type': 'image/svg+xml' }
        }
      );
    }
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    if (response.ok) {
      return response;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    // Fall back to cache if network fails
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Service unavailable' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Asset not available', { status: 404 });
  }
}

// Handle default requests
async function handleDefaultRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Page not available', { status: 404 });
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any pending background tasks
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'background-sync-complete'
    });
  });
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/photos/lccontainer-dark.png',
    badge: '/photos/lccontainer-dark.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('LC Container', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});