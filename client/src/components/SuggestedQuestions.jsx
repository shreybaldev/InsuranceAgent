function SuggestedQuestions({ questions, onQuestionClick, compact }) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className={`suggested-questions ${compact ? "compact" : ""}`}>
      <span className="sample-label">Try asking:</span>
      {questions.map((question, index) => (
        <button
          key={index}
          className="sample-query"
          onClick={() => onQuestionClick(question)}
        >
          "{question}"
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
