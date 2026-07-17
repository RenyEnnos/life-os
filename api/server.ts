import path from 'node:path';

import { validateServerOperatingMode } from '../shared/operatingMode';

async function start() {
  validateServerOperatingMode(process.env);
  const { createApp } = await import('./app');
  const port = Number(process.env.PORT || 3001);
  const app = createApp(undefined, undefined, {
    staticDir: path.resolve(process.cwd(), 'dist'),
  });

  app.listen(port, () => {
    console.log(`LifeOS API listening on http://localhost:${port}`);
  });
}

void start().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Server startup failed');
  process.exitCode = 1;
});
