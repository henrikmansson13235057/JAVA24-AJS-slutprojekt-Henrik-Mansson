import React from "react";
import {
  assignToMember,
  markAsDone as markAsDoneFirebase,
  deleteAssignment,
} from "../firebase/assigments";

const AssignmentList = ({ assignments, filters, sortBy, members, user }) => {
  const filtered = assignments
    .filter((a) => {
      if (filters.category && a.category !== filters.category) return false;
      if (filters.member && a.member !== filters.member) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "timestamp-asc")
        return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
      if (sortBy === "timestamp-desc")
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const markAsDone = async (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    if (assignment.member !== user.name) {
      alert("Du kan bara markera dina egna uppgifter som klara.");
      return;
    }

    try {
      await markAsDoneFirebase(assignmentId);
    } catch (error) {
      alert("Något gick fel vid markering som klar.");
      console.error(error);
    }
  };

  const listItemStyle = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  };

  const buttonStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginLeft: "0.5rem",
  };

  const selectStyle = {
    padding: "0.25rem 0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      {filtered.length === 0 ? (
        <p style={{ color: "#666" }}>Inga uppgifter</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((a) => (
            <li key={a.id} style={listItemStyle}>
              <div>
                <p style={{ fontWeight: "bold" }}>{a.title}</p>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                  {a.timestamp?.toDate().toLocaleString()} – {a.category}
                </p>
                {a.member && <p style={{ fontSize: "0.9rem" }}>Tilldelad: {a.member}</p>}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                  minWidth: "150px",
                }}
              >
                {a.status === "new" && (
                  <>
                    <select
                      onChange={(e) => assignToMember(a.id, e.target.value)}
                      style={{ ...selectStyle, width: "140px" }}
                      defaultValue=""
                    >
                      <option value="">Tilldela...</option>
                      {members
                        .filter((m) => m.role === a.category) 
                        .map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                    </select>

                    {user &&
                      (!a.member || a.member === "") &&
                      user.role === a.category && (
                        <button
                          onClick={() => assignToMember(a.id, user.name)}
                          style={{
                            ...buttonStyle,
                            backgroundColor: "#3b82f6",
                            marginLeft: "0",
                            width: "140px",
                          }}
                        >
                          Ta emot
                        </button>
                      )}
                  </>
                )}

                {a.status === "in progress" && a.member === user.name && (
                  <button
                    onClick={() => markAsDone(a.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#10b981",
                      marginLeft: "0",
                      width: "140px",
                    }}
                  >
                    Klart
                  </button>
                )}

                {a.status === "finished" && (
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#ef4444",
                      marginLeft: "0",
                      width: "140px",
                    }}
                  >
                    Radera
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentList;
