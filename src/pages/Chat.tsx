
import React, { useEffect } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChat } from "../contexts/ChatContext";

const Chat: React.FC = () => {
  const { messages, addStaticMessage, setApiKey } = useChat();
  
  // Set default API key on component mount
  useEffect(() => {
    // Set a default API key
    setApiKey("YOUR_API_KEY"); // Replace with your actual API key
  }, [setApiKey]);

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
