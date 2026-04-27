import { getProvider } from './providers';
import { hashInput, getCached, setCache, logAICall } from './cache';

async function callWithCache<T>(
  userId: string,
  functionName: string,
  input: string,
  fn: () => Promise<T>,
  ttlMs?: number
): Promise<T> {
  const inputHash = hashInput(input);
  const cached = getCached(userId, functionName, inputHash);
  if (cached !== null) {
    return cached as T;
  }

  const start = Date.now();
  let success = false;
  let errorMessage: string | undefined;

  try {
    const result = await fn();
    success = true;
    setCache(userId, functionName, inputHash, result, ttlMs);
    return result;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    logAICall({
      userId,
      functionName,
      tokensUsed: 0, // Would need provider-specific tracking
      responseTimeMs: Date.now() - start,
      success,
      errorMessage,
    });
  }
}

export async function chat(userId: string, message: string, context?: string): Promise<{ message: string }> {
  const provider = getProvider();
  const systemPrompt = context
    ? `You are LifeOS AI assistant. Context: ${context}`
    : 'You are LifeOS AI assistant. Help the user with their productivity and life management.';

  const response = await callWithCache(
    userId,
    'chat',
    `${context || ''}:${message}`,
    () => provider.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]),
    0 // No cache for chat
  );

  return { message: response };
}

export async function generateTags(
  userId: string,
  context: string,
  type: string
): Promise<{ tags: string[] }> {
  const provider = getProvider();
  const prompt = `Generate 3-5 relevant tags for this ${type}. Return ONLY a JSON array of strings, nothing else.

Context: ${context}`;

  const response = await callWithCache(userId, 'generateTags', `${type}:${context}`, () =>
    provider.generateText(prompt)
  );

  try {
    const tags = JSON.parse(response);
    return { tags: Array.isArray(tags) ? tags : [] };
  } catch {
    // Fallback: extract tags from text
    const tags = response.match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || [];
    return { tags };
  }
}

export async function generateSwot(
  userId: string,
  context: string
): Promise<{ swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] } }> {
  const provider = getProvider();
  const prompt = `Perform a SWOT analysis based on this context. Return ONLY a JSON object with keys: strengths, weaknesses, opportunities, threats. Each key should map to an array of 2-4 strings.

Context: ${context}`;

  const response = await callWithCache(userId, 'generateSwot', context, () =>
    provider.generateText(prompt)
  );

  try {
    const swot = JSON.parse(response);
    return {
      swot: {
        strengths: swot.strengths || [],
        weaknesses: swot.weaknesses || [],
        opportunities: swot.opportunities || [],
        threats: swot.threats || [],
      },
    };
  } catch {
    return {
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    };
  }
}

export async function generatePlan(
  userId: string,
  context: string
): Promise<{ plan: Record<string, string[]> }> {
  const provider = getProvider();
  const prompt = `Generate a weekly plan based on this context. Return ONLY a JSON object where keys are day names (Monday-Sunday) and values are arrays of task strings.

Context: ${context}`;

  const response = await callWithCache(userId, 'generatePlan', context, () =>
    provider.generateText(prompt)
  );

  try {
    const plan = JSON.parse(response);
    return { plan };
  } catch {
    return { plan: {} };
  }
}

export async function generateSummary(
  userId: string,
  context: string
): Promise<{ summary: string[] }> {
  const provider = getProvider();
  const prompt = `Summarize this content into 3-5 key points. Return ONLY a JSON array of strings.

Context: ${context}`;

  const response = await callWithCache(userId, 'generateSummary', context, () =>
    provider.generateText(prompt)
  );

  try {
    const summary = JSON.parse(response);
    return { summary: Array.isArray(summary) ? summary : [] };
  } catch {
    return { summary: [response] };
  }
}

export async function parseTask(
  userId: string,
  input: string
): Promise<Record<string, unknown>> {
  const provider = getProvider();
  const prompt = `Parse this natural language into a task object. Return ONLY a JSON object with these optional keys: title (string), priority ("low"|"medium"|"high"|"urgent"), dueDate (ISO date string), tags (string[]), description (string).

Input: ${input}`;

  const response = await callWithCache(userId, 'parseTask', input, () =>
    provider.generateText(prompt)
  );

  try {
    return JSON.parse(response);
  } catch {
    return { title: input };
  }
}

export async function parseEntity(
  userId: string,
  input: string
): Promise<{ type: 'task' | 'habit' | 'transaction'; data: Record<string, unknown> }> {
  const provider = getProvider();
  const prompt = `Parse this input and determine if it's a task, habit, or transaction. Return ONLY a JSON object with: "type" (one of "task", "habit", "transaction") and "data" (the parsed entity object).

Input: ${input}`;

  const response = await callWithCache(userId, 'parseEntity', input, () =>
    provider.generateText(prompt)
  );

  try {
    return JSON.parse(response);
  } catch {
    return { type: 'task', data: { title: input } };
  }
}
