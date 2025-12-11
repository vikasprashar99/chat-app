import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ChatMessage } from './ChatMessage';
import type { Message } from '@/types';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message: Message = {
      id: '1',
      chat_id: 'chat-1',
      role: 'user',
      content: 'Hello, how are you?',
      created_at: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const message: Message = {
      id: '2',
      chat_id: 'chat-1',
      role: 'assistant',
      content: 'I am doing well, thank you!',
      created_at: new Date().toISOString(),
    };

    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument();
  });
});
