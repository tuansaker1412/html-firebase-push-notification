// firebase-messaging-sw.js
// File này phải nằm ở ROOT của domain (ví dụ: http://localhost:3000/firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ⚠️ QUAN TRỌNG: Copy đúng config Firebase của bạn vào đây
// Service Worker chạy độc lập nên KHÔNG đọc được từ DOM/localStorage
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
  messagingSenderId: "YOUR_SENDER_ID",
});

const messaging = firebase.messaging();

// Handle background messages (khi tab không focus hoặc đóng)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const { title, body, icon } = payload.notification || {};
  const notifTitle = title || 'New Notification';
  const notifOptions = {
    body: body || '',
    icon: icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
    tag: 'fcm-notification', // Ghi đè notif cũ thay vì stack
    // actions: [
    //   { action: 'open', title: 'Mở ứng dụng' },
    //   { action: 'dismiss', title: 'Bỏ qua' }
    // ]
  };

  self.registration.showNotification(notifTitle, notifOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  if (event.action === 'dismiss') return;

  // Mở tab hoặc focus nếu đã mở
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
