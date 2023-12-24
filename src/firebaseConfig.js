// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8XW6bPdqL3YtCWlJJzjj2Ca9VR1Kv1aE",
  authDomain: "acheinu-1c232.firebaseapp.com",
  projectId: "acheinu-1c232",
  storageBucket: "acheinu-1c232.appspot.com",
  messagingSenderId: "241587821835",
  appId: "1:241587821835:web:b88c90f9afb1f641f5160e",
  measurementId: "G-9LSCJLMSKM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app);
export const userAuth = getAuth(app);
export const userAuthWithGoogle = new GoogleAuthProvider();
export const storage = getStorage(app);
