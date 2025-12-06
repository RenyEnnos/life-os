import { useEffect } from 'react';
import { useSyncQueue } from '@/shared/lib/syncQueue';
import { toast } from 'react-hot-toast'; // Assuming we have toast

export function OfflineSyncManager() {
    const { processQueue, queue } = useSyncQueue();

    useEffect(() => {
        const handleOnline = () => {
            toast.success('Back online! Syncing data...');
            processQueue();
        };

        window.addEventListener('online', handleOnline);

        // Also process immediately if we load the app and are online
        if (navigator.onLine && queue.length > 0) {
            processQueue();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, [processQueue, queue.length]);

    return null; // Headless component
}
