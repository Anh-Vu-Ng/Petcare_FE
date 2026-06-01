export type Role = 'user' | 'assistant' | 'system';

export interface ContextDoc {
  source: string;
  content: string;
  rrf_score?: number;
  rerank_score?: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  intent?: string;
  from_cache?: boolean;
  elapsed_time?: number;
  num_docs?: number;
  context_docs?: ContextDoc[];
  price_data?: string;
  timing?: Record<string, number>;
  standalone_query?: string;
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
  answer?: string;
  message?: string; // Fallback for dev mode / mock response
  intent?: string;
  from_cache?: boolean;
  elapsed_time?: number;
  num_docs?: number;
  context_docs?: ContextDoc[];
  price_data?: string;
  timing?: Record<string, number>;
  standalone_query?: string;
}
