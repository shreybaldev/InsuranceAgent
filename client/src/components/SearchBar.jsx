import { useRef } from "react";

function SearchBar({ value, onChange, onSubmit, isLoading, placeholder, onFileSelect, selectedFile, onFileClear }) {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please select a PDF file");
      }
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="search-bar-container">
      {selectedFile && (
        <div className="selected-file">
          <span className="file-icon">📄</span>
          <span className="file-name">{selectedFile.name}</span>
          <button type="button" className="file-remove" onClick={onFileClear}>
            ✕
          </button>
        </div>
      )}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Ask me anything about insurance..."}
          disabled={isLoading}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: "none" }}
        />
        <button
          type="button"
          className={`upload-btn ${selectedFile ? "has-file" : ""}`}
          title="Upload policy PDF"
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </button>
        <button
          type="submit"
          className="search-btn"
          disabled={isLoading || !value.trim()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span className="btn-text">Search</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
