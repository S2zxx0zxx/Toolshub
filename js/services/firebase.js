import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

// Replace with actual config
const firebaseConfig = {
  apiKey: "AIzaSyD295HUs8qit9LopB0pVNlkPMo0QpQssGc",
  authDomain: "toolshub-87859.firebaseapp.com",
  projectId: "toolshub-87859",
  storageBucket: "toolshub-87859.firebasestorage.app",
  messagingSenderId: "77238460546",
  appId: "1:77238460546:web:a6a0c35d56d75342a1549b",
  measurementId: "G-7LG85XY2C5"
};

let app, auth, db, storage;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error (Running in Guest/Local Mode):", error);
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };

// Enable offline persistence
if (db) {
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
}
