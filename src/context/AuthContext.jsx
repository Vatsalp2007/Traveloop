import { createContext, useState, useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import {
  loginWithEmail,
  signupWithEmail,
  loginWithGoogle,
  logout as authLogout,
  resetPassword as authResetPassword,
  updateProfileData,
} from "../firebase/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (docSnap.exists()) {
            setUserData({ uid: docSnap.id, ...docSnap.data() });
          } else {
            setUserData({ uid: firebaseUser.uid, email: firebaseUser.email });
          }
        } catch {
          setUserData({ uid: firebaseUser.uid, email: firebaseUser.email });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    user,
    userData,
    loading,
    login: loginWithEmail,
    signup: signupWithEmail,
    loginWithGoogle,
    logout: authLogout,
    resetPassword: authResetPassword,
    updateProfile: updateProfileData,
  }), [user, userData, loading]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "4px solid #E0E0E0",
          borderTop: "4px solid #F5A623",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
