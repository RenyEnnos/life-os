// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { createApp } from '../app';
import { FileBackedAuthRepository } from '../authRepository';
import { FileBackedMvpRepository } from '../mvpRepository';

describe('auth and invite access control', () => {
  const mvpFile = path.join(os.tmpdir(), `lifeos-mvp-auth-${Date.now()}.json`);
  const authFile = path.join(os.tmpdir(), `lifeos-auth-contract-${Date.now()}.json`);

  afterEach(async () => {
    await fs.rm(mvpFile, { force: true });
    await fs.rm(authFile, { force: true });
  });

  it('uses the environment-selected auth file when no path is provided', async () => {
    const previousPath = process.env.LIFEOS_AUTH_DATA_FILE;
    process.env.LIFEOS_AUTH_DATA_FILE = authFile;

    try {
      const repository = new FileBackedAuthRepository(undefined, [
        { email: 'env-partner@example.com', code: 'ENV-001' },
      ]);

      await repository.registerWithInvite({
        email: 'env-partner@example.com',
        passwordHash: 'synthetic-hash',
        fullName: 'Environment Partner',
        inviteCode: 'ENV-001',
      });

      await expect(fs.stat(authFile)).resolves.toBeDefined();
    } finally {
      if (previousPath === undefined) delete process.env.LIFEOS_AUTH_DATA_FILE;
      else process.env.LIFEOS_AUTH_DATA_FILE = previousPath;
    }
  });

  it('blocks unauthenticated MVP access and only allows invited registration', async () => {
    const app = createApp(
      new FileBackedMvpRepository(mvpFile),
      new FileBackedAuthRepository(authFile, [{ email: 'partner@example.com', code: 'ALPHA-001', fullName: 'Partner' }])
    );

    const badInvite = await request(app).post('/api/auth/register').send({
      email: 'partner@example.com',
      password: 'Password123!',
      name: 'Partner',
      inviteCode: 'WRONG-CODE',
    });
    expect(badInvite.status).toBe(400);

    const invitedClient = request.agent(app);
    const registration = await invitedClient.post('/api/auth/register').send({
      email: 'partner@example.com',
      password: 'Password123!',
      name: 'Partner',
      inviteCode: 'ALPHA-001',
    });

    expect(registration.status).toBe(201);
    expect(registration.body.user.email).toBe('partner@example.com');
    const copiedBearer = registration.body.token as string;

    const verified = await invitedClient.get('/api/auth/verify');
    expect(verified.status).toBe(200);
    expect(verified.body.email).toBe('partner@example.com');

    const authedWorkspace = await invitedClient.get('/api/mvp/workspace');
    expect(authedWorkspace.status).toBe(200);

    const invalidLogout = await invitedClient
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:5173')
      .send({ unexpected: true });
    expect(invalidLogout.status).toBe(400);
    expect((await invitedClient.get('/api/auth/verify')).status).toBe(200);

    const logout = await invitedClient.post('/api/auth/logout').set('Origin', 'http://localhost:5173').send({});
    expect(logout.status).toBe(200);

    const verifyAfterLogout = await invitedClient.get('/api/auth/verify');
    expect(verifyAfterLogout.status).toBe(401);

    const copiedBearerAfterLogout = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${copiedBearer}`);
    expect(copiedBearerAfterLogout.status).toBe(401);

    const login = await request(app).post('/api/auth/login').send({
      email: 'partner@example.com',
      password: 'Password123!',
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });

  it('loads legacy users without a session version as version zero', async () => {
    await fs.writeFile(authFile, JSON.stringify({
      invites: [],
      users: [{
        id: 'usr_legacy',
        email: 'legacy@example.test',
        passwordHash: 'synthetic-hash',
        fullName: 'Legacy User',
        inviteCode: 'LEGACY',
        theme: 'dark',
        onboardingCompleted: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }],
    }));

    const user = await new FileBackedAuthRepository(authFile, []).findUserById('usr_legacy');
    expect(user?.sessionVersion).toBe(0);
  });

  it('does not let a concurrent profile write roll back session revocation', async () => {
    const repository = new FileBackedAuthRepository(authFile, [
      { email: 'race@example.test', code: 'RACE-INVITE' },
    ]);
    const user = await repository.registerWithInvite({
      email: 'race@example.test',
      passwordHash: 'synthetic-hash',
      fullName: 'Race User',
      inviteCode: 'RACE-INVITE',
    });

    await Promise.all([
      repository.revokeSessions(user.id),
      repository.updateUser(user.id, { theme: 'light' }),
    ]);

    expect((await repository.findUserById(user.id))?.sessionVersion).toBe(1);
  });

  it('rejects a persisted fallback invite in controlled-demo', async () => {
    const previousMode = process.env.LIFEOS_OPERATING_MODE;
    process.env.LIFEOS_OPERATING_MODE = 'controlled-demo';
    await fs.writeFile(authFile, JSON.stringify({
      invites: [{
        email: 'partner@lifeos.local',
        code: 'LIFEOS-INVITE',
        claimedAt: null,
        claimedByUserId: null,
      }],
      users: [],
    }));

    try {
      const repository = new FileBackedAuthRepository(authFile, [
        { email: 'demo@example.test', code: 'DEMO-UNIQUE' },
      ]);
      await expect(repository.findUserByEmail('demo@example.test')).rejects.toThrow('LIFEOS_INVITES');
    } finally {
      if (previousMode === undefined) delete process.env.LIFEOS_OPERATING_MODE;
      else process.env.LIFEOS_OPERATING_MODE = previousMode;
    }
  });

  it('allows only the configured CORS origin in controlled-demo', async () => {
    const previousMode = process.env.LIFEOS_OPERATING_MODE;
    const previousOrigin = process.env.ALLOWED_ORIGIN;
    process.env.LIFEOS_OPERATING_MODE = 'controlled-demo';
    process.env.ALLOWED_ORIGIN = 'https://demo.example.test';

    try {
      const app = createApp(
        new FileBackedMvpRepository(mvpFile),
        new FileBackedAuthRepository(authFile, [{ email: 'demo@example.test', code: 'DEMO-UNIQUE' }]),
      );
      const allowed = await request(app).get('/api/health').set('Origin', 'https://demo.example.test');
      const localhost = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');

      expect(allowed.status).toBe(200);
      expect(allowed.headers['access-control-allow-origin']).toBe('https://demo.example.test');
      expect(localhost.status).toBe(403);
      expect(localhost.headers['access-control-allow-origin']).toBeUndefined();
    } finally {
      if (previousMode === undefined) delete process.env.LIFEOS_OPERATING_MODE;
      else process.env.LIFEOS_OPERATING_MODE = previousMode;
      if (previousOrigin === undefined) delete process.env.ALLOWED_ORIGIN;
      else process.env.ALLOWED_ORIGIN = previousOrigin;
    }
  });
});
