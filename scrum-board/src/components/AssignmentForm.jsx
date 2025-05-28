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

  const formStyle = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "1rem",
    maxWidth: "500px",
  };

  const inputStyle = {
    padding: "0.5rem",
    width: "100%",
    marginBottom: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6", // blå
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const headingStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Lägg till uppgift</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Uppgiftstitel"
        style={inputStyle}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={inputStyle}
      >
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>
      <button type="submit" style={buttonStyle}>
        Lägg till
      </button>
    </form>
  );
};

export default AssignmentForm;