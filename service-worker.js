// Import Workbox with error handling
try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');
} catch (error) {
  console.error('Failed to load Workbox:', error);
}

if (typeof workbox !== 'undefined' && workbox) {
  console.log('Workbox is loaded 🎉');
  
  // Set log level
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

  // Skip waiting and claim clients immediately
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

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
    ({ request }) => request.destination === 'style' || request.destination === 'script',
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

  // Cache HTML pages with NetworkFirst strategy
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Cache manifest.json
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith('/manifest.json'),
    new workbox.strategies.CacheFirst({
      cacheName: 'manifest-cache',
    })
  );

  // Clean up old caches on activate
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = [
      'static-assets', 
      'image-assets', 
      'html-cache', 
      'manifest-cache',
      'workbox-precache-v2-https://velocichicken.github.io/Sales-Tax-Calculator/'
    ];
    
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.some(whitelist => cacheName.includes(whitelist))) {
              console.log(`Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        )
      )
    );
  });

} else {
  console.log('Workbox failed to load 😬');
  
  // Fallback service worker without Workbox
  const CACHE_NAME = 'sales-tax-calculator-v1';
  const urlsToCache = [
    '/Sales-Tax-Calculator/',
    '/Sales-Tax-Calculator/index.html',
    '/Sales-Tax-Calculator/style.css',
    '/Sales-Tax-Calculator/main.js',
    '/Sales-Tax-Calculator/manifest.json',
    '/Sales-Tax-Calculator/icons/manifest-icon-192.maskable.png',
    '/Sales-Tax-Calculator/icons/manifest-icon-512.maskable.png'
  ];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  });
}
//claude thank you