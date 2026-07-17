import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { authStateSchema, type StoredUser } from '../api/authRepository';
import { writeJsonFile } from '../api/atomicJsonFile';
import { persistedMvpStoreSchema } from '../api/mvpRepository';
import { PrismaBackedMvpRepository } from '../api/prismaMvpRepository';
import {
  digestWorkspace,
  digestWorkspaceExport,
  normalizeWorkspace,
  workspaceExportSchema,
  type MvpWorkspaceRecovery,
} from '../api/workspaceRecovery';
import { createEmptyWorkspace } from '../shared/mvp/state';
import type { MvpWorkspaceSnapshot } from '../shared/mvp/types';

const LEDGER_FORMAT = 'lifeos.file-to-prisma-migration';
const LEDGER_VERSION = 1;

const ledgerSchema = z.object({
  format: z.literal(LEDGER_FORMAT),
  version: z.literal(LEDGER_VERSION),
  migrationId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  status: z.enum(['validated', 'applying', 'applied', 'rolled-back']),
  sourceSha256: z.object({ auth: z.string().length(64), workspace: z.string().length(64) }).strict(),
  backups: z.object({ auth: z.string(), workspace: z.string() }).strict().nullable(),
  users: z.array(z.object({
    sourceUserId: z.string(),
    targetUserId: z.string(),
    identityDigest: z.string().length(64),
    emailSha256: z.string().length(64),
    inviteCodeSha256: z.string().length(64),
    workspaceRecords: z.array(z.object({ kind: z.string(), sourceId: z.string(), targetId: z.string() }).strict()),
    semanticDigest: z.string().length(64),
    recoveries: z.array(z.object({ id: z.string(), envelopeDigest: z.string().length(64) }).strict()),
  }).strict()),
  createdUserIds: z.array(z.string()),
}).strict();

export type MigrationLedger = z.infer<typeof ledgerSchema>;

interface SourceUser {
  user: StoredUser;
  workspace: MvpWorkspaceSnapshot;
  recoveries: MvpWorkspaceRecovery[];
  records: WorkspaceRecord[];
}

type WorkspaceRecordKind = 'review' | 'plan' | 'priority' | 'action' | 'reflection' | 'feedback' | 'event' | 'recovery';
export interface WorkspaceRecord { kind: WorkspaceRecordKind; id: string }

export interface TargetFingerprint {
  identityDigest: string;
  workspaceDigest: string;
  recoveries: Array<{ id: string; envelopeDigest: string }>;
}

export interface MigrationDatabase {
  findIdentityCollisions(users: Array<{ id: string; email: string; inviteCode: string }>): Promise<string[]>;
  findWorkspaceRecordCollisions(records: WorkspaceRecord[]): Promise<string[]>;
  importUser(user: StoredUser, workspace: MvpWorkspaceSnapshot, recoveries: MvpWorkspaceRecovery[]): Promise<void>;
  readTargetFingerprint(userId: string): Promise<TargetFingerprint | null>;
  deleteUsersIfUnchanged(expected: Array<{ userId: string; fingerprint: TargetFingerprint }>): Promise<void>;
  close(): Promise<void>;
}

export interface MigrationOptions {
  authFile: string;
  workspaceFile: string;
  ledgerFile: string;
  backupDir?: string;
  now?: () => Date;
  migrationId?: string;
}

function sha256(value: string | Buffer) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizedIdentity(user: Pick<StoredUser, 'id' | 'email' | 'inviteCode' | 'fullName' | 'createdAt' | 'updatedAt'>) {
  return {
    id: user.id,
    email: user.email.trim().toLowerCase(),
    inviteCode: user.inviteCode.trim(),
    fullName: user.fullName.trim(),
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: new Date(user.updatedAt).toISOString(),
  };
}

function digestIdentity(user: Pick<StoredUser, 'id' | 'email' | 'inviteCode' | 'fullName' | 'createdAt' | 'updatedAt'>) {
  return sha256(JSON.stringify(normalizedIdentity(user)));
}

