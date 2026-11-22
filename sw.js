// GreenGuardian Service Worker (sw.js) — SYNOVA
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {
    title: 'Tree SOS: Low Soil Moisture 18%',
    body: 'Neem Sapling needs water! Tap to help (+100 pts).'
  };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'greenguardian-sos',
      data: { url: './index.html' },
      actions: [
        { action: 'help', title: 'I WILL HELP' },
        { action: 'open', title: 'Open Map' }
      ]
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tree-sos') {
    event.waitUntil(
      self.registration.showNotification('GreenGuardian Sync Complete', {
        body: 'Your verified tree care proof and Green Points are synced.'
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
