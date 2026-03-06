import { useEffect } from 'react';
import { useSyncQueue } from '@/shared/lib/syncQueue';
import { SyncEngine } from '@/shared/services/SyncEngine';
import { NotificationReconciler } from '@/shared/services/NotificationReconciler';
import { toast } from 'react-hot-toast';

export function OfflineSyncManager() {
    const { processQueue, queue } = useSyncQueue();

    useEffect(() => {
        const handleOnline = async () => {
            toast.success('Back online! Syncing data...');
            
            // 1. Pull changes from remote (Server -> Local)
            await SyncEngine.pull();
            
            // 2. Reconcile Notifications
            await NotificationReconciler.reconcile();
            
            // 3. Push changes to remote (Local -> Server)
            await processQueue();
        };

        window.addEventListener('online', handleOnline);

        // Also process immediately if we load the app and are online
        if (navigator.onLine) {
            // Background pull on startup
            SyncEngine.pull().then(async () => {
                // await NotificationReconciler.reconcile();
                if (queue.length > 0) {
                    processQueue();
                }
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, [processQueue, queue.length]);

    return null; // Headless component
}
