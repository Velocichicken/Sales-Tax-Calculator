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