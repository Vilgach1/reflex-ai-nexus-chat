
import React, { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

export const ApiKeyInput: React.FC = () => {
  const { setApiKey, apiKey } = useChat();
  const [inputValue, setInputValue] = useState(apiKey || "");
  const [isVisible, setIsVisible] = useState(false);
  const defaultApiKey = "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";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
    } else {
      // If input is empty, use the default key
      setApiKey(defaultApiKey);
    }
  };

  const handleUseDefault = () => {
    setApiKey(defaultApiKey);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type={isVisible ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter custom API key (optional)"
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
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={handleUseDefault}
            className="flex-1 py-6 bg-secondary/50 hover:bg-secondary transition-all duration-300 rounded-lg"
          >
            Use Default Key
          </Button>
          
          <Button 
            type="submit" 
            className="flex-1 py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
            disabled={!inputValue.trim() && !defaultApiKey}
          >
            Connect
          </Button>
        </div>
      </form>
    </div>
  );
};
