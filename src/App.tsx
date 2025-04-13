
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Admin from "./pages/Admin";
import { useState, useEffect } from "react";
import TermsOfService from "./components/TermsOfService";
import { AuthProvider } from "./contexts/AuthContext";

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
        <AuthProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <TermsOfService open={showTerms} onAccept={handleAcceptTerms} />
              {!showTerms && (
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              )}
            </TooltipProvider>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
