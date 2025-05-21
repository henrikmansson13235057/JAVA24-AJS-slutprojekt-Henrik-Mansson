import React, { useState, useEffect } from "react";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import FilterSortBar from "./components/FilterSortBar";
import MemberForm from "./components/MemberForm";

import { getAssignments } from "/firebase/assigments";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ category: "", member: "" });
  const [sortBy, setSortBy] = useState("timestamp-desc");

  useEffect(() => {
    const unsubscribe = getAssignments((data) => {
      setAssignments(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAddAssignment = async (title, category) => {
    await addDoc(collection(db, "assignments"), {
      title,
      category,
      status: "new",
      member: "",
      timestamp: new Date(),
    });
  };

  const handleAddMember = async (name, role) => {
    setMembers([...members, { id: Date.now().toString(), name, category: role }]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Scrum Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AssignmentForm onAddAssignment={handleAddAssignment} />
          <MemberForm onAddMember={handleAddMember} />
        </div>
        <div>
          <FilterSortBar
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            members={members}
          />
          <AssignmentList
            assignments={assignments}
            filters={filters}
            sortBy={sortBy}
            members={members}
          />
        </div>
      </div>
    </div>
  );
};

export default App;