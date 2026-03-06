import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { get, set, del } from 'idb-keyval'
import { apiClient } from '@/shared/api/http'

interface MutationVariables {
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    payload?: unknown;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes - balance between freshness and performance
            gcTime: 1000 * 60 * 60, // 1 hour - cache duration
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
})

// Set default mutation handlers for offline rehydration
queryClient.setMutationDefaults(['habits'], {
    mutationFn: async (variables: MutationVariables) => {
        const { endpoint, method, payload } = variables;
        if (method === 'PATCH') return apiClient.patch(endpoint, payload);
        if (method === 'PUT') return apiClient.put(endpoint, payload);
        if (method === 'DELETE') return apiClient.delete(endpoint);
        return apiClient.post(endpoint, payload);
    },
});

queryClient.setMutationDefaults(['tasks'], {
    mutationFn: async (variables: MutationVariables) => {
        const { endpoint, method, payload } = variables;
        if (method === 'PATCH') return apiClient.patch(endpoint, payload);
        if (method === 'PUT') return apiClient.put(endpoint, payload);
        if (method === 'DELETE') return apiClient.delete(endpoint);
        return apiClient.post(endpoint, payload);
    },
});

export const persister = createAsyncStoragePersister({
    storage: {
        getItem: async (key) => {
            const val = await get(key)
            return val // idb-keyval returns parsed value or undefined
        },
        setItem: async (key, value) => {
            await set(key, value)
        },
        removeItem: async (key) => {
            await del(key)
        },
    },
})
