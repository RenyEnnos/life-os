import React from 'react';
import { useSyncQueue } from '@/shared/lib/syncQueue';
import { Cloud, CloudOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SyncBadgeProps {
  itemId: string;
  className?: string;
  showText?: boolean;
}

/**
 * SyncBadge provides visual feedback on the synchronization status of a specific item.
 */
export function SyncBadge({ itemId, className, showText = false }: SyncBadgeProps) {
  const { queue } = useSyncQueue();
  const isPending = queue.some(item => (item.payload as any)?.id === itemId || item.endpoint.includes(itemId));
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (!isOnline && isPending) {
    return (
      <div className={cn("flex items-center gap-1 text-amber-500", className)} title="Pending Sync (Offline)">
        <CloudOff size={14} />
        {showText && <span className="text-[10px] uppercase font-bold tracking-wider">Offline</span>}
      </div>
    );
  }

  if (isPending) {
    return (
      <div className={cn("flex items-center gap-1 text-blue-400 animate-pulse", className)} title="Syncing...">
        <RefreshCw size={14} className="animate-spin" />
        {showText && <span className="text-[10px] uppercase font-bold tracking-wider">Syncing</span>}
      </div>
    );
  }

  // If not pending, we assume it's synced (either just synced or already up to date)
  return (
    <div className={cn("flex items-center gap-1 text-emerald-500/50", className)} title="Synced">
      <CheckCircle2 size={14} />
      {showText && <span className="text-[10px] uppercase font-bold tracking-wider">Synced</span>}
    </div>
  );
}
