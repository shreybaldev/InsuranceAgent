function QuerySelector({ queryTypes, activeType, onTypeChange }) {
  return (
    <div className="query-selector">
      {queryTypes.map((type) => (
        <button
          key={type.id}
          className={`query-btn ${activeType === type.id ? "active" : ""}`}
          onClick={() => onTypeChange(type.id)}
        >
          <span className="query-icon">{type.icon}</span>
          <span>{type.label}</span>
        </button>
      ))}
    </div>
  );
}

export default QuerySelector;
