import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import {
  initDB,
  setupTables,
  createChat,
  getChats,
  deleteChat,
  addMessage,
  getMessages,
  updateChatTitle,
} from './db.js';
import {
  initAI,
  generateChatResponse,
  generatePersonalityProfile,
  isPersonalityQuery,
} from './ai.js';
import type { SendMessageRequest, SendMessageResponse } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB and AI
const dbUrl = process.env.TURSO_DATABASE_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;
const groqKey = process.env.GROQ_API_KEY;

if (!dbUrl || !dbToken) {
  console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
  process.exit(1);
}

if (!groqKey) {
  console.error('Missing GROQ_API_KEY');
  process.exit(1);
}

initDB(dbUrl, dbToken);
initAI(groqKey);

// Setup tables on startup
setupTables()
  .then(() => console.log('Database tables ready'))
  .catch(err => console.error('Failed to setup tables:', err));

// Routes

// Get all chats
app.get('/api/chats', async (_req, res) => {
  try {
    const chats = await getChats();
    res.json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

// Create a new chat
app.post('/api/chats', async (_req, res) => {
  try {
    const id = uuidv4();
    const chat = await createChat(id, 'New Chat');
    res.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Delete a chat
app.delete('/api/chats/:chatId', async (req, res) => {
  try {
    await deleteChat(req.params.chatId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// Get messages for a chat
app.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const messages = await getMessages(req.params.chatId);
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message and get AI response
app.post('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body as SendMessageRequest;

    if (!message?.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get existing messages for context
    const existingMessages = await getMessages(chatId);

    // Add user message
    const userMessage = await addMessage(uuidv4(), chatId, 'user', message);

    //title for first message
    let newTitle: string | undefined;
    if (existingMessages.length === 0) {
      newTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
      await updateChatTitle(chatId, newTitle);
    }

    // Check if this is a personality query
    let response: string;
    if (isPersonalityQuery(message)) {
      // Get only user messages from the current chat for personality profile
      const chatUserMessages = [...existingMessages, userMessage].filter(m => m.role === 'user');
      response = await generatePersonalityProfile(chatUserMessages);
    } else {
      response = await generateChatResponse(
        [...existingMessages, userMessage],
        message
      );
    }

    // Add assistant message
    const assistantMessage = await addMessage(
      uuidv4(),
      chatId,
      'assistant',
      response
    );

    const responseData: SendMessageResponse = {
      userMessage,
      assistantMessage,
      newTitle,
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
