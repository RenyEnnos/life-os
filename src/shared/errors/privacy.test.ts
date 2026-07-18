/** @vitest-environment jsdom */
import { expect, it, vi } from 'vitest';

import { captureError } from './index';
import { handleError } from '../lib/errorHandler';

it('keeps personal and free-text details out of logs and transports', () => {
  const sentinel = 'person@example.test Password123! INVITE token reflection?secret=1';
  const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const warningLog = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response());
  const gtag = vi.fn();
  window.gtag = gtag;

  const report = captureError(new Error(sentinel), {
    component: 'AccountScreen',
    action: 'load_failed',
    userId: sentinel,
    metadata: { freeText: sentinel },
  });
  handleError(`/account?token=${sentinel}`, new Error(sentinel));

  expect(JSON.stringify(report)).not.toContain(sentinel);
  expect(JSON.stringify(errorLog.mock.calls)).not.toContain(sentinel);
  expect(JSON.stringify(warningLog.mock.calls)).not.toContain(sentinel);
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(gtag).not.toHaveBeenCalled();
});
