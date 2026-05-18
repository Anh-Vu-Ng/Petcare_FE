export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: Message[];
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  message: string;
  // If the backend also returns sources or other metadata, we can add them here
  sources?: any[];
}
