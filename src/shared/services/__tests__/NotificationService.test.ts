import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationService } from '../NotificationService';

describe('NotificationService', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('schedule logs a warning (not fully implemented)', async () => {
    await NotificationService.schedule();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('NotificationService.schedule is not fully implemented')
    );
  });

  it('cancel logs a warning (not fully implemented)', async () => {
    await NotificationService.cancel();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('NotificationService.cancel is not fully implemented')
    );
  });

  it('requestPermissions logs a warning (not fully implemented)', async () => {
    await NotificationService.requestPermissions();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('NotificationService.requestPermissions is not fully implemented')
    );
  });
});
