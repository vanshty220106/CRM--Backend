import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { login as authLogin, signup as authSignup, logout as authLogout, googleSignIn as authGoogleSignIn, getUserData } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setLoading(false);
        return;
      }

      // --- Admin Local System Fallback Sync (No longer overwriting active Tab Rules) ---
      if (!localStorage.getItem('role')) {
        localStorage.setItem('role', 'citizen');
      }

      // --- 1. FIREBASE TO BACKEND JWT SYNC ---
      try {
        const tokenRes = await fetch('/api/auth/firebase-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Citizen',
            role: 'citizen'
          })
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData?.data?.token) {
            localStorage.setItem('token', tokenData.data.token);
          }
        }
      } catch (syncErr) {
        console.warn("Backend sync failed:", syncErr);
      }
      
      // --- 2. OPTIMISTIC RENDER (Block unmounts before Firestore hang) ---
      setUser(firebaseUser);
      setLoading(false);

      // --- 3. BACKGROUND PROFILE HYDRATION ---
      getUserData(firebaseUser.uid).then(userData => {
        if (userData) {
          setUser(prev => ({ ...prev, ...userData }));
        }
      }).catch(err => console.warn("Background Firestore poll skipped:", err));
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      return await authLogin(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      return await authSignup(name, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      return await authLogout();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      return await authGoogleSignIn();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    googleSignIn
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
