import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ipcMain } from 'electron';

const mockState = vi.hoisted(() => ({
  handlers: new Map<string, (event: unknown, ...args: unknown[]) => Promise<unknown>>(),
}));

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, handler: (event: unknown, ...args: unknown[]) => Promise<unknown>) => {
      mockState.handlers.set(channel, handler);
    }),
  },
}));

vi.mock('../../db/BaseRepository', () => ({
  BaseRepository: vi.fn().mockImplementation(() => ({
    getAll: vi.fn().mockReturnValue([{ id: '1', title: 'Test' }]),
    getById: vi.fn().mockReturnValue({ id: '1', title: 'Test' }),
    create: vi.fn().mockReturnValue({ id: '2', title: 'Created' }),
    update: vi.fn().mockReturnValue({ id: '1', title: 'Updated' }),
    delete: vi.fn().mockReturnValue(true),
  })),
}));

vi.mock('../../db/allowedTables', () => ({
  ALLOWED_RESOURCES: {
    tasks: 'tasks',
    habits: 'habits',
    transactions: 'transactions',
  },
}));

import { setupResourceHandlers } from '../resourceHandler';

describe('setupResourceHandlers', () => {
  beforeEach(() => {
    mockState.handlers.clear();
    vi.clearAllMocks();
    setupResourceHandlers();
  });

  it('registers the resource:invoke handler', () => {
    expect(mockState.handlers.has('resource:invoke')).toBe(true);
  });

  it('calls getAll for valid resource', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    const result = await handler({}, 'tasks', 'getAll');
    expect(result).toEqual([{ id: '1', title: 'Test' }]);
  });

  it('throws for unauthorized resource', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    await expect(handler({}, 'unknown_table', 'getAll')).rejects.toThrow('Unauthorized or unknown resource');
  });

  it('throws for unknown action', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    await expect(handler({}, 'tasks', 'patch')).rejects.toThrow('Unknown action');
  });

  it('calls getById with correct id', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    const result = await handler({}, 'tasks', 'getById', '1');
    expect(result).toEqual({ id: '1', title: 'Test' });
  });

  it('calls create with data', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    const result = await handler({}, 'tasks', 'create', { title: 'New' });
    expect(result).toEqual({ id: '2', title: 'Created' });
  });

  it('calls update with id and data', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    const result = await handler({}, 'tasks', 'update', '1', { title: 'Updated' });
    expect(result).toEqual({ id: '1', title: 'Updated' });
  });

  it('calls delete with id', async () => {
    const handler = mockState.handlers.get('resource:invoke')!;
    const result = await handler({}, 'tasks', 'delete', '1');
    expect(result).toBe(true);
  });
});
