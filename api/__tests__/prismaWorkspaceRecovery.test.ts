import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createEmptyWorkspace, withComputedAnalytics } from '../../shared/mvp/state';
import { PrismaBackedMvpRepository } from '../prismaMvpRepository';
import { createWorkspaceExport } from '../workspaceRecovery';

function transactionDouble() {
  const empty = vi.fn().mockResolvedValue([]);
  return {
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
