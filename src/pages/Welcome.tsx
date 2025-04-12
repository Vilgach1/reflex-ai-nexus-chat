
import React, { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Google, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Welcome: React.FC = () => {
  const { apiKey, setApiKey } = useChat();
  const { user, loading: authLoading, signIn, signUp, googleSignIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState("");
  const defaultApiKey = "YOUR_API_KEY"; // API key redacted
  
  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

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
  if ((user || (apiKey && validAccessCodes.includes(accessCode))) && animationComplete && cookiesAccepted && tosAccepted) {
    // Set API key if not already set
    if (!apiKey && user) {
      setApiKey(defaultApiKey);
    }
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email || !password) {
      setAuthError("Пожалуйста, заполните все поля");
      return;
    }
    
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email || !password || !confirmPassword) {
      setAuthError("Пожалуйста, заполните все поля");
      return;
    }
    
    if (password !== confirmPassword) {
      setAuthError("Пароли не совпадают");
      return;
    }
    
    if (password.length < 6) {
      setAuthError("Пароль должен содержать не менее 6 символов");
      return;
    }
    
    const { error } = await signUp(email, password);
    if (error) {
      setAuthError(error.message);
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
            <p className="text-muted-foreground">Ваш продвинутый AI-ассистент для общения</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
              },
              {
                title: "Красивый Интерфейс",
                description: "Наслаждайтесь элегантным, минималистичным дизайном с эффектами стекломорфизма",
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
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Вход</TabsTrigger>
                  <TabsTrigger value="signup">Регистрация</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Электронная почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-6 floating-input"
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-6 floating-input"
                      />
                    </div>
                    
                    {authError && (
                      <p className="text-destructive text-sm mt-1">{authError}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="cookies" 
                          checked={cookiesAccepted} 
                          onCheckedChange={(checked) => setCookiesAccepted(checked as boolean)} 
                        />
                        <label htmlFor="cookies" className="text-sm text-muted-foreground cursor-pointer">
                          Я принимаю использование cookies и сбор данных для улучшения сервиса
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tos" 
                          checked={tosAccepted} 
                          onCheckedChange={(checked) => setTosAccepted(checked as boolean)} 
                        />
                        <label htmlFor="tos" className="text-sm text-muted-foreground cursor-pointer">
                          Я согласен с Условиями использования и Политикой конфиденциальности
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
                      disabled={!cookiesAccepted || !tosAccepted || authLoading}
                    >
                      {authLoading ? "Вход..." : "Войти"}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Или</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={googleSignIn}
                      className="w-full py-6 transition-all duration-300 rounded-lg"
                      disabled={!cookiesAccepted || !tosAccepted}
                    >
                      <Google className="mr-2 h-4 w-4" /> Войти через Google
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Электронная почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-6 floating-input"
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full py-6 floating-input"
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-6 floating-input"
                      />
                    </div>
                    
                    {authError && (
                      <p className="text-destructive text-sm mt-1">{authError}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="cookies-signup" 
                          checked={cookiesAccepted} 
                          onCheckedChange={(checked) => setCookiesAccepted(checked as boolean)} 
                        />
                        <label htmlFor="cookies-signup" className="text-sm text-muted-foreground cursor-pointer">
                          Я принимаю использование cookies и сбор данных для улучшения сервиса
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tos-signup" 
                          checked={tosAccepted} 
                          onCheckedChange={(checked) => setTosAccepted(checked as boolean)} 
                        />
                        <label htmlFor="tos-signup" className="text-sm text-muted-foreground cursor-pointer">
                          Я согласен с Условиями использования и Политикой конфиденциальности
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
                      disabled={!cookiesAccepted || !tosAccepted || authLoading}
                    >
                      {authLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Или</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={googleSignIn}
                      className="w-full py-6 transition-all duration-300 rounded-lg"
                      disabled={!cookiesAccepted || !tosAccepted}
                    >
                      <Google className="mr-2 h-4 w-4" /> Войти через Google
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="accesscode">
                  <form onSubmit={handleAccessSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Введите код доступа (16 символов)"
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
                          id="cookies-code" 
                          checked={cookiesAccepted} 
                          onCheckedChange={(checked) => setCookiesAccepted(checked as boolean)} 
                        />
                        <label htmlFor="cookies-code" className="text-sm text-muted-foreground cursor-pointer">
                          Я принимаю использование cookies и сбор данных для улучшения сервиса
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tos-code" 
                          checked={tosAccepted} 
                          onCheckedChange={(checked) => setTosAccepted(checked as boolean)} 
                        />
                        <label htmlFor="tos-code" className="text-sm text-muted-foreground cursor-pointer">
                          Я согласен с Условиями использования и Политикой конфиденциальности
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full py-6 bg-primary/90 hover:bg-primary transition-all duration-300 rounded-lg floating-button"
                      disabled={!accessCode || !cookiesAccepted || !tosAccepted}
                    >
                      Получить доступ к чату
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
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
