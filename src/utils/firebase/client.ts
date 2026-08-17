import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "seismic-dolphin-nmln4",
  appId: "1:49198710917:web:1249646896230d92c269ec",
  apiKey: "AIzaSyC67qzIhEL5ncwDAWEjlphcB2KRlzNaIRw",
  authDomain: "seismic-dolphin-nmln4.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-arrowpuzzle-dc656439-8f04-4505-9461-43b29f3b7a77",
  storageBucket: "seismic-dolphin-nmln4.firebasestorage.app",
  messagingSenderId: "49198710917",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export default app;

