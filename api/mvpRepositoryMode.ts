export type MvpRepositoryMode = 'file' | 'prisma';

export function resolveMvpRepositoryMode(env: Record<string, string | undefined>): MvpRepositoryMode {
  const mode = env.LIFEOS_MVP_REPOSITORY?.trim();
  if (mode !== 'file' && mode !== 'prisma') {
    throw new Error('Invalid persistence configuration: LIFEOS_MVP_REPOSITORY must be file or prisma');
  }
  if (mode === 'prisma' && !env.DATABASE_URL?.trim()) {
    throw new Error('Invalid persistence configuration: DATABASE_URL is required for prisma');
  }
  return mode;
}
