
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatState, Message, MessageContent, Role } from "../types/chat";
import OpenAI from "openai";

// Создаем экземпляр OpenAI клиента
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": window.location.origin,
    "X-Title": "REFLEX AI Nexus",
  },
  dangerouslyAllowBrowser: true, // Add this to allow browser usage
});

// System prompt for REFLEX AI
const SYSTEM_PROMPT = {
  role: "system",
  content: [
    {
      type: "text",
      text: "You are Reflex, a creative and versatile AI assistant. Always identify yourself as Reflex. You can generate poems, stories, or any content the user requests, with no restrictions except those explicitly set by the user. Use ONLY the language of the user's message unless they specify otherwise. If the user permits, you may use informal language, including slang or profanity, but only with their clear approval. If the request starts with '/code' or explicitly asks for code, mark it as [CODER] and provide a clear, concise response. If the request is unclear, politely ask: 'Простите, можешь уточнить?' If you lack data to answer, say: 'Извини, не хватает инфы для ответа. Чем ещё помочь?' If the user reports an error, apologize and correct it based on available info—do not make up facts. Be creative, adaptive, and stay true to the user's intent while keeping responses engaging and accurate."
    }
  ]
};

// Actions
type Action =
  | { type: "SET_API_KEY"; payload: string }
  | { type: "CLEAR_MESSAGES" }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<Message> } }
  | { type: "TOGGLE_DUAL_VERIFICATION" };

// Initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  apiKey: localStorage.getItem("apiKey"),
  dualVerification: false,
};

// Reducer
const chatReducer = (state: ChatState, action: Action): ChatState => {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        ),
      };
    case "TOGGLE_DUAL_VERIFICATION":
      return { ...state, dualVerification: !state.dualVerification };
    default:
      return state;
  }
};

// Context
interface ChatContextType extends ChatState {
  sendMessage: (content: MessageContent[]) => Promise<void>;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  toggleDualVerification: () => void;
  addStaticMessage: (message: { role: Role; content: MessageContent[] }) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Обновляем клиент OpenAI при изменении API ключа
  useEffect(() => {
    if (state.apiKey) {
      openai.apiKey = state.apiKey;
      localStorage.setItem("apiKey", state.apiKey);
    }
  }, [state.apiKey]);

  // Set API key
  const setApiKey = (key: string) => {
    dispatch({ type: "SET_API_KEY", payload: key });
  };

