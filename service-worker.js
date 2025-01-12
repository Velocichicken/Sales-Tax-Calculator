importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');





// Precaching essential assets for offline use
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' }, // Cache the main page
  { url: '/index.html', revision: '1' },
  { url: '/style.css', revision: '1' },
  { url: '/main.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/icons/manifest-icon-192.maskable.png', revision: '1' },
  { url: '/icons/manifest-icon-512.maskable.png', revision: '1' },
]);

// Cache HTML assets for offline usage
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

// Cache static assets like JavaScript and CSS for offline usage
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

// Cache image assets for offline usage
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

// Cache icon files for offline use
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/icons/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'splash-images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
      }),
    ],
  })
);

// Skip waiting and activate immediately after installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    workbox.precaching.precacheAndRoute([
      { url: '/', revision: '1' },
      { url: '/index.html', revision: '1' },
      { url: '/style.css', revision: '1' },
      { url: '/main.js', revision: '1' },
      { url: '/manifest.json', revision: '1' },
      { url: '/icons/manifest-icon-192.maskable.png', revision: '1' },
      { url: '/icons/manifest-icon-512.maskable.png', revision: '1' },
    ])
  );
});

// Clear old caches during activation
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
});c