import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Hardcoded Firebase configuration from your .env values
const firebaseConfig = {
  apiKey: "AIzaSyAF7WY8XmXW4PNg9SEiL_4-hqfDnw79Zj8",
  authDomain: "pillpal-a9052.firebaseapp.com",
  projectId: "pillpal-a9052",
  storageBucket: "pillpal-a9052.firebasestorage.app",
  messagingSenderId: "846484782018",
  appId: "1:846484782018:web:7f611093737fa6604eb45b",
  measurementId: "G-PT7BNP1VBS",
  databaseURL: "https://pillpal-a9052-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export Firebase services
export { auth, googleProvider, db };
export default app;
