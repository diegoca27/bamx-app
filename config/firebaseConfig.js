// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM0u6Vbpm6NI1In_BvkwJyZY4TvfXlpDE",
  authDomain: "bamx-app-d67a4.firebaseapp.com",
  projectId: "bamx-app-d67a4",
  storageBucket: "bamx-app-d67a4.appspot.com",
  messagingSenderId: "608136685091",
  appId: "1:608136685091:web:92c9504b8744aa3f29f396",
  measurementId: "G-8PVFRHJQ66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestore = getFirestore(app);

export const db = getFirestore(app);
export { auth, firestore };