// @vitest-environment node

import { Prisma, PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PrismaBackedMvpRepository } from '../prismaMvpRepository';
import { createEmptyWorkspace } from '../../shared/mvp/state';
import { createWorkspaceExport } from '../workspaceRecovery';

const databaseUrl = process.env.LIFEOS_TEST_DATABASE_URL;
const run = databaseUrl ? describe : describe.skip;

run('Prisma account deletion integration', () => {
  const prisma = new PrismaClient({ datasources: { db: {
    url: databaseUrl ?? 'postgresql://unused:unused@127.0.0.1:1/unused',
  } } });
  const ids = ['privacy-delete-one', 'privacy-keep-two'];

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    for (const [id, email] of [[ids[0], 'privacy-delete@example.test'], [ids[1], 'privacy-keep@example.test']]) {
      await prisma.user.create({ data: {
        id, email,
        profile: { create: { displayName: id } },
        reflectionEntries: { create: { period: 'DAILY', body: `${id}-private` } },
        workspaceRecoveries: { create: {
          format: 'lifeos.mvp.workspace', version: 1, exportedAt: new Date(),
          payload: JSON.parse(JSON.stringify(createWorkspaceExport(createEmptyWorkspace()))) as Prisma.InputJsonValue,
        } },
      } });
    }
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  });

  it('cascades only the exact user identity, workspace and recoveries', async () => {
    await new PrismaBackedMvpRepository(prisma).deleteUserData(ids[0]);

    await expect(prisma.user.findUnique({ where: { id: ids[0] } })).resolves.toBeNull();
    await expect(prisma.reflectionEntry.count({ where: { userId: ids[0] } })).resolves.toBe(0);
    await expect(prisma.mvpWorkspaceRecovery.count({ where: { userId: ids[0] } })).resolves.toBe(0);
    await expect(prisma.user.findUnique({ where: { id: ids[1] } })).resolves.toMatchObject({ id: ids[1] });
    await expect(prisma.reflectionEntry.count({ where: { userId: ids[1] } })).resolves.toBe(1);
    await expect(prisma.mvpWorkspaceRecovery.count({ where: { userId: ids[1] } })).resolves.toBe(1);
  });
});
