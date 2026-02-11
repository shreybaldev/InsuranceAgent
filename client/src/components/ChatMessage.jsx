function ChatMessage({ message }) {
  const formatMarkdown = (text) => {
    // Split into lines for processing
    const lines = text.split("\n");
    const elements = [];
    let listItems = [];
    let listType = null;

    const processInlineFormatting = (line) => {
      // Bold: **text** or __text__
      line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      line = line.replace(/__(.+?)__/g, "<strong>$1</strong>");

      // Italic: *text* or _text_
      line = line.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
      line = line.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>");

      // Code: `text`
      line = line.replace(/`(.+?)`/g, "<code>$1</code>");

      return line;
    };

    const flushList = () => {
      if (listItems.length > 0) {
        const Tag = listType === "ol" ? "ol" : "ul";
        elements.push(
          <Tag key={elements.length}>
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: processInlineFormatting(item) }} />
            ))}
          </Tag>
        );
        listItems = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines but flush any pending list
      if (trimmedLine === "") {
        flushList();
        return;
      }

      // Headers
      if (trimmedLine.startsWith("### ")) {
        flushList();
        elements.push(
          <h4 key={index} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine.slice(4)) }} />
        );
        return;
      }
      if (trimmedLine.startsWith("## ")) {
        flushList();
        elements.push(
          <h3 key={index} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine.slice(3)) }} />
        );
        return;
      }
      if (trimmedLine.startsWith("# ")) {
        flushList();
        elements.push(
          <h3 key={index} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine.slice(2)) }} />
        );
        return;
      }

      // Unordered list items
      if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
        if (listType !== "ul") {
          flushList();
          listType = "ul";
        }
        listItems.push(trimmedLine.slice(2));
        return;
      }

      // Ordered list items
      const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)/);
      if (orderedMatch) {
        if (listType !== "ol") {
          flushList();
          listType = "ol";
        }
        listItems.push(orderedMatch[1]);
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={index} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine) }} />
      );
    });

    // Flush any remaining list
    flushList();

    return elements;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-message">
      <div className="message question">{message.question}</div>
      <div className="message answer">{formatMarkdown(message.answer)}</div>
      <div className="timestamp">{formatTime(message.timestamp)}</div>
    </div>
  );
}

export default ChatMessage;
