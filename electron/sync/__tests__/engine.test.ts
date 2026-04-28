import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
  prepare: vi.fn().mockReturnValue({
    all: vi.fn().mockReturnValue([]),
    get: vi.fn().mockReturnValue(null),
    run: vi.fn().mockReturnValue({ changes: 0 }),
  }),
  exec: vi.fn(),
  pragma: vi.fn(),
  transaction: vi.fn((fn: () => void) => fn),
}));

vi.mock('better-sqlite3', () => ({
  default: vi.fn().mockImplementation(() => mockDb),
}));

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/tmp'),
    isPackaged: false,
    getAppPath: vi.fn(() => '/tmp'),
  },
  net: {
    isOnline: vi.fn().mockReturnValue(true),
  },
}));

vi.mock('../../auth/desktopSession', () => ({
  createDesktopSupabaseClient: vi.fn(),
  hydrateDesktopSession: vi.fn().mockResolvedValue(undefined),
}));

describe('sync engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('startSyncEngine is a function', async () => {
    const { startSyncEngine } = await import('../engine');
    expect(typeof startSyncEngine).toBe('function');
  });

  it('startSyncEngine does not throw when called', async () => {
    const { startSyncEngine } = await import('../engine');
    expect(() => startSyncEngine()).not.toThrow();
  });

  it('startSyncEngine returns early when Supabase client creation fails', async () => {
    const { createDesktopSupabaseClient } = await import('../../auth/desktopSession');
    vi.mocked(createDesktopSupabaseClient).mockImplementation(() => { throw new Error('No config'); });

    const { startSyncEngine } = await import('../engine');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    startSyncEngine();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing Supabase configuration'),
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
