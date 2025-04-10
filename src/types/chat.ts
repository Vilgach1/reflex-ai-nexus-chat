
export type Role = "user" | "assistant" | "system";

export interface MessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface Message {
  id: string;
  role: Role;
  content: MessageContent[];
  createdAt: Date;
  isPending?: boolean;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  apiKey: string | null;
  dualVerification: boolean;
}

export interface AIModelResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
