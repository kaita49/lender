import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4fHQHd4QfJJ7O8pFAIFQ-llNB6MemAOE",
  authDomain: "lender-d2825.firebaseapp.com",
  projectId: "lender-d2825",
  storageBucket: "lender-d2825.appspot.com",
  messagingSenderId: "401852318724",
  appId: "1:401852318724:web:70e62d25e8315e1217a151",
  measurementId: "G-04KVJ6G636"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, storage };
