import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://dta-cache-default-rtdb.firebaseio.com",
  projectId: "dta-cache",
  storageBucket: "dta-cache.appspot.com",
  messagingSenderId: "792610761869",
  appId: "1:792610761869:web:ca71900e81ba2a40c2c6c4",
  measurementId: "G-9M16NRF0PC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireStore = getFirestore(app);
const realtimeDB = getDatabase(app);
export { fireStore, auth, realtimeDB };

