
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatState, Message, MessageContent, AIModelResponse } from "../types/chat";

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
  addStaticMessage: (message: { role: string; content: MessageContent[] }) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (state.apiKey) {
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
  const addStaticMessage = (message: { role: string; content: MessageContent[] }) => {
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
        content: [{ type: "text", text: "Thinking..." }],
        createdAt: new Date(),
        isPending: true,
      };
      
      dispatch({ type: "ADD_MESSAGE", payload: pendingMessage });
      dispatch({ type: "SET_LOADING", payload: true });

      // Get all previous messages for context (excluding the pending message)
      const previousMessages = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Create the API messages array
      const apiMessages = [
        ...previousMessages,
        {
          role: "user",
          content
        }
      ];

      // Call the API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${state.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "REFLEX AI Nexus",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-thinking-exp-1219:free",
          messages: apiMessages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from AI");
      }

      const data: AIModelResponse = await response.json();
      let aiResponse = data.choices[0].message.content;

      // If dual verification is enabled, verify the response with a second API call
      if (state.dualVerification) {
        // Update the pending message to show verification in progress
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            id: pendingMessageId,
            updates: {
              content: [{ type: "text", text: "Verifying response..." }]
            }
          }
        });

        // Call OpenAI API to verify
        const verificationResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${state.apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "REFLEX AI Nexus",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "anthropic/claude-3-haiku:latest",
            messages: [
              {
                role: "system",
                content: [{ 
                  type: "text", 
                  text: "You are a verification assistant. Your job is to review AI responses for accuracy and clarity. If there are issues with the response, fix them. Return the improved response or confirm the original if it's accurate." 
                }]
              },
              {
                role: "user",
                content: [{ 
                  type: "text", 
                  text: `Please verify this AI response for accuracy and clarity: "${aiResponse}"` 
                }]
              }
            ]
          })
        });

        if (verificationResponse.ok) {
          const verificationData: AIModelResponse = await verificationResponse.json();
          aiResponse = verificationData.choices[0].message.content;
        }
      }

      // Update the AI message with the response
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          id: pendingMessageId,
          updates: {
            content: [{ type: "text", text: aiResponse }],
            isPending: false
          }
        }
      });
      
    } catch (error) {
      // Update the pending message to show the error
      const pendingMessage = state.messages.find(msg => msg.isPending);
      if (pendingMessage) {
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: {
            id: pendingMessage.id,
            updates: {
              content: [{ type: "text", text: "Error occurred. Please try again." }],
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
