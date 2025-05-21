import React, { useState } from "react";

const MemberForm = ({ onAddMember }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("ux");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    onAddMember(name, role);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Lägg till medlem</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Namn"
        className="border p-2 w-full mb-2"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 w-full mb-2"
      >
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Lägg till
      </button>
    </form>
  );
};

export default MemberForm;