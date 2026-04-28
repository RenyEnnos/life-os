import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ipcMain } from 'electron';

const mockState = vi.hoisted(() => ({
  handlers: new Map<string, (event: unknown, ...args: unknown[]) => Promise<unknown>>(),
  mockGetAll: vi.fn().mockReturnValue([]),
  mockCreate: vi.fn().mockReturnValue({ id: 'new-1', title: 'Created' }),
  mockUpdate: vi.fn().mockReturnValue({ id: '1', title: 'Updated' }),
  mockDelete: vi.fn().mockReturnValue(true),
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
    getAll: mockState.mockGetAll,
    create: mockState.mockCreate,
    update: mockState.mockUpdate,
    delete: mockState.mockDelete,
  })),
}));

import { setupTasksHandlers } from '../tasksHandler';

describe('setupTasksHandlers', () => {
  beforeEach(() => {
    mockState.handlers.clear();
    vi.clearAllMocks();
    setupTasksHandlers();
  });

  it('registers all task handlers', () => {
    expect(mockState.handlers.has('tasks:getAll')).toBe(true);
    expect(mockState.handlers.has('tasks:create')).toBe(true);
    expect(mockState.handlers.has('tasks:update')).toBe(true);
    expect(mockState.handlers.has('tasks:delete')).toBe(true);
  });

  it('tasks:getAll returns task list', async () => {
    mockState.mockGetAll.mockReturnValue([{ id: '1', title: 'Task 1' }]);
    const handler = mockState.handlers.get('tasks:getAll')!;
    const result = await handler({});
    expect(result).toEqual([{ id: '1', title: 'Task 1' }]);
  });

  it('tasks:getAll returns empty array on error', async () => {
    mockState.mockGetAll.mockImplementation(() => { throw new Error('DB error'); });
    const handler = mockState.handlers.get('tasks:getAll')!;
    const result = await handler({});
    expect(result).toEqual([]);
  });

  it('tasks:create returns created task', async () => {
    const handler = mockState.handlers.get('tasks:create')!;
    const result = await handler({}, { title: 'New Task' });
    expect(result).toEqual({ id: 'new-1', title: 'Created' });
  });

  it('tasks:create throws on error', async () => {
    mockState.mockCreate.mockImplementation(() => { throw new Error('Create failed'); });
    const handler = mockState.handlers.get('tasks:create')!;
    await expect(handler({}, { title: 'Fail' })).rejects.toThrow('Create failed');
  });

  it('tasks:update returns updated task', async () => {
    const handler = mockState.handlers.get('tasks:update')!;
    const result = await handler({}, '1', { title: 'Updated' });
    expect(result).toEqual({ id: '1', title: 'Updated' });
  });

  it('tasks:delete returns true on success', async () => {
    const handler = mockState.handlers.get('tasks:delete')!;
    const result = await handler({}, '1');
    expect(result).toBe(true);
  });
});
