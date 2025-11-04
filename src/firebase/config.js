// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBJng40_-rjZNNzXqtk-yxxJ8VD4FFi8fM",
  authDomain: "culturelink-kenya.firebaseapp.com",
  projectId: "culturelink-kenya",
  storageBucket: "culturelink-kenya.firebasestorage.app",
  messagingSenderId: "965488232107",
  appId: "1:965488232107:web:718fb0d0e962527c6f59ee",
  measurementId: "G-Q21477381T"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
