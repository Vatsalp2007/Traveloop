import {
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  doc,
  collection,
} from "firebase/firestore";
import { db } from "./config";

export async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

export async function setDocument(collectionName, id, data) {
  try {
    await setDoc(doc(db, collectionName, id), data);
  } catch (error) {
    throw error;
  }
}

export async function updateDocument(collectionName, id, data) {
  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    throw error;
  }
}

export async function deleteDocument(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    throw error;
  }
}

export async function getDocument(collectionName, id) {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export async function getCollection(collectionName, constraints = []) {
  try {
    const q = constraints.length > 0
      ? query(collection(db, collectionName), ...constraints)
      : collection(db, collectionName);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
}

export function subscribeToCollection(collectionName, constraints, callback, onError) {
  try {
    const q = constraints.length > 0
      ? query(collection(db, collectionName), ...constraints)
      : collection(db, collectionName);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      },
      (error) => {
        console.error("Snapshot error:", error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("Subscribe error:", error);
    if (onError) onError(error);
    return () => {};
  }
}

export function subscribeToDocument(collectionName, id, callback) {
  try {
    const unsubscribe = onSnapshot(
      doc(db, collectionName, id),
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Snapshot error:", error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error("Subscribe error:", error);
    return () => {};
  }
}
