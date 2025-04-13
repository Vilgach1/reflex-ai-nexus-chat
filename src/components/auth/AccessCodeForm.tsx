
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AccessCodeFormProps {
  onAccessGranted: () => void;
  cookiesAccepted: boolean;
  tosAccepted: boolean;
  setCookiesAccepted: (accepted: boolean) => void;
  setTosAccepted: (accepted: boolean) => void;
  validAccessCodes: string[];
  setApiKey: (key: string) => void;
  defaultApiKey: string;
}

const AccessCodeForm: React.FC<AccessCodeFormProps> = ({
  onAccessGranted,
  cookiesAccepted,
  tosAccepted,
  setCookiesAccepted,
  setTosAccepted,
  validAccessCodes,
  setApiKey,
  defaultApiKey
}) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validAccessCodes.includes(accessCode)) {
      setApiKey(defaultApiKey);
      setError("");
      onAccessGranted();
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  return (
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
  );
};

export default AccessCodeForm;
