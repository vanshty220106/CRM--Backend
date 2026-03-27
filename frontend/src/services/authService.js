import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const provider = new GoogleAuthProvider();

export const signup = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Run Firestore sync strictly in background to prevent silent hangs
  const userDocRef = doc(db, "users", user.uid);
  setDoc(userDocRef, {
    uid: user.uid,
    name: name,
    email: email,
    role: "citizen",
    createdAt: new Date().toISOString()
  }).catch(error => console.warn("Background Firestore sync skipped:", error));
  
  return { ...user, displayName: name };
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async () => {
  return signOut(auth);
};

export const googleSignIn = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Background check unconfigured DB
  const userDocRef = doc(db, "users", user.uid);
  getDoc(userDocRef).then(async (userDoc) => {
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email,
        role: "citizen",
        createdAt: new Date().toISOString()
      });
    }
  }).catch(error => console.warn("Background Firestore sync skipped:", error));

  return user;
};

export const getUserData = async (uid) => {
  // Use Promise.race to forcefully terminate Firebase's infinite retry loops!
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await Promise.race([
      getDoc(userDocRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout Firebase Polling')), 3000))
    ]);
    
    if (userDoc && userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.warn("Firestore background hook correctly aborted due to:", error.message);
    return null;
  }
};
