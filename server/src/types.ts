export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  newTitle?: string;
}
