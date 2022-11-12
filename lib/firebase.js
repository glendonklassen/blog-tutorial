import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  collection,
  getFirestore,
  query,
  where,
  limit,
  getDocs,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { GoogleAuthProvider } from 'firebase/auth'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: 'AIzaSyCTzfW8Pl_YhdA5myxJV_JAn4R1h9RK0xU',
  authDomain: 'blog-tutorial-32d03.firebaseapp.com',
  projectId: 'blog-tutorial-32d03',
  storageBucket: 'blog-tutorial-32d03.appspot.com',
  messagingSenderId: '87150552718',
  appId: '1:87150552718:web:a02e01411a0dbdf22b4bdf',
  measurementId: 'G-TRD6CVTF7R',
}

export const app = initializeApp(firebaseConfig)
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LetGwEjAAAAALczKpy-nWnfwdw7yL9Alcwi7hhl'),
  isTokenAutoRefreshEnabled: true,
})
export const db = getFirestore(app)
export const storage = getStorage()
export const googleAuthProvider = new GoogleAuthProvider()
export const auth = getAuth()
export async function getUserWithUsername(username) {
  const constraints = []
  constraints.push(where('username', '==', username))
  constraints.push(limit(1))
  const q = query(collection(db, 'users'), ...constraints)
  const qDocs = await getDocs(q)
  return qDocs.docs[0]
}
