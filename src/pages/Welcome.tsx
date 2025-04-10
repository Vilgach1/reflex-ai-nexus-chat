import React, { useState, useEffect } from "react";
import { ApiKeyInput } from "../components/ApiKeyInput";
import { useChat } from "../contexts/ChatContext";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import BrandTelegram from "../components/icons/BrandTelegram";

const Welcome: React.FC = () => {
  const { apiKey, setApiKey } = useChat();
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const defaultApiKey = "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";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (!apiKey && !loading) {
      setApiKey(defaultApiKey);
    }
  }, [apiKey, loading, setApiKey, defaultApiKey]);

  if (apiKey && animationComplete) {
    return <Navigate to="/chat" />;
  }

  const handleTelegramAuth = () => {
    setApiKey(defaultApiKey);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {loading ? (
        <div className="animate-pulse">
          <img 
            src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" 
            alt="REFLEX AI" 
            className="w-24 h-24 mb-4"
          />
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <img 
              src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" 
              alt="REFLEX AI" 
              className="w-24 h-24 mx-auto mb-6 animate-float"
            />
            <h1 className="text-4xl font-bold text-gradient mb-2">REFLEX AI Nexus</h1>
            <p className="text-muted-foreground">Your advanced AI chat assistant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: "Advanced Chat",
                description: "Chat with state-of-the-art AI models with text and image support",
                delay: 100
              },
              {
                title: "Verification Mode",
                description: "Enable dual AI verification for more accurate responses",
                delay: 200
              },
              {
                title: "Beautiful Interface",
                description: "Enjoy a sleek, minimalist design with glass-morphism effects",
                delay: 300
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-panel p-6 rounded-xl animate-fade-in"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div 
            className="animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-xl animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-primary">Enter REFLEX AI</h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleTelegramAuth}
                  className="w-full py-6 bg-[#0088cc] hover:bg-[#0088cc]/90 transition-all duration-300 rounded-lg floating-button flex items-center justify-center gap-2"
                >
                  <BrandTelegram className="h-5 w-5" />
                  <span>Continue with Telegram</span>
                </Button>
                
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-border flex-grow"></div>
                  <span className="px-4 text-xs text-muted-foreground">or use an API key</span>
                  <div className="border-t border-border flex-grow"></div>
                </div>
                
                <ApiKeyInput />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "800ms" }}>
            <p>Powered by OpenRouter AI - Images and text are processed via their API</p>
            <p className="mt-1">Default API key already configured for you</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
