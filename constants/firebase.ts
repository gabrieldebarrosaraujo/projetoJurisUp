// constants/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ❗ Cole aqui as configs do seu Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCD9h9SleibuApEjfyy4qXWQ1z5mVVaEE0",
  authDomain: "jurisup-32cb0.firebaseapp.com",
  projectId: "jurisup-32cb0",
  storageBucket: "jurisup-32cb0.firebasestorage.app",
  messagingSenderId: "249261696122",
  appId: "1:249261696122:web:62d73e055cab3906f547c3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
