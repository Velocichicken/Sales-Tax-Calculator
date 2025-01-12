importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Precaching essential assets
workbox.precaching.precacheAndRoute([
  { url: '/Sales-Tax-Calculator/', revision: '1' },
  { url: '/Sales-Tax-Calculator/index.html', revision: '1' },
  { url: '/Sales-Tax-Calculator/style.css', revision: '1' },
  { url: '/Sales-Tax-Calculator/main.js', revision: '1' },
  { url: '/Sales-Tax-Calculator/manifest.json', revision: '1' },
  { url: '/Sales-Tax-Calculator/icons/manifest-icon-192.maskable.png', revision: '1' },
  { url: '/Sales-Tax-Calculator/icons/manifest-icon-512.maskable.png', revision: '1' },
]);

// Runtime caching for HTML pages
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

// Cache CSS and JS files with a CacheFirst strategy
workbox.routing.registerRoute(
  ({ request }) => ['style', 'script'].includes(request.destination),
  new workbox.strategies.CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

// Cache images with a CacheFirst strategy
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

// Cache the manifest.json file with a NetworkFirst strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname === '/Sales-Tax-Calculator/manifest.json',
  new workbox.strategies.NetworkFirst({
    cacheName: 'manifest-cache',
  })
);

// Cache icons with a CacheFirst strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/Sales-Tax-Calculator/icons/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'splash-images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Fallback for offline access
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the successful network response
        const clonedResponse = response.clone();
        caches.open('my-cache').then((cache) => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => {
        // Return cached response or offline fallback
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/Sales-Tax-Calculator/index.html');
        });
      })
  );
});

// Install event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-assets').then((cache) =>
      cache.addAll([
        '/Sales-Tax-Calculator/index.html',
        '/Sales-Tax-Calculator/style.css',
        '/Sales-Tax-Calculator/main.js',
        '/Sales-Tax-Calculator/manifest.json',
        '/Sales-Tax-Calculator/icons/manifest-icon-192.maskable.png',
        '/Sales-Tax-Calculator/icons/manifest-icon-512.maskable.png',
      ])
    )
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['static-assets', 'image-assets', 'html-assets', 'splash-images', 'manifest-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});