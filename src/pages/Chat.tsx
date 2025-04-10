
import React, { useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChat } from "../contexts/ChatContext";
import { Navigate } from "react-router-dom";
import { MessageContent } from "@/types/chat";

const Chat: React.FC = () => {
  const { apiKey, messages, addStaticMessage } = useChat();

  // Redirect to welcome if API key is not set
  if (!apiKey) {
    return <Navigate to="/" />;
  }

  // Send welcome message if this is a fresh chat
  useEffect(() => {
    if (messages.length === 0) {
      // Add a static welcome message instead of requesting from the neural network
      addStaticMessage({
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Hello! I'm REFLEX AI, your advanced AI assistant. How can I help you today?",
          },
        ],
      });
    }
  }, [messages.length, addStaticMessage]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <ChatInterface />
    </div>
  );
};

export default Chat;
