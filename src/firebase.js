import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAefxfHT5Xt1D2q9W07J6koP5wcOASCeRk",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "912771321184",
  appId: "1:912771321184:web:0db4a5f2e3766a68f16205",
  measurementId: "G-PKV8CCMFEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Connect to emulators in development (temporarily commented out to connect to real Firebase)
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, 'http://localhost:9098');
//   connectFirestoreEmulator(db, 'localhost', 8081);
//   connectFunctionsEmulator(functions, 'localhost', 5002);
//   connectStorageEmulator(storage, 'localhost', 9200);
// }

export { app, auth, db, functions, storage };