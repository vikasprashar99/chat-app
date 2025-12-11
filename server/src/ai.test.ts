import { describe, it, expect } from 'vitest';
import { isPersonalityQuery } from './ai.js';

describe('AI Service', () => {
  describe('isPersonalityQuery', () => {
    it('should detect "who am i" as personality query', () => {
      expect(isPersonalityQuery('Who am I?')).toBe(true);
      expect(isPersonalityQuery('who am i')).toBe(true);
    });

    it('should detect "tell me about myself" as personality query', () => {
      expect(isPersonalityQuery('Tell me about myself')).toBe(true);
    });

    it('should detect "what do you know about me" as personality query', () => {
      expect(isPersonalityQuery('What do you know about me?')).toBe(true);
    });

    it('should detect "describe me" as personality query', () => {
      expect(isPersonalityQuery('Describe me')).toBe(true);
    });

    it('should detect "my personality" as personality query', () => {
      expect(isPersonalityQuery('What is my personality?')).toBe(true);
    });

    it('should NOT detect regular messages as personality queries', () => {
      expect(isPersonalityQuery('Hello')).toBe(false);
      expect(isPersonalityQuery('What is the weather?')).toBe(false);
      expect(isPersonalityQuery('Tell me a joke')).toBe(false);
      expect(isPersonalityQuery('Who is the president?')).toBe(false);
    });
  });
});
