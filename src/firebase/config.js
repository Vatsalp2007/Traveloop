import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1eYRCRl-f-jWhSvgU8B1Dnekm_PMHJnU",
  authDomain: "traveloop-9c51e.firebaseapp.com",
  projectId: "traveloop-9c51e",
  storageBucket: "traveloop-9c51e.firebasestorage.app",
  messagingSenderId: "835178250205",
  appId: "1:835178250205:web:004f267020c9d51e4cc034"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence only works in one tab');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support persistence');
  }
});

export default app;
