
import React, { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const Welcome: React.FC = () => {
  const { apiKey, setApiKey } = useChat();
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState("");
  const defaultApiKey = "YOUR_API_KEY"; // API key redacted

  // Valid access codes (16 characters each)
  const validAccessCodes = [
    "a1b2c3d4e5f6g7h8",
    "i9j0k1l2m3n4o5p6",
    "q7r8s9t0u1v2w3x4",
    "y5z6a7b8c9d0e1f2",
    "g3h4i5j6k7l8m9n0",
    "o1p2q3r4s5t6u7v8",
    "w9x0y1z2a3b4c5d6",
    "e7f8g9h0i1j2k3l4",
    "m5n6o7p8q9r0s1t2",
    "u3v4w5x6y7z8a9b0"
  ];

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

  // Only redirect to chat if access code is valid and terms are accepted
  if (apiKey && animationComplete && validAccessCodes.includes(accessCode) && cookiesAccepted && tosAccepted) {
    return <Navigate to="/chat" />;
  }

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validAccessCodes.includes(accessCode)) {
      setApiKey(defaultApiKey);
      setError("");
    } else {
      setError("Invalid access code. Please try again.");
    }
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
            className="w-24 h-24 mb-4 object-contain"
          />
        </div>
      ) : (
        <div className="max-w-2xl w-full mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 animate-float flex items-center justify-center">
              <img 
                src="/lovable-uploads/6c6c0bb8-75ce-4564-b83c-9893d315e7a6.png" 
                alt="REFLEX AI" 
                className="w-full h-full object-contain"
              />
            </div>
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
              
              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter access code (16 characters)"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full py-6 floating-input"
                    maxLength={16}
                  />
                  {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cookies" 
                      checked={cookiesAccepted} 
                      onCheckedChange={(checked) => setCookiesAccepted(checked as boolean)} 
                    />
                    <label htmlFor="cookies" className="text-sm text-muted-foreground cursor-pointer">
                      I accept cookies and data collection for service improvement
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tos" 
                      checked={tosAccepted} 
                      onCheckedChange={(checked) => setTosAccepted(checked as boolean)} 
                    />
                    <label htmlFor="tos" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
                  disabled={!accessCode || !cookiesAccepted || !tosAccepted}
                >
                  Access Chat
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="space-y-2">
              <p>Powered by OpenRouter AI - Images and text are processed via their API</p>
              <p>Your data is collected and processed according to our Privacy Policy</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
