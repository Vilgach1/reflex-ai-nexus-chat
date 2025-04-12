
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { MessageContent } from "../types/chat";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Shield, Trash2, VerifiedIcon, AlertTriangle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ChatInterface: React.FC = () => {
  const { messages, sendMessage, isLoading, clearMessages, dualVerification, toggleDualVerification, error } = useChat();
  const { signOut } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Ошибка",
        description: error,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [error, toast]);

  const handleSendMessage = async (content: MessageContent[]) => {
    await sendMessage(content);
  };

  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Чат очищен",
      description: "Все сообщения были удалены.",
      duration: 3000,
    });
  };

  const handleToggleVerification = () => {
    toggleDualVerification();
    toast({
      title: dualVerification ? "Режим верификации выключен" : "Режим верификации включен",
      description: dualVerification 
        ? "Ответы больше не будут проверяться вторым ИИ." 
        : "Ответы теперь будут проверяться вторым ИИ для повышения точности.",
      duration: 3000,
    });
  };

  const handleSignOut = async () => {
    await signOut();
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
            title={dualVerification ? "Отключить режим верификации" : "Включить режим верификации"}
          >
            <Shield className={`h-4 w-4 ${dualVerification ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/10"
            title="Очистить чат"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-9 h-9 rounded-full bg-primary/5 hover:bg-primary/10"
            title="Выйти из аккаунта"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
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
            <h2 className="text-xl font-bold mb-2 text-gradient">Добро пожаловать в REFLEX AI Nexus</h2>
            <p className="text-muted-foreground max-w-md">
              Начните разговор с ИИ. Вы можете загружать изображения, форматировать текст с помощью **жирного** и {">"} цитат, и многое другое.
            </p>
            {dualVerification && (
              <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-primary/5">
                <VerifiedIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">Режим верификации включен</span>
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
      
      <div className="p-2 text-xs text-center text-muted-foreground border-t border-border/40 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
        ИИ может ошибаться. Пожалуйста, проверяйте важную информацию.
      </div>
    </div>
  );
};
