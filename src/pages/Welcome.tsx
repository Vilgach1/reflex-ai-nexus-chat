
import React, { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import LoginForm from "@/components/auth/LoginForm";
import AccessCodeForm from "@/components/auth/AccessCodeForm";

const Welcome: React.FC = () => {
  const { apiKey, setApiKey } = useChat();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
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

  // Only redirect to chat if user is authenticated or access code is valid and terms are accepted
  if ((user || (apiKey && validAccessCodes.includes(apiKey))) && animationComplete && cookiesAccepted && tosAccepted) {
    // Set API key if not already set
    if (!apiKey && user) {
      setApiKey(defaultApiKey);
    }
    return <Navigate to="/chat" />;
  }

  const AuthTabsContent = () => (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="signin">Вход</TabsTrigger>
        <TabsTrigger value="accesscode">Код доступа</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <LoginForm 
          cookiesAccepted={cookiesAccepted}
          tosAccepted={tosAccepted}
          setCookiesAccepted={setCookiesAccepted}
          setTosAccepted={setTosAccepted}
          onLoginSuccess={() => setLoginOpen(false)}
        />
      </TabsContent>
      
      <TabsContent value="accesscode">
        <AccessCodeForm
          onAccessGranted={() => setLoginOpen(false)}
          cookiesAccepted={cookiesAccepted}
          tosAccepted={tosAccepted}
          setCookiesAccepted={setCookiesAccepted}
          setTosAccepted={setTosAccepted}
          validAccessCodes={validAccessCodes}
          setApiKey={setApiKey}
          defaultApiKey={defaultApiKey}
        />
      </TabsContent>
    </Tabs>
  );

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
            <p className="text-muted-foreground">Ваш продвинутый AI-ассистент для общения</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              {
                title: "Продвинутый Чат",
                description: "Общайтесь с современными AI-моделями с поддержкой текста и изображений",
                delay: 100
              },
              {
                title: "Режим Верификации",
                description: "Включите двойную AI-верификацию для более точных ответов",
                delay: 200
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
            className="animate-slide-up text-center"
            style={{ animationDelay: "500ms" }}
          >
            {isMobile ? (
              <Drawer open={loginOpen} onOpenChange={setLoginOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    className="w-full max-w-xs py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button text-lg"
                  >
                    Перейти в REFLEX
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-6">
                  <DrawerHeader className="mb-4">
                    <DrawerTitle>Авторизация</DrawerTitle>
                  </DrawerHeader>
                  <AuthTabsContent />
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full max-w-xs py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button text-lg"
                  >
                    Перейти в REFLEX
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle>Авторизация</DialogTitle>
                  </DialogHeader>
                  <AuthTabsContent />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="space-y-2">
              <p>Работает на OpenRouter AI - Изображения и текст обрабатываются через их API</p>
              <p>Ваши данные собираются и обрабатываются в соответствии с нашей Политикой конфиденциальности</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
