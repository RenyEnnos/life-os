import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/shared/api/http';
import { ApiError } from '@/shared/api/http';
import { get, set, del } from 'idb-keyval';
import { useSyncConflictStore } from '@/shared/stores/useSyncConflictStore';
import { useSyncLogStore } from '@/shared/stores/useSyncLogStore';
import { logger } from '@/shared/lib/logger';

function generateUniqueId(): string {
    return crypto.randomUUID();
}

export interface SyncItem<T = unknown> {
    id: string;
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    payload: T;
    timestamp: number;
    retryCount: number;
    lastError?: string;
    nextRetryTimestamp?: number;
}

interface SyncQueueState {
    queue: SyncItem[];
    addToQueue: (item: Omit<SyncItem, 'id' | 'timestamp' | 'retryCount' | 'lastError' | 'nextRetryTimestamp'>) => void;
    updateItem: (id: string, updates: Partial<SyncItem>) => void;
    removeFromQueue: (id: string) => void;
    clearQueue: () => void;
    processQueue: () => Promise<void>;
}

// Custom storage for Zustand using idb-keyval
const storage = {
    getItem: async (name: string): Promise<string | null> => {
        const value = await get(name);
        return value ? JSON.stringify(value) : null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, JSON.parse(value));
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

/**
 * Calculates the next retry delay using exponential backoff with jitter.
 * Base delay: 2 seconds
 */
function calculateNextRetryDelay(retryCount: number): number {
    const baseDelay = 2000; // 2 seconds
    const maxDelay = 1000 * 60 * 60; // 1 hour max
    const exponentialDelay = Math.min(maxDelay, baseDelay * Math.pow(2, retryCount));
    const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
    return exponentialDelay + jitter;
}

export const useSyncQueue = create<SyncQueueState>()(
    persist(
        (set, get) => ({
            queue: [],
            addToQueue: (item) => {
                set((state) => ({
                    queue: [
                        ...state.queue,
                        {
                            ...item,
                            id: generateUniqueId(),
                            timestamp: Date.now(),
                            retryCount: 0,
                        },
                    ],
                }));
            },
            updateItem: (id, updates) => {
                set((state) => ({
                    queue: state.queue.map((item) =>
                        item.id === id ? { ...item, ...updates } : item
                    ),
                }));
            },
            removeFromQueue: (id) => {
                set((state) => ({
                    queue: state.queue.filter((item) => item.id !== id),
                }));
            },
            clearQueue: () => {
                set({ queue: [] });
            },
            processQueue: async () => {
                const { queue, removeFromQueue, updateItem } = get();
                if (queue.length === 0) return;

                const now = Date.now();

                // Process sequentially to maintain order and detect conflicts
                for (const item of queue) {
                    // Skip if it's not time to retry yet
                    if (item.nextRetryTimestamp && item.nextRetryTimestamp > now) {
                        continue;
                    }

                    try {
                        let response;
                        if (item.method === 'POST') {
                            response = await apiClient.post(item.endpoint, item.payload);
                        } else if (item.method === 'PUT') {
                            response = await apiClient.put(item.endpoint, item.payload);
                        } else if (item.method === 'DELETE') {
                            response = await apiClient.delete(item.endpoint);
                        } else if (item.method === 'PATCH') {
                            response = await apiClient.patch(item.endpoint, item.payload);
                        }

                        logger.log(`Successfully synced item ${item.id}`, response);

                        useSyncLogStore.getState().addLog({
                            type: 'success',
                            message: `Sincronizado item ${item.id}`,
                            table: item.endpoint.split('/')[2] || 'unknown',
                            method: item.method
                        });

                        // If successful, remove from queue
                        removeFromQueue(item.id);
                    } catch (error: unknown) {
                        const apiErr = error instanceof ApiError ? error : null;
                        const errMessage = error instanceof Error ? error.message : String(error);
                        const errStatus = apiErr?.status;
                        logger.error(`Failed to sync item ${item.id}`, error);

                        // Handle Conflict (409)
                        if (errStatus === 409) {
                            logger.warn(`Conflict detected for item ${item.id}. Server version is newer.`);

                            // Capture the conflict for user resolution
                            const table = item.endpoint.split('/')[2] || 'unknown';
                            useSyncConflictStore.getState().addConflict({
                                id: generateUniqueId(),
                                itemId: (item.payload as Record<string, unknown>)?.id as string || item.id,
                                table,
                                localData: item.payload as Record<string, unknown>,
                                serverData: (apiErr?.details ?? {}) as Record<string, unknown>,
                                endpoint: item.endpoint,
                                method: item.method
                            });

                            useSyncLogStore.getState().addLog({
                                type: 'error',
                                message: `Conflito detectado (409) no item ${item.id}. Requer resolução manual.`,
                                table,
                                method: item.method
                            });

                            removeFromQueue(item.id);
                            continue;
                        }

                        // Determine if it's a transient error or permanent
                        const isPermanentError = errStatus && errStatus >= 400 && errStatus < 500 && errStatus !== 429;

                        if (isPermanentError) {
                            useSyncLogStore.getState().addLog({
                                type: 'error',
                                message: `Erro permanente ${errStatus}: ${errMessage}`,
                                table: item.endpoint.split('/')[2] || 'unknown',
                                method: item.method,
                                details: errMessage
                            });
                            logger.error(`Permanent error ${errStatus} for item ${item.id}. Discarding.`);
                            removeFromQueue(item.id);
                        } else {
                            // Transient error (Network, 500, 429) - apply exponential backoff
                            const retryCount = (item.retryCount || 0) + 1;
                            const delay = calculateNextRetryDelay(retryCount);

                            updateItem(item.id, {
                                retryCount,
                                lastError: errMessage,
                                nextRetryTimestamp: Date.now() + delay
                            });

                            useSyncLogStore.getState().addLog({
                                type: 'retry',
                                message: `Falha temporária (Tentativa #${retryCount}). Retentando em ${Math.round(delay / 1000)}s`,
                                details: errMessage,
                                table: item.endpoint.split('/')[2] || 'unknown',
                                method: item.method
                            });

                            logger.log(`Item ${item.id} scheduled for retry in ${Math.round(delay / 1000)}s (Attempt #${retryCount})`);

                            // Stop processing the queue to maintain order (subsequent items might depend on this one)
                            break;
                        }
                    }
                }
            },
        }),
        {
            name: 'offline-sync-queue',
            storage: createJSONStorage(() => storage),
        }
    )
);
