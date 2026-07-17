// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { backupPathFor, mutateJsonFile, restoreJsonBackup } from '../atomicJsonFile';
import { FileBackedAuthRepository } from '../authRepository';
import { FileBackedMvpRepository } from '../mvpRepository';

describe('atomic JSON persistence', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lifeos-atomic-json-'));
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(directory, { recursive: true, force: true });
  });

  it.each([
    ['auth', (file: string) => new FileBackedAuthRepository(file, []).findUserById('missing')],
    ['workspace', (file: string) => new FileBackedMvpRepository(file).getWorkspace('missing')],
  ])('fails loudly on malformed %s JSON without changing its bytes', async (_label, read) => {
    const file = path.join(directory, `${_label}.json`);
    const corrupt = Buffer.from('{"truncated":');
    await fs.writeFile(file, corrupt);

    await expect(read(file)).rejects.toThrow(`Corrupt JSON file at ${file}`);
    expect(await fs.readFile(file)).toEqual(corrupt);
  });

  it.each([
    ['auth', '{"invites":[],"users":"not-an-array"}\n', (file: string) => new FileBackedAuthRepository(file, []).findUserById('missing')],
    ['workspace', '{"users":[],"recoveries":{}}\n', (file: string) => new FileBackedMvpRepository(file).getWorkspace('missing')],
  ])('fails loudly on a structurally invalid %s store without rewriting it', async (label, payload, read) => {
    const file = path.join(directory, `invalid-${label}.json`);
    const invalid = Buffer.from(payload);
    await fs.writeFile(file, invalid);

    await expect(read(file)).rejects.toThrow(`Corrupt JSON file at ${file}`);
    expect(await fs.readFile(file)).toEqual(invalid);
  });

  it('keeps the target intact and removes the temp file when rename is interrupted', async () => {
    const file = path.join(directory, 'interrupted.json');
    const schema = z.object({ value: z.number() }).strict();
    await mutateJsonFile(file, schema, () => ({ value: 0 }), (state) => ({ state: { value: state.value + 1 }, result: undefined }));
    const before = await fs.readFile(file);
    const rename = vi.spyOn(fs, 'rename').mockImplementation(async (source, destination) => {
      if (path.resolve(String(destination)) === path.resolve(file)) throw new Error('simulated interruption');
      return vi.importActual<typeof import('node:fs/promises')>('node:fs/promises').then((actual) => actual.rename(source, destination));
    });

    await expect(mutateJsonFile(file, schema, () => ({ value: 0 }), () => ({ state: { value: 2 }, result: undefined })))
      .rejects.toThrow('simulated interruption');

    expect(await fs.readFile(file)).toEqual(before);
    expect((await fs.readdir(directory)).filter((name) => name.endsWith('.tmp'))).toEqual([]);
    rename.mockRestore();
  });

  it('backs up and restores the previous file byte for byte', async () => {
    const file = path.join(directory, 'restore.json');
    const schema = z.object({ value: z.number() }).strict();
    const original = Buffer.from('{\n  "value": 7\n}\n');
    await fs.writeFile(file, original);

    await mutateJsonFile(file, schema, () => ({ value: 0 }), () => ({ state: { value: 8 }, result: undefined }));
    expect(await fs.readFile(backupPathFor(file))).toEqual(original);
    await restoreJsonBackup(file, schema);
    expect(await fs.readFile(file)).toEqual(original);
  });

  it('serializes auth and workspace mutations across repository instances sharing a path', async () => {
    const authFile = path.join(directory, 'auth.json');
    const firstAuth = new FileBackedAuthRepository(authFile, [{ email: 'one@example.test', code: 'ONE' }]);
    const secondAuth = new FileBackedAuthRepository(authFile, [{ email: 'two@example.test', code: 'TWO' }]);
    await Promise.all([
      firstAuth.registerWithInvite({ email: 'one@example.test', inviteCode: 'ONE', fullName: 'One', passwordHash: 'hash-1' }),
      secondAuth.registerWithInvite({ email: 'two@example.test', inviteCode: 'TWO', fullName: 'Two', passwordHash: 'hash-2' }),
    ]);
    expect(await firstAuth.findUserByEmail('one@example.test')).not.toBeNull();
    expect(await firstAuth.findUserByEmail('two@example.test')).not.toBeNull();

    const workspaceFile = path.join(directory, 'workspace.json');
    const firstWorkspace = new FileBackedMvpRepository(workspaceFile);
    const secondWorkspace = new FileBackedMvpRepository(workspaceFile);
    await Promise.all([
      firstWorkspace.addReflection('user', { period: 'daily', body: 'first' }),
      secondWorkspace.addReflection('user', { period: 'daily', body: 'second' }),
    ]);
    expect((await firstWorkspace.getWorkspace('user')).reflections.map(({ body }) => body).sort())
      .toEqual(['first', 'second']);
  });
});
