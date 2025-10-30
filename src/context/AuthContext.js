// src/context/AuthContext.js - UPDATED for Cold Start Integration
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserDocument } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (user) => {
        setCurrentUser(user);
        
        if (user) {
          try {
            // Get user profile data from Firestore
            const profileData = await getUserDocument(user.uid);
            setUserProfile(profileData);
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setError(err.message);
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      },
      (err) => {
        // Handle auth state change errors
        console.error('Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    user: currentUser,        // ✅ Export as 'user' (Cold Start Modal needs this)
    currentUser,              // ✅ Keep for backward compatibility
    userProfile,
    loading,
    error                     // ✅ Added error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};