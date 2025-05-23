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

  return (
    <div className="mt-4">
      {filtered.length === 0 ? (
        <p className="text-gray-500">Inga uppgifter</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((a) => (
            <li
              key={a.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-gray-600">
                  {a.timestamp?.toDate().toLocaleString()} – {a.category}
                </p>
                {a.member && <p className="text-sm">Tilldelad: {a.member}</p>}
              </div>
              <div className="space-x-2 flex items-center">
                {a.status === "new" && (
                  <>
                    <select
                      onChange={(e) => assignToMember(a.id, e.target.value)}
                      className="border p-1"
                      defaultValue=""
                    >
                      <option value="">Tilldela...</option>
                      {members
                        .filter((m) => m.category === a.category)
                        .map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                    </select>

                    {user &&
                      (!a.member || a.member === "") &&
                      // Visa "Ta emot"-knappen ENDAST om användarens roll matchar uppgiftens kategori
                      user.role === a.category && (
                        <button
                          onClick={() => assignToMember(a.id, user.name)}
                          className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Ta emot
                        </button>
                      )}
                  </>
                )}
                {a.status === "in progress" && (
                  a.member === user.name && (
                    <button
                      onClick={() => markAsDone(a.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Klart
                    </button>
                  )
                )}
                {a.status === "finished" && (
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
