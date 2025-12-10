import type { Chat, Message } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  newTitle?: string;
}

export async function fetchChats(): Promise<Chat[]> {
  const res = await fetch(`${API_URL}/api/chats`);
  if (!res.ok) throw new Error('Failed to fetch chats');
  return res.json();
}

export async function createChat(): Promise<Chat> {
  const res = await fetch(`${API_URL}/api/chats`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to create chat');
  return res.json();
}

export async function deleteChat(chatId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete chat');
}

export async function fetchMessages(chatId: string): Promise<Message[]> {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(
  chatId: string,
  message: string
): Promise<SendMessageResponse> {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}
