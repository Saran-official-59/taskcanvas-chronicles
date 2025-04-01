
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-mode",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
console.log("Firebase config:", { 
  apiKey: firebaseConfig.apiKey ? "present" : "missing",
  authDomain: firebaseConfig.authDomain ? "present" : "missing",
  projectId: firebaseConfig.projectId ? "present" : "missing",
  appId: firebaseConfig.appId ? "present" : "missing"
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
