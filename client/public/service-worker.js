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
  console.log('[ServiceWorker] Push event received:', event);

  let data = {
    title: 'KampusKart',
    body: 'You have a new update',
  };

  if (event.data) {
    try {
      data = event.data.json();
      console.log('[ServiceWorker] Parsed push data:', data);
    } catch (e) {
      console.error('[ServiceWorker] Push data parse error:', e);
      // If not JSON, use raw text
      data.body = event.data.text();
    }
  } else {
    console.warn('[ServiceWorker] No data in push event');
  }

  console.log('[ServiceWorker] Showing notification:', data.title, data.body);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'kampuskart-notification',
      requireInteraction: false,
    }).then(() => {
      console.log('[ServiceWorker] Notification displayed successfully');
    }).catch((error) => {
      console.error('[ServiceWorker] Failed to show notification:', error);
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.notification.tag);
  event.notification.close();
  
  // Deep link to orders page or relevant page
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window to home page
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});