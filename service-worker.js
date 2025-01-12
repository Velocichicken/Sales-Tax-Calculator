importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Precaching essential assets
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' }, // Cache the main page
  { url: '/index.html', revision: '1' },
  { url: '/style.css', revision: '1' },
  { url: '/main.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/Sales-Tax-Calculator/icons/manifest-icon-192.maskable.png', revision: '1' },
  { url: '/Sales-Tax-Calculator/icons/manifest-icon-512.maskable.png', revision: '1' },
]);

// Cache assets for offline usage
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.CacheFirst({
    cacheName: 'html-assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
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

// Cache manifest and icon files
workbox.routing.registerRoute(
  '/manifest.json',
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/icons/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'splash-images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Adjust based on your app's needs
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Ensure all assets are available offline and provide fallback for offline access
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response if the network fetch is successful
        const clonedResponse = response.clone();
        caches.open('my-cache').then((cache) => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => {
        // If network fetch fails, return cached response or fallback
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/offline.html');
        });
      })
  );
});

// Install event: Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    workbox.precaching.precacheAndRoute([
      { url: '/', revision: '1' },
      { url: '/index.html', revision: '1' },
      { url: '/style.css', revision: '1' },
      { url: '/main.js', revision: '1' },
      { url: './manifest.json', revision: '1' },
      { url: '/icons/manifest-icon-192.maskable.png', revision: '1' },
      { url: '/icons/manifest-icon-512.maskable.png', revision: '1' },
      { url: '/offline.html', revision: '1' },  // Add offline fallback page here
    ])
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['static-assets', 'image-assets', 'html-assets', 'splash-images'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});