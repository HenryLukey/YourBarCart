import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqBwwGmGJZVlxsIjTZJY3shJylwMNk3cA",
  authDomain: "yourbarcart-3b871.firebaseapp.com",
  projectId: "yourbarcart-3b871",
  storageBucket: "yourbarcart-3b871.appspot.com",
  messagingSenderId: "299657064585",
  appId: "1:299657064585:web:13424436f20fdd81031658",
  measurementId: "G-X3K15MYN50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider(auth);
const facebookProvider = new FacebookAuthProvider(auth);

export const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
}

export const signInWithFacebook = async () => {
  await signInWithPopup(auth, facebookProvider);
}