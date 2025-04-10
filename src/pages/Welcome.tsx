
import React, { useState, useEffect } from "react";
import { ApiKeyInput } from "../components/ApiKeyInput";
import { useChat } from "../contexts/ChatContext";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Welcome: React.FC = () => {
  const { apiKey } = useChat();
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Simulate loading for the intro animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // After loading, start the main animation
    if (!loading) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Redirect to chat if API key is already set and animation is done
  if (apiKey && animationComplete) {
    return <Navigate to="/chat" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {loading ? (
        // Initial loading animation
        <div className="animate-pulse">
          <img 
            src="/lovable-uploads/a2940193-64b8-463b-8771-5bccc5f77c25.png" 
            alt="REFLEX AI" 
            className="w-24 h-24 mb-4"
          />
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto">
          {/* Logo and title animation */}
          <div className="text-center mb-8 animate-fade-in">
            <img 
              src="/lovable-uploads/a2940193-64b8-463b-8771-5bccc5f77c25.png" 
              alt="REFLEX AI" 
              className="w-24 h-24 mx-auto mb-6 animate-float"
            />
            <h1 className="text-4xl font-bold text-gradient mb-2">REFLEX AI Nexus</h1>
            <p className="text-muted-foreground">Your advanced AI chat assistant</p>
          </div>

          {/* Feature highlights */}
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

          {/* API key input */}
          <div 
            className="animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <ApiKeyInput />
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "800ms" }}>
            <p>Powered by OpenRouter AI - Images and text are processed via their API</p>
            <p className="mt-1">Default API key: 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</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
