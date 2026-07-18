// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app';
import { FileBackedAuthRepository } from '../authRepository';
import { FileBackedMvpRepository } from '../mvpRepository';

describe('personal data lifecycle', () => {
  const origin = 'http://localhost:5173';
  const password = 'Password123!';
  const authFile = path.join(os.tmpdir(), `lifeos-account-auth-${process.pid}.json`);
  const mvpFile = path.join(os.tmpdir(), `lifeos-account-mvp-${process.pid}.json`);

  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all([
      authFile, `${authFile}.bak`, mvpFile, `${mvpFile}.bak`,
    ].map((file) => fs.rm(file, { force: true })));
  });

  async function fixture() {
    const repository = new FileBackedMvpRepository(mvpFile);
    const authRepository = new FileBackedAuthRepository(authFile, [
      { email: 'alpha@example.test', code: 'ALPHA-PRIVATE' },
      { email: 'beta@example.test', code: 'BETA-PRIVATE' },
    ]);
    const app = createApp(repository, authRepository);
    const alpha = request.agent(app);
    const beta = request.agent(app);
    const userIds: string[] = [];
    for (const [client, email, code, name] of [
      [alpha, 'alpha@example.test', 'ALPHA-PRIVATE', 'Alpha Person'],
      [beta, 'beta@example.test', 'BETA-PRIVATE', 'Beta Person'],
    ] as const) {
      const registration = await client.post('/api/auth/register').send({ email, password, name, inviteCode: code });
      expect(registration.status).toBe(201);
      userIds.push(registration.body.user.id);
    }
    await repository.addReflection(userIds[0], { period: 'daily', body: 'ALPHA PRIVATE REFLECTION' });
    await repository.addReflection(userIds[1], { period: 'daily', body: 'BETA PRIVATE REFLECTION' });
    const alphaExport = await repository.exportWorkspace(userIds[0]);
    await repository.resetWorkspace(userIds[0], alphaExport);
    await repository.restoreWorkspace(userIds[0], alphaExport);
    return { app, alpha, beta, repository, authRepository, userIds };
  }

  it('exports only the authenticated account without credentials or another user data', async () => {
    const { alpha } = await fixture();
    const response = await alpha.post('/api/auth/data-export').set('Origin', origin).send({ password });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      format: 'lifeos.account.export', version: 1,
      account: { email: 'alpha@example.test', fullName: 'Alpha Person' },
    });
    const serialized = JSON.stringify(response.body.data);
    expect(serialized).toContain('ALPHA PRIVATE REFLECTION');
    expect(response.body.data.recoveries).toHaveLength(1);
    expect(serialized).not.toContain('BETA PRIVATE REFLECTION');
    expect(serialized).not.toContain('BETA-PRIVATE');
    expect(serialized).not.toContain('passwordHash');
    expect(serialized).not.toContain('sessionVersion');
  });

  it('deletes one account, its recoveries and sanitized file backups without crossing users', async () => {
    const { app, alpha, repository, userIds } = await fixture();
    expect((await alpha.post('/api/auth/delete-account').set('Origin', origin).send({
      password, confirmation: 'delete my account',
    })).status).toBe(400);

    const deleted = await alpha.post('/api/auth/delete-account').set('Origin', origin).send({
      password, confirmation: 'DELETE MY ACCOUNT',
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.data).toEqual({ deleted: true, status: 'completed', processors: 'disabled' });
    expect((await alpha.get('/api/auth/verify')).status).toBe(401);
    expect((await request(app).post('/api/auth/login').send({ email: 'alpha@example.test', password })).status).toBe(401);
    await expect(new FileBackedAuthRepository(authFile, [
      { email: 'alpha@example.test', code: 'ALPHA-PRIVATE' },
    ]).registerWithInvite({
      email: 'alpha@example.test', passwordHash: 'synthetic', fullName: 'Recreated', inviteCode: 'ALPHA-PRIVATE',
    })).rejects.toThrow('Invite not found');

    expect(JSON.stringify(await repository.getWorkspace(userIds[1]))).toContain('BETA PRIVATE REFLECTION');
    for (const file of [authFile, `${authFile}.bak`, mvpFile, `${mvpFile}.bak`]) {
      const bytes = await fs.readFile(file, 'utf8');
      expect(bytes).not.toContain('ALPHA PRIVATE REFLECTION');
      expect(bytes).not.toContain('Alpha Person');
      expect(bytes).not.toContain('alpha@example.test');
      expect(bytes).not.toContain('ALPHA-PRIVATE');
    }
  });

  it('restores authentication when atomic MVP deletion fails', async () => {
    const { app, alpha, repository } = await fixture();
    vi.spyOn(repository, 'deleteUserData').mockRejectedValueOnce(new Error('synthetic deletion failure'));

    expect((await alpha.post('/api/auth/delete-account').set('Origin', origin).send({
      password, confirmation: 'DELETE MY ACCOUNT',
    })).status).toBe(500);
    expect((await request(app).post('/api/auth/login').send({ email: 'alpha@example.test', password })).status).toBe(200);
  });

  it('resumes a durable pending deletion after process restart', async () => {
    const { authRepository, userIds } = await fixture();
    await authRepository.beginAccountDeletion(userIds[0]);

    createApp(new FileBackedMvpRepository(mvpFile), new FileBackedAuthRepository(authFile));

    await vi.waitFor(async () => {
      const auth = JSON.parse(await fs.readFile(authFile, 'utf8'));
      expect(auth.users.some(({ id }: { id: string }) => id === userIds[0])).toBe(false);
      const mvp = JSON.parse(await fs.readFile(mvpFile, 'utf8'));
      expect(mvp.users[userIds[0]]).toBeUndefined();
      expect(mvp.recoveries[userIds[0]]).toBeUndefined();
    });
  });

  it('keeps deletion accepted when final authentication purge needs reconciliation', async () => {
    const { alpha, authRepository } = await fixture();
    vi.spyOn(authRepository, 'finalizeAccountDeletion').mockRejectedValueOnce(new Error('synthetic finalization failure'));

    const deleted = await alpha.post('/api/auth/delete-account').set('Origin', origin).send({
      password, confirmation: 'DELETE MY ACCOUNT',
    });

    expect(deleted.status).toBe(202);
    expect(deleted.body.data).toEqual({ deleted: true, status: 'pending', processors: 'disabled' });
    expect((await alpha.get('/api/auth/verify')).status).toBe(401);
  });

  it('handles a failed pending-deletion inventory without an unhandled rejection', async () => {
    const { alpha, authRepository } = await fixture();
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(authRepository, 'finalizeAccountDeletion').mockRejectedValueOnce(new Error('synthetic finalization failure'));
    vi.spyOn(authRepository, 'listPendingDeletionUserIds').mockRejectedValueOnce(new Error('synthetic inventory failure'));

    const deleted = await alpha.post('/api/auth/delete-account').set('Origin', origin).send({
      password, confirmation: 'DELETE MY ACCOUNT',
    });

    expect(deleted.status).toBe(202);
    await vi.waitFor(() => expect(log).toHaveBeenCalledWith('Pending account deletion inventory failed'));
  });

  it('reconciles later pending users when one deletion fails', async () => {
    const { repository, authRepository, userIds } = await fixture();
    await authRepository.beginAccountDeletion(userIds[0]);
    await authRepository.beginAccountDeletion(userIds[1]);
    const originalDelete = repository.deleteUserData.bind(repository);
    vi.spyOn(repository, 'deleteUserData').mockImplementation(async (userId) => {
      if (userId === userIds[0]) throw new Error('synthetic isolated failure');
      return originalDelete(userId);
    });

    createApp(repository, authRepository);

    await vi.waitFor(async () => {
      const pending = await authRepository.listPendingDeletionUserIds();
      expect(pending).toContain(userIds[0]);
      expect(pending).not.toContain(userIds[1]);
    });
  });

  it('rejects stale writes submitted after deletion starts', async () => {
    const { repository, userIds } = await fixture();
    const deletion = repository.deleteUserData(userIds[0]);
    const staleWrite = expect(repository.addReflection(userIds[0], {
      period: 'daily', body: 'must not return',
    })).rejects.toThrow('Account deletion in progress');

    await deletion;
    await staleWrite;
    expect(JSON.stringify(await repository.getWorkspace(userIds[1]))).toContain('BETA PRIVATE REFLECTION');
  });
});
