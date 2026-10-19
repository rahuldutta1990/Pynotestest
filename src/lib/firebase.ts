import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const getIdToken = async () => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const signInStaff = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerStaff = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const signOutUser = async () => {
  return await signOut(auth);
};
