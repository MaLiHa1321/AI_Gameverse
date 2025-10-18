// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUwMnAyw28cbc3vlfcYE9N7UKqHuK56OQ",
  authDomain: "ai-gameverse.firebaseapp.com",
  projectId: "ai-gameverse",
  storageBucket: "ai-gameverse.firebasestorage.app",
  messagingSenderId: "673369154065",
  appId: "1:673369154065:web:82c82191988a536ecf47b0",
  measurementId: "G-XWVB79PX39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);