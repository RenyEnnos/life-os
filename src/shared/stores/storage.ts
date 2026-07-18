import { get, set, del } from 'idb-keyval';
import { StateStorage } from 'zustand/middleware';

/**
 * Adaptador IndexedDB para o middleware de persistência do Zustand.
 * Utiliza idb-keyval para uma API simples de chave-valor sobre IndexedDB.
 * Verifica a existência do objecto indexedDB global para ser executado
 * de forma segura em ambientes de Node.js / SSR / testes (jsdom).
 */
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof indexedDB === 'undefined') return null;
    try {
      const value = await get(name);
      return value ?? null;
    } catch {
      console.warn('indexedDB getItem failed');
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof indexedDB === 'undefined') return;
    try {
      await set(name, value);
    } catch {
      console.warn('indexedDB setItem failed');
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof indexedDB === 'undefined') return;
    try {
      await del(name);
    } catch {
      console.warn('indexedDB removeItem failed');
    }
  },
};
