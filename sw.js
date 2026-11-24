const CACHE_NAME = 'greenguardian-synova-v5';
const CORE_ASSETS = [
  '/Green/',
  '/Green/index.html',
  '/Green/manifest.json',
  '/Green/icon-192.png',
  '/Green/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {
    title: '🌱 GreenGuardian Live Contribution',
    body: 'Someone just cared for a tree! Tap to view in Community Feed.'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/Green/icon-192.png',
      badge: '/Green/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'greenguardian-live',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return self.clients.openWindow('/Green/index.html?tab=community');
    })
  );
});
