let app = null;
let auth = null;
let db = null;
let storage = null;
let isInitialized = false;

const firebaseConfig = {
  apiKey: "AIzaSyD295HUs8qit9LopB0pVNlkPMo0QpQssGc",
  authDomain: "toolshub-87859.firebaseapp.com",
  projectId: "toolshub-87859",
  storageBucket: "toolshub-87859.firebasestorage.app",
  messagingSenderId: "77238460546",
  appId: "1:77238460546:web:a6a0c35d56d75342a1549b",
  measurementId: "G-7LG85XY2C5"
};

let fbAppModule = null;
let fbAuthModule = null;
let fbFirestoreModule = null;
let fbStorageModule = null;

async function initFirebase() {
  if (isInitialized) return true;
  try {
    const [appMod, authMod, firestoreMod, storageMod] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js')
    ]);
    
    fbAppModule = appMod;
    fbAuthModule = authMod;
    fbFirestoreModule = firestoreMod;
    fbStorageModule = storageMod;

    app = appMod.getApps().length === 0 ? appMod.initializeApp(firebaseConfig) : appMod.getApp();
    auth = authMod.getAuth(app);
    try {
      db = firestoreMod.initializeFirestore(app, {
        localCache: firestoreMod.persistentLocalCache()
      });
    } catch (e) {
      // Fallback if already initialized
      db = firestoreMod.getFirestore(app);
    }
    storage = storageMod.getStorage(app);

    isInitialized = true;
    return true;
  } catch (error) {
    console.error("Firebase initialization failed (Running in Guest/Local Mode):", error);
    return false;
  }
}

export { 
  initFirebase, 
  app, auth, db, storage, 
  fbAppModule, fbAuthModule, fbFirestoreModule, fbStorageModule,
  isInitialized
};
