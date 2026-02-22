import { describe, it, expect } from 'vitest';
import { resolveWithLWW, resolveWithMerge, hasConflict, SyncableEntity } from '../conflictResolver';

describe('conflictResolver', () => {
    describe('resolveWithLWW', () => {
        it('should pick the local version if it is newer', () => {
            const local: SyncableEntity = { id: '1', title: 'Local', updated_at: '2025-01-02T10:00:00Z' };
            const server: SyncableEntity = { id: '1', title: 'Server', updated_at: '2025-01-01T10:00:00Z' };
            
            const result = resolveWithLWW(local, server);
            expect(result.title).toBe('Local');
        });

        it('should pick the server version if it is newer', () => {
            const local: SyncableEntity = { id: '1', title: 'Local', updated_at: '2025-01-01T10:00:00Z' };
            const server: SyncableEntity = { id: '1', title: 'Server', updated_at: '2025-01-02T10:00:00Z' };
            
            const result = resolveWithLWW(local, server);
            expect(result.title).toBe('Server');
        });
    });

    describe('resolveWithMerge', () => {
        it('should merge newer local fields into server object', () => {
            const local: SyncableEntity = { id: '1', title: 'Updated Title', status: 'done', updated_at: '2025-01-02T10:00:00Z' };
            const server: SyncableEntity = { id: '1', title: 'Old Title', status: 'pending', other: 'kept', updated_at: '2025-01-01T10:00:00Z' };
            
            const result = resolveWithMerge(local, server);
            expect(result.title).toBe('Updated Title');
            expect(result.status).toBe('done');
            expect(result.other).toBe('kept');
        });

        it('should keep server fields if server is newer', () => {
            const local: SyncableEntity = { id: '1', title: 'Stale Title', updated_at: '2025-01-01T10:00:00Z' };
            const server: SyncableEntity = { id: '1', title: 'Fresh Title', updated_at: '2025-01-02T10:00:00Z' };
            
            const result = resolveWithMerge(local, server);
            expect(result.title).toBe('Fresh Title');
        });
    });

    describe('hasConflict', () => {
        it('should return false if updated_at is identical', () => {
            const local: SyncableEntity = { id: '1', updated_at: '2025-01-01T10:00:00Z', data: 'a' };
            const server: SyncableEntity = { id: '1', updated_at: '2025-01-01T10:00:00Z', data: 'a' };
            expect(hasConflict(local, server)).toBe(false);
        });

        it('should return true if data differs even if timestamps are different', () => {
            const local: SyncableEntity = { id: '1', updated_at: '2025-01-02T10:00:00Z', data: 'b' };
            const server: SyncableEntity = { id: '1', updated_at: '2025-01-01T10:00:00Z', data: 'a' };
            expect(hasConflict(local, server)).toBe(true);
        });
    });
});
