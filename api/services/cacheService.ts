import NodeCache from 'node-cache';

// Default TTL configurations per namespace (in seconds)
const DEFAULT_TTL = {
  short: 300,      // 5 minutes
  medium: 600,     // 10 minutes
  long: 3600,      // 1 hour
  dashboard: 300,  // 5 minutes
  habits: 600,     // 10 minutes
  tasks: 300,      // 5 minutes
  journal: 1800,   // 30 minutes
  finances: 600,   // 10 minutes
};

// Cache storage with namespace isolation
const caches = new Map<string, NodeCache>();

// Get or create cache for a namespace
function getCache(namespace: string, ttl?: number): NodeCache {
  if (!caches.has(namespace)) {
    const cacheTTL = ttl ?? DEFAULT_TTL[namespace as keyof typeof DEFAULT_TTL] ?? DEFAULT_TTL.medium;
    caches.set(namespace, new NodeCache({ stdTTL: cacheTTL, checkperiod: cacheTTL * 0.2 }));
  }
  return caches.get(namespace)!;
}

// Generate cache key with optional prefix
function generateKey(namespace: string, key: string, userId?: string): string {
  return userId ? `${namespace}:${userId}:${key}` : `${namespace}:${key}`;
}

/**
 * Unified Cache Service
 * Provides namespaced caching with TTL and invalidation support
 */
export const CacheService = {
  /**
   * Get a value from cache
   * @param namespace - Cache namespace (e.g., 'dashboard', 'habits')
   * @param key - Cache key
   * @param userId - Optional user ID for user-scoped caching
   * @returns Cached value or null if not found/expired
   */
  get<T>(namespace: string, key: string, userId?: string): T | null {
    try {
      const cache = getCache(namespace);
      const cacheKey = generateKey(namespace, key, userId);
      const value = cache.get<T>(cacheKey);
      return value ?? null;
    } catch (error) {
      console.error(`Cache get error for ${namespace}:${key}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  },

  /**
   * Set a value in cache with optional custom TTL
   * @param namespace - Cache namespace
   * @param key - Cache key
   * @param value - Value to cache
   * @param userId - Optional user ID for user-scoped caching
   * @param ttl - Optional custom TTL in seconds (overrides namespace default)
   */
  set<T>(namespace: string, key: string, value: T, userId?: string, ttl?: number): boolean {
    try {
      const cache = getCache(namespace, ttl);
      const cacheKey = generateKey(namespace, key, userId);
      return ttl !== undefined ? cache.set(cacheKey, value, ttl) : cache.set(cacheKey, value);
    } catch (error) {
      console.error(`Cache set error for ${namespace}:${key}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  },

  /**
   * Delete a specific cache entry
   * @param namespace - Cache namespace
   * @param key - Cache key
   * @param userId - Optional user ID for user-scoped caching
   */
  delete(namespace: string, key: string, userId?: string): number {
    try {
      const cache = getCache(namespace);
      const cacheKey = generateKey(namespace, key, userId);
      return cache.del(cacheKey);
    } catch (error) {
      console.error(`Cache delete error for ${namespace}:${key}:`, error instanceof Error ? error.message : String(error));
      return 0;
    }
  },

  /**
   * Invalidate all cache entries for a namespace or user
   * @param namespace - Cache namespace to invalidate
   * @param userId - Optional user ID to invalidate only user-scoped entries
   */
  invalidate(namespace: string, userId?: string): void {
    try {
      const cache = getCache(namespace);
      if (userId) {
        // Invalidate all keys for a specific user
        const keys = cache.keys() as string[];
        const prefix = `${namespace}:${userId}:`;
        const userKeys = keys.filter(k => k.startsWith(prefix));
        if (userKeys.length > 0) {
          cache.del(userKeys);
        }
      } else {
        // Invalidate all keys in namespace
        cache.flushAll();
      }
    } catch (error) {
      console.error(`Cache invalidate error for ${namespace}:`, error instanceof Error ? error.message : String(error));
    }
  },

  /**
   * Clear all caches across all namespaces
   */
  clearAll(): void {
    try {
      caches.forEach(cache => cache.flushAll());
    } catch (error) {
      console.error('Cache clear all error:', error instanceof Error ? error.message : String(error));
    }
  },

  /**
   * Check if a key exists in cache
   * @param namespace - Cache namespace
   * @param key - Cache key
   * @param userId - Optional user ID for user-scoped caching
   */
  has(namespace: string, key: string, userId?: string): boolean {
    try {
      const cache = getCache(namespace);
      const cacheKey = generateKey(namespace, key, userId);
      return cache.has(cacheKey);
    } catch (error) {
      console.error(`Cache has error for ${namespace}:${key}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  },

  /**
   * Get cache statistics for a namespace
   * @param namespace - Cache namespace
   */
  getStats(namespace: string): { keys: number; hits: number; misses: number } {
    try {
      const cache = getCache(namespace);
      const stats = cache.getStats();
      return {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses,
      };
    } catch (error) {
      console.error(`Cache stats error for ${namespace}:`, error instanceof Error ? error.message : String(error));
      return { keys: 0, hits: 0, misses: 0 };
    }
  },
};
