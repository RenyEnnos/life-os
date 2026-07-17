// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app';
import { FileBackedAuthRepository } from '../authRepository';
import { FileBackedMvpRepository } from '../mvpRepository';
import { onboardingRequestSchema } from '../requestSchemas';
import { server } from '../../src/test/msw/server';

describe.sequential('canonical HTTP request boundary', () => {
  const origin = 'http://localhost:5173';
  const mvpFile = path.join(os.tmpdir(), `lifeos-http-boundary-mvp-${process.pid}.json`);
  const authFile = path.join(os.tmpdir(), `lifeos-http-boundary-auth-${process.pid}.json`);

  beforeAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await fs.rm(mvpFile, { force: true });
    await fs.rm(authFile, { force: true });
  });

  afterEach(async () => {
    await fs.rm(mvpFile, { force: true });
    await fs.rm(authFile, { force: true });
  });

  afterAll(() => {
    server.listen();
  });

  function buildApp(repository = new FileBackedMvpRepository(mvpFile)) {
    return createApp(
      repository,
      new FileBackedAuthRepository(authFile, [{ email: 'boundary@example.test', code: 'BOUNDARY-INVITE' }]),
    );
  }

  async function registeredSession() {
    const app = buildApp();
    const client = request.agent(app);
    const registration = await client.post('/api/auth/register').set('Origin', origin).send({
      email: 'boundary@example.test',
      password: 'Password123!',
      name: 'Boundary User',
      inviteCode: 'BOUNDARY-INVITE',
    });
    expect(registration.status).toBe(201);
    return { app, client, token: registration.body.token as string };
  }

  async function registeredClient() {
    return (await registeredSession()).client;
  }

  it('rejects unknown and out-of-bound onboarding fields before persistence', async () => {
    const client = await registeredClient();
    const payload = {
      displayName: 'Boundary User',
      role: '',
      lifeSeason: '',
      planningPain: '',
      successDefinition: '',
      goals: Array.from({ length: 21 }, (_, index) => `Goal ${index}`),
      commitments: [],
      constraints: [],
      injectedRole: 'admin',
    };
    expect(onboardingRequestSchema.safeParse(payload).success).toBe(false);
    const invalid = await client.put('/api/mvp/onboarding').set('Origin', origin).send(payload);

    expect(invalid.status).toBe(400);
    const workspace = await client.get('/api/mvp/workspace');
    expect(workspace.body.data.onboarding.completedAt).toBeNull();
  });

  it('rejects registration passwords that bcrypt would silently truncate', async () => {
    const response = await request(buildApp()).post('/api/auth/register').send({
      email: 'boundary@example.test',
      password: 'x'.repeat(73),
      name: 'Boundary User',
      inviteCode: 'BOUNDARY-INVITE',
    });
    expect(response.status).toBe(400);
  });

  it('rejects login suffixes beyond the bcrypt byte limit', async () => {
    const app = buildApp();
    const password = 'x'.repeat(72);
    expect((await request(app).post('/api/auth/register').send({
      email: 'boundary@example.test', password, name: 'Boundary User', inviteCode: 'BOUNDARY-INVITE',
    })).status).toBe(201);

    const login = await request(app).post('/api/auth/login').send({
      email: 'boundary@example.test', password: `${password}x`,
    });
    expect(login.status).toBe(400);
  });

  it('rejects invalid calendar dates and numeric ranges', async () => {
    const client = await registeredClient();
    const invalidDate = await client.post('/api/mvp/daily-checkins').set('Origin', origin).send({
      date: '2026-02-31',
      energy: 0,
      focus: 6,
      blockers: '',
      note: '',
    });
    const invalidFeedback = await client.post('/api/mvp/feedback').set('Origin', origin).send({
      rating: 6,
      message: 'Out of range',
    });

    expect(invalidDate.status).toBe(400);
    expect(invalidFeedback.status).toBe(400);
  });

  it('rejects invalid shapes for every remaining canonical write', async () => {
    const { app, client } = await registeredSession();
    const requests = [
      () => request(app).post('/api/auth/register').send({
        email: 'other@example.test', password: 'Password123!', name: 'Other', inviteCode: 'OTHER', extra: true,
      }),
      () => request(app).post('/api/auth/login').send({ email: 'boundary@example.test', password: 'Password123!', extra: true }),
      () => client.patch('/api/auth/profile').set('Origin', origin).send({ unexpected: true }),
      () => client.post('/api/mvp/weekly-plans/generate').set('Origin', origin).send({
        wins: [], unfinishedWork: [], constraints: [], focusArea: '', energyLevel: 6, notes: '',
      }),
      () => client.post('/api/mvp/weekly-plans/plan-id/confirm').set('Origin', origin).send({ unexpected: true }),
      () => client.patch('/api/mvp/action-items/action-id').set('Origin', origin).send({}),
      () => client.patch(`/api/mvp/action-items/${'x'.repeat(129)}`).set('Origin', origin).send({ status: 'done' }),
      () => client.post('/api/mvp/reflections').set('Origin', origin).send({ period: 'monthly', body: '' }),
    ];

    for (const sendRequest of requests) {
      expect((await sendRequest()).status).toBe(400);
    }
  });

  it('returns 400 for malformed JSON and 413 above the 32 KiB contract', async () => {
    const client = await registeredClient();
    const malformed = await client
      .post('/api/mvp/feedback')
      .set('Origin', origin)
      .set('Content-Type', 'application/json')
      .send('{"rating":4');
    const oversized = await client
      .post('/api/mvp/feedback')
      .set('Origin', origin)
      .send({ rating: 4, message: 'x'.repeat(33 * 1024) });

    expect(malformed.status).toBe(400);
    expect(oversized.status).toBe(413);
  });

  it('rejects unparsed non-JSON bytes on routes with an empty-object contract', async () => {
    const { client } = await registeredSession();

    const logout = await client
      .post('/api/auth/logout')
      .set('Origin', origin)
      .set('Content-Type', 'text/plain')
      .send('unexpected');
    const confirm = await client
      .post('/api/mvp/weekly-plans/plan-id/confirm')
      .set('Origin', origin)
      .set('Content-Type', 'text/plain')
      .send('unexpected');
    const reset = await client
      .delete('/api/mvp/workspace')
      .set('Origin', origin)
      .set('Content-Type', 'text/plain')
      .send('unexpected');

    expect(logout.status).toBe(400);
    expect(confirm.status).toBe(400);
    expect(reset.status).toBe(404);
    expect((await client.get('/api/auth/verify')).status).toBe(200);
  });

  it('keeps the session valid and reports a server error when logout revocation cannot persist', async () => {
    const authRepository = new FileBackedAuthRepository(
      authFile,
      [{ email: 'boundary@example.test', code: 'BOUNDARY-INVITE' }],
    );
    const app = createApp(new FileBackedMvpRepository(mvpFile), authRepository);
    const client = request.agent(app);
    const registration = await client.post('/api/auth/register').send({
      email: 'boundary@example.test',
      password: 'Password123!',
      name: 'Boundary User',
      inviteCode: 'BOUNDARY-INVITE',
    });
    vi.spyOn(authRepository, 'revokeSessions').mockRejectedValueOnce(new Error('disk unavailable'));

    const logout = await client.post('/api/auth/logout').set('Origin', origin).send({});

    expect(logout.status).toBe(500);
    expect((await client.get('/api/auth/verify')).status).toBe(200);
    expect((await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${registration.body.token as string}`)).status).toBe(200);
  });

  it('requires an exact allowed Origin for cookie writes but not bearer writes', async () => {
    const { app, client, token } = await registeredSession();
    const payload = { rating: 4, message: 'Boundary signal' };

    const missingOrigin = await client.post('/api/mvp/feedback').send(payload);
    const crossOrigin = await client.post('/api/mvp/feedback').set('Origin', 'https://attacker.example').send(payload);
    const exactOrigin = await client.post('/api/mvp/feedback').set('Origin', origin).send(payload);
    const bearer = await request(app)
      .post('/api/mvp/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(missingOrigin.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    expect(exactOrigin.status).toBe(200);
    expect(bearer.status).toBe(200);
  });

  it('does not touch the MVP repository before Origin and payload validation pass', async () => {
    const repository = new FileBackedMvpRepository(mvpFile);
    const ensureUser = vi.spyOn(repository, 'ensureUser');
    const app = buildApp(repository);
    const client = request.agent(app);
    expect((await client.post('/api/auth/register').send({
      email: 'boundary@example.test', password: 'Password123!', name: 'Boundary User', inviteCode: 'BOUNDARY-INVITE',
    })).status).toBe(201);

    expect((await client.post('/api/mvp/feedback').send({ rating: 4, message: 'No Origin' })).status).toBe(403);
    expect((await client.post('/api/mvp/feedback').set('Origin', origin).send({ rating: 9, message: 'Invalid' })).status).toBe(400);
    expect(ensureUser).not.toHaveBeenCalled();
  });

  it('throttles expensive plan generation by authenticated user', async () => {
    const client = await registeredClient();
    const payload = {
      wins: [],
      unfinishedWork: [],
      constraints: [],
      focusArea: 'Boundary hardening',
      energyLevel: 3,
      notes: '',
    };

    for (let attempt = 0; attempt < 20; attempt += 1) {
      expect((await client.post('/api/mvp/weekly-plans/generate').set('Origin', origin).send(payload)).status).toBe(200);
    }
    expect((await client.post('/api/mvp/weekly-plans/generate').set('Origin', origin).send(payload)).status).toBe(429);
  });

  it('throttles ordinary writes by authenticated user', async () => {
    const client = await registeredClient();
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const response = await client
        .post('/api/mvp/feedback')
        .set('Origin', origin)
        .send({ rating: 4, message: `Signal ${attempt}` });
      expect(response.status).toBe(200);
    }
    expect((await client.post('/api/mvp/feedback').set('Origin', origin).send({ rating: 4, message: 'Throttled' })).status).toBe(429);
  });

  it('does not let forwarded headers bypass direct-peer auth throttling', async () => {
    const app = buildApp();
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', `203.0.113.${attempt + 1}`)
        .send({ email: 'missing@example.test', password: 'WrongPassword' });
      expect(response.status).toBe(401);
    }
    const throttled = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', '198.51.100.200')
      .send({ email: 'missing@example.test', password: 'WrongPassword' });
    expect(throttled.status).toBe(429);
  });
});
