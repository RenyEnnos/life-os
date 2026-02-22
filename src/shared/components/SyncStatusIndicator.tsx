import React, { useEffect } from 'react';
import { useSyncQueue } from '@/shared/lib/syncQueue';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import CloudOff from 'lucide-react/dist/esm/icons/cloud-off';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle2';
import { cn } from '@/shared/lib/cn';

export const SyncStatusIndicator = ({ className }: { className?: string }) => {
    const { queue, isSyncing, processQueue } = useSyncQueue();
    const [isOnline, setIsOnline] = React.useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            processQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [processQueue]);

    // Attempt to sync periodically if queue has items and we are online
    useEffect(() => {
        if (queue.length > 0 && isOnline && !isSyncing) {
            const interval = setInterval(() => {
                processQueue();
            }, 30000); // Try every 30s
            return () => clearInterval(interval);
        }
    }, [queue.length, isOnline, isSyncing, processQueue]);

    if (queue.length === 0 && isOnline) return null;

    return (
        <div className={cn("fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium backdrop-blur-md shadow-lg border transition-all", 
            !isOnline ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
            isSyncing ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
            "bg-zinc-800/80 text-zinc-400 border-white/10",
            className
        )}>
            {!isOnline && (
                <>
                    <CloudOff className="w-3 h-3" />
                    <span>Offline ({queue.length})</span>
                </>
            )}
            {isOnline && isSyncing && (
                <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Syncing...</span>
                </>
            )}
            {isOnline && queue.length > 0 && !isSyncing && (
                <button 
                    onClick={() => processQueue()}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Pending ({queue.length})</span>
                </button>
            )}
        </div>
    );
};
