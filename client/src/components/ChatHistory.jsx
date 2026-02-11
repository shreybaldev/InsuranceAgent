import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

function ChatHistory({ messages, isLoading, pendingQuestion }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Only auto-scroll if user is near the bottom
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

      if (isNearBottom) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-history" ref={containerRef}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && pendingQuestion && (
        <div className="chat-message">
          <div className="message question">{pendingQuestion}</div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatHistory;
