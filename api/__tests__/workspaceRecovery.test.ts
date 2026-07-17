// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FileBackedMvpRepository } from '../mvpRepository';
import { createEmptyWorkspace } from '../../shared/mvp/state';
import { createWorkspaceExport, digestWorkspace, workspaceExportSchema } from '../workspaceRecovery';

describe('file-backed workspace recovery invariants', () => {
  const dataFile = path.join(os.tmpdir(), `lifeos-workspace-recovery-${process.pid}.json`);
  const userId = 'usr_recovery';

  beforeEach(async () => {
    await fs.rm(dataFile, { force: true });
  });

  afterEach(async () => {
    await fs.rm(dataFile, { force: true });
  });

  async function populatedRepository() {
    const repository = new FileBackedMvpRepository(dataFile);
    await repository.saveOnboarding(userId, {
      displayName: 'Recovery User',
      role: 'Maintainer',
      lifeSeason: 'Launch',
      planningPain: 'Unsafe reset',
      successDefinition: 'Recoverable data',
      goals: ['Ship recovery'],
      commitments: ['Verify backups'],
      constraints: ['No data loss'],
    });
    await repository.addReflection(userId, { period: 'daily', body: 'Keep this reflection.' });
    return repository;
  }

  it('retains a portable export in the same mutation as reset and restores it exactly', async () => {
    const repository = await populatedRepository();
    const prepared = await repository.exportWorkspace(userId);

    const reset = await repository.resetWorkspace(userId, prepared);

    expect(reset.workspace.onboarding.completedAt).toBeNull();
    expect(reset.export).toEqual(prepared);
    const retained = await repository.getLatestRecovery(userId);
    expect(retained).toEqual({ id: reset.recoveryId, export: prepared });

    const restored = await repository.restoreWorkspace(userId, retained!.export);
    expect(restored).toEqual(prepared.workspace);
  });

  it('recomputes untrusted analytics before retaining the recovery export', async () => {
    const repository = await populatedRepository();
    const prepared = await repository.exportWorkspace(userId);
    prepared.workspace.analytics.feedbackEntries = 999;

    const reset = await repository.resetWorkspace(userId, prepared);

    expect(reset.export.workspace.analytics.feedbackEntries).toBe(0);
    expect((await repository.getLatestRecovery(userId))!.export.workspace.analytics.feedbackEntries).toBe(0);
  });

  it('rejects a stale prepared digest without clearing or retaining a false recovery', async () => {
    const repository = await populatedRepository();
    const before = await repository.getWorkspace(userId);

    const stale = await repository.exportWorkspace(userId);
    stale.workspace = { ...stale.workspace, reflections: [] };
    expect(digestWorkspace(stale.workspace)).not.toBe(digestWorkspace(before));
    await expect(repository.resetWorkspace(userId, stale))
      .rejects.toThrow('Workspace changed after export');

    expect(await repository.getWorkspace(userId)).toEqual(before);
    expect(await repository.getLatestRecovery(userId)).toBeNull();
  });

  it('preserves the original workspace when the combined recovery/reset write fails', async () => {
    const repository = await populatedRepository();
    const before = await repository.getWorkspace(userId);
    const prepared = await repository.exportWorkspace(userId);
    const writeFailure = vi.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error('disk unavailable'));

    await expect(repository.resetWorkspace(userId, prepared)).rejects.toThrow('disk unavailable');
    writeFailure.mockRestore();

    expect(await repository.getWorkspace(userId)).toEqual(before);
    expect(await repository.getLatestRecovery(userId)).toBeNull();
  });

  it('rejects an unsupported portable version before replacing current data', async () => {
    const repository = await populatedRepository();
    const before = await repository.getWorkspace(userId);
    const portableExport = await repository.exportWorkspace(userId);

    await expect(repository.restoreWorkspace(userId, { ...portableExport, version: 2 } as never))
      .rejects.toThrow();

    expect(await repository.getWorkspace(userId)).toEqual(before);
  });

  it.each([
    ['review id without generatedAt', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.review.id = 'review-orphan';
    }],
    ['review generatedAt without id', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.review.generatedAt = '2026-07-17T00:00:00.000Z';
    }],
    ['review content without a persisted review', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.review.wins = ['Must not be silently dropped'];
    }],
    ['plan id without generatedAt', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.plan.id = 'plan-orphan';
    }],
    ['plan priorities without a plan', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.plan.priorities = [{ id: 'priority-orphan', title: 'Orphan', rationale: '', successMetric: '', actions: [] }];
    }],
    ['plan metadata without a persisted plan', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.plan.summary = 'Must not be silently dropped';
    }],
    ['plan confirmation without a plan', (workspace: ReturnType<typeof createEmptyWorkspace>) => {
      workspace.plan.confirmedAt = '2026-07-17T00:00:00.000Z';
    }],
  ])('rejects an inconsistent portable envelope: %s', (_label, mutate) => {
    const envelope = createWorkspaceExport(createEmptyWorkspace());
    mutate(envelope.workspace);
    expect(workspaceExportSchema.safeParse(envelope).success).toBe(false);
  });

  it('serializes reset and restore with ordinary mutations for the same user', async () => {
    const repository = await populatedRepository();
    const prepared = await repository.exportWorkspace(userId);

    const update = repository.addReflection(userId, { period: 'daily', body: 'Committed before reset.' });
    const reset = repository.resetWorkspace(userId, prepared);
    await update;
    await expect(reset).rejects.toThrow('Workspace changed after export');
    expect((await repository.getWorkspace(userId)).reflections.map(({ body }) => body))
      .toContain('Committed before reset.');

    const restore = repository.restoreWorkspace(userId, prepared);
    const postRestoreUpdate = repository.addReflection(userId, { period: 'daily', body: 'Committed after restore.' });
    await restore;
    await postRestoreUpdate;
    expect((await repository.getWorkspace(userId)).reflections.map(({ body }) => body))
      .toEqual(expect.arrayContaining(['Keep this reflection.', 'Committed after restore.']));
  });
});
