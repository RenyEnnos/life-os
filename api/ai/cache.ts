import crypto from 'crypto';

// In-memory cache for when Supabase is not available
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

export function hashInput(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getCached(userId: string, functionName: string, inputHash: string): unknown | null {
  const key = `${userId}:${functionName}:${inputHash}`;
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

export function setCache(
  userId: string,
  functionName: string,
  inputHash: string,
  value: unknown,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  const key = `${userId}:${functionName}:${inputHash}`;
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

// AI logs stored in memory (would be Supabase in production)
const logStore: Array<{
  id: string;
  user_id: string;
  function_name: string;
  tokens_used: number;
  response_time_ms: number;
  success: boolean;
  error_message: string | null;
  created_at: string;
}> = [];

export function logAICall(params: {
  userId: string;
  functionName: string;
  tokensUsed: number;
  responseTimeMs: number;
  success: boolean;
  errorMessage?: string;
}): void {
  logStore.push({
    id: crypto.randomUUID(),
    user_id: params.userId,
    function_name: params.functionName,
    tokens_used: params.tokensUsed,
    response_time_ms: params.responseTimeMs,
    success: params.success,
    error_message: params.errorMessage || null,
    created_at: new Date().toISOString(),
  });
}

export function getAILogs(userId: string) {
  return logStore
    .filter(log => log.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 50);
}
