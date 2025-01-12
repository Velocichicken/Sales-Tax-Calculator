importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );

  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
  );

  workbox.routing.registerRoute(
    '/manifest.json',
    new workbox.strategies.NetworkFirst()
  );

  workbox.routing.registerRoute(
    ({url}) => url.pathname.startsWith('/icons/'),
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

  // Precaching static assets
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1' }, // Cache the main page
  { url: '/index.html', revision: '1' },
  { url: '/style.css', revision: '1' },
  { url: '/main.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/icons/icon-192x192.png', revision: '1' },
  { url: '/icons/icon-512x512.png', revision: '1' },
]);

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);

// Fallback for offline navigation
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((response) => response || fetch(event.request))
    );
  }
});