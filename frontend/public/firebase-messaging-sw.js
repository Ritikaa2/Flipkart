/* global importScripts, firebase */

importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAiRRuc2E9NPswrsmuixj8H36Wc13Necgk',
  authDomain: 'flipkart-feb94.firebaseapp.com',
  projectId: 'flipkart-feb94',
  storageBucket: 'flipkart-feb94.firebasestorage.app',
  messagingSenderId: '726138488780',
  appId: '1:726138488780:web:b260549053bed52e283f69',
  measurementId: 'G-MG4E1E79GW'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Flipkart order update';
  const options = {
    body: payload.notification?.body || 'Your order status has been updated.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});
