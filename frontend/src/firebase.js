// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-test-46166.firebaseapp.com",
  projectId: "mern-test-46166",
  storageBucket: "mern-test-46166.appspot.com",
  messagingSenderId: "305074819889",
  appId: "1:305074819889:web:babfc6e0943bf954ad1610"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);