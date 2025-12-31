// Service Worker untuk Android Push Notifications
console.log('Service Worker: Registering...');

self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating...');
  event.waitUntil(clients.claim());
});

// Handle messages dari main app
self.addEventListener('message', function(event) {
  console.log('Service Worker: Message received -', event.data);
  
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    
    self.registration.showNotification(title, {
      ...options,
      badge: '/badge-72.png',
      icon: '/icon-192.png'
    }).then(() => {
      console.log('✅ Service Worker: Notification shown -', title);
    }).catch(err => {
      console.error('Service Worker: Notification error -', err);
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Service Worker: Notification clicked -', event.action);
  event.notification.close();
  
  // Focus window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('Service Worker: Notification closed');
});

// Handle push events (untuk future use)
self.addEventListener('push', function(event) {
  console.log('Service Worker: Push received');
  
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, data.options)
    );
  }
});
