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

    const verified = await invitedClient.get('/api/auth/verify');
    expect(verified.status).toBe(200);
    expect(verified.body.email).toBe('partner@example.com');

    const authedWorkspace = await invitedClient.get('/api/mvp/workspace');
    expect(authedWorkspace.status).toBe(200);

    const logout = await invitedClient.post('/api/auth/logout').send({});
    expect(logout.status).toBe(200);

    const verifyAfterLogout = await invitedClient.get('/api/auth/verify');
    expect(verifyAfterLogout.status).toBe(401);

    const login = await request(app).post('/api/auth/login').send({
      email: 'partner@example.com',
      password: 'Password123!',
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});
