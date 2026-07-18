import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createEmptyWorkspace, withComputedAnalytics } from '../../shared/mvp/state';
import { PrismaBackedMvpRepository } from '../prismaMvpRepository';
import { createWorkspaceExport } from '../workspaceRecovery';

function transactionDouble() {
  const empty = vi.fn().mockResolvedValue([]);
  return {
    user: { create: vi.fn(), findUnique: vi.fn(), deleteMany: vi.fn() },
    userProfile: { findUnique: vi.fn().mockResolvedValue(null), create: vi.fn(), deleteMany: vi.fn() },
    goal: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    commitment: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    weeklyReview: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), deleteMany: vi.fn() },
    weeklyPlan: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn(), deleteMany: vi.fn() },
    dailyCheckIn: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    reflectionEntry: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    feedbackEntry: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    mvpEventLog: { findMany: empty, createMany: vi.fn(), deleteMany: vi.fn() },
    mvpWorkspaceRecovery: {
      create: vi.fn().mockResolvedValue({ id: 'recovery-1' }),
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn(),
    },
  };
}

describe('Prisma workspace recovery', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retains the prepared export before deleting workspace rows in one interactive transaction', async () => {
    const tx = transactionDouble();
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const prepared = createWorkspaceExport(createEmptyWorkspace(), '2026-07-17T12:00:00.000Z');

    const result = await repository.resetWorkspace('user-1', prepared);

    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
    expect(tx.mvpWorkspaceRecovery.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      userId: 'user-1', format: 'lifeos.mvp.workspace', version: 1,
    }) });
    expect(tx.mvpWorkspaceRecovery.create.mock.invocationCallOrder[0])
      .toBeLessThan(tx.mvpEventLog.deleteMany.mock.invocationCallOrder[0]);
    expect(tx.mvpWorkspaceRecovery.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'user-1', id: { not: 'recovery-1' } }, skip: 4,
    }));
    expect(result).toEqual(expect.objectContaining({ recoveryId: 'recovery-1', export: prepared }));
  });

  it('does not retain or delete when the prepared export is stale', async () => {
    const tx = transactionDouble();
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const staleWorkspace = structuredClone(createEmptyWorkspace());
    staleWorkspace.onboarding.displayName = 'changed';
    const stale = createWorkspaceExport(staleWorkspace);

    await expect(repository.resetWorkspace('user-1', stale)).rejects.toThrow('Workspace changed after export');
    expect(tx.mvpWorkspaceRecovery.create).not.toHaveBeenCalled();
    expect(tx.mvpEventLog.deleteMany).not.toHaveBeenCalled();
  });

  it('returns only the latest recovery scoped to the user', async () => {
    const portableExport = createWorkspaceExport(createEmptyWorkspace(), '2026-07-17T12:00:00.000Z');
    const findFirst = vi.fn().mockResolvedValue({ id: 'recovery-1', payload: portableExport });
    const repository = new PrismaBackedMvpRepository({ mvpWorkspaceRecovery: { findFirst } } as never);

    await expect(repository.getLatestRecovery('user-1')).resolves.toEqual({ id: 'recovery-1', export: portableExport });
    expect(findFirst).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  });

  it('strictly replaces rows and preserves every represented relational id and timestamp', async () => {
    const tx = transactionDouble();
    tx.weeklyReview.create.mockResolvedValue({ id: 'review-1' });
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const generatedAt = '2026-07-14T10:00:00.000Z';
    const workspace = withComputedAnalytics({
      ...createEmptyWorkspace(),
      review: { id: 'review-1', wins: [], unfinishedWork: [], constraints: [], focusArea: '', energyLevel: 3, notes: '', generatedAt },
      plan: {
        id: 'plan-1', summary: 'Plan', weekLabel: 'Jul 14, 2026', generatedAt, confirmedAt: generatedAt,
        priorities: [{
          id: 'priority-1', title: 'Priority', rationale: '', successMetric: '',
          actions: [{ id: 'action-1', title: 'Action', details: '', status: 'todo', note: '' }],
        }],
      },
      reflections: [{ id: 'reflection-1', period: 'weekly', body: 'Body', createdAt: generatedAt }],
      feedback: [{ id: 'feedback-1', rating: 5, message: 'Good', createdAt: generatedAt }],
      events: [{ id: 'event-1', type: 'weekly_plan_confirmed', createdAt: generatedAt }],
    });

    await repository.restoreWorkspace('user-1', createWorkspaceExport(workspace));

    expect(tx.mvpEventLog.deleteMany.mock.invocationCallOrder[0])
      .toBeLessThan(tx.weeklyPlan.create.mock.invocationCallOrder[0]);
    expect(tx.weeklyPlan.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      id: 'plan-1', weeklyReviewId: 'review-1',
      priorities: { create: [expect.objectContaining({
        id: 'priority-1',
        actionItems: { create: [expect.objectContaining({ id: 'action-1', createdAt: new Date(generatedAt) })] },
      })] },
    }) });
    expect(tx.reflectionEntry.createMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ id: 'reflection-1', createdAt: new Date(generatedAt) })] });
    expect(tx.feedbackEntry.createMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ id: 'feedback-1', createdAt: new Date(generatedAt) })] });
    expect(tx.mvpEventLog.createMany).toHaveBeenCalledWith({ data: [expect.objectContaining({ id: 'event-1', createdAt: new Date(generatedAt) })] });
  });

  it('imports identity, active workspace, and retained recoveries in one Serializable transaction', async () => {
    const tx = transactionDouble();
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const workspace = createEmptyWorkspace();
    const recovery = {
      id: 'recovery-migrated-1',
      export: createWorkspaceExport(createEmptyWorkspace(), '2026-07-16T12:00:00.000Z'),
    };
    tx.user.create.mockResolvedValue({
      id: 'user-migrated-1', email: 'person@example.com', inviteCode: 'INVITE', fullName: 'Person',
      createdAt: new Date('2026-07-15T10:00:00.000Z'), updatedAt: new Date('2026-07-15T11:00:00.000Z'),
    });
    tx.mvpWorkspaceRecovery.findMany.mockResolvedValue([{ id: recovery.id, payload: recovery.export }]);

    await repository.importMigratedUser({
      id: 'user-migrated-1',
      email: ' Person@Example.COM ',
      passwordHash: 'not-persisted-here',
      fullName: ' Person ',
      inviteCode: ' INVITE ',
      theme: 'dark',
      onboardingCompleted: false,
      sessionVersion: 0,
      createdAt: '2026-07-15T10:00:00.000Z',
      updatedAt: '2026-07-15T11:00:00.000Z',
    }, workspace, [recovery]);

    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
    expect(tx.user.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      id: 'user-migrated-1', email: 'person@example.com', inviteCode: 'INVITE', fullName: 'Person',
    }), select: expect.any(Object) });
    expect(tx.userProfile.create).toHaveBeenCalled();
    expect(tx.mvpWorkspaceRecovery.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      id: 'recovery-migrated-1', userId: 'user-migrated-1', payload: recovery.export,
    }) });
    expect(tx.user.create.mock.invocationCallOrder[0])
      .toBeLessThan(tx.userProfile.create.mock.invocationCallOrder[0]);
  });

  it('rejects a divergent imported workspace inside the Serializable transaction', async () => {
    const tx = transactionDouble();
    tx.user.create.mockResolvedValue({
      id: 'user-migrated-1', email: 'person@example.com', inviteCode: 'INVITE', fullName: 'Person',
      createdAt: new Date('2026-07-15T10:00:00.000Z'), updatedAt: new Date('2026-07-15T11:00:00.000Z'),
    });
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const workspace = withComputedAnalytics({
      ...createEmptyWorkspace(),
      reflections: [{ id: 'reflection-missing', period: 'weekly', body: 'Must survive', createdAt: '2026-07-15T10:00:00.000Z' }],
    });

    await expect(repository.importMigratedUser({
      id: 'user-migrated-1', email: 'person@example.com', passwordHash: 'not-migrated', fullName: 'Person',
      inviteCode: 'INVITE', theme: 'dark', onboardingCompleted: false, sessionVersion: 0,
      createdAt: '2026-07-15T10:00:00.000Z', updatedAt: '2026-07-15T11:00:00.000Z',
    }, workspace, [])).rejects.toThrow('Migration import verification failed for user user-migrated-1');

    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
  });

  it('checks the complete migration fingerprint and deletes in one Serializable transaction', async () => {
    const tx = transactionDouble();
    tx.user.findUnique.mockResolvedValue({
      id: 'user-migrated-1', email: 'person@example.com', inviteCode: 'INVITE', fullName: 'Person',
      createdAt: new Date('2026-07-15T10:00:00.000Z'), updatedAt: new Date('2026-07-15T11:00:00.000Z'),
    });
    tx.mvpWorkspaceRecovery.findMany.mockResolvedValue([]);
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);
    const identityDigest = createHash('sha256').update(JSON.stringify({
      id: 'user-migrated-1', email: 'person@example.com', inviteCode: 'INVITE', fullName: 'Person',
      createdAt: '2026-07-15T10:00:00.000Z', updatedAt: '2026-07-15T11:00:00.000Z',
    })).digest('hex');
    const workspaceDigest = createHash('sha256')
      .update(JSON.stringify(createWorkspaceExport(createEmptyWorkspace()).workspace))
      .digest('hex');

    await repository.deleteMigratedUsersIfUnchanged([{
      userId: 'user-migrated-1',
      fingerprint: { identityDigest, workspaceDigest, recoveries: [] },
    }]);

    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
    expect(tx.user.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['user-migrated-1'] } } });
  });

  it('deletes exactly one account through the Prisma cascade in a Serializable transaction', async () => {
    const tx = transactionDouble();
    const db = { $transaction: vi.fn((callback) => callback(tx)) };
    const repository = new PrismaBackedMvpRepository(db as never);

    await repository.deleteUserData('user-one');

    expect(db.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
    expect(tx.user.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['user-one'] } } });
  });

  it('blocks stale identity recreation as soon as account deletion starts', async () => {
    let finishDelete!: () => void;
    const pendingDelete = new Promise<void>((resolve) => { finishDelete = resolve; });
    const db = { $transaction: vi.fn(() => pendingDelete), user: { upsert: vi.fn() } };
    const repository = new PrismaBackedMvpRepository(db as never);

    const deletion = repository.deleteUserData('user-one');
    await expect(repository.ensureUser({ id: 'user-one' } as never)).rejects.toThrow('Account deletion in progress');
    expect(db.user.upsert).not.toHaveBeenCalled();
    finishDelete();
    await deletion;
  });

  it('does not start reset while an ordinary mutation for the same user is unsettled', async () => {
    const tx = transactionDouble();
    let finishFeedback!: (value: unknown[]) => void;
    const pendingFeedback = new Promise<unknown[]>((resolve) => { finishFeedback = resolve; });
    const db = {
      ...tx,
      feedbackEntry: { ...tx.feedbackEntry, create: vi.fn().mockResolvedValue({}) },
      mvpEventLog: { ...tx.mvpEventLog, create: vi.fn().mockResolvedValue({}) },
      $transaction: vi.fn((input: unknown) => {
        if (Array.isArray(input)) return pendingFeedback;
        return (input as (client: typeof tx) => unknown)(tx);
      }),
    };
    const repository = new PrismaBackedMvpRepository(db as never);
    const prepared = createWorkspaceExport(createEmptyWorkspace());

    const feedback = repository.submitFeedback('user-1', { rating: 5, message: 'Keep this write' });
    await vi.waitFor(() => expect(db.$transaction).toHaveBeenCalledTimes(1));
    const reset = repository.resetWorkspace('user-1', prepared);
    await Promise.resolve();
    expect(db.$transaction).toHaveBeenCalledTimes(1);

    finishFeedback([]);
    await feedback;
    await expect(reset).resolves.toEqual(expect.objectContaining({ recoveryId: 'recovery-1' }));
    expect(db.$transaction).toHaveBeenCalledTimes(3);
    expect(tx.mvpWorkspaceRecovery.create.mock.invocationCallOrder[0])
      .toBeGreaterThan(db.$transaction.mock.invocationCallOrder[2]);
  });
});
