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

  // Shared helper: upsert a user's Firestore profile document after any sign-in method
  async function upsertUserProfile(user) {
    if (!db || !fbFirestoreModule) return;
    const userRef = fbFirestoreModule.doc(db, 'users', user.uid);
    const snap = await fbFirestoreModule.getDoc(userRef);
    if (!snap.exists()) {
      await fbFirestoreModule.setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || null,
        createdAt: fbFirestoreModule.serverTimestamp(),
        updatedAt: fbFirestoreModule.serverTimestamp(),
        role: "user",
        plan: "free",
        credits: 0
      });
    }
  }

  async function signInWithGoogle() {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const provider = new fbAuthModule.GoogleAuthProvider();
      // Use redirect (not popup) — popup is unreliable on mobile Chrome and gets blocked.
      // The page will navigate away to Google and back; onAuthStateChanged handles the result.
      await fbAuthModule.signInWithRedirect(firebaseAuth, provider);
      // Note: execution does NOT continue here — the page navigates away.
    } catch (error) {
      console.error("Google Sign In error:", error);
      throw error;
    }
  }

  // Call this once on app init to collect the result of a completed redirect sign-in.
  async function handleRedirectResult() {
    if (!firebaseAuth || !fbAuthModule) return null;
    try {
      const result = await fbAuthModule.getRedirectResult(firebaseAuth);
      if (result?.user) {
        await upsertUserProfile(result.user);
        return result.user;
      }
    } catch (error) {
      // Silently ignore — common on first load when no redirect happened
      console.warn("getRedirectResult:", error.code || error.message);
    }
    return null;
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
    handleRedirectResult,
    getCurrentUser,
    onAuthStateChanged,
    getUserProfile
  };
})();
