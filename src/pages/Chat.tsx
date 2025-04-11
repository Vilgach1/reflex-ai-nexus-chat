
import React, { useEffect, useState } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChat } from "../contexts/ChatContext";
import { Skeleton } from "@/components/ui/skeleton";

const Chat: React.FC = () => {
  const { messages, addStaticMessage, setApiKey } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  
  // Set default API key on component mount
  useEffect(() => {
    // Set the provided API key
    setApiKey("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");
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setApiKey]);

  // Send welcome message if this is a fresh chat
  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      // Add a static welcome message instead of requesting from the neural network
      addStaticMessage({
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Привет! Я REFLEX AI, продвинутый ИИ-ассистент. Я могу отвечать на ваши вопросы, анализировать изображения и помогать с различными задачами. Благодаря интеграции с Google Gemini 2.0, я обладаю хорошим пониманием контекста и могу поддерживать осмысленные диалоги. Вы можете отправлять мне текст и изображения, а я постараюсь предоставить наиболее полезный ответ. Чем я могу вам помочь сегодня?",
          },
        ],
      });
    }
  }, [isLoading, messages.length, addStaticMessage]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <img 
            src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" 
            alt="REFLEX AI" 
            className="w-32 h-32 mb-6 object-contain animate-float"
          />
          <div className="space-y-2 w-48">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <ChatInterface />
    </div>
  );
};

export default Chat;
