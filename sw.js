// Kontakteen Ferdaan - Service Worker
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : {};
  var title = data.title || 'Kontakteen Ferdaan';
  var options = {
    body: data.body || 'Nová zpráva!',
    icon: '/kontakteen/icon.png',
    badge: '/kontakteen/icon.png',
    vibrate: [200, 100, 200],
    data: { url: '/kontakteen/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || '/kontakteen/'));
});
