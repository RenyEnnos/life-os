export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  name: string;
  chat(messages: ChatMessage[]): Promise<string>;
  generateText(prompt: string): Promise<string>;
}

export interface AICacheEntry {
  id: string;
  user_id: string;
  function_name: string;
  input_hash: string;
  output: unknown;
  updated_at: string;
}

export interface AILogEntry {
  id: string;
  user_id: string;
  function_name: string;
  tokens_used: number;
  response_time_ms: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}
