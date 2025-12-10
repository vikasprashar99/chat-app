# AI Chat Bot with Personality Profiles

A chatbot application that learns from conversations and can generate personality profiles based on chat history.

## Features

- 💬 Multiple chat conversations
- 🤖 AI-powered responses using Google Gemini
- 🧠 Personality profile generation - ask "Who am I?" to get insights
- 💾 Persistent storage with Turso DB
- 🎨 Clean UI with Shadcn components

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express + TypeScript (ESM)
- **Database**: Turso (libSQL)
- **AI**: Google Gemini API

## Project Structure

```
chat-bot-rag/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
└── server/          # Node.js backend
    ├── src/
    │   ├── index.ts
    │   ├── db.ts
    │   ├── ai.ts
    │   └── types.ts
    └── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- Turso account and database
- Google Gemini API key

### Server Setup

1. Navigate to server directory:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file:
   ```env
   TURSO_DATABASE_URL=your_turso_url
   TURSO_AUTH_TOKEN=your_turso_token
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

### Client Setup

1. Navigate to client directory:
   ```bash
   cd client
   npm install
   ```

2. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. Start the client:
   ```bash
   npm run dev
   ```

## Running Tests

```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test
```

## How Personality Profiles Work

When you ask questions like:
- "Who am I?"
- "Tell me about myself"
- "What do you know about me?"
- "Describe me"

The app fetches all your previous messages from the database and uses Gemini to analyze your communication style, interests, and personality traits.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chats | Get all chats |
| POST | /api/chats | Create new chat |
| DELETE | /api/chats/:id | Delete a chat |
| GET | /api/chats/:id/messages | Get messages for a chat |
| POST | /api/chats/:id/messages | Send a message |
