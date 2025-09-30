// src/services/authService.js - Enhanced with Email Verification
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

// Sign up with email and password + email verification
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    console.log('🔍 AUTH: Creating user account...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ AUTH: User account created:', user.uid);
    
    // Update user profile with display name
    await updateProfile(user, { displayName });
    console.log('✅ AUTH: Display name updated');
    
    // Send email verification
    console.log('📧 AUTH: Sending email verification...');
    await sendEmailVerification(user);
    console.log('✅ AUTH: Email verification sent to:', user.email);
    
    // Create user document in Firestore (but mark as unverified)
    await createUserDocument(user, { displayName, emailVerified: false });
    
    // Sign out user immediately - they must verify email first
    await signOut(auth);
    console.log('🔐 AUTH: User signed out - must verify email first');
    
    return { 
      user, 
      error: null, 
      message: `Account created! Please check your email (${email}) and click the verification link before logging in.`
    };
  } catch (error) {
    console.error('❌ AUTH: Signup error:', error);
    return { user: null, error: error.message };
  }
};

// Sign in with email verification check
export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔍 AUTH: Attempting login...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ AUTH: Login successful for:', user.email);
    console.log('📧 AUTH: Email verified?', user.emailVerified);
    
    // Check if email is verified
    if (!user.emailVerified) {
      console.log('⚠️ AUTH: Email not verified, signing out...');
      await signOut(auth);
      return { 
        user: null, 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        needsVerification: true,
        email: user.email
      };
    }
    
    // Update user document to mark email as verified
    await updateUserDocument(user.uid, { emailVerified: true });
    
    return { user, error: null };
  } catch (error) {
    console.error('❌ AUTH: Login error:', error);
    let errorMessage = 'Login failed';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { user: null, error: errorMessage };
  }
};

// Resend email verification
export const resendEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      return { error: null, message: 'Verification email sent! Please check your inbox.' };
    } else {
      return { error: 'No user found or email already verified' };
    }
  } catch (error) {
    console.error('❌ AUTH: Resend verification error:', error);
    return { error: error.message };
  }
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    console.log('📧 AUTH: Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('✅ AUTH: Password reset email sent');
    return { 
      error: null, 
      message: `Password reset link sent to ${email}. Please check your inbox and follow the instructions.`
    };
  } catch (error) {
    console.error('❌ AUTH: Password reset error:', error);
    let errorMessage = 'Failed to send password reset email';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { error: errorMessage };
  }
};

// Check email verification status
export const checkEmailVerification = async () => {
  const user = auth.currentUser;
  if (user) {
    await reload(user); // Refresh user data
    return user.emailVerified;
  }
  return false;
};

// Sign in with Google (no email verification needed)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user document if it doesn't exist
    await createUserDocument(user, { emailVerified: true }); // Google emails are automatically verified
    
    return { user, error: null };
  } catch (error) {
    console.error('❌ AUTH: Google signin error:', error);
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);
  
  if (!userSnapshot.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName: displayName || additionalData.displayName || '',
        email,
        createdAt,
        emailVerified: additionalData.emailVerified || false,
        culturalPreferences: {
          favoriteTribes: [],
          interests: [],
          experienceLevel: 'beginner'
        },
        chatHistory: [],
        ...additionalData
      });
      console.log('✅ AUTH: User document created');
    } catch (error) {
      console.error('❌ AUTH: Error creating user document:', error);
    }
  }
  
  return userRef;
};

// Update user document
const updateUserDocument = async (uid, updateData) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...updateData,
      updatedAt: new Date()
    }, { merge: true });
    console.log('✅ AUTH: User document updated');
  } catch (error) {
    console.error('❌ AUTH: Error updating user document:', error);
  }
};

// Get user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error('❌ AUTH: Error getting user document:', error);
    return null;
  }
};

// Update user cultural preferences
export const updateUserPreferences = async (uid, preferences) => {
  if (!uid) return;
  
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      culturalPreferences: preferences,
      updatedAt: new Date()
    }, { merge: true });
    
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};