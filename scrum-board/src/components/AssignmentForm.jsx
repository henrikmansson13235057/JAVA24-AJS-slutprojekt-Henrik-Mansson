import React, { useState } from "react";

const AssignmentForm = ({ onAddAssignment }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ux");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    onAddAssignment(title, category);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Lägg till uppgift</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Uppgiftstitel"
        className="border p-2 w-full mb-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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
export default AssignmentForm;