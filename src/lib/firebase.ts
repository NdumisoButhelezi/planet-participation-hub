
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
