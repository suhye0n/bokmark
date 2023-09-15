import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvuOOlhBa8OiJbDYpx5cKS201Kz23nPrQ",
    authDomain: "b0kmark.firebaseapp.com",
    projectId: "b0kmark",
    storageBucket: "b0kmark.appspot.com",
    messagingSenderId: "521837223810",
    appId: "1:521837223810:web:f831c8957f1e1f4250799b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
