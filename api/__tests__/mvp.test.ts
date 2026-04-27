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

describe('MVP API contract', () => {
  const tempFile = path.join(os.tmpdir(), `lifeos-mvp-${Date.now()}.json`);
  const authFile = path.join(os.tmpdir(), `lifeos-auth-${Date.now()}.json`);
  const app = createApp(
    new FileBackedMvpRepository(tempFile),
    new FileBackedAuthRepository(authFile, [{ email: 'pedro@example.com', code: 'INVITE-123', fullName: 'Pedro' }])
  );

  beforeAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await fs.rm(tempFile, { force: true });
    await fs.rm(authFile, { force: true });
  });

  afterAll(() => {
    server.listen();
  });

  afterEach(async () => {
    await fs.rm(tempFile, { force: true });
    await fs.rm(authFile, { force: true });
  });

  it('persists the weekly loop through the server contract', async () => {
    const client = request.agent(app);

    const registration = await client.post('/api/auth/register').send({
      email: 'pedro@example.com',
      password: 'Password123!',
      name: 'Pedro',
      inviteCode: 'INVITE-123',
    });

    expect(registration.status).toBe(201);
    expect(registration.body.token).toBeTruthy();

    const onboarding = await client
      .put('/api/mvp/onboarding')
      .send({
        displayName: 'Pedro',
        role: 'Founding Engineer',
        lifeSeason: 'Shipping the MVP',
        planningPain: 'Too many open loops',
        successDefinition: 'Reach a tight weekly plan quickly.',
        goals: ['Ship MVP persistence'],
        commitments: ['Family logistics'],
        constraints: ['School pickup twice a week'],
      });

    expect(onboarding.status).toBe(200);
    expect(onboarding.body.data.onboarding.completedAt).toBeTruthy();

    const generated = await client
      .post('/api/mvp/weekly-plans/generate')
      .send({
        wins: ['Shipped MVP shell'],
        unfinishedWork: ['Replace browser persistence'],
        constraints: ['Protect afternoon focus'],
        focusArea: 'Activation',
        energyLevel: 4,
        notes: 'Keep the plan narrow.',
      });

    expect(generated.status).toBe(200);
    expect(generated.body.data.plan.id).toBeTruthy();
    expect(generated.body.data.plan.priorities.length).toBeGreaterThan(0);

    const planId = generated.body.data.plan.id as string;
    const actionId = generated.body.data.plan.priorities[0].actions[0].id as string;

    const confirmed = await client.post(`/api/mvp/weekly-plans/${planId}/confirm`).send();
    expect(confirmed.body.data.plan.confirmedAt).toBeTruthy();

    const updatedAction = await client
      .patch(`/api/mvp/action-items/${actionId}`)
      .send({ status: 'done', note: 'Moved to complete during the test.' });

    expect(updatedAction.body.data.analytics.completedActions).toBe(1);

    const dailyCheckIn = await client
      .post('/api/mvp/daily-checkins')
      .send({
        date: '2026-03-19',
        energy: 4,
        focus: 4,
        blockers: 'None',
        note: 'Protected focus block booked.',
      });

    expect(dailyCheckIn.body.data.analytics.dailyCheckIns).toBe(1);

    const reflection = await client
      .post('/api/mvp/reflections')
      .send({ period: 'daily', body: 'The loop felt tighter with server state.' });
    expect(reflection.body.data.reflections).toHaveLength(1);

    const feedback = await client
      .post('/api/mvp/feedback')
      .send({ rating: 5, message: 'Persistence now survives reloads.' });
    expect(feedback.body.data.feedback).toHaveLength(1);

    const workspace = await client.get('/api/mvp/workspace');
    expect(workspace.body.data.analytics.weeklyPlanConfirmed).toBe(true);
    expect(workspace.body.data.analytics.completedActions).toBe(1);
    expect(workspace.body.data.analytics.feedbackEntries).toBe(1);
  });
});
