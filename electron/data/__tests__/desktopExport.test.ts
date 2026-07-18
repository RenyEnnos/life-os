// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import type { MvpRepository } from '../../../api/mvpRepository.types';
import { createDesktopExport } from '../desktopExport';

describe('desktop data export', () => {
  it('exports only the selected identity and never serializes tokens or the sync queue', async () => {
    const rows = {
      tasks: [
        { id: 'a', user_id: 'desktop-a', title: 'PRIVATE A' },
        { id: 'b', user_id: 'desktop-b', title: 'PRIVATE B' },
      ],
      journal_entries: [{ id: 'orphan', user_id: null, content: 'UNMAPPED' }],
      sync_queue: [{ id: 'q', payload: 'SYNC-SECRET' }],
      auth_session: [{ user_id: 'desktop-a', access_token: 'ACCESS-SECRET', refresh_token: 'REFRESH-SECRET' }],
    };
    const db = {
      prepare: (sql: string) => ({
        all: (userId?: string) => {
          if (sql.includes('sqlite_master')) return Object.keys(rows).map((name) => ({ name }));
          const table = Object.keys(rows).find((name) => sql.includes(`FROM ${name}`)) as keyof typeof rows;
          const tableRows = rows[table] as Array<Record<string, unknown>>;
          return userId
            ? tableRows.filter(({ user_id }) => user_id === userId)
            : tableRows.filter(({ user_id }) => user_id == null || user_id === '');
        },
        get: () => sql.includes('sync_queue')
          ? ({ count: rows.sync_queue.length })
          : ({ count: rows.journal_entries.filter(({ user_id }) => user_id == null).length }),
      }),
    };
    const repository = {
      exportWorkspace: vi.fn().mockResolvedValue({ userId: 'desktop-a', plans: ['MVP A'] }),
      listRecoveries: vi.fn().mockResolvedValue([{ id: 'recovery-a' }]),
    } as unknown as MvpRepository;

    const result = await createDesktopExport(db as never, repository, 'desktop-a', 'local');
    const serialized = JSON.stringify(result);

    expect(result.sourceIdentity).toEqual({
      runtime: 'electron', sourceUserId: 'desktop-a', identitySource: 'local',
    });
    expect(result.data.legacy.tasks).toEqual([{ id: 'a', user_id: 'desktop-a', title: 'PRIVATE A' }]);
    expect(result.data.unmapped.journal_entries).toEqual({ count: 1 });
    expect(result.excluded.syncQueue.count).toBe(1);
    expect(serialized).not.toContain('PRIVATE B');
    expect(serialized).not.toContain('ACCESS-SECRET');
    expect(serialized).not.toContain('REFRESH-SECRET');
    expect(serialized).not.toContain('SYNC-SECRET');
    expect(serialized).not.toContain('UNMAPPED');
  });
});
