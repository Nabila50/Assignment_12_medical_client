import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../../firebase/firebase.init";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
// import { auth } from "../../firebase/firebase.init";

// google button click for one time

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  // Checking user.............

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // create user................

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // SignIN.............

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // --------Sign IN for google.----------

  const signInWithGoogle = ()=>{
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }

  // ------ Update userProfile------------

  const updateUserProfile = profileInfo =>{
    return updateProfile(auth.currentUser, profileInfo)
  }

  // ----------logOut----------

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  // Observer...............

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('user in the auth state change')
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    signInWithGoogle,
    updateUserProfile
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
