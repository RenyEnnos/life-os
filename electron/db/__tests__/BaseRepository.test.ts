import { describe, it, expect, vi, beforeEach } from 'vitest';

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
  run: vi.fn().mockReturnValue({ changes: 1 }),
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

// Simulate PRAGMA table_info returning task columns
const taskColumns = [
  { name: 'id' }, { name: 'user_id' }, { name: 'title' }, { name: 'description' },
  { name: 'status' }, { name: 'completed' }, { name: 'priority' }, { name: 'due_date' },
  { name: 'project_id' }, { name: 'tags' }, { name: 'energy_level' }, { name: 'time_block' },
  { name: 'position' }, { name: 'is_deleted' }, { name: 'version' },
  { name: 'created_at' }, { name: 'updated_at' },
];

describe('BaseRepository', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Default: PRAGMA returns task columns for column validation
    mockPrepare.mockReturnValue({
      all: vi.fn().mockReturnValue(taskColumns),
      get: vi.fn().mockReturnValue(null),
      run: vi.fn().mockReturnValue({ changes: 1 }),
    });
    // Initialize the database
    const { initDb } = await import('../database');
    initDb();
  });

  it('throws for disallowed table names', async () => {
    const { BaseRepository } = await import('../BaseRepository');
    expect(() => new BaseRepository('evil_table')).toThrow('not in the allowed tables list');
  });

  it('allows valid table names', async () => {
    const { BaseRepository } = await import('../BaseRepository');
    expect(() => new BaseRepository('tasks')).not.toThrow();
    expect(() => new BaseRepository('habits')).not.toThrow();
    expect(() => new BaseRepository('transactions')).not.toThrow();
  });

  it('getAll returns array from database', async () => {
    mockPrepare.mockReturnValue({
      all: vi.fn().mockReturnValue([{ id: '1', title: 'Task 1' }]),
      get: vi.fn(),
      run: vi.fn(),
    });
    const { BaseRepository } = await import('../BaseRepository');
    const repo = new BaseRepository('tasks');
    const result = repo.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getById returns null for non-existent record', async () => {
    mockPrepare.mockReturnValue({
      all: vi.fn().mockReturnValue(taskColumns),
      get: vi.fn().mockReturnValue(null),
      run: vi.fn(),
    });
    const { BaseRepository } = await import('../BaseRepository');
    const repo = new BaseRepository('tasks');
    const result = repo.getById('non-existent');
    expect(result).toBeNull();
  });

  it('create inserts a new record and enqueues sync', async () => {
    const { BaseRepository } = await import('../BaseRepository');
    const repo = new BaseRepository('tasks');
    const result = repo.create({ title: 'New Task', user_id: 'user-1' });
    expect(result).toBeTruthy();
    expect(result.title).toBe('New Task');
    expect(result.id).toBeTruthy();
  });

  it('delete soft-deletes a record', async () => {
    const { BaseRepository } = await import('../BaseRepository');
    const repo = new BaseRepository('tasks');
    const result = repo.delete('1');
    expect(result).toBe(true);
  });
});
