// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "mindcraft-692e3.firebaseapp.com",
    projectId: "mindcraft-692e3",
    storageBucket: "mindcraft-692e3.firebasestorage.app",
    messagingSenderId: "423591480703",
    appId: "1:423591480703:web:060fa94a8dbc590c9d9e4a",
    measurementId: "G-YS6LDYE8GR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);