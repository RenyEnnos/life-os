import path from 'node:path';

import { createApp } from './app';

const port = Number(process.env.PORT || 3001);
const app = createApp(undefined, undefined, {
  staticDir: path.resolve(process.cwd(), 'dist'),
});

app.listen(port, () => {
  console.log(`LifeOS API listening on http://localhost:${port}`);
});
