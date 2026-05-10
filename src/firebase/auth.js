import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function signupWithEmail(email, password, displayName, extraData = {}) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || "",
      photoURL: extraData.photoURL || "",
      phone: extraData.phone || "",
      city: extraData.city || "",
      country: extraData.country || "",
      additionalInfo: extraData.additionalInfo || "",
      createdAt: serverTimestamp(),
    });
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    return user;
  } catch (error) {
    throw error;
  }
}

export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        phone: "",
        city: "",
        country: "",
        additionalInfo: "",
        createdAt: serverTimestamp(),
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
}

export async function updateProfileData(name, photoURL, extraData = {}) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    const updates = {};
    if (name !== undefined) {
      await updateProfile(user, { displayName: name });
      updates.displayName = name;
    }
    if (photoURL !== undefined) {
      await updateProfile(user, { photoURL });
      updates.photoURL = photoURL;
    }
    if (extraData.phone !== undefined) updates.phone = extraData.phone;
    if (extraData.city !== undefined) updates.city = extraData.city;
    if (extraData.country !== undefined) updates.country = extraData.country;
    if (extraData.additionalInfo !== undefined) updates.additionalInfo = extraData.additionalInfo;
    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "users", user.uid), updates);
    }
  } catch (error) {
    throw error;
  }
}
