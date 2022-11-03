import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTzfW8Pl_YhdA5myxJV_JAn4R1h9RK0xU",
    authDomain: "blog-tutorial-32d03.firebaseapp.com",
    projectId: "blog-tutorial-32d03",
    storageBucket: "blog-tutorial-32d03.appspot.com",
    messagingSenderId: "87150552718",
    appId: "1:87150552718:web:a02e01411a0dbdf22b4bdf",
    measurementId: "G-TRD6CVTF7R"
  };

if (!firebase.app.length){
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();