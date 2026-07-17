import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

// Replace with actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence.");
    }
  });
} catch (e) {
  console.warn("Could not enable persistence", e);
}
