import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { doc, setDoc, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { auth as firebaseAuth, db } from './firebase.js';

export const Auth = (() => {

  async function signup(email, password, displayName) {
    if (!firebaseAuth) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName });

      if (db) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
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
    if (!firebaseAuth) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    if (!firebaseAuth) return;
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    if (!firebaseAuth) throw new Error("Firebase Auth is disabled or misconfigured.");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      const user = userCredential.user;
      
      // Upsert user profile
      if (db) {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
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
    if (!firebaseAuth) {
      callback(null);
      return () => {};
    }
    return firebaseOnAuthStateChanged(firebaseAuth, callback);
  }

  async function getUserProfile(uid) {
    if (!db) return null;
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
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
