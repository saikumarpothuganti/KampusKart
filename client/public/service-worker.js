// Minimal Service Worker for PWA + Notifications (no caching)

self.addEventListener('install', () => {
  console.log('[ServiceWorker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(self.clients.claim());
});

// REQUIRED: Push notification handler
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');

  let data = {
    title: 'KampusKart',
    body: 'You have a new update',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('[ServiceWorker] Push data error', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    })
  );
});