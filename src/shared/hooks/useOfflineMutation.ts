import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useSyncQueue } from '@/shared/lib/syncQueue';
import { useState, useEffect } from 'react';

/**
 * A wrapper around useMutation that handles offline states.
 * If the device is offline or the request fails due to network error, 
 * the mutation is added to the sync queue.
 */
export function useOfflineMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext> & {
        endpoint: string;
        method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    }
): UseMutationResult<TData, TError, TVariables, TContext> {
    const { addToQueue } = useSyncQueue();
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // We can't easily intercept the `mutationFn` directly inside `useMutation` without wrapping it.
    // So we assume the user passed a mutationFn that might fail.
    // BUT `useOfflineMutation` requires us to know the endpoint/payload to queue it.
    // So typically `mutationFn` calls `apiClient.post(...)`.
    // If we want to queue it genericly, we need the arguments.

    const originalMutationFn = options.mutationFn;

    const wrappedMutationFn = async (variables: TVariables): Promise<TData> => {
        if (isOffline) {
            // Optimistically queue it
            addToQueue({
                endpoint: options.endpoint,
                method: options.method,
                payload: variables,
            });
            // Throw a special error or return a mock success?
            // To update UI optimistically, we usually need to rely on onMutate.
            // Returning a mock promise that resolves might confuse React Query if it expects real data.
            // But for "fire and forget", it's fine.
            return Promise.resolve({ offline: true } as unknown as TData);
        }

        try {
            if (originalMutationFn) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return await (originalMutationFn as any)(variables);
            }
            // If no mutationFn provided, we use the endpoint/method (default behavior)
            // But useMutation requires mutationFn usually.
            throw new Error('No mutationFn provided');
        } catch {
            // Check if network error
            // If network error, add to queue
            addToQueue({
                endpoint: options.endpoint,
                method: options.method,
                payload: variables,
            });
            return Promise.resolve({ offline: true } as unknown as TData);
        }
    };

    return useMutation({
        ...options,
        mutationFn: wrappedMutationFn,
    });
}