function recoveryFingerprints(recoveries: MvpWorkspaceRecovery[]) {
  return recoveries
    .map(({ id, export: portableExport }) => ({ id, envelopeDigest: digestWorkspaceExport(portableExport) }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function representedRecordIds(workspace: MvpWorkspaceSnapshot) {
  return [
    ...(workspace.review.id ? [{ kind: 'review' as const, id: workspace.review.id }] : []),
    ...(workspace.plan.id ? [{ kind: 'plan' as const, id: workspace.plan.id }] : []),
    ...workspace.plan.priorities.flatMap((priority) => [
      { kind: 'priority' as const, id: priority.id },
      ...priority.actions.map((action) => ({ kind: 'action' as const, id: action.id })),
    ]),
    ...workspace.reflections.map((entry) => ({ kind: 'reflection' as const, id: entry.id })),
    ...workspace.feedback.map((entry) => ({ kind: 'feedback' as const, id: entry.id })),
    ...workspace.events.map((entry) => ({ kind: 'event' as const, id: entry.id })),
  ];
}

async function readSource(options: MigrationOptions) {
  const [authRaw, workspaceRaw] = await Promise.all([
    fs.readFile(options.authFile),
    fs.readFile(options.workspaceFile),
  ]);
  const auth = authStateSchema.parse(JSON.parse(authRaw.toString('utf8')));
  const store = persistedMvpStoreSchema.parse(JSON.parse(workspaceRaw.toString('utf8')));
  const users: SourceUser[] = auth.users.map((user) => {
    const workspace = store.users[user.id] === undefined
      ? createEmptyWorkspace()
      : normalizeWorkspace(store.users[user.id] as MvpWorkspaceSnapshot);
    const recoveries = (store.recoveries[user.id] ?? []).map((recovery) => ({
      id: recovery.id,
      export: workspaceExportSchema.parse(recovery.export),
    }));
    return {
      user: { ...user, email: user.email.trim().toLowerCase() },
      workspace,
      recoveries,
      records: [
        ...representedRecordIds(workspace),
        ...recoveries.map(({ id }) => ({ kind: 'recovery' as const, id })),
      ],
    };
  });

  const authUserIds = new Set(users.map(({ user }) => user.id));
  const orphanWorkspaceIds = Object.keys(store.users).filter((id) => !authUserIds.has(id));
  if (orphanWorkspaceIds.length > 0) {
    throw new Error(`Workspace users have no matching identity: ${orphanWorkspaceIds.join(', ')}`);
  }
  const orphanRecoveryIds = Object.keys(store.recoveries).filter((id) => !authUserIds.has(id));
  if (orphanRecoveryIds.length > 0) {
    throw new Error(`Workspace recoveries have no matching identity: ${orphanRecoveryIds.join(', ')}`);
  }

  const duplicate = (values: string[]) => values.find((value, index) => values.indexOf(value) !== index);
  const duplicateIdentity = duplicate(users.flatMap(({ user }) => [
    `id:${user.id}`,
    `email:${user.email.trim().toLowerCase()}`,
    ...(user.inviteCode ? [`invite:${user.inviteCode}`] : []),
  ]));
  if (duplicateIdentity) throw new Error(`Duplicate source identity: ${duplicateIdentity.split(':')[0]}`);
  const duplicateRecord = duplicate(users.flatMap(({ records }) => records.map(({ kind, id }) => `${kind}:${id}`)));
  if (duplicateRecord) throw new Error(`Duplicate source workspace record ID: ${duplicateRecord}`);

  return {
    users,
    sourceSha256: { auth: sha256(authRaw), workspace: sha256(workspaceRaw) },
  };
}

async function writeLedger(file: string, ledger: MigrationLedger) {
  await writeJsonFile(file, ledgerSchema, ledger);
  await fs.chmod(file, 0o600);
}

async function validateCollisions(source: Awaited<ReturnType<typeof readSource>>, db: MigrationDatabase) {
  const identities = source.users.map(({ user }) => ({ id: user.id, email: user.email, inviteCode: user.inviteCode }));
  const [identityCollisions, recordCollisions] = await Promise.all([
    db.findIdentityCollisions(identities),
    db.findWorkspaceRecordCollisions(source.users.flatMap(({ records }) => records)),
  ]);
  if (identityCollisions.length || recordCollisions.length) {
    throw new Error([
      identityCollisions.length ? `Identity collisions: ${identityCollisions.join(', ')}` : '',
      recordCollisions.length ? `Workspace record collisions: ${recordCollisions.join(', ')}` : '',
    ].filter(Boolean).join('; '));
  }
}

function createLedger(source: Awaited<ReturnType<typeof readSource>>, options: MigrationOptions): MigrationLedger {
  return {
    format: LEDGER_FORMAT,
    version: LEDGER_VERSION,
    migrationId: options.migrationId ?? randomUUID(),
    createdAt: (options.now?.() ?? new Date()).toISOString(),
    status: 'validated',
    sourceSha256: source.sourceSha256,
    backups: null,
    users: source.users.map(({ user, workspace, recoveries, records }) => ({
      sourceUserId: user.id,
      targetUserId: user.id,
      identityDigest: digestIdentity(user),
      emailSha256: sha256(user.email.trim().toLowerCase()),
      inviteCodeSha256: sha256(user.inviteCode),
      workspaceRecords: records.map(({ kind, id }) => ({ kind, sourceId: id, targetId: id })),
      semanticDigest: digestWorkspace(workspace),
      recoveries: recoveryFingerprints(recoveries),
    })),
    createdUserIds: [],
  };
}

export async function dryRunMigration(options: MigrationOptions, db: MigrationDatabase) {
  const source = await readSource(options);
  await validateCollisions(source, db);
  const ledger = createLedger(source, options);
  await writeLedger(options.ledgerFile, ledger);
  return ledger;
}

export async function applyMigration(options: MigrationOptions, db: MigrationDatabase) {
  const source = await readSource(options);
  await validateCollisions(source, db);
  const ledger = createLedger(source, options);
  const backupDir = options.backupDir ?? path.join(path.dirname(options.ledgerFile), `${ledger.migrationId}-backup`);
  await fs.mkdir(backupDir, { recursive: true });
  const backups = {
    auth: path.join(backupDir, `auth-${path.basename(options.authFile)}`),
    workspace: path.join(backupDir, `workspace-${path.basename(options.workspaceFile)}`),
  };
  await Promise.all([
    fs.copyFile(options.authFile, backups.auth, fs.constants.COPYFILE_EXCL),
    fs.copyFile(options.workspaceFile, backups.workspace, fs.constants.COPYFILE_EXCL),
  ]);
  await Promise.all([fs.chmod(backups.auth, 0o600), fs.chmod(backups.workspace, 0o600)]);
  const [backupAuth, backupWorkspace, currentAuth, currentWorkspace] = await Promise.all([
    fs.readFile(backups.auth),
    fs.readFile(backups.workspace),
    fs.readFile(options.authFile),
    fs.readFile(options.workspaceFile),
  ]);
  if (
    sha256(backupAuth) !== source.sourceSha256.auth
    || sha256(currentAuth) !== source.sourceSha256.auth
    || sha256(backupWorkspace) !== source.sourceSha256.workspace
    || sha256(currentWorkspace) !== source.sourceSha256.workspace
  ) {
    throw new Error('Source or backup changed before migration import');
  }
  ledger.backups = backups;
  ledger.status = 'applying';
  await writeLedger(options.ledgerFile, ledger);

  try {
    for (const { user, workspace, recoveries } of source.users) {
      ledger.createdUserIds.push(user.id);
      await writeLedger(options.ledgerFile, ledger);
      await db.importUser(user, workspace, recoveries);
      const expected = ledger.users.find(({ targetUserId }) => targetUserId === user.id)!;
      const imported = await db.readTargetFingerprint(user.id);
      if (!imported || !fingerprintsEqual(imported, ledgerFingerprint(expected))) {
        throw new Error(`Semantic verification failed for user ${user.id}`);
      }
    }
  } catch (error) {
    try {
      await deleteLedgerUsers(ledger, db);
      ledger.status = 'rolled-back';
      await writeLedger(options.ledgerFile, ledger);
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'Migration failed and automatic rollback also failed');
    }
    throw error;
  }

  ledger.status = 'applied';
  await writeLedger(options.ledgerFile, ledger);
  return ledger;
}

export async function rollbackMigration(ledgerFile: string, db: MigrationDatabase) {
  const ledger = ledgerSchema.parse(JSON.parse(await fs.readFile(ledgerFile, 'utf8')));
  if (ledger.status !== 'applying' && ledger.status !== 'applied') {
    throw new Error(`Ledger cannot be rolled back from status ${ledger.status}`);
  }
  await deleteLedgerUsers(ledger, db);
  ledger.status = 'rolled-back';
  await writeLedger(ledgerFile, ledger);
  return ledger;
}

function deleteLedgerUsers(ledger: MigrationLedger, db: MigrationDatabase) {
  return db.deleteUsersIfUnchanged(
    ledger.users
      .filter(({ targetUserId }) => ledger.createdUserIds.includes(targetUserId))
      .map((user) => ({ userId: user.targetUserId, fingerprint: ledgerFingerprint(user) })),
  );
}

function ledgerFingerprint(user: MigrationLedger['users'][number]): TargetFingerprint {
  return {
    identityDigest: user.identityDigest,
    workspaceDigest: user.semanticDigest,
    recoveries: [...user.recoveries].sort((left, right) => left.id.localeCompare(right.id)),
  };
}

function fingerprintsEqual(left: TargetFingerprint, right: TargetFingerprint) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createPrismaMigrationDatabase(prisma = new PrismaClient()): MigrationDatabase {
  const repository = new PrismaBackedMvpRepository(prisma);
  return {
    async findIdentityCollisions(users) {
      if (!users.length) return [];
      const rows = await prisma.user.findMany({
        where: { OR: users.flatMap((user) => [
          { id: user.id },
          { email: { equals: user.email.trim().toLowerCase(), mode: 'insensitive' as const } },
          ...(user.inviteCode.trim() ? [{ inviteCode: user.inviteCode.trim() }] : []),
        ]) },
        select: { id: true },
      });
      return rows.map(({ id }) => id);
    },
    async findWorkspaceRecordCollisions(records) {
      if (!records.length) return [];
      const ids = (kind: WorkspaceRecordKind) => records.filter((record) => record.kind === kind).map((record) => record.id);
      const [reviews, plans, priorities, actions, reflections, feedback, events, recoveries] = await Promise.all([
        prisma.weeklyReview.findMany({ where: { id: { in: ids('review') } }, select: { id: true } }),
        prisma.weeklyPlan.findMany({ where: { id: { in: ids('plan') } }, select: { id: true } }),
        prisma.weeklyPriority.findMany({ where: { id: { in: ids('priority') } }, select: { id: true } }),
        prisma.actionItem.findMany({ where: { id: { in: ids('action') } }, select: { id: true } }),
        prisma.reflectionEntry.findMany({ where: { id: { in: ids('reflection') } }, select: { id: true } }),
        prisma.feedbackEntry.findMany({ where: { id: { in: ids('feedback') } }, select: { id: true } }),
        prisma.mvpEventLog.findMany({ where: { id: { in: ids('event') } }, select: { id: true } }),
        prisma.mvpWorkspaceRecovery.findMany({ where: { id: { in: ids('recovery') } }, select: { id: true } }),
      ]);
      return [
        ...reviews.map(({ id }) => `review:${id}`),
        ...plans.map(({ id }) => `plan:${id}`),
        ...priorities.map(({ id }) => `priority:${id}`),
        ...actions.map(({ id }) => `action:${id}`),
        ...reflections.map(({ id }) => `reflection:${id}`),
        ...feedback.map(({ id }) => `feedback:${id}`),
        ...events.map(({ id }) => `event:${id}`),
        ...recoveries.map(({ id }) => `recovery:${id}`),
      ];
    },
    async importUser(user, workspace, recoveries) {
      await repository.importMigratedUser(user, workspace, recoveries);
    },
    async readTargetFingerprint(userId) {
      const identity = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, inviteCode: true, fullName: true, createdAt: true, updatedAt: true },
      });
      if (!identity) return null;
      const [workspace, recoveries] = await Promise.all([
        repository.getWorkspace(userId),
        prisma.mvpWorkspaceRecovery.findMany({ where: { userId }, select: { id: true, payload: true } }),
      ]);
      return {
        identityDigest: digestIdentity({
          id: identity.id,
          email: identity.email,
          inviteCode: identity.inviteCode ?? '',
          fullName: identity.fullName ?? '',
          createdAt: identity.createdAt.toISOString(),
          updatedAt: identity.updatedAt.toISOString(),
        }),
        workspaceDigest: digestWorkspace(workspace),
        recoveries: recoveryFingerprints(recoveries.map(({ id, payload }) => ({
          id,
          export: workspaceExportSchema.parse(payload),
        }))),
      };
    },
    deleteUsersIfUnchanged: (expected) => repository.deleteMigratedUsersIfUnchanged(expected),
    close: () => prisma.$disconnect(),
  };
}

