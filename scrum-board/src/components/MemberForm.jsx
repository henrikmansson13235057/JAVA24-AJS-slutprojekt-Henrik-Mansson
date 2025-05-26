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
      <form onSubmit={handleSubmit} className="p-4 border rounded mb-6">
        

        {!user && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Namn"
            className="border p-2 w-full mb-2"
          />
        )}

        {user && (
          <p className="mb-2">
            <strong>{user.name}</strong> (inloggad som <em>{user.role}</em>)
          </p>
        )}

        

      
      </form>

      <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Alla medlemmar</h2>
        {members.length === 0 ? (
          <p className="text-gray-500"></p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {members.map((m) => (
              <li key={m.id} className="border-b pb-1">
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
