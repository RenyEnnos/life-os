// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { resolveMvpRepositoryMode } from '../mvpRepositoryMode';

describe('explicit MVP repository selection', () => {
  it('never treats DATABASE_URL as a repository selector', () => {
    expect(() => resolveMvpRepositoryMode({ DATABASE_URL: 'postgresql://db/lifeos' }))
      .toThrow('LIFEOS_MVP_REPOSITORY');
  });

  it('accepts only explicit file or fully configured Prisma modes', () => {
    expect(resolveMvpRepositoryMode({ LIFEOS_MVP_REPOSITORY: 'file', DATABASE_URL: 'postgresql://ignored' }))
      .toBe('file');
    expect(resolveMvpRepositoryMode({ LIFEOS_MVP_REPOSITORY: 'prisma', DATABASE_URL: 'postgresql://db/lifeos' }))
      .toBe('prisma');
    expect(() => resolveMvpRepositoryMode({ LIFEOS_MVP_REPOSITORY: 'prisma' }))
      .toThrow('DATABASE_URL');
    expect(() => resolveMvpRepositoryMode({ LIFEOS_MVP_REPOSITORY: 'memory' }))
      .toThrow('LIFEOS_MVP_REPOSITORY');
  });
});
