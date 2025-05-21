import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

// Add new assignment
export const addAssignment = async (title, category) => {
  await addDoc(collection(db, "assignments"), {
    title,
    category,
    status: "new",
    member: "",
    timestamp: serverTimestamp(),
  });
};

// Assign to member
export const assignToMember = async (id, memberName) => {
  const ref = doc(db, "assignments", id);
  await updateDoc(ref, {
    member: memberName,
    status: "in progress",
  });
};

// Mark as done
export const markAsDone = async (id) => {
  const ref = doc(db, "assignments", id);
  await updateDoc(ref, {
    status: "finished",
  });
};

// Delete assignment
export const deleteAssignment = async (id) => {
  const ref = doc(db, "assignments", id);
  await deleteDoc(ref);
};

// Get real-time assignments
export const getAssignments = (callback) => {
  const q = query(collection(db, "assignments"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp // Keep the Firestore timestamp
    }));
    callback(data);
  });
};