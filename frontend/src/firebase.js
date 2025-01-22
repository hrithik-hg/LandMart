// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "landmart-1fa0f.firebaseapp.com",
  projectId: "landmart-1fa0f",
  storageBucket: "landmart-1fa0f.firebasestorage.app",
  messagingSenderId: "1071755484383",
  appId: "1:1071755484383:web:eda3dd848dc8168eb21d6a",
  measurementId: "G-5X5CSNEZNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);