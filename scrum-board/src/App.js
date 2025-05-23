import React, { useState, useEffect } from "react";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import FilterSortBar from "./components/FilterSortBar";
import MemberForm from "./components/MemberForm";

import { auth, db } from "./firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

const App = () => {
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ category: "", member: "" });
  const [sortBy, setSortBy] = useState("timestamp-desc");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState("ux");

  // Realtime updates for assignments
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "assignments"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssignments(data);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all members for assignment dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, "members"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(data);
    };

    fetchMembers();
  }, []);

  const filtered = (status) =>
    assignments
      .filter((a) => a?.status === status)
      .filter(
        (a) =>
          (!filters.category || a?.category === filters.category) &&
          (!filters.member || a?.member === filters.member)
      );

  const handleAddAssignment = async (title, category) => {
    await addDoc(collection(db, "assignments"), {
      title,
      category,
      status: "new",
      member: "",
      timestamp: serverTimestamp(),
    });
  };

  const handleAddMember = async (name, role) => {
    const newMember = { name, category: role };
    try {
      await addDoc(collection(db, "members"), newMember);
    } catch (error) {
      alert("Kunde inte lägga till medlem: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Fyll i email och lösenord");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser({ uid, ...userDoc.data() });
        alert(`Välkommen tillbaka, ${userDoc.data().name || email}!`);
      } else {
        alert("Användardata kunde inte hittas.");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Fel vid inloggning: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Fyll i email och lösenord");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        name: email,
        role,
      });
      setUser({ uid, email, name: email, role });
      alert("Registrering lyckades!");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Fel vid registrering: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMembers([]);
  };

  const markAsDone = (assignmentId) => {
  const assignment = assignments.find(a => a.id === assignmentId);
  if (!assignment) return;

  // Kontrollera att uppgiften tillhör den inloggade användaren
  if (assignment.assignedTo !== user.email) {
    alert("Du kan bara markera dina egna uppgifter som klara.");
    return;
  }

  // Uppdatera status till "finished"
  const updatedAssignments = assignments.map(a =>
    a.id === assignmentId ? { ...a, status: "finished" } : a
  );

  setAssignments(updatedAssignments);
};


  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Scrum Board</h1>

      {!user && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl mb-4">{isRegistering ? "Registrera" : "Logga in"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Lösenord"
              className="border p-2 w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegistering && (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border p-2 w-full mb-3"
              >
                <option value="ux">UX</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
              </select>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              {isRegistering ? "Registrera" : "Logga in"}
            </button>
          </form>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-4 text-blue-600 underline"
          >
            {isRegistering ? "Har redan konto? Logga in" : "Har inte konto? Registrera"}
          </button>
        </div>
      )}

      {user && (
        <>
          <div className="flex justify-between items-center mb-6">
            <p>
              Inloggad som <strong>{user.email}</strong> ({user.role})
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logga ut
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-4">
              <AssignmentForm onAddAssignment={handleAddAssignment} />
              <MemberForm onAddMember={handleAddMember} user={user} />
            </div>

            <div className="text-center mb-6 md:col-span-2 bg-white rounded-xl shadow-md p-4">
              <FilterSortBar
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                members={members}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["new", "in progress", "finished"].map((status) => (
              <div key={status}>
                <h2
                  className={`text-xl font-bold mb-2 ${
                    status === "new"
                      ? "text-red-500"
                      : status === "in progress"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {status === "new" && "🆕 Ny"}
                  {status === "in progress" && "🚧 Pågår"}
                  {status === "finished" && "✅ Klar"}
                </h2>
                <AssignmentList
                  assignments={filtered(status)}
                  filters={filters}
                  sortBy={sortBy}
                  members={members}
                  user={user}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
