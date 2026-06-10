const VAPID_PUBLIC_KEY = 'U7oLhpRjVvVuiy8KguCsUDt_1rc_juJYcMSlsu9kmxA';

// Kontakteen Ferdaan — Service Worker v3
// Handles: FCM push, notificationclick, install/activate

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBnOTGHXeSWZvSe_VR1dcX7o82AKQ19iNU",
  authDomain: "kontakteen-6d10a.firebaseapp.com",
  databaseURL: "https://kontakteen-6d10a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kontakteen-6d10a",
  storageBucket: "kontakteen-6d10a.firebasestorage.app",
  messagingSenderId: "767140318545",
  appId: "1:767140318545:web:85dad2fc8614e257975770"
});

const messaging = firebase.messaging();

// Background push → show notification
messaging.onBackgroundMessage(function(payload) {
  var data = payload.data || {};
  return self.registration.showNotification(
    data.title || 'Kontakteen Ferdaan',
    {
      body:      data.body  || 'Nová zpráva!',
      icon:      '/kontakteen/icon-192.png',
      badge:     '/kontakteen/icon-192.png',
      vibrate:   [200, 100, 200],
      tag:       'kontakteen-msg',
      renotify:  true,
      data:      { msgId: data.msgId || '', url: '/kontakteen/' }
    }
  );
});

// Notification click → focus or open app, scroll to message
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var target = e.notification.data && e.notification.data.url
    ? e.notification.data.url
    : '/kontakteen/';
  var msgId = e.notification.data && e.notification.data.msgId;
  if (msgId) target += '#msg-' + msgId;

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs) {
      for (var c of cs) {
        if (c.url.includes('/kontakteen/') && 'focus' in c) {
          c.postMessage({ type: 'SCROLL_TO_MSG', msgId: msgId });
          return c.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener('install',  function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
