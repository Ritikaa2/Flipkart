import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyAiRRuc2E9NPswrsmuixj8H36Wc13Necgk',
  authDomain: 'flipkart-feb94.firebaseapp.com',
  projectId: 'flipkart-feb94',
  storageBucket: 'flipkart-feb94.firebasestorage.app',
  messagingSenderId: '726138488780',
  appId: '1:726138488780:web:b260549053bed52e283f69',
  measurementId: 'G-MG4E1E79GW'
};

const app = initializeApp(firebaseConfig);

let messagingPromise;

export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null;

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => (supported ? getMessaging(app) : null))
      .catch(() => null);
  }

  return messagingPromise;
};

export const requestFirebaseNotificationToken = async () => {
  try {
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window)
    ) {
      return null;
    }

    const existingToken = localStorage.getItem('firebaseDeviceToken');
    if (existingToken) return existingToken;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('Missing VITE_FIREBASE_VAPID_KEY. Firebase browser push token was not created.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    });

    if (token) {
      localStorage.setItem('firebaseDeviceToken', token);
    }

    return token || null;
  } catch (err) {
    console.warn('Firebase browser push token was skipped:', err.message || err);
    return null;
  }
};

export const listenForFirebaseOrderMessages = async (callback) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  return onMessage(messaging, callback);
};

export default app;
