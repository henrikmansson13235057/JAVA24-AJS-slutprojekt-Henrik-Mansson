


// firebase/firebase.js (example)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGNd0ZOBKETzJAttnxrRa1OeDV4Zqb0jo",
  authDomain: "scrumboard-f2e02.firebaseapp.com",
  projectId: "scrumboard-f2e02",
  storageBucket: "scrumboard-f2e02.firebasestorage.app",
  messagingSenderId: "48014949573",
  appId: "1:48014949573:web:d85977114783f4138184ac",
  measurementId: "G-1EYFVNR3N6",
};
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

