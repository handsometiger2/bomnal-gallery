import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "impactful-actor-sxjsq",
  appId: "1:563951875916:web:913ed156ef53140f9b41e9",
  apiKey: "AIzaSyCULsrHk9exNNafb0kNVCx8JlONxynLnAc",
  authDomain: "impactful-actor-sxjsq.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-fdadfe58-dec4-4720-a392-c5a3272eef67",
  storageBucket: "impactful-actor-sxjsq.firebasestorage.app",
  messagingSenderId: "563951875916",
  measurementId: "",
  oAuthClientId: "563951875916-nm0vn89uss9cdtc502687v4lmagb4lme.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
