importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded 🎉`);
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

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

  // Cache CSS and JS files with CacheFirst strategy
  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script'].includes(request.destination),
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache manifest.json efficiently
  workbox.routing.registerRoute(
    ({ url }) => url.pathname === '/Sales-Tax-Calculator/manifest.json',
    new workbox.strategies.CacheFirst({
      cacheName: 'manifest-cache',
    })
  );

  // Activate event: Cleanup old caches
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['static-assets', 'image-assets', 'html-assets', 'splash-images', 'manifest-cache', 'dynamic-cache'];
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log(`Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        )
      )
    );
  });

} else {
  console.log(`Workbox didn't load 😬`);
}