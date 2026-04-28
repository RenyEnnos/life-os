import { describe, it, expect, beforeEach } from 'vitest';
import { useSyncConflictStore } from '../useSyncConflictStore';
import type { SyncConflict } from '../useSyncConflictStore';

const createConflict = (overrides: Partial<SyncConflict> = {}): SyncConflict => ({
  id: `conflict-${Date.now()}`,
  itemId: 'item-1',
  table: 'tasks',
  localData: { title: 'Local version' },
  serverData: { title: 'Server version' },
  endpoint: '/api/tasks/item-1',
  method: 'PUT',
  ...overrides,
});

describe('useSyncConflictStore', () => {
  beforeEach(() => {
    useSyncConflictStore.setState({ conflicts: [] });
  });

  it('starts with empty conflicts', () => {
    expect(useSyncConflictStore.getState().conflicts).toEqual([]);
  });

  it('addConflict adds a conflict', () => {
    const conflict = createConflict({ id: 'c1', itemId: 'item-1' });
    useSyncConflictStore.getState().addConflict(conflict);
    expect(useSyncConflictStore.getState().conflicts).toHaveLength(1);
    expect(useSyncConflictStore.getState().conflicts[0].id).toBe('c1');
  });

  it('addConflict replaces existing conflict with same itemId', () => {
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c1', itemId: 'item-1' }));
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c2', itemId: 'item-1' }));
    const conflicts = useSyncConflictStore.getState().conflicts;
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].id).toBe('c2');
  });

  it('addConflict keeps different itemIds', () => {
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c1', itemId: 'item-1' }));
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c2', itemId: 'item-2' }));
    expect(useSyncConflictStore.getState().conflicts).toHaveLength(2);
  });

  it('resolveConflict removes conflict by id', () => {
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c1', itemId: 'item-1' }));
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c2', itemId: 'item-2' }));
    useSyncConflictStore.getState().resolveConflict('c1');
    const conflicts = useSyncConflictStore.getState().conflicts;
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].id).toBe('c2');
  });

  it('clearConflicts removes all conflicts', () => {
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c1', itemId: 'item-1' }));
    useSyncConflictStore.getState().addConflict(createConflict({ id: 'c2', itemId: 'item-2' }));
    useSyncConflictStore.getState().clearConflicts();
    expect(useSyncConflictStore.getState().conflicts).toEqual([]);
  });
});
