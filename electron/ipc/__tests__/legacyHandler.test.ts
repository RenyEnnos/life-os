import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => {
  const handlers = new Map<string, (event: unknown, ...args: unknown[]) => Promise<unknown>>();
  const db = {
    exec: vi.fn(),
    prepare: vi.fn(() => ({
      get: vi.fn(),
      all: vi.fn(() => []),
      run: vi.fn(),
    })),
  };

  return {
    handlers,
    db,
  };
});

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, handler: (event: unknown, ...args: unknown[]) => Promise<unknown>) => {
      mockState.handlers.set(channel, handler);
    }),
  },
}));

vi.mock('../../db/database', () => ({
  getDb: () => mockState.db,
}));

import { setupLegacyHandlers } from '../legacyHandler';

describe('setupLegacyHandlers', () => {
  beforeEach(() => {
    mockState.handlers.clear();
    vi.clearAllMocks();
    setupLegacyHandlers();
  });

  it('rejects nested API routes instead of corrupting them into legacy resources', async () => {
    const handler = mockState.handlers.get('api:legacy');

    await expect(handler?.({}, 'GET', '/api/mvp/workspace')).rejects.toThrow(
      'Legacy IPC only supports top-level resource routes.',
    );
  });
});
