import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createWorkspaceExport, digestWorkspace, digestWorkspaceExport } from '../api/workspaceRecovery';
import { createEmptyWorkspace, withComputedAnalytics } from '../shared/mvp/state';
import type { MvpWorkspaceSnapshot } from '../shared/mvp/types';
import {
  applyMigration,
  createPrismaMigrationDatabase,
  dryRunMigration,
  rollbackMigration,
  type MigrationDatabase,
} from './migrate-file-to-prisma';

const temporaryDirectories: string[] = [];

async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lifeos-migration-'));
  temporaryDirectories.push(directory);
  const authFile = path.join(directory, 'auth.json');
  const workspaceFile = path.join(directory, 'workspace.json');
  const ledgerFile = path.join(directory, 'ledger.json');
  const workspace = withComputedAnalytics({
    ...createEmptyWorkspace(),
    reflections: [{
      id: 'reflection-source-1',
      period: 'weekly' as const,
      body: 'kept semantically',
      createdAt: '2026-07-17T12:00:00.000Z',
    }],
  });
  const recovery = {
    id: 'recovery-source-1',
    export: createWorkspaceExport(createEmptyWorkspace(), '2026-07-16T12:00:00.000Z'),
  };
  await fs.writeFile(authFile, JSON.stringify({
    invites: [],
    users: [{
      id: 'usr-source-1',
      email: 'Person@Example.COM',
      passwordHash: 'secret-password-hash',
      fullName: 'Person',
      inviteCode: 'SECRET-INVITE',
      theme: 'dark',
      onboardingCompleted: false,
      sessionVersion: 2,
      createdAt: '2026-07-17T10:00:00.000Z',
      updatedAt: '2026-07-17T10:00:00.000Z',
    }],
  }));
  await fs.writeFile(workspaceFile, JSON.stringify({
    users: { 'usr-source-1': workspace },
    recoveries: { 'usr-source-1': [recovery] },
  }));
  return { directory, authFile, workspaceFile, ledgerFile, workspace, recovery };
}

function fakeDatabase(overrides: Partial<MigrationDatabase> = {}) {
  const fingerprints = new Map<string, Awaited<ReturnType<MigrationDatabase['readTargetFingerprint']>>>();
  const importedIds: string[] = [];
  const importedEmails: string[] = [];
  const deletedBatches: string[][] = [];
  const database: MigrationDatabase = {
    findIdentityCollisions: async () => [],
    findWorkspaceRecordCollisions: async () => [],
    async importUser(user, workspace, recoveries) {
      importedIds.push(user.id);
      importedEmails.push(user.email);
      fingerprints.set(user.id, {
        identityDigest: createHash('sha256').update(JSON.stringify({
          id: user.id,
          email: user.email.trim().toLowerCase(),
          inviteCode: user.inviteCode.trim(),
          fullName: user.fullName.trim(),
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        })).digest('hex'),
        workspaceDigest: digestWorkspace(workspace),
        recoveries: recoveries.map(({ id, export: portableExport }) => ({
          id,
          envelopeDigest: digestWorkspaceExport(portableExport),
        })).sort((left, right) => left.id.localeCompare(right.id)),
      });
    },
    async readTargetFingerprint(userId) {
      return structuredClone(fingerprints.get(userId) ?? null);
    },
    async deleteUsersIfUnchanged(expected) {
      for (const { userId, fingerprint } of expected) {
        const current = fingerprints.get(userId);
        if (current && JSON.stringify(current) !== JSON.stringify(fingerprint)) {
          throw new Error(`Rollback refused because target changed for user ${userId}`);
        }
      }
      const userIds = expected.map(({ userId }) => userId);
      deletedBatches.push([...userIds]);
      userIds.forEach((id) => fingerprints.delete(id));
    },
    close: async () => undefined,
    ...overrides,
  };
  return { database, importedIds, importedEmails, deletedBatches, fingerprints };
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(temporaryDirectories.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })));
});

