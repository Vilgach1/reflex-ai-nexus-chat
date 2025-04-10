
import React, { useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChat } from "../contexts/ChatContext";
import { Navigate } from "react-router-dom";
import { MessageContent } from "@/types/chat";

const Chat: React.FC = () => {
  const { apiKey, messages, sendMessage } = useChat();

  // Redirect to welcome if API key is not set
  if (!apiKey) {
    return <Navigate to="/" />;
  }

  // Send welcome message if this is a fresh chat
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageContent[] = [
        {
          type: "text",
          text: "Hello! I'm REFLEX AI, your advanced AI assistant. How can I help you today?",
        },
      ];
      
      const systemMessage = {
        id: "welcome",
        role: "assistant" as const,
        content: welcomeMessage,
        createdAt: new Date(),
      };
      
      // Add welcome message
      sendMessage([
        {
          type: "text",
          text: "Introduce yourself as REFLEX AI and welcome the user.",
        },
      ]);
    }
  }, [messages.length, sendMessage]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <ChatInterface />
    </div>
  );
};

export default Chat;
