
import React, { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

export const ApiKeyInput: React.FC = () => {
  const { setApiKey, apiKey } = useChat();
  const [inputValue, setInputValue] = useState(apiKey || "");
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-xl animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-primary">Enter your OpenRouter API Key</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Your API key is stored locally and never sent to our servers.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type={isVisible ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="sk-or-v1-xxxxx..."
            className="pl-10 pr-24 py-6 floating-input"
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
          disabled={!inputValue.trim()}
        >
          Connect
        </Button>
        
        <div className="text-xs text-center text-muted-foreground mt-4">
          Default API key is already provided for demonstration.
        </div>
      </form>
    </div>
  );
};
