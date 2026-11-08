importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

const config = JSON.parse(new URL(self.location.href).searchParams.get('config') || '{}');
if (config.projectId) {
  self.firebase.initializeApp(config);
  self.firebase.messaging();
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.FCM_MSG?.fcmOptions?.link || '/';
  event.waitUntil(self.clients.openWindow(link));
});
