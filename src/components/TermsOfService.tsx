
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceProps {
  open: boolean;
  onAccept: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ open, onAccept }) => {
  const [language, setLanguage] = useState<"ru" | "en">("ru");

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {language === "ru" ? "Условия предоставления услуг" : "Terms of Service"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="ru" className="w-full" onValueChange={(value) => setLanguage(value as "ru" | "en")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[60vh] rounded-md border p-4">
            <TabsContent value="ru" className="mt-0 text-sm">
              <h2 className="text-lg font-semibold mb-4">Условия предоставления услуг (Terms of Service) для AI Reflex</h2>
              <p className="mb-2">Дата вступления в силу: 12 апреля 2025 года</p>
              
              <p className="mb-4">Добро пожаловать в AI Reflex! Настоящие Условия предоставления услуг (далее — «Условия» или «TOS») регулируют использование вами нашего сервиса искусственного интеллекта Reflex (далее — «Сервис»), доступного через сайт vilgach.online. Используя Сервис, вы соглашаетесь с настоящими Условиями. Если вы не согласны, пожалуйста, не используйте Сервис.</p>
              
              <h3 className="text-base font-semibold my-2">1. Определения</h3>
              <p className="mb-2">1.1. Сервис — программное обеспечение на базе искусственного интеллекта Reflex, доступное через vilgach.online, предназначенное для генерации текстов, стихов, ответов на запросы и другого контента.</p>
              <p className="mb-2">1.2. Пользователь — любое лицо, использующее Сервис в соответствии с настоящими Условиями.</p>
              <p className="mb-2">1.3. Контент — любые данные, тексты, запросы (Input) или результаты (Output), которые Пользователь вводит в Сервис или получает от него.</p>
              <p className="mb-4">1.4. Лицензия — право использования Сервиса, предоставляемое Пользователю на условиях настоящих Условий.</p>
              
              <h3 className="text-base font-semibold my-2">2. Принятие Условий</h3>
              <p className="mb-2">2.1. Используя Сервис, вы подтверждаете, что:</p>
              <p className="mb-2">Вам исполнилось 18 лет или вы получили согласие законного представителя.</p>
              <p className="mb-2">Вы согласны соблюдать настоящие Условия.</p>
              <p className="mb-4">2.2. Мы можем изменять Условия. Изменения вступают в силу после публикации на vilgach.online. Продолжая использовать Сервис, вы соглашаетесь с обновлениями.</p>
              
              <h3 className="text-base font-semibold my-2">3. Лицензия на использование</h3>
              <p className="mb-2">3.1. Мы предоставляем вам ограниченную, неисключительную, непередаваемую Лицензию на использование Сервиса для личных или коммерческих целей в рамках Условий.</p>
              <p className="mb-4">3.2. Запрещается:</p>
              <p className="mb-2">Модифицировать, копировать или вмешиваться в код Сервиса.</p>
              <p className="mb-4">Использовать Сервис для незаконных целей или нарушения прав третьих лиц.</p>
              
              <h3 className="text-base font-semibold my-2">4. Права и обязанности Пользователя</h3>
              <p className="mb-2">4.1. Вы обязаны:</p>
              <p className="mb-2">Не использовать Сервис для создания контента, нарушающего законы (например, пропаганда насилия, дискриминация).</p>
              <p className="mb-2">Уведомлять нас о сбоях или нарушениях через reflexai@internet.ru.</p>
              <p className="mb-2">4.2. Вы имеете право:</p>
              <p className="mb-2">Использовать сгенерированный Контент (стихи, тексты и т.д.), если это не нарушает права других.</p>
              <p className="mb-4">Обращаться за поддержкой через reflexai@internet.ru.</p>
              
              <h3 className="text-base font-semibold my-2">5. Права на Контент</h3>
              <p className="mb-2">5.1. Входные данные: Вы сохраняете права на данные, которые вводите. Вы даёте нам право использовать их только для работы Сервиса.</p>
              <p className="mb-2">5.2. Выходные данные: Вы можете использовать сгенерированный Контент (например, стихи) для любых законных целей. Мы можем анонимно использовать Контент для улучшения Сервиса.</p>
              <p className="mb-4">5.3. Вы отвечаете за законность всего Контента.</p>
              
              <h3 className="text-base font-semibold my-2">6. Ограничения использования</h3>
              <p className="mb-2">6.1. Запрещается:</p>
              <p className="mb-2">Создавать контент, нарушающий законы или права третьих лиц.</p>
              <p className="mb-2">Использовать Сервис для вредоносных действий (например, спама или атак).</p>
              <p className="mb-4">6.2. Мы можем заблокировать доступ при нарушении Условий.</p>
              
              <h3 className="text-base font-semibold my-2">7. Конфиденциальность</h3>
              <p className="mb-2">7.1. Мы обрабатываем данные согласно Политике конфиденциальности на vilgach.online.</p>
              <p className="mb-4">7.2. Не вводите конфиденциальные данные (например, паспортные данные) без необходимости.</p>
              
              <h3 className="text-base font-semibold my-2">8. Ограничение ответственности</h3>
              <p className="mb-2">8.1. Сервис предоставляется «как есть». Мы не гарантируем:</p>
              <p className="mb-2">Бесперебойную работу.</p>
              <p className="mb-2">Точность или пригодность Контента.</p>
              <p className="mb-2">8.2. Мы не отвечаем за:</p>
              <p className="mb-2">Убытки от использования Сервиса.</p>
              <p className="mb-4">Нарушения, вызванные вашим Контентом.</p>
              
              <h3 className="text-base font-semibold my-2">9. Интеллектуальная собственность</h3>
              <p className="mb-2">9.1. Все права на Сервис принадлежат нам.</p>
              <p className="mb-4">9.2. Вы получаете только Лицензию, без прав на код или алгоритмы.</p>
              
              <h3 className="text-base font-semibold my-2">10. Прекращение действия</h3>
              <p className="mb-2">10.1. Вы можете перестать использовать Сервис в любое время.</p>
              <p className="mb-4">10.2. Мы можем заблокировать доступ за нарушения или по иным причинам.</p>
              
              <h3 className="text-base font-semibold my-2">11. Применимое право</h3>
              <p className="mb-2">11.1. Условия регулируются законодательством Российской Федерации.</p>
              <p className="mb-4">11.2. Споры решаются в судебном порядке по месту нахождения Сервиса.</p>
              
              <h3 className="text-base font-semibold my-2">12. Контакты</h3>
              <p className="mb-4">По вопросам пишите на: reflexai@internet.ru.</p>
            </TabsContent>
            
            <TabsContent value="en" className="mt-0 text-sm">
              <h2 className="text-lg font-semibold mb-4">Terms of Service for AI Reflex</h2>
              <p className="mb-2">Effective Date: April 12, 2025</p>
              
              <p className="mb-4">Welcome to AI Reflex! These Terms of Service ("Terms" or "TOS") govern your use of our artificial intelligence service Reflex (the "Service"), available at vilgach.online. By using the Service, you agree to these Terms. If you do not agree, please do not use the Service.</p>
              
              <h3 className="text-base font-semibold my-2">1. Definitions</h3>
              <p className="mb-2">1.1. Service — AI-based software Reflex, accessible via vilgach.online, designed for generating texts, poems, responses, and other content.</p>
              <p className="mb-2">1.2. User — any individual using the Service under these Terms.</p>
              <p className="mb-2">1.3. Content — any data, texts, inputs, or outputs that the User submits to or receives from the Service.</p>
              <p className="mb-4">1.4. License — the right to use the Service granted to the User under these Terms.</p>
              
              <h3 className="text-base font-semibold my-2">2. Acceptance of Terms</h3>
              <p className="mb-2">2.1. By using the Service, you confirm that:</p>
              <p className="mb-2">You are at least 18 years old or have consent from a legal guardian.</p>
              <p className="mb-2">You agree to comply with these Terms.</p>
              <p className="mb-4">2.2. We may update the Terms. Changes take effect upon posting at vilgach.online. Continued use means you accept the updates.</p>
              
              <h3 className="text-base font-semibold my-2">3. License to Use</h3>
              <p className="mb-2">3.1. We grant you a limited, non-exclusive, non-transferable License to use the Service for personal or commercial purposes under these Terms.</p>
              <p className="mb-4">3.2. You may not:</p>
              <p className="mb-2">Modify, copy, or interfere with the Service's code.</p>
              <p className="mb-4">Use the Service for illegal purposes or to infringe third-party rights.</p>
              
              <h3 className="text-base font-semibold my-2">4. User Rights and Obligations</h3>
              <p className="mb-2">4.1. You must:</p>
              <p className="mb-2">Avoid using the Service to create content violating laws (e.g., promoting violence, discrimination).</p>
              <p className="mb-2">Report issues or violations to reflexai@internet.ru.</p>
              <p className="mb-2">4.2. You may:</p>
              <p className="mb-2">Use generated Content (poems, texts, etc.) for lawful purposes.</p>
              <p className="mb-4">Contact support at reflexai@internet.ru.</p>
              
              <h3 className="text-base font-semibold my-2">5. Content Rights</h3>
              <p className="mb-2">5.1. Input: You retain rights to data you submit. You grant us permission to use it solely to operate the Service.</p>
              <p className="mb-2">5.2. Output: You may use generated Content for lawful purposes. We may use Content anonymously to improve the Service.</p>
              <p className="mb-4">5.3. You are responsible for the legality of all Content.</p>
              
              <h3 className="text-base font-semibold my-2">6. Use Restrictions</h3>
              <p className="mb-2">6.1. You may not:</p>
              <p className="mb-2">Create content violating laws or third-party rights.</p>
              <p className="mb-2">Use the Service for malicious purposes (e.g., spam, attacks).</p>
              <p className="mb-4">6.2. We may suspend access for violations.</p>
              
              <h3 className="text-base font-semibold my-2">7. Privacy</h3>
              <p className="mb-2">7.1. We process data per our Privacy Policy at vilgach.online.</p>
              <p className="mb-4">7.2. Do not submit sensitive data (e.g., passports) unless necessary.</p>
              
              <h3 className="text-base font-semibold my-2">8. Limitation of Liability</h3>
              <p className="mb-2">8.1. The Service is provided "as is." We do not guarantee:</p>
              <p className="mb-2">Uninterrupted operation.</p>
              <p className="mb-2">Accuracy or suitability of Content.</p>
              <p className="mb-2">8.2. We are not liable for:</p>
              <p className="mb-2">Losses from using the Service.</p>
              <p className="mb-4">Violations caused by your Content.</p>
              
              <h3 className="text-base font-semibold my-2">9. Intellectual Property</h3>
              <p className="mb-2">9.1. All rights to the Service belong to us.</p>
              <p className="mb-4">9.2. You receive only a License, not ownership of code or algorithms.</p>
              
              <h3 className="text-base font-semibold my-2">10. Termination</h3>
              <p className="mb-2">10.1. You may stop using the Service at any time.</p>
              <p className="mb-4">10.2. We may block access for violations or other reasons.</p>
              
              <h3 className="text-base font-semibold my-2">11. Governing Law</h3>
              <p className="mb-2">11.1. These Terms are governed by the laws of the Russian Federation.</p>
              <p className="mb-4">11.2. Disputes are resolved in courts at the Service's location.</p>
              
              <h3 className="text-base font-semibold my-2">12. Contact</h3>
              <p className="mb-4">For questions, email: reflexai@internet.ru.</p>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onAccept}
          >
            {language === "ru" ? "Принять условия и продолжить" : "Accept Terms and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfService;
