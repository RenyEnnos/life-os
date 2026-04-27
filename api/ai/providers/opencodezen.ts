import type { AIProvider, ChatMessage } from '../types';

const BASE_URL = 'https://api.opencode.ai/v1';

export function createOpenCodeZenProvider(): AIProvider {
  const apiKey = process.env.OPENCODEZEN_API_KEY;
  if (!apiKey) {
    throw new Error('OPENCODEZEN_API_KEY environment variable is required');
  }

  const model = process.env.OPENCODEZEN_MODEL || 'gpt-5-nano';

  async function callChatCompletions(messages: { role: string; content: string }[]): Promise<string> {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenCode Zen API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content ?? '';
  }

  return {
    name: 'opencodezen',

    async chat(messages: ChatMessage[]): Promise<string> {
      return callChatCompletions(
        messages.map(m => ({ role: m.role, content: m.content }))
      );
    },

    async generateText(prompt: string): Promise<string> {
      return callChatCompletions([{ role: 'user', content: prompt }]);
    },
  };
}
