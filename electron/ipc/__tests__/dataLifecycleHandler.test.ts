import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  handlers: new Map<string, (event: unknown) => Promise<unknown>>(),
  hydrate: vi.fn(),
  createExport: vi.fn(),
}));

vi.mock('electron', () => ({
  ipcMain: { handle: vi.fn((channel: string, handler: (event: unknown) => Promise<unknown>) => {
    state.handlers.set(channel, handler);
  }) },
}));
vi.mock('../../auth/desktopSession', () => ({
  hydrateDesktopSession: state.hydrate,
  isLocalDesktopAuthAllowed: () => process.env.LIFEOS_OPERATING_MODE === 'local-dev',
}));
vi.mock('../../data/desktopExport', () => ({ createDesktopExport: state.createExport }));
vi.mock('../mvpHandler', () => ({ createDesktopMvpRepository: vi.fn() }));
vi.mock('../../db/database', () => ({ getDb: vi.fn() }));

import { setupDataLifecycleHandlers } from '../dataLifecycleHandler';

const trustedEvent = { senderFrame: { url: 'file:///app/dist/index.html' } };

describe('desktop data lifecycle IPC', () => {
  beforeEach(() => {
    process.env.DIST = '/app/dist';
    process.env.LIFEOS_OPERATING_MODE = 'local-dev';
    delete process.env.PLAYWRIGHT_TEST;
    state.handlers.clear();
    vi.clearAllMocks();
  });

  it('requires a current desktop identity before exporting', async () => {
    state.hydrate.mockResolvedValue({ client: null, session: null });
    setupDataLifecycleHandlers({} as never, {} as never);

    await expect(state.handlers.get('data:export-desktop')?.(trustedEvent)).rejects.toThrow(
      'Desktop data export requires authentication',
    );
  });

  it('rejects export requests from an unexpected renderer', async () => {
    setupDataLifecycleHandlers({} as never, {} as never);

    await expect(state.handlers.get('data:export-desktop')?.({
      senderFrame: { url: 'https://attacker.example/' },
    })).rejects.toThrow('Untrusted Electron IPC sender');
    expect(state.hydrate).not.toHaveBeenCalled();
  });

  it('does not label a Supabase identity as test outside local-dev', async () => {
    process.env.LIFEOS_OPERATING_MODE = 'controlled-demo';
    process.env.PLAYWRIGHT_TEST = '1';
    state.hydrate.mockResolvedValue({ client: {}, session: { user: { id: 'cloud-user' } } });
    state.createExport.mockResolvedValue({ format: 'lifeos.desktop.export' });
    setupDataLifecycleHandlers({} as never, {} as never);

    await state.handlers.get('data:export-desktop')?.(trustedEvent);

    expect(state.createExport).toHaveBeenCalledWith({}, {}, 'cloud-user', 'supabase');
  });
});
