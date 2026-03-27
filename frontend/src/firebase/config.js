import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Analytics is optional
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDa5ECYhD1iJk1Tk35cSJjvejz0yCZqbI",
  authDomain: "civicflow-9aaf4.firebaseapp.com",
  projectId: "civicflow-9aaf4",
  storageBucket: "civicflow-9aaf4.firebasestorage.app",
  messagingSenderId: "870691282618",
  appId: "1:870691282618:web:2771518c4df263a8a16c83",
  measurementId: "G-WL3K70BS6B"
};

const app = initializeApp(firebaseConfig);

// Core services (IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional
export const analytics = getAnalytics(app);