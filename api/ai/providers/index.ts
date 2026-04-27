import type { AIProvider } from '../types';
import { createGroqProvider } from './groq';
import { createGeminiProvider } from './gemini';
import { createOpenCodeZenProvider } from './opencodezen';

type ProviderName = 'groq' | 'gemini' | 'opencodezen';

let cachedProvider: AIProvider | null = null;

export function getProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  const requested = (process.env.AI_PROVIDER || '').toLowerCase() as ProviderName;

  // Try requested provider first
  if (requested) {
    const provider = tryCreate(requested);
    if (provider) {
      cachedProvider = provider;
      return provider;
    }
  }

  // Auto-detect: try providers in priority order
  const priority: ProviderName[] = ['opencodezen', 'groq', 'gemini'];
  for (const name of priority) {
    const provider = tryCreate(name);
    if (provider) {
      cachedProvider = provider;
      return provider;
    }
  }

  throw new Error(
    'No AI provider available. Set at least one of: OPENCODEZEN_API_KEY, GROQ_API_KEY, GEMINI_API_KEY'
  );
}

function tryCreate(name: ProviderName): AIProvider | null {
  try {
    switch (name) {
      case 'groq':
        return createGroqProvider();
      case 'gemini':
        return createGeminiProvider();
      case 'opencodezen':
        return createOpenCodeZenProvider();
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function getProviderName(): string {
  return getProvider().name;
}
