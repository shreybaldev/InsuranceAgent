import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SuggestedQuestions from "./components/SuggestedQuestions";
import QuerySelector from "./components/QuerySelector";
import ChatHistory from "./components/ChatHistory";
import { QUERY_TYPES, QUESTIONS_BY_TYPE } from "./config/questions";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQueryType, setActiveQueryType] = useState("buy");
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (question) => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setInput("");
    setPendingQuestion(question);

    try {
      const formData = new FormData();
      formData.append("question", question);

      if (selectedFile) {
        formData.append("pdf", selectedFile);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
      setSelectedFile(null); // Clear file after successful submission
    } catch (err) {
      setError("Failed to get AI response. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
      setPendingQuestion(null);
    }
  };

  const handleSuggestedClick = (question) => {
    setInput(question);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleFileClear = () => {
    setSelectedFile(null);
  };

  const currentPlaceholder =
    QUERY_TYPES.find((q) => q.id === activeQueryType)?.placeholder ||
    "Ask me anything about insurance...";

  const currentQuestions = QUESTIONS_BY_TYPE[activeQueryType] || [];

  const hasMessages = messages.length > 0 || isLoading;

  return (
    <div className={`app ${hasMessages ? "has-messages" : ""}`}>
      <section className="hero">
        <div className="chat-header">
          <h1>PolicyIQ</h1>
        </div>

        <div className="hero-content">
          <h1>Your AI Insurance Assistant</h1>
          <p>
            Get instant answers about buying, claiming, or renewing insurance -
            powered by intelligent AI
          </p>

          <QuerySelector
            queryTypes={QUERY_TYPES}
            activeType={activeQueryType}
            onTypeChange={setActiveQueryType}
          />

          <SearchBar
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder={currentPlaceholder}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onFileClear={handleFileClear}
          />

          <SuggestedQuestions
            questions={currentQuestions}
            onQuestionClick={handleSuggestedClick}
          />
        </div>
      </section>

      <div className="chat-container">
        <ChatHistory
          messages={messages}
          isLoading={isLoading}
          pendingQuestion={pendingQuestion}
        />

        {error && <div className="error">{error}</div>}

        <div className="chat-input-area">
          <SearchBar
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder={currentPlaceholder}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onFileClear={handleFileClear}
          />
          <SuggestedQuestions
            questions={currentQuestions}
            onQuestionClick={handleSuggestedClick}
            compact
          />
        </div>
      </div>
    </div>
  );
}

export default App;
