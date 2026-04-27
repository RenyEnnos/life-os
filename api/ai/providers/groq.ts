import Groq from 'groq-sdk';
import type { AIProvider, ChatMessage } from '../types';

export function createGroqProvider(): AIProvider {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is required');
  }

  const client = new Groq({ apiKey });
  const model = 'llama-3.3-70b-versatile';

  return {
    name: 'groq',

    async chat(messages: ChatMessage[]): Promise<string> {
      const completion = await client.chat.completions.create({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7,
        max_tokens: 2048,
      });
      return completion.choices[0]?.message?.content ?? '';
    },

    async generateText(prompt: string): Promise<string> {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 2048,
      });
      return completion.choices[0]?.message?.content ?? '';
    },
  };
}
