import { createHash } from 'node:crypto';

import type Database from 'better-sqlite3';

import type { MvpRepository } from '../../api/mvpRepository.types';

const LEGACY_TABLES = [
  'tasks',
  'habits',
  'journal_entries',
  'university_courses',
  'university_assignments',
  'transactions',
  'health_metrics',
  'medication_reminders',
] as const;

type IdentitySource = 'local' | 'supabase' | 'test' | 'unknown';
type Row = Record<string, unknown>;

const checksum = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

export async function createDesktopExport(
  db: Database.Database,
  repository: MvpRepository,
  sourceUserId: string,
  identitySource: IdentitySource,
) {
  const existingTables = new Set(
    (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as Array<{ name: string }>)
      .map(({ name }) => name),
  );
  const legacy: Record<string, Row[]> = {};
  const unmapped: Record<string, { count: number }> = {};

  for (const table of LEGACY_TABLES) {
    if (!existingTables.has(table)) continue;
    legacy[table] = db.prepare(`SELECT * FROM ${table} WHERE user_id = ?`).all(sourceUserId) as Row[];
    unmapped[table] = db.prepare(
      `SELECT COUNT(*) AS count FROM ${table} WHERE user_id IS NULL OR TRIM(user_id) = ''`,
    ).get() as { count: number };
  }

  const syncQueueCount = existingTables.has('sync_queue')
    ? (db.prepare('SELECT COUNT(*) AS count FROM sync_queue').get() as { count: number }).count
    : 0;
  const workspace = await repository.exportWorkspace(sourceUserId);
  const recoveries = await repository.listRecoveries(sourceUserId);
  const data = { workspace, recoveries, legacy, unmapped };
  const sourceIdentity = { runtime: 'electron' as const, sourceUserId, identitySource };
  const excluded = {
    authSession: 'tokens are credentials and are never exported',
    syncQueue: { count: syncQueueCount, reason: 'owner cannot be proved and payload may contain credentials' },
  };

  return {
    format: 'lifeos.desktop.export' as const,
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    sourceIdentity,
    data,
    excluded,
    checksum: checksum({ sourceIdentity, data, excluded }),
  };
}
