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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "assignments"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssignments(data);
    });
    return () => unsubscribe();
  }, []);

  // Använd users collection för medlemmar så båda dropdowns är synkroniserade
  useEffect(() => {
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.data().email,
        category: doc.data().role, // Mappa role till category för filtrering
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
    try {
      // Lägg till i users collection så det syns i båda dropdowns
      await addDoc(collection(db, "users"), { 
        name, 
        role: role,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@temp.com` // Temporär email
      });
      
      // Uppdatera members state direkt
      const newMember = {
        id: Date.now().toString(), // Temporärt ID
        name,
        category: role,
        role: role
      };
      setMembers(prev => [...prev, newMember]);
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
      
      // Uppdatera members efter registrering
      const newMember = {
        id: uid,
        name: email,
        category: role,
        role: role
      };
      setMembers(prev => [...prev, newMember]);
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
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;
    if (assignment.assignedTo !== user.email) {
      alert("Du kan bara markera dina egna uppgifter som klara.");
      return;
    }

    const updatedAssignments = assignments.map((a) =>
      a.id === assignmentId ? { ...a, status: "finished" } : a
    );
    setAssignments(updatedAssignments);
  };

  const appStyle = {
    minHeight: "100vh",
    padding: "1.5rem",
    fontFamily: "sans-serif",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#f3f4f6",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563eb",
    marginBottom: "2rem",
  };

  const buttonStyle = {
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={appStyle}>
      <h1 style={headingStyle}>Scrum Board</h1>

      {!user && (
        <div style={{ ...cardStyle, maxWidth: "400px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {isRegistering ? "Registrera" : "Logga in"}
          </h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ ...inputStyle }}
            />
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle }}
            />
            {isRegistering && (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ ...inputStyle }}
              >
                <option value="ux">UX</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
              </select>
            )}
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem",
                width: "100%",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isRegistering ? "Registrera" : "Logga in"}
            </button>
          </form>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ marginTop: "1rem", color: "#2563eb", textDecoration: "underline" }}
          >
            {isRegistering ? "Har redan konto? Logga in" : "Har inte konto? Registrera"}
          </button>
        </div>
      )}

      {user && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p>
              Inloggad som <strong>{user.email}</strong> ({user.role})
            </p>
            <button onClick={handleLogout} style={buttonStyle}>
              Logga ut
            </button>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "300px", ...cardStyle }}>
              <AssignmentForm onAddAssignment={handleAddAssignment} />
              <MemberForm onAddMember={handleAddMember} user={user} />
            </div>
            <div style={{ flex: 2, minWidth: "300px", ...cardStyle }}>
              <FilterSortBar
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                members={members}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["new", "in progress", "finished"].map((status) => (
              <div key={status} style={{ flex: 1, minWidth: "250px" }}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    color:
                      status === "new"
                        ? "#ef4444"
                        : status === "in progress"
                        ? "#f59e0b"
                        : "#16a34a",
                  }}
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

const inputStyle = {
  padding: "0.5rem",
  width: "100%",
  marginBottom: "0.75rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default App;