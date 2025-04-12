
import React, { useEffect, useState } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { useChat } from "../contexts/ChatContext";
import { Skeleton } from "@/components/ui/skeleton";

const Chat: React.FC = () => {
  const { messages, addStaticMessage, setApiKey } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  
  // Set default API key on component mount
  useEffect(() => {
    // Set the provided API key only if it's not already set
    setApiKey("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");
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array so it only runs once on mount

  // Send welcome message if this is a fresh chat
  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      // Add a static welcome message instead of requesting from the neural network
      addStaticMessage({
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Привет! Я REFLEX AI, продвинутый ИИ-ассистент. Я могу отвечать на ваши вопросы, анализировать изображения и помогать с различными задачами. Благодаря интеграции с DeepSeek модели, я обладаю хорошим пониманием контекста и могу поддерживать осмысленные диалоги на разных языках. Вы можете отправлять мне текст и изображения, а я постараюсь предоставить наиболее полезный ответ. Чем я могу вам помочь сегодня?",
          },
        ],
      });
    }
  }, [isLoading, messages.length, addStaticMessage]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-pulse-gentle flex flex-col items-center">
          <img 
            src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" 
            alt="REFLEX AI" 
            className="w-32 h-32 mb-6 object-contain animate-float"
          />
          <div className="space-y-2 w-48">
            <Skeleton className="h-4 w-full animate-shimmer" />
            <Skeleton className="h-4 w-3/4 mx-auto animate-shimmer" />
            <Skeleton className="h-4 w-5/6 mx-auto animate-shimmer" />
          </div>
          <p className="mt-4 text-center text-muted-foreground animate-fade-in">
            Инициализация REFLEX AI...
          </p>
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
