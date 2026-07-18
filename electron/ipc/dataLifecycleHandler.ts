import type Database from 'better-sqlite3';

import type { MvpRepository } from '../../api/mvpRepository.types';
import { hydrateDesktopSession, isLocalDesktopAuthAllowed } from '../auth/desktopSession';
import { createDesktopExport } from '../data/desktopExport';
import { getDb } from '../db/database';
import { createDesktopMvpRepository } from './mvpHandler';
import { handleTrusted } from './trustedHandler';

export function setupDataLifecycleHandlers(
  repository: MvpRepository = createDesktopMvpRepository(),
  db: Database.Database = getDb(),
) {
  handleTrusted('data:export-desktop', async () => {
    const { client, session } = await hydrateDesktopSession();
    if (!session?.user?.id) throw new Error('Desktop data export requires authentication');
    const identitySource = isLocalDesktopAuthAllowed() && process.env.PLAYWRIGHT_TEST === '1'
      ? 'test'
      : client ? 'supabase' : 'local';
    return createDesktopExport(db, repository, session.user.id, identitySource);
  });
}
