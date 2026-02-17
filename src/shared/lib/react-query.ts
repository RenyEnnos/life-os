import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { get, set, del } from 'idb-keyval'

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
