import React, { useState, useEffect } from "react";

const MemberForm = ({ onAddMember, user, members = [] }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("ux");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role || "ux");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;

    onAddMember(name, role);

    if (!user) {
      setName("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "5px", marginBottom: "1rem" }}>
        {!user && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Namn"
            style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem", boxSizing: "border-box" }}
          />
        )}

        {user && (
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>{user.name}</strong> (inloggad som <em>{user.role}</em>)
          </p>
        )}
        <button type="submit">Lägg till medlem</button>
      </form>

      <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "5px", maxWidth: "400px", margin: "0 auto", boxShadow: "0 0 5px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.75rem" }}>Alla medlemmar</h2>
        {members.length === 0 ? (
          <p style={{ color: "#777" }}>Inga medlemmar ännu.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0, maxHeight: "200px", overflowY: "auto" }}>
            {members.map((m) => (
              <li key={m.id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                <p>
                  <strong>{m.name}</strong> ({m.category})
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MemberForm;
