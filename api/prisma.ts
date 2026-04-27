import { PrismaClient } from '@prisma/client';

declare global {
  var __lifeosPrisma__: PrismaClient | undefined;
}

export function createPrismaClient() {
  return new PrismaClient();
}

export const prisma = globalThis.__lifeosPrisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__lifeosPrisma__ = prisma;
}
