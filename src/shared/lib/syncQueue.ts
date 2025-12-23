import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/shared/api/http';

export interface SyncItem<T = unknown> {
    id: string;
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    payload: T;
    timestamp: number;
    retryCount: number;
}

interface SyncQueueState {
    queue: SyncItem[];
    addToQueue: (item: Omit<SyncItem, 'id' | 'timestamp' | 'retryCount'>) => void;
    removeFromQueue: (id: string) => void;
    clearQueue: () => void;
    processQueue: () => Promise<void>;
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
                            id: Math.random().toString(36).substring(2, 9),
                            timestamp: Date.now(),
                            retryCount: 0,
                        },
                    ],
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
                const { queue, removeFromQueue } = get();
                if (queue.length === 0) return;

                // Process sequentially to maintain order
                for (const item of queue) {
                    try {
                        if (item.method === 'POST') {
                            await apiClient.post(item.endpoint, item.payload);
                        } else if (item.method === 'PUT') {
                            await apiClient.put(item.endpoint, item.payload);
                        } else if (item.method === 'DELETE') {
                            await apiClient.delete(item.endpoint);
                        } else if (item.method === 'PATCH') {
                            await apiClient.patch(item.endpoint, item.payload);
                        }

                        // If successful, remove from queue
                        removeFromQueue(item.id);
                    } catch (error) {
                        console.error(`Failed to sync item ${item.id}`, error);
                        // Make decision: keep in queue? Increment retry?
                        // For now, keep in queue and stop processing to retry later
                        // But if it's a 400 Bad Request, we should maybe drop it?
                        // P2 task to improve retry logic. P0: just basic queue.
                    }
                }
            },
        }),
        {
            name: 'offline-sync-queue',
        }
    )
);
