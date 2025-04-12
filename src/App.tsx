
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import TermsOfService from "./components/TermsOfService";

const queryClient = new QueryClient();

const App = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  useEffect(() => {
    // Check if terms have been accepted before
    const accepted = localStorage.getItem("termsAccepted");
    if (accepted === "true") {
      setTermsAccepted(true);
      setShowTerms(false);
    }
  }, []);
  
  const handleAcceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    setTermsAccepted(true);
    setShowTerms(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <TermsOfService open={showTerms} onAccept={handleAcceptTerms} />
            {!showTerms && (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Chat />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            )}
          </TooltipProvider>
        </ChatProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
