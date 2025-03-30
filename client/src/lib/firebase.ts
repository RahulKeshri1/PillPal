import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Extract environment variables
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

// Debug: Log environment variables (without exposing full values)
console.log('Firebase config check:');
console.log('API Key exists:', !!API_KEY, 'Length:', API_KEY?.length);
console.log('Project ID exists:', !!PROJECT_ID);
console.log('App ID exists:', !!APP_ID);

// Create Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: "",
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence (for offline capabilities)
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.error('The current browser does not support all of the features required to enable persistence');
    }
  });

export default app;
