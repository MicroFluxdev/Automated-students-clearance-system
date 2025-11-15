// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAx4STNfzBwgvMjM6XbK-6x65Qa9BTpWjk",
  authDomain: "ascs-dd799.firebaseapp.com",
  databaseURL: "https://ascs-dd799-default-rtdb.firebaseio.com",
  projectId: "ascs-dd799",
  storageBucket: "ascs-dd799.appspot.com", // ✅ FIXED
  messagingSenderId: "981562936510",
  appId: "1:981562936510:web:398a8d5d11dfc95a27e2ef",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage (if needed)
export const storage = getStorage(app);

// Messaging (if you will use FCM web push)
export const messaging = getMessaging(app);
