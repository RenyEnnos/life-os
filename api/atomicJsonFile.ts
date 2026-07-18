import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { z } from 'zod';

const queues = new Map<string, Promise<void>>();

function resolved(filePath: string) {
  return path.resolve(filePath);
}

async function inFileQueue<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
  const key = resolved(filePath);
  const previous = queues.get(key) ?? Promise.resolve();
  const result = previous.then(operation, operation);
  const settled = result.then(() => undefined, () => undefined);
  queues.set(key, settled);
  void settled.then(() => {
    if (queues.get(key) === settled) queues.delete(key);
  });
  return result;
}

export function backupPathFor(filePath: string) {
  return `${resolved(filePath)}.bak`;
}

function parseJsonBytes<T>(filePath: string, bytes: Uint8Array, schema: z.ZodType<T>): T {
  try {
    return schema.parse(JSON.parse(Buffer.from(bytes).toString('utf8')));
  } catch (cause) {
    if (cause instanceof SyntaxError || cause instanceof z.ZodError) {
      const error = new Error(`Corrupt JSON file at ${resolved(filePath)}`) as Error & { cause?: unknown };
      error.cause = cause;
      throw error;
    }
    throw cause;
  }
}

export async function readJsonFile<T>(filePath: string, schema: z.ZodType<T>, missing: () => T): Promise<T> {
  let bytes: Buffer;
  try {
    bytes = await fs.readFile(resolved(filePath));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return missing();
    throw error;
  }
  return parseJsonBytes(filePath, bytes, schema);
}

async function replaceFile(filePath: string, bytes: Uint8Array) {
  const target = resolved(filePath);
  const directory = path.dirname(target);
  const temporary = path.join(directory, `.${path.basename(target)}.${process.pid}.${randomUUID()}.tmp`);
  await fs.mkdir(directory, { recursive: true });
  try {
    await fs.writeFile(temporary, bytes, { flag: 'wx', mode: 0o600 });
    const handle = await fs.open(temporary, 'r+');
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.rename(temporary, target);
    const directoryHandle = await fs.open(directory, 'r');
    try {
      await directoryHandle.sync();
    } finally {
      await directoryHandle.close();
    }
  } catch (error) {
    await fs.rm(temporary, { force: true });
    throw error;
  }
}

async function writeWithBackup(filePath: string, state: unknown, backupCurrent = false) {
  const target = resolved(filePath);
  const next = Buffer.from(JSON.stringify(state, null, 2));
  try {
    const current = await fs.readFile(target);
    await replaceFile(backupPathFor(target), backupCurrent ? next : current);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  await replaceFile(target, next);
}

export async function mutateJsonFile<T, R>(
  filePath: string,
  schema: z.ZodType<T>,
  missing: () => T,
  mutation: (state: T) => Promise<{ state: T; result: R }> | { state: T; result: R },
  options: { purgePreviousBackup?: boolean } = {},
): Promise<R> {
  return inFileQueue(filePath, async () => {
    const current = await readJsonFile(filePath, schema, missing);
    const { state, result } = await mutation(current);
    const validated = schema.parse(state);
    await writeWithBackup(filePath, validated, options.purgePreviousBackup === true);
    return result;
  });
}

export async function writeJsonFile<T>(filePath: string, schema: z.ZodType<T>, value: T): Promise<void> {
  await inFileQueue(filePath, async () => {
    await writeWithBackup(filePath, schema.parse(value));
  });
}

export async function restoreJsonBackup<T>(filePath: string, schema: z.ZodType<T>): Promise<T> {
  return inFileQueue(filePath, async () => {
    const target = resolved(filePath);
    const backup = backupPathFor(target);
    const bytes = await fs.readFile(backup);
    const parsed = parseJsonBytes(backup, bytes, schema);
    await replaceFile(target, bytes);
    return parsed;
  });
}
