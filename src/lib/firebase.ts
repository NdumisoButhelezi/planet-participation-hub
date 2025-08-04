
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaIzJhbY7B0hrKtnFISP4l6d7IFpjHYLQ",
  authDomain: "ndu-dontouch.firebaseapp.com",
  projectId: "ndu-dontouch",
  storageBucket: "ndu-dontouch.firebasestorage.app",
  messagingSenderId: "286837111746",
  appId: "1:286837111746:web:c32132b5996e680857745b",
  measurementId: "G-0L0C302WP8"
};

const app = initializeApp(firebaseConfig);

// Initialize analytics with error handling
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Analytics initialization failed:", error);
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });
