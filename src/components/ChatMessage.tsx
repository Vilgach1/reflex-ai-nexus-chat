
import React, { useEffect, useRef, useState } from "react";
import { Message } from "../types/chat";
import { formatMessage } from "../utils/formatMessage";
import { Bot, User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const messageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-scroll to this message when it appears
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end" 
      });
    }
    
    // Add a small delay before showing the message for a nice entrance effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const isUser = message.role === "user";

  const renderAvatar = () => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      );
    }
  };

  const renderContent = () => {
    if (message.isPending) {
      return (
        <div className="animate-pulse-gentle">
          <span>Thinking</span>
          <span className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      );
    }

    return message.content.map((item, index) => {
      if (item.type === "text" && item.text) {
        return (
          <div key={index} className={message.isPending ? "opacity-70 animate-pulse-gentle" : ""}>
            {formatMessage(item.text)}
          </div>
        );
      } else if (item.type === "image_url" && item.image_url?.url) {
        return (
          <img
            key={index}
            src={item.image_url.url}
            alt="User uploaded image"
            className="max-w-full max-h-60 object-contain rounded-md my-2 shadow-sm transition-all duration-300 hover:shadow-md"
            loading="lazy"
          />
        );
      }
      return null;
    });
  };

  return (
    <div 
      ref={messageRef}
      className={`flex gap-3 p-4 ${isVisible ? (isUser ? "animate-slide-in-right" : "animate-slide-in-left") : "opacity-0"}`}
    >
      {renderAvatar()}
      
      <div
        className={`${
          isUser ? "message-bubble-user" : "message-bubble-ai"
        } ${message.isError ? "border border-destructive/50" : ""} ${
          message.isPending ? "animate-pulse-gentle" : ""
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
