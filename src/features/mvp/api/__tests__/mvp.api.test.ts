import { afterEach, describe, expect, it, vi } from 'vitest';

import { mvpApi } from '@/features/mvp/api/mvp.api';
import { createEmptyWorkspace } from '@/features/mvp/lib/state';

const originalWindow = global.window;

describe('mvpApi desktop transport', () => {
  afterEach(() => {
    if (originalWindow) {
      global.window = originalWindow;
    } else {
      delete (global as { window?: unknown }).window;
    }
  });

  it('uses the explicit Electron MVP bridge instead of the generic HTTP fallback', async () => {
    const workspace = createEmptyWorkspace();
    const getWorkspace = vi.fn().mockResolvedValue(workspace);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      writable: true,
      value: {
      electron: {},
      api: {
        mvp: {
          getWorkspace,
        },
        legacy: {
          request: vi.fn(),
        },
      },
      },
    });

    await expect(mvpApi.getWorkspace()).resolves.toEqual(workspace);
    expect(getWorkspace).toHaveBeenCalledOnce();
    expect(global.window.api.legacy.request).not.toHaveBeenCalled();
  });
});
