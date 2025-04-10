
import React, { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { MessageContent } from "../types/chat";

interface ChatInputProps {
  onSendMessage: (content: MessageContent[]) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === "" && images.length === 0) return;
    
    const content: MessageContent[] = [];
    
    // Add text content if present
    if (message.trim() !== "") {
      content.push({
        type: "text",
        text: message.trim()
      });
    }
    
    // Add image content if present
    images.forEach(image => {
      content.push({
        type: "image_url",
        image_url: {
          url: image
        }
      });
    });
    
    onSendMessage(content);
    setMessage("");
    setImages([]);
    setShowImageUpload(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    setImages([...images, imageUrl]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="relative glass-panel rounded-xl">
        {showImageUpload && (
          <div className="p-2 border-b border-border">
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        )}
        
        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleImageUpload}
            className="h-9 w-9 rounded-full bg-primary/5 hover:bg-primary/10 ml-2 mb-2"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[200px] border-0 focus-visible:ring-0 resize-none bg-transparent p-3"
            disabled={disabled}
          />
          
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={disabled || (message.trim() === "" && images.length === 0)}
            className="h-9 w-9 rounded-full bg-primary/5 hover:bg-primary/10 mr-2 mb-2 floating-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
