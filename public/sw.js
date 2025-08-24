// Service Worker for LC Container - Image Optimization & Caching
const CACHE_NAME = 'lccontainer-v1';
const STATIC_CACHE = 'static-v1';
const IMAGE_CACHE = 'images-v1';

// Cache strategies
const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
};

const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        '/',
        '/styles/global.css',
        '/photos/logos/lccontainer-logo-transparent-400.png',
        '/photos/container/standard/20ft_5.jpg'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Cache strategy based on request type
  if (url.pathname.startsWith('/photos/')) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (url.pathname.startsWith('/styles/') || url.pathname.startsWith('/_astro/')) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync tasks
  if (import.meta.env.DEV) {
    console.log('Background sync completed');
  }
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
