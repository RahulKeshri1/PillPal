import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Create simple Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log configuration status (without exposing values)
console.log('Firebase configuration check:');
console.log('API Key exists:', !!firebaseConfig.apiKey);
console.log('Project ID exists:', !!firebaseConfig.projectId);
console.log('App ID exists:', !!firebaseConfig.appId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export the initialized services
export { auth, googleProvider, db };
export default app;
