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
      // Use popup since redirect can be blocked by modern browser third-party storage partitioning on localhost/github pages
      const result = await fbAuthModule.signInWithPopup(firebaseAuth, provider);
      if (result?.user) {
        await upsertUserProfile(result.user);
        return result.user;
      }
    } catch (error) {
      console.error("Google Sign In error:", error);
      throw error;
    }
  }

  // No longer needed for popup, but keeping it safe if anything falls back
  async function handleRedirectResult() {
    if (!firebaseAuth || !fbAuthModule) return null;
    try {
      if (fbAuthModule.getRedirectResult) {
        const result = await fbAuthModule.getRedirectResult(firebaseAuth);
        if (result?.user) {
          await upsertUserProfile(result.user);
          return result.user;
        }
      }
    } catch (error) {
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

  async function reauthenticate(password) {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    const user = firebaseAuth.currentUser;
    if (!user || !user.email) throw new Error("No signed-in user to re-authenticate.");
    const credential = fbAuthModule.EmailAuthProvider.credential(user.email, password);
    await fbAuthModule.reauthenticateWithCredential(user, credential);
  }

  async function reauthenticateWithGooglePopup() {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No signed-in user to re-authenticate.");
    const provider = new fbAuthModule.GoogleAuthProvider();
    await fbAuthModule.reauthenticateWithPopup(user, provider);
  }

  async function deleteAccount() {
    if (!firebaseAuth || !fbAuthModule) throw new Error("Firebase Auth is disabled or misconfigured.");
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error("No signed-in user.");
    await fbAuthModule.deleteUser(user);
  }

  return {
    signup,
    login,
    logout,
    signInWithGoogle,
    handleRedirectResult,
    getCurrentUser,
    onAuthStateChanged,
    getUserProfile,
    reauthenticate,
    reauthenticateWithGooglePopup,
    deleteAccount
  };
})();
