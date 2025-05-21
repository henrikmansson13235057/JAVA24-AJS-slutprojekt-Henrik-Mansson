import React from "react";
import { assignToMember, markAsDone, deleteAssignment } from "../firebase/assignments";

const AssignmentList = ({
  assignments,
  filters,
  sortBy,
  members,
}) => {
  const filtered = assignments
    .filter((a) => {
      if (filters.category && a.category !== filters.category) return false;
      if (filters.member && a.member !== filters.member) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "timestamp-asc") return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
      if (sortBy === "timestamp-desc") return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const grouped = {
    new: [],
    "in progress": [],
    finished: [],
  };
  filtered.forEach((a) => grouped[a.status]?.push(a));

  return (
    <div className="mt-6">
      {Object.entries(grouped).map(([status, list]) => (
        <div key={status} className="mb-6">
          <h3 className="text-lg font-semibold capitalize mb-2">{status}</h3>
          {list.length === 0 ? (
            <p className="text-gray-500">Inga uppgifter</p>
          ) : (
            <ul className="space-y-2">
              {list.map((a) => (
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
                  <div className="space-x-2">
                    {status === "new" && (
                      <select
                        onChange={(e) => assignToMember(a.id, e.target.value)}
                        className="border p-1"
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
                    )}
                    {status === "in progress" && (
                      <button
                        onClick={() => markAsDone(a.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Klart
                      </button>
                    )}
                    {status === "finished" && (
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
      ))}
    </div>
  );
};

export default AssignmentList;