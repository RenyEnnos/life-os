import { describe, it, expect } from 'vitest';
import { HapticsService, haptics } from '../HapticsService';

describe('HapticsService', () => {
  it('vibrate is callable without throwing', async () => {
    await expect(HapticsService.vibrate()).resolves.toBeUndefined();
  });

  it('success is callable without throwing', async () => {
    await expect(HapticsService.success()).resolves.toBeUndefined();
  });

  it('impact is callable without throwing', async () => {
    await expect(HapticsService.impact()).resolves.toBeUndefined();
  });
});

describe('haptics', () => {
  it('impact is callable without throwing', async () => {
    await expect(haptics.impact()).resolves.toBeUndefined();
  });

  it('vibrate is callable without throwing', async () => {
    await expect(haptics.vibrate()).resolves.toBeUndefined();
  });
});
