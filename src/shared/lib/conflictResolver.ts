/**
 * Conflict Resolution Utility
 * Implements strategies for merging data and resolving conflicts between local and server states.
 */

export interface SyncableEntity {
    id: string;
    updated_at: string | number;
    [key: string]: any;
}

/**
 * Last-Write-Wins (LWW) Strategy
 * Resolves conflict by picking the version with the most recent timestamp.
 */
export function resolveWithLWW<T extends SyncableEntity>(local: T, server: T): T {
    const localTime = new Date(local.updated_at).getTime();
    const serverTime = new Date(server.updated_at).getTime();

    if (localTime > serverTime) {
        return local;
    }
    return server;
}

/**
 * Shallow Merge Strategy
 * Merges fields from both objects, preferring non-null/non-empty values.
 * In case of direct conflict on a field, the timestamp-based winner is used for that field.
 */
export function resolveWithMerge<T extends SyncableEntity>(local: T, server: T): T {
    const winner = resolveWithLWW(local, server);
    
    // Simple merge: Start with server data (the authority)
    const result = { ...server };
    
    // Overlay local changes if they are newer
    const localTime = new Date(local.updated_at).getTime();
    const serverTime = new Date(server.updated_at).getTime();
    
    if (localTime > serverTime) {
        Object.keys(local).forEach(key => {
            if (local[key] !== undefined && local[key] !== null) {
                result[key as keyof T] = local[key];
            }
        });
    }
    
    return result;
}

/**
 * Detects if a conflict exists between local and server data
 */
export function hasConflict(local: SyncableEntity, server: SyncableEntity): boolean {
    // If timestamps match, no conflict (assuming data is same)
    if (local.updated_at === server.updated_at) return false;
    
    // Check if critical fields differ
    // This is a simple implementation; ideally we check actual content values
    return JSON.stringify(local) !== JSON.stringify(server);
}
