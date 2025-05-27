import React from "react";

const FilterSortBar = ({ filters, setFilters, sortBy, setSortBy, members }) => {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "1rem",
    margin: "1rem 0",
  };

  const selectStyle = {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      <select
        value={filters.category}
        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        style={selectStyle}
      >
        <option value="">Alla kategorier</option>
        <option value="ux">UX</option>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
      </select>

      <select
        value={filters.member}
        onChange={(e) => setFilters((f) => ({ ...f, member: e.target.value }))}
        style={selectStyle}
      >
        <option value="">Alla medlemmar</option>
        {members.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)} 
        style={selectStyle}
      >
        <option value="timestamp-desc">Nyast först</option>
        <option value="timestamp-asc">Äldst först</option>
        <option value="title-asc">A–Ö</option>
        <option value="title-desc">Ö–A</option>
      </select>
    </div>
  );
};

export default FilterSortBar;
