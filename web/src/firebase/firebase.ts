import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBh0uqJCkmOvEOC-29csFUjqeaxK3RPzvg",
    authDomain: "sehrify-ai.firebaseapp.com",
    projectId: "sehrify-ai",
    storageBucket: "sehrify-ai.firebasestorage.app",
    messagingSenderId: "100510908005",
    appId: "1:100510908005:web:2b3c252546eda6df65508c",
    measurementId: "G-YPZMZRKNZR"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };