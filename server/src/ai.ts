import Groq from 'groq-sdk';
import type { Message } from './types.js';

let groq: Groq | null = null;

export function initAI(apiKey: string): void {
  groq = new Groq({ apiKey });
}

function getAI(): Groq {
  if (!groq) {
    throw new Error('AI not initialized. Call initAI first.');
  }
  return groq;
}

export async function generateChatResponse(
  messages: Message[],
  userMessage: string
): Promise<string> {
  const client = getAI();

  const history = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Keep your responses concise and to the point. Avoid long explanations unless specifically asked.'
      },
      ...history,
      { role: 'user', content: userMessage }
    ],
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
}

export async function generatePersonalityProfile(
  userMessages: Message[]
): Promise<string> {
  const client = getAI();

  if (userMessages.length < 3) {
    return "I don't have enough conversation history to create a personality profile yet. Let's chat more, and I'll learn about you!";
  }

  const messagesText = userMessages
    .map(m => m.content)
    .join('\n---\n');

  const prompt = `Based on the following messages from a user, create a brief personality profile about them. 
Analyze their communication style, interests, and key personality traits.
Keep it concise - use short bullet points. Maximum 5-6 points total.

User messages:
${messagesText}

Create a brief "Who You Are" personality profile:`;

  const response = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not generate a personality profile.';
}

const PERSONALITY_PATTERNS = [
  /who am i/i,
  /tell me about myself/i,
  /what do you know about me/i,
  /describe me/i,
  /my personality/i,
  /what have you learned about me/i,
  /what kind of person am i/i,
  /analyze me/i,
];

export function isPersonalityQuery(message: string): boolean {
  return PERSONALITY_PATTERNS.some(pattern => pattern.test(message));
}
