import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CacheService } from '../cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    // Clear all caches before each test
    CacheService.clearAll();
  });

  afterEach(() => {
    // Clean up after each test
    CacheService.clearAll();
  });

  describe('get and set', () => {
    it('should store and retrieve values', () => {
      const testData = { message: 'Hello, cache!' };
      CacheService.set('test', 'key1', testData);
      const result = CacheService.get('test', 'key1');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = CacheService.get('test', 'nonexistent');
      expect(result).toBeNull();
    });

    it('should handle different data types', () => {
      const stringData = 'text value';
      const numberData = 42;
      const arrayData = [1, 2, 3];
      const objectData = { nested: { value: true } };

      CacheService.set('test', 'string', stringData);
      CacheService.set('test', 'number', numberData);
      CacheService.set('test', 'array', arrayData);
      CacheService.set('test', 'object', objectData);

      expect(CacheService.get('test', 'string')).toBe(stringData);
      expect(CacheService.get('test', 'number')).toBe(numberData);
      expect(CacheService.get('test', 'array')).toEqual(arrayData);
      expect(CacheService.get('test', 'object')).toEqual(objectData);
    });
  });

  describe('user-scoped caching', () => {
    it('should isolate cache by user ID', () => {
      const testData = { userId: 'user1' };
      CacheService.set('test', 'data', testData, 'user1');
      CacheService.set('test', 'data', { userId: 'user2' }, 'user2');

      const user1Data = CacheService.get('test', 'data', 'user1');
      const user2Data = CacheService.get('test', 'data', 'user2');

      expect(user1Data).toEqual({ userId: 'user1' });
      expect(user2Data).toEqual({ userId: 'user2' });
    });

    it('should handle same key for different users', () => {
      CacheService.set('habits', 'list', ['habit1', 'habit2'], 'user1');
      CacheService.set('habits', 'list', ['habit3', 'habit4'], 'user2');

      expect(CacheService.get('habits', 'list', 'user1')).toEqual(['habit1', 'habit2']);
      expect(CacheService.get('habits', 'list', 'user2')).toEqual(['habit3', 'habit4']);
    });
  });

  describe('delete', () => {
    it('should delete specific keys', () => {
      CacheService.set('test', 'key1', 'value1');
      CacheService.set('test', 'key2', 'value2');

      expect(CacheService.has('test', 'key1')).toBe(true);
      CacheService.delete('test', 'key1');
      expect(CacheService.has('test', 'key1')).toBe(false);
      expect(CacheService.has('test', 'key2')).toBe(true);
    });

    it('should delete user-scoped keys', () => {
      CacheService.set('test', 'key1', 'value1', 'user1');
      CacheService.set('test', 'key1', 'value2', 'user2');

      CacheService.delete('test', 'key1', 'user1');

      expect(CacheService.get('test', 'key1', 'user1')).toBeNull();
      expect(CacheService.get('test', 'key1', 'user2')).toEqual('value2');
    });

    it('should return number of deleted items', () => {
      CacheService.set('test', 'key1', 'value1');
      const deleted = CacheService.delete('test', 'key1');
      expect(deleted).toBe(1);
    });
  });

  describe('invalidate', () => {
    it('should flush all keys in a namespace', () => {
      CacheService.set('test', 'key1', 'value1');
      CacheService.set('test', 'key2', 'value2');
      CacheService.set('other', 'key1', 'value3');

      CacheService.invalidate('test');

      expect(CacheService.get('test', 'key1')).toBeNull();
      expect(CacheService.get('test', 'key2')).toBeNull();
      expect(CacheService.get('other', 'key1')).toEqual('value3');
    });

    it('should invalidate only user-specific keys when userId provided', () => {
      CacheService.set('test', 'key1', 'value1', 'user1');
      CacheService.set('test', 'key2', 'value2', 'user1');
      CacheService.set('test', 'key1', 'value3', 'user2');

      CacheService.invalidate('test', 'user1');

      expect(CacheService.get('test', 'key1', 'user1')).toBeNull();
      expect(CacheService.get('test', 'key2', 'user1')).toBeNull();
      expect(CacheService.get('test', 'key1', 'user2')).toEqual('value3');
    });
  });

  describe('clearAll', () => {
    it('should clear all namespaces', () => {
      CacheService.set('namespace1', 'key1', 'value1');
      CacheService.set('namespace2', 'key2', 'value2');
      CacheService.set('namespace3', 'key3', 'value3');

      CacheService.clearAll();

      expect(CacheService.get('namespace1', 'key1')).toBeNull();
      expect(CacheService.get('namespace2', 'key2')).toBeNull();
      expect(CacheService.get('namespace3', 'key3')).toBeNull();
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      CacheService.set('test', 'key1', 'value1');
      expect(CacheService.has('test', 'key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(CacheService.has('test', 'nonexistent')).toBe(false);
    });

    it('should work with user-scoped keys', () => {
      CacheService.set('test', 'key1', 'value1', 'user1');
      expect(CacheService.has('test', 'key1', 'user1')).toBe(true);
      expect(CacheService.has('test', 'key1', 'user2')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      CacheService.set('test', 'key1', 'value1');
      CacheService.set('test', 'key2', 'value2');

      // Access a key to generate hits
      CacheService.get('test', 'key1');
      CacheService.get('test', 'key1');

      // Try to access non-existent key for miss
      CacheService.get('test', 'nonexistent');

      const stats = CacheService.getStats('test');
      expect(stats.keys).toBe(2);
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.misses).toBeGreaterThan(0);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should use namespace default TTL', () => {
      const testData = { message: 'test' };
      CacheService.set('dashboard', 'key1', testData);
      const result = CacheService.get('dashboard', 'key1');
      expect(result).toEqual(testData);
    });

    it('should allow custom TTL override', () => {
      const testData = { message: 'test' };
      CacheService.set('test', 'key1', testData, undefined, 1); // 1 second TTL

      const result = CacheService.get('test', 'key1');
      expect(result).toEqual(testData);

      // Wait for TTL to expire
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const expiredResult = CacheService.get('test', 'key1');
          expect(expiredResult).toBeNull();
          resolve();
        }, 1100);
      });
    });

    it('should have different TTLs per namespace', () => {
      CacheService.set('dashboard', 'key1', 'value1');
      CacheService.set('habits', 'key1', 'value2');
      CacheService.set('journal', 'key1', 'value3');

      // All should be available immediately
      expect(CacheService.get('dashboard', 'key1')).toBe('value1');
      expect(CacheService.get('habits', 'key1')).toBe('value2');
      expect(CacheService.get('journal', 'key1')).toBe('value3');
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      // Mock console.error to prevent noise in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // These should not throw errors
      expect(() => CacheService.get('test', 'key')).not.toThrow();
      expect(() => CacheService.set('test', 'key', 'value')).not.toThrow();
      expect(() => CacheService.delete('test', 'key')).not.toThrow();
      expect(() => CacheService.invalidate('test')).not.toThrow();
      expect(() => CacheService.clearAll()).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