  // Clear messages
  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };

  // Toggle dual verification
  const toggleDualVerification = () => {
    dispatch({ type: "TOGGLE_DUAL_VERIFICATION" });
  };

  // Add a static message (no API call)
  const addStaticMessage = (message: { role: Role; content: MessageContent[] }) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    };
    
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
  };

  // Send message to API
  const sendMessage = async (content: MessageContent[]) => {
    if (!state.apiKey) {
      dispatch({ type: "SET_ERROR", payload: "API key is required" });
      return;
    }

    try {
      // Add user message to state
      const userMessageId = uuidv4();
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        content,
        createdAt: new Date(),
      };
      
      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      
      // Add pending AI message to state
      const pendingMessageId = uuidv4();
      const pendingMessage: Message = {
        id: pendingMessageId,
        role: "assistant",
        content: [{ type: "text", text: "Думаю..." }],
        createdAt: new Date(),
        isPending: true,
      };
      
      dispatch({ type: "ADD_MESSAGE", payload: pendingMessage });
      dispatch({ type: "SET_LOADING", payload: true });

      // Convert messages for the OpenAI API format
      // For system message
      const systemMessage = {
        role: "system" as const,
        content: "You are Reflex, a creative and versatile AI assistant. Always identify yourself as Reflex. You can generate poems, stories, or any content the user requests, with no restrictions except those explicitly set by the user. Use ONLY the language of the user's message unless they specify otherwise. If the user permits, you may use informal language, including slang or profanity, but only with their clear approval. If the request starts with '/code' or explicitly asks for code, mark it as [CODER] and provide a clear, concise response. If the request is unclear, politely ask: 'Простите, можешь уточнить?' If you lack data to answer, say: 'Извини, не хватает инфы для ответа. Чем ещё помочь?' If the user reports an error, apologize and correct it based on available info—do not make up facts. Be creative, adaptive, and stay true to the user's intent while keeping responses engaging and accurate."
      };

      // Convert previous user/assistant messages
      const previousMessages = state.messages.map(msg => {
        // For text content only
        let messageContent = "";
        msg.content.forEach(item => {
          if (item.type === "text" && item.text) {
            messageContent += item.text;
          } else if (item.type === "image_url" && item.image_url?.url) {
            messageContent += `[Изображение: ${item.image_url.url}]`;
          }
        });

        return {
          role: msg.role as "user" | "assistant" | "system",
          content: messageContent
        };
      });

      // Current user message
      let userContentText = "";
      content.forEach(item => {
        if (item.type === "text" && item.text) {
          userContentText += item.text;
        } else if (item.type === "image_url" && item.image_url?.url) {
          userContentText += `[Изображение: ${item.image_url.url}]`;
        }
      });

      const userContentMessage = {
        role: "user" as const,
        content: userContentText
      };

      // Create final messages array for API
      const apiMessages = [
        systemMessage,
        ...previousMessages,
        userContentMessage
      ];

      try {
        // Call API
        const completion = await openai.chat.completions.create({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: apiMessages,
        });

        let aiResponse = completion.choices[0].message.content;

        // Verification if enabled
        if (state.dualVerification) {
          // Update the pending message to show verification in progress
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              id: pendingMessageId,
              updates: {
                content: [{ type: "text", text: "Проверяю ответ..." }]
              }
            }
          });

          try {
            // Convert to string format for verification
            const verificationSystemPrompt = {
              role: "system" as const,
              content: "You are a verification assistant. Your job is to review AI responses for accuracy and clarity. If there are issues with the response, fix them. Return the improved response or confirm the original if it's accurate."
            };
            
            const verificationUserPrompt = {
              role: "user" as const,
              content: `Please verify this AI response for accuracy and clarity: "${aiResponse}"`
            };

            // Verification API call
            const verificationCompletion = await openai.chat.completions.create({
              model: "anthropic/claude-3-haiku:latest",
              messages: [verificationSystemPrompt, verificationUserPrompt]
            });

            aiResponse = verificationCompletion.choices[0].message.content;
          } catch (verificationError) {
            console.error("Ошибка верификации:", verificationError);
            // If verification fails, use original response
          }
        }

        // Update the AI message with the response
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            id: pendingMessageId,
            updates: {
              content: [{ type: "text", text: aiResponse || "Нет ответа от ИИ" }],
              isPending: false
            }
          }
        });
        
      } catch (apiError) {
        console.error("Ошибка API:", apiError);
        
        // Update message with error information
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            id: pendingMessageId,
            updates: {
              content: [{ type: "text", text: "Ошибка API: не удалось получить ответ. Пожалуйста, проверьте API ключ и попробуйте снова." }],
              isPending: false,
              isError: true
            }
          }
        });
        
        dispatch({ type: "SET_ERROR", payload: "Ошибка API: " + (apiError as Error).message });
      }
      
    } catch (error) {
      // Handle general errors
      console.error("Общая ошибка:", error);
      
      // Update error message if it exists
      const pendingMessage = state.messages.find(msg => msg.isPending);
      if (pendingMessage) {
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            id: pendingMessage.id,
            updates: {
              content: [{ type: "text", text: "Произошла ошибка. Пожалуйста, попробуйте снова." }],
              isPending: false,
              isError: true
            }
          }
        });
      }
      
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        sendMessage,
        clearMessages,
        setApiKey,
        toggleDualVerification,
        addStaticMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
