// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from '../app';

describe('static SPA routing', () => {
  const marker = 'lifeos-static-routing-marker';
  let staticDir: string;

  beforeAll(async () => {
    staticDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lifeos-static-'));
    await fs.writeFile(path.join(staticDir, 'index.html'), marker);
  });

  afterAll(async () => {
    await fs.rm(staticDir, { recursive: true, force: true });
  });

  it('serves the SPA without masking API routes', async () => {
    const app = createApp(undefined, undefined, { staticDir });

    const root = await request(app).get('/');
    expect(root.status).toBe(200);
    expect(root.text).toContain(marker);
    expect(root.headers['content-security-policy']).not.toContain('upgrade-insecure-requests');

    const clientRoute = await request(app).get('/mvp/today');
    expect(clientRoute.status).toBe(200);
    expect(clientRoute.text).toContain(marker);

    const health = await request(app).get('/api/health');
    expect(health.status).toBe(200);
    expect(health.body.data.status).toBe('ok');

    const unknownApi = await request(app).get('/api/not-a-route');
    expect(unknownApi.status).toBe(404);
    expect(unknownApi.text).not.toContain(marker);

    for (const apiPath of ['/API', '/Api/not-a-route', '/%61pi/not-a-route']) {
      const apiVariant = await request(app).get(apiPath);
      expect(apiVariant.status).toBe(404);
      expect(apiVariant.text).not.toContain(marker);
    }

    for (const assetPath of ['/assets/missing.js', '/favicon.ico', '/missing.css']) {
      const missingAsset = await request(app).get(assetPath);
      expect(missingAsset.status).toBe(404);
      expect(missingAsset.text).not.toContain(marker);
    }
  });
});
