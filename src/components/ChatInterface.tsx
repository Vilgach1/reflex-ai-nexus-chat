
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "../contexts/ChatContext";
import { MessageContent } from "../types/chat";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Shield, Trash2, VerifiedIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, dualVerification, toggleDualVerification } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (content: MessageContent[]) => {
    await sendMessage(content);
  };

  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  };

  const handleToggleVerification = () => {
    toggleDualVerification();
    toast({
      title: dualVerification ? "Verification mode disabled" : "Verification mode enabled",
      description: dualVerification 
        ? "Responses will no longer be verified by a second AI." 
        : "Responses will now be verified by a second AI for accuracy.",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h1 className="text-xl font-bold text-gradient">REFLEX AI Nexus</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleVerification}
            className={`w-9 h-9 rounded-full ${dualVerification ? 'bg-primary/20' : 'bg-primary/5'} hover:bg-primary/10`}
            title={dualVerification ? "Disable verification mode" : "Enable verification mode"}
          >
            <Shield className={`h-4 w-4 ${dualVerification ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/10"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/5 flex items-center justify-center animate-float">
              <img src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" alt="REFLEX AI" className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gradient">Welcome to REFLEX AI Nexus</h2>
            <p className="text-muted-foreground max-w-md">
              Start a conversation with the AI. You can upload images, format text with **bold** and {">"} quotes, and more.
            </p>
            {dualVerification && (
              <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-primary/5">
                <VerifiedIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Verification mode is enabled</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};
