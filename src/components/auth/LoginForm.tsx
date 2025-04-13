
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
  cookiesAccepted: boolean;
  tosAccepted: boolean;
  setCookiesAccepted: (accepted: boolean) => void;
  setTosAccepted: (accepted: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  cookiesAccepted,
  tosAccepted,
  setCookiesAccepted,
  setTosAccepted
}) => {
  const { signIn, signUp, googleSignIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

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
    } else if (onLoginSuccess) {
      onLoginSuccess();
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

  const handleGoogleSignIn = async () => {
    await googleSignIn();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
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
            onClick={handleGoogleSignIn}
            className="w-full py-6 transition-all duration-300 rounded-lg"
            disabled={!cookiesAccepted || !tosAccepted}
          >
            <Globe className="mr-2 h-4 w-4" /> Войти через Google
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
            onClick={handleGoogleSignIn}
            className="w-full py-6 transition-all duration-300 rounded-lg"
            disabled={!cookiesAccepted || !tosAccepted}
          >
            <Globe className="mr-2 h-4 w-4" /> Войти через Google
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
