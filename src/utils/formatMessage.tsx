
import React, { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Detect code blocks
const detectCodeBlocks = (text: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  const segments: { type: "text" | "code"; content: string; language?: string }[] = [];

  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.substring(lastIndex, match.index),
      });
    }
    
    // Add code block
    segments.push({
      type: "code",
      content: match[2],
      language: match[1] || "text", // Default to text if no language specified
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.substring(lastIndex),
    });
  }
  
  return segments;
};

// Format inline markdown
const formatInlineMarkdown = (text: string): ReactNode[] => {
  // Split by bold markers
  const boldSegments = text.split(/(\*\*.*?\*\*)/g);
  
  // Process each segment
  const result = boldSegments.map((segment, index) => {
    // Bold text
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={index}>{segment.slice(2, -2)}</strong>;
    }
    
    // Process quotes in regular text
    const quoteSegments = segment.split(/(> .*?)(?:\n|$)/g);
    
    if (quoteSegments.length > 1) {
      return quoteSegments.map((quoteSegment, quoteIndex) => {
        if (quoteSegment.startsWith("> ")) {
          return (
            <blockquote
              key={`${index}-${quoteIndex}`}
              className="border-l-4 border-primary/50 pl-3 my-2 text-muted-foreground"
            >
              {quoteSegment.slice(2)}
            </blockquote>
          );
        }
        return <span key={`${index}-${quoteIndex}`}>{quoteSegment}</span>;
      });
    }
    
    // Regular text
    return <span key={index}>{segment}</span>;
  });
  
  // Flatten the array in case we had nested arrays from quote processing
  return result.flat();
};

// Main formatting function
export const formatMessage = (message: string): ReactNode => {
  const segments = detectCodeBlocks(message);
  
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "code") {
          return (
            <div className="code-block-container relative group" key={index}>
              <div className="code-language absolute top-0 right-0 bg-primary/10 text-primary text-xs px-2 py-1 rounded-bl">
                {segment.language}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(segment.content)}
                className="copy-button absolute top-0 right-16 bg-primary/10 hover:bg-primary/20 text-primary text-xs px-2 py-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Copy
              </button>
              <SyntaxHighlighter 
                language={segment.language} 
                style={atomDark}
                className="rounded-md my-2 code-block"
                customStyle={{ background: "rgba(30, 30, 30, 0.8)" }}
              >
                {segment.content.trim()}
              </SyntaxHighlighter>
            </div>
          );
        }
        return <div key={index}>{formatInlineMarkdown(segment.content)}</div>;
      })}
    </>
  );
};
