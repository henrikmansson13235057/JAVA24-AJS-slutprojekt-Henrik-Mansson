// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGNd0ZOBKETzJAttnxrRa1OeDV4Zqb0jo",
  authDomain: "scrumboard-f2e02.firebaseapp.com",
  projectId: "scrumboard-f2e02",
  storageBucket: "scrumboard-f2e02.firebasestorage.app",
  messagingSenderId: "48014949573",
  appId: "1:48014949573:web:d85977114783f4138184ac",
  measurementId: "G-1EYFVNR3N6"
};

// ✅ Initialize Firebase first
const app = initializeApp(firebaseConfig);

// ✅ Then use `app` to initialize other services
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ✅ Export db so other files can use it
export { db };
