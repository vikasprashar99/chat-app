import { createClient, type Client } from '@libsql/client';
import type { Chat, Message } from './types.js';

let db: Client | null = null;

export function initDB(url: string, authToken: string): Client {
  db = createClient({
    url,
    authToken,
  });
  return db;
}

export function getDB(): Client {
  if (!db) {
    throw new Error('Database not initialized. Call initDB first.');
  }
  return db;
}

export async function setupTables(): Promise<void> {
  const client = getDB();
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    )
  `);
}

export async function createChat(id: string, title: string): Promise<Chat> {
  const client = getDB();
  const created_at = new Date().toISOString();
  
  await client.execute({
    sql: 'INSERT INTO chats (id, title, created_at) VALUES (?, ?, ?)',
    args: [id, title, created_at],
  });
  
  return { id, title, created_at };
}

export async function getChats(): Promise<Chat[]> {
  const client = getDB();
  const result = await client.execute('SELECT * FROM chats ORDER BY created_at DESC');
  return result.rows.map(row => ({
    id: row.id as string,
    title: row.title as string,
    created_at: row.created_at as string,
  }));
}

export async function deleteChat(chatId: string): Promise<void> {
  const client = getDB();
  await client.execute({
    sql: 'DELETE FROM messages WHERE chat_id = ?',
    args: [chatId],
  });
  await client.execute({
    sql: 'DELETE FROM chats WHERE id = ?',
    args: [chatId],
  });
}

export async function addMessage(
  id: string,
  chatId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const client = getDB();
  const created_at = new Date().toISOString();
  
  await client.execute({
    sql: 'INSERT INTO messages (id, chat_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)',
    args: [id, chatId, role, content, created_at],
  });
  
  return { id, chat_id: chatId, role, content, created_at };
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const client = getDB();
  const result = await client.execute({
    sql: 'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
    args: [chatId],
  });
  
  return result.rows.map(row => ({
    id: row.id as string,
    chat_id: row.chat_id as string,
    role: row.role as 'user' | 'assistant',
    content: row.content as string,
    created_at: row.created_at as string,
  }));
}

export async function getAllUserMessages(): Promise<Message[]> {
  const client = getDB();
  const result = await client.execute(
    "SELECT * FROM messages WHERE role = 'user' ORDER BY created_at ASC"
  );
  
  return result.rows.map(row => ({
    id: row.id as string,
    chat_id: row.chat_id as string,
    role: row.role as 'user' | 'assistant',
    content: row.content as string,
    created_at: row.created_at as string,
  }));
}

export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  const client = getDB();
  await client.execute({
    sql: 'UPDATE chats SET title = ? WHERE id = ?',
    args: [title, chatId],
  });
}
