// Kontakteen Ferdaan - Service Worker v2
const VAPID_PUBLIC = 'BGyCiUWZtqK-yfW42zOMaqvyl2zFIiOCcZ2LS8i5vLEdEOBEn6iTEUNeuCS457xg1bIaTrsXmU4KFv5xliKUl2g';

self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });

// Push notification received
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: 'Kontakteen', body: e.data ? e.data.text() : 'Nová zpráva!' }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'Kontakteen Ferdaan', {
      body: data.body || 'Nová zpráva!',
      icon: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f46a.png',
      badge: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f46a.png',
      vibrate: [200, 100, 200],
      tag: 'kontakteen-msg',
      renotify: true,
      data: { url: self.location.origin + '/kontakteen/' }
    })
  );
});

// Notification click
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs) {
      for (var c of cs) { if (c.url.includes('/kontakteen/') && 'focus' in c) return c.focus(); }
      return clients.openWindow('/kontakteen/');
    })
  );
});
