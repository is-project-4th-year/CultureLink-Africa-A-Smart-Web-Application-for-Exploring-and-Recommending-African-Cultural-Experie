// src/services/authService.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const googleProvider = new GoogleAuthProvider();

// Error message handler - converts Firebase errors to user-friendly messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/requires-recent-login': 'Please log in again to complete this action.',
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Send welcome email via Firestore trigger (we'll set this up)
const sendWelcomeEmail = async (user) => {
  try {
    // Create a document in a 'mail' collection that triggers a Cloud Function
    const mailRef = doc(db, 'mail', `welcome_${user.uid}_${Date.now()}`);
    await setDoc(mailRef, {
      to: user.email,
      template: {
        name: 'welcome',
        data: {
          displayName: user.displayName || 'Explorer',
          email: user.email
        }
      }
    });
    console.log('Welcome email queued for:', user.email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error - welcome email failure shouldn't block signup
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await createUserDocument(user, { displayName });
    
    // Send welcome email
    await sendWelcomeEmail(user);
    
    return { 
      user, 
      error: null,
      message: 'Account created successfully! Please check your email to verify your account.'
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      user: null, 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      return {
        user: null,
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true
      };
    }
    
    return { 
      user, 
      error: null,
      message: 'Login successful! Welcome back.'
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      user: null, 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if this is a new user
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const isNewUser = !userDoc.exists();
    
    // Create user document if new user
    if (isNewUser) {
      await createUserDocument(user);
      await sendWelcomeEmail(user);
    }
    
    return { 
      user, 
      error: null,
      isNewUser,
      message: isNewUser ? 'Welcome to CultureLink Kenya!' : 'Welcome back!'
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { 
      user: null, 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { 
      error: null,
      message: 'Logged out successfully.'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Reset password
export const ResetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      error: null,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'No user is currently logged in.' };
    }
    
    if (user.emailVerified) {
      return { error: 'Email is already verified.' };
    }
    
    await sendEmailVerification(user);
    return { 
      error: null,
      message: 'Verification email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);
  
  if (!userSnapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        displayName: displayName || additionalData.displayName || '',
        email,
        photoURL: photoURL || '',
        createdAt,
        culturalPreferences: {
          favoriteTribes: [],
          interests: [],
          experienceLevel: 'beginner'
        },
        chatHistory: [],
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }
  
  return userRef;
};

// Get user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return { id: userSnapshot.id, ...userSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

// Update user cultural preferences
export const updateUserPreferences = async (uid, preferences) => {
  if (!uid) return { error: 'User ID is required' };
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      culturalPreferences: preferences,
      updatedAt: new Date()
    });
    return { 
      error: null,
      message: 'Preferences updated successfully!'
    };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { 
      error: getErrorMessage(error.code),
      code: error.code
    };
  }
};

  
// Update user bookmarks
export const updateUserBookmarks = async (uid, bookmarks) => {
  if (!uid) return { error: 'User ID is required' };
  
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      bookmarks: bookmarks,
      updatedAt: new Date()
    });
    return { 
      error: null,
      message: 'Bookmarks updated successfully!'
    };
  } catch (error) {
    console.error('Error updating bookmarks:', error);
    return { 
      error: 'Failed to update bookmarks',
      code: error.code
    };
  }
};



// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  if (!file) return { error: 'No file provided' };
  
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profile-pictures/${userId}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const photoURL = await getDownloadURL(storageRef);
    
    // Update user profile
    await updateProfile(auth.currentUser, { photoURL });
    
    // Update Firestore user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      photoURL,
      updatedAt: new Date()
    });
    
    return { 
      photoURL,
      error: null,
      message: 'Profile picture updated successfully!'
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { 
      error: 'Failed to upload profile picture',
      code: error.code
    };
  }
};