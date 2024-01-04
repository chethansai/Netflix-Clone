import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';

// Initialize Firebase (import firebaseConfig from a single source)
// Dummy Firebase Config (Replace with actual credentials)

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket.appspot.com',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
};

const app = initializeApp(firebaseConfig);

// Create an AuthContext
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  //Sign Up with Email & Password
  const signUpWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //Addition of Verifying Email
      await sendVerificationEmail(userCredential.user);
      await setDoc(doc(db, 'users', email), {
        savedShows: [],
      });
    } catch (error) {
      alert('Email/Password Sign-Up Failed' + error.message);
    }
  };

  // Sign in with email and password
  const signInWithEmailPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      //Direct Error Console Logging, Introduce as function for handling Suggestion - Multiple Authentication
      try {
        handleSignInError(error, auth, email);
      } catch (errorr) {
        alert(errorr.message);
      }
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('Sign Out Failed' + error.message);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      alert('Password Reset Failed' + error.message);
    }
  };

  // Send Verification Email
  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      alert('Failed to send verification email.' + error.message);
    }
  };

  // Check Verification Email
  const checkVerificationEmail = async () => {
    try {
      if (user) {
        //
        if (!emailVerified) {
          if (
            auth.currentUser
              ? await auth.currentUser
                .reload()
                .then(() => auth.currentUser.emailVerified)
              : false
          ) {
            // Perform any additional actions you want when email is verified
            // For example, update the user state
            setUser(user);
            setEmailVerified(true);
          } else {
            // Handle case when email is not verified
            // For example, show a message to the user
            console.log('Email not verified.');
            alert(
              'Email not verified. Please check your inbox and verify the email.'
            );
          }
        }
      }
    } catch (error) {
      // Handle any errors that occur during the email verification check
      console.error(error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.email), {
        savedShows: [],
      });
    } catch (error) {
      alert('Google Sign-In Failed' + error.message);
    }
  };

  //handle Sign In Error
  const handleSignInError = async (error, auth, email) => {
    // Check if the error message indicates a wrong password
    if (error.code === 'auth/wrong-password') {
      try {
        const signInMethods = await fetchSignInMethods(auth, email);

        let providerType = 'Unknown';
        if (signInMethods.includes('password')) {
          providerType = 'Email/Password';
        } else if (signInMethods.includes('google.com')) {
          providerType = 'Google';
          alert(
            'You have created account with Signing In with Google. Please login using Sign In with Google Button '
          );
        } else if (signInMethods.includes('facebook.com')) {
          providerType = 'Facebook';
        }
        alert('Sign-In Failed. An error occurred.' + error.message);
      } catch (fetchError) {
        alert('Sign-In Failed. An error occurred.' + fetchError.message);
      }
    } else {
      // Handle other types of errors as needed
      alert('Sign-In Failed. An error occurred.' + error.message);
    }
  };

  const fetchSignInMethods = async (auth, email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      return signInMethods;
    } catch (error) {
      console.error('Error fetching sign-in methods:', error);
      return [];
    }
  };

  const value = {
    auth,
    user,
    db,
    emailVerified,
    checkVerificationEmail,
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    resetPassword,
    signOutUser,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
