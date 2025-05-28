import React, { useState, useEffect } from "react";

const MemberForm = ({ onAddMember, user }) => {
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
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginBottom: "1rem",
      }}
    >
      {!user && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Namn"
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "0.5rem",
            boxSizing: "border-box",
          }}
        />
      )}
    
    </form>
  );
};

export default MemberForm;
