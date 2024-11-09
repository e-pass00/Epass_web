// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCgFpubwX6FjbuvF0t2-OoneYoHda6VQ7Q',
  authDomain: 'epass-e50a0.firebaseapp.com',
  projectId: 'epass-e50a0',
  storageBucket: 'epass-e50a0.appspot.com',
  messagingSenderId: '145498487703',
  appId: '1:145498487703:web:e0084cfdd36fcc0eb0a2d2',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
