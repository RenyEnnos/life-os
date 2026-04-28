import { describe, it, expect, vi } from 'vitest';

const mockPrepare = vi.fn();
const mockDb = {
  prepare: mockPrepare,
  exec: vi.fn(),
  pragma: vi.fn(),
  transaction: vi.fn((fn: () => void) => fn),
};

const mockStatement = {
  all: vi.fn().mockReturnValue([]),
  get: vi.fn().mockReturnValue(null),
  run: vi.fn().mockReturnValue({ changes: 0 }),
};

mockPrepare.mockReturnValue(mockStatement);

vi.mock('better-sqlite3', () => ({
  default: vi.fn().mockImplementation(() => mockDb),
}));

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/tmp'),
    isPackaged: false,
    getAppPath: vi.fn(() => '/tmp'),
  },
}));

describe('database', () => {
  it('getDbPath returns a path ending with lifeos.db', async () => {
    const { getDbPath } = await import('../database');
    const dbPath = getDbPath();
    expect(dbPath).toContain('lifeos.db');
  });

  it('initDb creates a database, enables WAL, and creates tables', async () => {
    const { initDb } = await import('../database');
    const db = initDb();
    expect(db).toBeTruthy();
    expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
    // createSchema calls db.exec with CREATE TABLE statements
    expect(mockDb.exec).toHaveBeenCalled();
  });

  it('getDb returns the same instance as initDb', async () => {
    const { initDb, getDb } = await import('../database');
    const db1 = initDb();
    const db2 = getDb();
    expect(db1).toBe(db2);
  });
});