describe('file-to-Prisma migration', () => {
  it('writes a versioned dry-run ledger without credentials and rejects collisions', async () => {
    const files = await fixture();
    const { database } = fakeDatabase();
    const ledger = await dryRunMigration({
      ...files,
      migrationId: '11111111-1111-4111-8111-111111111111',
      now: () => new Date('2026-07-17T13:00:00.000Z'),
    }, database);
    const rawLedger = await fs.readFile(files.ledgerFile, 'utf8');

    expect(ledger).toMatchObject({
      format: 'lifeos.file-to-prisma-migration',
      version: 1,
      status: 'validated',
      sourceSha256: { auth: expect.stringMatching(/^[a-f0-9]{64}$/), workspace: expect.stringMatching(/^[a-f0-9]{64}$/) },
      users: [{
        sourceUserId: 'usr-source-1',
        targetUserId: 'usr-source-1',
        workspaceRecords: [
          { kind: 'reflection', sourceId: 'reflection-source-1', targetId: 'reflection-source-1' },
          { kind: 'recovery', sourceId: 'recovery-source-1', targetId: 'recovery-source-1' },
        ],
        recoveries: [{ id: 'recovery-source-1', envelopeDigest: expect.stringMatching(/^[a-f0-9]{64}$/) }],
      }],
    });
    expect(rawLedger).not.toContain('passwordHash');
    expect(rawLedger).not.toContain('secret-password-hash');
    expect(rawLedger.toLowerCase()).not.toContain('person@example.com');
    expect(rawLedger).not.toContain('SECRET-INVITE');

    const colliding = fakeDatabase({ findWorkspaceRecordCollisions: async () => ['reflection-source-1'] });
    await expect(dryRunMigration({ ...files, ledgerFile: path.join(files.directory, 'collision.json') }, colliding.database))
      .rejects.toThrow('Workspace record collisions: reflection-source-1');
    const identityCollision = fakeDatabase({ findIdentityCollisions: async () => ['usr-existing'] });
    await expect(dryRunMigration({ ...files, ledgerFile: path.join(files.directory, 'identity-collision.json') }, identityCollision.database))
      .rejects.toThrow('Identity collisions: usr-existing');

    let scannedRecords: Array<{ kind: string; id: string }> = [];
    const recoveryCollision = fakeDatabase({
      findWorkspaceRecordCollisions: async (records) => {
        scannedRecords = records;
        return ['recovery:recovery-source-1'];
      },
    });
    await expect(dryRunMigration({ ...files, ledgerFile: path.join(files.directory, 'recovery-collision.json') }, recoveryCollision.database))
      .rejects.toThrow('recovery:recovery-source-1');
    expect(scannedRecords).toContainEqual({ kind: 'recovery', id: 'recovery-source-1' });
  });

  it('rejects retained recoveries whose owner has no source identity', async () => {
    const files = await fixture();
    const store = JSON.parse(await fs.readFile(files.workspaceFile, 'utf8'));
    store.recoveries['orphan-user'] = [files.recovery];
    await fs.writeFile(files.workspaceFile, JSON.stringify(store));

    await expect(dryRunMigration(files, fakeDatabase().database))
      .rejects.toThrow('Workspace recoveries have no matching identity: orphan-user');
  });

  it('queries target emails case-insensitively using the normalized source email', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const database = createPrismaMigrationDatabase({ user: { findMany } } as never);

    await database.findIdentityCollisions([{
      id: 'user-1', email: ' Person@Example.COM ', inviteCode: ' INVITE ',
    }]);

    expect(findMany).toHaveBeenCalledWith({
      where: { OR: [
        { id: 'user-1' },
        { email: { equals: 'person@example.com', mode: 'insensitive' } },
        { inviteCode: 'INVITE' },
      ] },
      select: { id: true },
    });
  });

  it('backs up sources before apply, preserves stable IDs, and verifies semantic equality', async () => {
    const files = await fixture();
    const backupDir = path.join(files.directory, 'backup');
    const { database, importedIds, importedEmails } = fakeDatabase();
    const ledger = await applyMigration({ ...files, backupDir }, database);

    expect(ledger.status).toBe('applied');
    expect(ledger.createdUserIds).toEqual(['usr-source-1']);
    expect(importedIds).toEqual(['usr-source-1']);
    expect(importedEmails).toEqual(['person@example.com']);
    await expect(fs.readFile(path.join(backupDir, 'auth-auth.json'), 'utf8'))
      .resolves.toBe(await fs.readFile(files.authFile, 'utf8'));
    await expect(fs.readFile(path.join(backupDir, 'workspace-workspace.json'), 'utf8'))
      .resolves.toBe(await fs.readFile(files.workspaceFile, 'utf8'));
  });

  it('refuses import when either source or backup bytes differ from the initial hashes', async () => {
    const files = await fixture();
    const { database, importedIds } = fakeDatabase();
    const copyFile = fs.copyFile.bind(fs);
    vi.spyOn(fs, 'copyFile').mockImplementation(async (source, destination, mode) => {
      await copyFile(source, destination, mode);
      if (String(destination).includes('workspace-workspace.json')) {
        await fs.appendFile(files.workspaceFile, '\n');
      }
    });

    await expect(applyMigration(files, database))
      .rejects.toThrow('Source or backup changed before migration import');
    expect(importedIds).toEqual([]);
  });

  it('refuses import when a copied backup does not match the initial source hash', async () => {
    const files = await fixture();
    const { database, importedIds } = fakeDatabase();
    const copyFile = fs.copyFile.bind(fs);
    vi.spyOn(fs, 'copyFile').mockImplementation(async (source, destination, mode) => {
      await copyFile(source, destination, mode);
      if (String(destination).includes('workspace-workspace.json')) {
        await fs.appendFile(destination, '\n');
      }
    });

    await expect(applyMigration(files, database))
      .rejects.toThrow('Source or backup changed before migration import');
    expect(importedIds).toEqual([]);
  });

  it('rolls back only user IDs recorded as created by the migration', async () => {
    const files = await fixture();
    const { database, deletedBatches } = fakeDatabase();
    await applyMigration({ ...files }, database);
    const ledger = await rollbackMigration(files.ledgerFile, database);

    expect(ledger.status).toBe('rolled-back');
    expect(deletedBatches).toEqual([['usr-source-1']]);
  });

  it('refuses manual rollback after any identity, workspace, or recovery fingerprint changes', async () => {
    const files = await fixture();
    const { database, deletedBatches, fingerprints } = fakeDatabase();
    await applyMigration({ ...files }, database);
    const current = fingerprints.get('usr-source-1')!;
    for (const drifted of [
      { ...current!, identityDigest: '0'.repeat(64) },
      { ...current!, workspaceDigest: '0'.repeat(64) },
      { ...current!, recoveries: [{ id: 'recovery-source-1', envelopeDigest: '0'.repeat(64) }] },
    ]) {
      fingerprints.set('usr-source-1', drifted);
      await expect(rollbackMigration(files.ledgerFile, database))
        .rejects.toThrow('Rollback refused because target changed for user usr-source-1');
    }
    expect(deletedBatches).toEqual([]);
  });

  it('treats an absent target as a safe rollback no-op for an applying ledger', async () => {
    const files = await fixture();
    const { database, deletedBatches, fingerprints } = fakeDatabase();
    await applyMigration(files, database);
    fingerprints.delete('usr-source-1');
    const ledger = JSON.parse(await fs.readFile(files.ledgerFile, 'utf8'));
    ledger.status = 'applying';
    await fs.writeFile(files.ledgerFile, JSON.stringify(ledger));

    await expect(rollbackMigration(files.ledgerFile, database)).resolves.toMatchObject({ status: 'rolled-back' });
    expect(deletedBatches).toEqual([['usr-source-1']]);
  });

  it('automatically cleans the ledger when transactional import verification aborts', async () => {
    const files = await fixture();
    const { database, deletedBatches } = fakeDatabase({
      importUser: async () => { throw new Error('Migration import verification failed for user usr-source-1'); },
    });

    await expect(applyMigration({ ...files }, database)).rejects.toThrow(
      'Migration import verification failed for user usr-source-1',
    );
    expect(deletedBatches).toEqual([['usr-source-1']]);
    expect(JSON.parse(await fs.readFile(files.ledgerFile, 'utf8'))).toMatchObject({
      status: 'rolled-back',
      createdUserIds: ['usr-source-1'],
    });
  });
});
