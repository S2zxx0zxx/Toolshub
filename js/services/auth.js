import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { doc, setDoc, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { auth as firebaseAuth, db } from './firebase.js';

export const Auth = (() => {

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create user document in Firestore
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

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  function getCurrentUser() {
    return firebaseAuth.currentUser;
  }

  function onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(firebaseAuth, callback);
  }

  async function getUserProfile(uid) {
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
    getCurrentUser,
    onAuthStateChanged,
    getUserProfile
  };
})();
