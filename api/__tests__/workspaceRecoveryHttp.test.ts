// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../app';
import { FileBackedAuthRepository } from '../authRepository';
import { FileBackedMvpRepository } from '../mvpRepository';
import { server } from '../../src/test/msw/server';

describe.sequential('recoverable workspace HTTP contract', () => {
  const origin = 'http://localhost:5173';
  const password = 'Password123!';
  const mvpFile = path.join(os.tmpdir(), `lifeos-recovery-http-mvp-${process.pid}.json`);
  const authFile = path.join(os.tmpdir(), `lifeos-recovery-http-auth-${process.pid}.json`);

  beforeAll(() => server.close());
  afterAll(() => server.listen());
  beforeEach(async () => Promise.all([fs.rm(mvpFile, { force: true }), fs.rm(authFile, { force: true })]));
  afterEach(async () => Promise.all([fs.rm(mvpFile, { force: true }), fs.rm(authFile, { force: true })]));

  async function session() {
    const app = createApp(
      new FileBackedMvpRepository(mvpFile),
      new FileBackedAuthRepository(authFile, [{ email: 'recovery@example.test', code: 'RECOVERY-INVITE' }]),
    );
    const client = request.agent(app);
    expect((await client.post('/api/auth/register').send({
      email: 'recovery@example.test', password, name: 'Recovery User', inviteCode: 'RECOVERY-INVITE',
    })).status).toBe(201);
    expect((await client.put('/api/mvp/onboarding').set('Origin', origin).send({
      displayName: 'Recovery User', role: 'Maintainer', lifeSeason: 'Launch', planningPain: 'Data loss',
      successDefinition: 'Restored', goals: ['Recover'], commitments: [], constraints: [],
    })).status).toBe(200);
    return { app, client };
  }

  async function loggedInSession() {
    const app = createApp(new FileBackedMvpRepository(mvpFile), new FileBackedAuthRepository(authFile));
    const client = request.agent(app);
    expect((await client.post('/api/auth/login').send({
      email: 'recovery@example.test', password,
    })).status).toBe(200);
    return { app, client };
  }

  it('requires password and exact phrase, removes bodyless DELETE, and rejects stale reset tokens', async () => {
    const { client } = await session();
    expect((await client.delete('/api/mvp/workspace').set('Origin', origin).send({})).status).toBe(404);
    expect((await client.post('/api/mvp/workspace/reset/export').send({
      password, confirmation: 'RESET MY WORKSPACE',
    })).status).toBe(403);
    expect((await client.post('/api/mvp/workspace/recovery').send({
      password, confirmation: 'RESTORE MY WORKSPACE', export: await new FileBackedMvpRepository(mvpFile).exportWorkspace('missing-user'),
    })).status).toBe(403);
    const { client: invalidClient } = await loggedInSession();
    expect((await invalidClient.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
      password: 'WrongPassword', confirmation: 'RESET MY WORKSPACE',
    })).status).toBe(401);
    expect((await invalidClient.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
      password, confirmation: 'reset my workspace',
    })).status).toBe(400);

    const prepared = await client.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE',
    });
    expect(prepared.status).toBe(200);

    const alteredEnvelope = structuredClone(prepared.body.data.export);
    alteredEnvelope.exportedAt = '2026-07-17T00:00:00.000Z';
    expect((await client.post('/api/mvp/workspace/reset').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE', resetToken: prepared.body.data.resetToken,
      export: alteredEnvelope,
    })).status).toBe(401);

    expect((await client.post('/api/mvp/reflections').set('Origin', origin).send({
      period: 'daily', body: 'Changed after export',
    })).status).toBe(200);
    const staleReset = await client.post('/api/mvp/workspace/reset').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE', resetToken: prepared.body.data.resetToken,
      export: prepared.body.data.export,
    });
    expect(staleReset.status).toBe(409);
    expect((await client.get('/api/mvp/workspace')).body.data.reflections).toHaveLength(1);
  });

  it('retains recovery after reset response loss and restores a portable envelope above 32 KiB', async () => {
    const { client } = await session();
    const prepared = await client.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE',
    });
    const reset = await client.post('/api/mvp/workspace/reset').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE', resetToken: prepared.body.data.resetToken,
      export: prepared.body.data.export,
    });
    expect(reset.status).toBe(200);
    expect(reset.body.data.workspace.onboarding.completedAt).toBeNull();

    const retained = await client.get('/api/mvp/workspace/recovery/latest');
    expect(retained.status).toBe(200);
    expect(retained.body.data.export).toEqual(prepared.body.data.export);

    const portableExport = retained.body.data.export;
    portableExport.workspace.reflections = Array.from({ length: 20 }, (_, index) => ({
      id: `reflection-${index}`,
      period: 'daily',
      body: `recovery-${index}-${'x'.repeat(2_000)}`,
      createdAt: '2026-07-17T00:00:00.000Z',
    }));
    const recovery = await client.post('/api/mvp/workspace/recovery').set('Origin', origin).send({
      password, confirmation: 'RESTORE MY WORKSPACE', export: portableExport,
    });
    expect(recovery.status).toBe(200);
    expect(recovery.body.data.reflections).toHaveLength(20);
  });

  it('counts failed attempts in separate deterministic reset and recovery rate limits', async () => {
    const { client } = await session();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect((await client.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
        password: 'WrongPassword', confirmation: 'RESET MY WORKSPACE',
      })).status).toBe(401);
    }
    expect((await client.post('/api/mvp/workspace/reset/export').set('Origin', origin).send({
      password, confirmation: 'RESET MY WORKSPACE',
    })).status).toBe(429);

    const prepared = await new FileBackedMvpRepository(mvpFile).exportWorkspace('missing-user');
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect((await client.post('/api/mvp/workspace/recovery').set('Origin', origin).send({
        password: 'WrongPassword', confirmation: 'RESTORE MY WORKSPACE', export: prepared,
      })).status).toBe(401);
    }
    expect((await client.post('/api/mvp/workspace/recovery').set('Origin', origin).send({
      password, confirmation: 'RESTORE MY WORKSPACE', export: prepared,
    })).status).toBe(429);
  });
});
