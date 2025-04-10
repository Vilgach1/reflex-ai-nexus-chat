
import React, { useEffect, useRef } from "react";
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
  const isUser = message.role === "user";
  
  // Auto-scroll to this message when it appears
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const renderAvatar = () => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      );
    }
  };

  const renderContent = () => {
    return message.content.map((item, index) => {
      if (item.type === "text" && item.text) {
        return (
          <div key={index} className={message.isPending ? "opacity-70 animate-pulse" : ""}>
            {formatMessage(item.text)}
          </div>
        );
      } else if (item.type === "image_url" && item.image_url?.url) {
        return (
          <img
            key={index}
            src={item.image_url.url}
            alt="User uploaded image"
            className="max-w-full max-h-60 object-contain rounded-md my-2"
          />
        );
      }
      return null;
    });
  };

  return (
    <div 
      ref={messageRef}
      className={`flex gap-3 p-4 ${isUser ? "animate-slide-in-right" : "animate-slide-in-left"}`}
    >
      {renderAvatar()}
      
      <div
        className={`${
          isUser ? "message-bubble-user ml-auto" : "message-bubble-ai"
        } ${message.isError ? "border-red-500" : ""}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