function parseCli(argv: string[]) {
  const [command, ...args] = argv;
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!flag?.startsWith('--') || !value) throw new Error(`Invalid argument: ${flag ?? ''}`);
    values.set(flag.slice(2), value);
  }
  const required = (name: string) => {
    const value = values.get(name);
    if (!value) throw new Error(`Missing --${name}`);
    return path.resolve(value);
  };
  if (command === 'rollback') return { command, ledgerFile: required('ledger') } as const;
  if (command !== 'dry-run' && command !== 'apply') {
    throw new Error('Usage: migrate-file-to-prisma.ts <dry-run|apply|rollback> --ledger FILE [--auth-file FILE --workspace-file FILE --backup-dir DIR]');
  }
  return {
    command,
    options: {
      authFile: required('auth-file'),
      workspaceFile: required('workspace-file'),
      ledgerFile: required('ledger'),
      backupDir: values.has('backup-dir') ? required('backup-dir') : undefined,
    },
  } as const;
}

async function main() {
  const parsed = parseCli(process.argv.slice(2));
  const db = createPrismaMigrationDatabase();
  try {
    const ledger = parsed.command === 'rollback'
      ? await rollbackMigration(parsed.ledgerFile, db)
      : parsed.command === 'apply'
        ? await applyMigration(parsed.options, db)
        : await dryRunMigration(parsed.options, db);
    process.stdout.write(`${ledger.status}: ${ledger.users.length} user(s); ledger ${parsed.command === 'rollback' ? parsed.ledgerFile : parsed.options.ledgerFile}\n`);
  } finally {
    await db.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
