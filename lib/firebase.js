import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTzfW8Pl_YhdA5myxJV_JAn4R1h9RK0xU",
  authDomain: "blog-tutorial-32d03.firebaseapp.com",
  projectId: "blog-tutorial-32d03",
  storageBucket: "blog-tutorial-32d03.appspot.com",
  messagingSenderId: "87150552718",
  appId: "1:87150552718:web:a02e01411a0dbdf22b4bdf",
  measurementId: "G-TRD6CVTF7R"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth();
export async function getUserWithUsername(username) {
  const q = query(collection(db, 'users'),
    where('username', '==', username),
    limit(1));
  const qDocs = await getDocs(q);
  return qDocs[0];
}