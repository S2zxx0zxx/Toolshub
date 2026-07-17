import { auth as firebaseAuth, db, fbAuthModule, fbFirestoreModule } from './firebase.js';

export const Auth = (() => {

  async function signup(email, password, displayName) {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const userCredential = await fbAuthModule.createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      
      await fbAuthModule.updateProfile(user, { displayName });

      if (db && fbFirestoreModule) {
        await fbFirestoreModule.setDoc(fbFirestoreModule.doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: user.photoURL || null,
          createdAt: fbFirestoreModule.serverTimestamp(),
          updatedAt: fbFirestoreModule.serverTimestamp(),
          role: "user",
          plan: "free",
          credits: 0
        });
      }

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const userCredential = await fbAuthModule.signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    if (!firebaseAuth || !fbAuthModule) return;
    try {
      await fbAuthModule.signOut(firebaseAuth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const provider = new fbAuthModule.GoogleAuthProvider();
      const userCredential = await fbAuthModule.signInWithPopup(firebaseAuth, provider);
      const user = userCredential.user;
      
      // Upsert user profile
      if (db && fbFirestoreModule) {
        const userRef = fbFirestoreModule.doc(db, 'users', user.uid);
        const snap = await fbFirestoreModule.getDoc(userRef);
        if (!snap.exists()) {
          await fbFirestoreModule.setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || null,
            createdAt: fbFirestoreModule.serverTimestamp(),
            updatedAt: fbFirestoreModule.serverTimestamp(),
            role: "user",
            plan: "free",
            credits: 0
          });
        }
      }
      return user;
    } catch (error) {
      console.error("Google Sign In error:", error);
      throw error;
    }
  }

  function getCurrentUser() {
    return firebaseAuth ? firebaseAuth.currentUser : null;
  }

  function onAuthStateChanged(callback) {
    if (!firebaseAuth || !fbAuthModule) {
      callback(null);
      return () => {};
    }
    return fbAuthModule.onAuthStateChanged(firebaseAuth, callback);
  }

  async function getUserProfile(uid) {
    if (!db || !fbFirestoreModule) return null;
    try {
      const docSnap = await fbFirestoreModule.getDoc(fbFirestoreModule.doc(db, 'users', uid));
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  }

  return {
    signup,
    login,
    logout,
    signInWithGoogle,
    getCurrentUser,
    onAuthStateChanged,
    getUserProfile
  };
})();
