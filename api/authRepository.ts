import path from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';

import { parseInviteSeeds, type InviteSeed } from '../shared/operatingMode';
import { mutateJsonFile, readJsonFile } from './atomicJsonFile';

export interface StoredInvite extends InviteSeed {
  claimedAt: string | null;
  claimedByUserId: string | null;
}

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  inviteCode: string;
  theme: 'dark' | 'light';
  onboardingCompleted: boolean;
  sessionVersion: number;
  deletionPending?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  invites: StoredInvite[];
  users: StoredUser[];
  revokedInviteDigests: string[];
}

const inviteSchema = z.object({
  email: z.string(), code: z.string(), fullName: z.string().optional(),
  claimedAt: z.string().nullable(), claimedByUserId: z.string().nullable(),
}).strict();
const userSchema = z.object({
  id: z.string(), email: z.string(), passwordHash: z.string(), fullName: z.string(), inviteCode: z.string(),
  theme: z.enum(['dark', 'light']), onboardingCompleted: z.boolean(), sessionVersion: z.number().int().nonnegative().optional(),
  deletionPending: z.boolean().optional(),
  createdAt: z.string(), updatedAt: z.string(),
}).strict();
export const authStateSchema = z.object({
  invites: z.array(inviteSchema), users: z.array(userSchema),
  revokedInviteDigests: z.array(z.string().regex(/^[a-f0-9]{64}$/)).optional().default([]),
}).strict()
  .transform((state): AuthState => ({
    invites: state.invites,
    revokedInviteDigests: state.revokedInviteDigests,
    users: state.users.map((user) => ({
      ...user, sessionVersion: user.sessionVersion ?? 0, deletionPending: user.deletionPending ?? false,
    })),
  })) as z.ZodType<AuthState>;

function emptyAuthState(): AuthState {
  return { invites: [], users: [], revokedInviteDigests: [] };
}

function inviteDigest(email: string, code: string) {
  return createHash('sha256').update(`${normalizeEmail(email)}::${code.trim()}`).digest('hex');
}

function defaultFilePath() {
  return process.env.LIFEOS_AUTH_DATA_FILE || path.join(process.cwd(), '.data', 'auth-state.json');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export class FileBackedAuthRepository {
  private filePath: string;
  private seedInvites: InviteSeed[];

  constructor(filePath = defaultFilePath(), seedInvites?: InviteSeed[]) {
    this.filePath = filePath;
    this.seedInvites = seedInvites ?? parseInviteSeeds(process.env.LIFEOS_INVITES);
  }

  private async readState(): Promise<AuthState> {
    return this.withSeededInvites(await readJsonFile(this.filePath, authStateSchema, emptyAuthState));
  }

  private async withSeededInvites(state: AuthState): Promise<AuthState> {
    const controlledDemo = process.env.LIFEOS_OPERATING_MODE === 'controlled-demo';
    if (
      controlledDemo &&
      state.invites.some((invite) =>
        normalizeEmail(invite.email) === 'partner@lifeos.local' || invite.code === 'LIFEOS-INVITE'
      )
    ) {
      throw new Error('Invalid operating-mode persisted state: LIFEOS_INVITES');
    }

    const fallbackInvite =
      this.seedInvites.length > 0
        ? this.seedInvites
        : controlledDemo
          ? []
          : [{ email: 'partner@lifeos.local', code: 'LIFEOS-INVITE', fullName: 'Design Partner' }];
    const configuredDigests = new Set(fallbackInvite.map(({ email, code }) => inviteDigest(email, code)));
    const revokedInviteDigests = state.revokedInviteDigests.filter((digest) => configuredDigests.has(digest));

    const byEmailCode = new Set(state.invites.map((invite) => `${invite.email}::${invite.code}`));
    const mergedInvites = [...state.invites];

    for (const invite of fallbackInvite) {
      const normalizedInvite = {
        email: normalizeEmail(invite.email),
        code: invite.code.trim(),
        fullName: invite.fullName?.trim() || undefined,
      };
      const key = `${normalizedInvite.email}::${normalizedInvite.code}`;
      if (!byEmailCode.has(key) && !revokedInviteDigests.includes(inviteDigest(normalizedInvite.email, normalizedInvite.code))) {
        mergedInvites.push({
          ...normalizedInvite,
          claimedAt: null,
          claimedByUserId: null,
        });
      }
    }

    return {
      invites: mergedInvites,
      revokedInviteDigests,
      users: state.users.map((user) => ({
        ...user,
        sessionVersion: Number.isInteger(user.sessionVersion) && user.sessionVersion >= 0 ? user.sessionVersion : 0,
      })),
    };
  }

  async registerWithInvite(input: {
    email: string;
    passwordHash: string;
    fullName: string;
    inviteCode: string;
  }) {
    return mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const email = normalizeEmail(input.email);
      const inviteCode = input.inviteCode.trim();

      const existingUser = state.users.find((user) => user.email === email);
      if (existingUser) {
        throw new Error('User already registered');
      }

      const invite = state.invites.find((entry) => entry.email === email && entry.code === inviteCode);
      if (!invite) {
        throw new Error('Invite not found for this email');
      }

      if (invite.claimedAt) {
        throw new Error('Invite already claimed');
      }

      const now = new Date().toISOString();
      const user: StoredUser = {
        id: createId('usr'),
        email,
        passwordHash: input.passwordHash,
        fullName: input.fullName.trim(),
        inviteCode,
        theme: 'dark',
        onboardingCompleted: false,
        sessionVersion: 0,
        deletionPending: false,
        createdAt: now,
        updatedAt: now,
      };

      invite.claimedAt = now;
      invite.claimedByUserId = user.id;
      state.users.push(user);
      return { state, result: user };
    });
  }

  async findUserByEmail(email: string) {
    const state = await this.readState();
    return state.users.find((user) => user.email === normalizeEmail(email) && !user.deletionPending) ?? null;
  }

  async findUserById(userId: string) {
    const state = await this.readState();
    return state.users.find((user) => user.id === userId && !user.deletionPending) ?? null;
  }

  async updateUser(userId: string, patch: Partial<Pick<StoredUser, 'fullName' | 'theme' | 'onboardingCompleted'>>) {
    return mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const user = state.users.find((entry) => entry.id === userId);
      if (!user || user.deletionPending) {
        throw new Error('User not found');
      }

      if (patch.fullName !== undefined) {
        user.fullName = patch.fullName.trim();
      }
      if (patch.theme !== undefined) {
        user.theme = patch.theme;
      }
      if (patch.onboardingCompleted !== undefined) {
        user.onboardingCompleted = patch.onboardingCompleted;
      }
      user.updatedAt = new Date().toISOString();

      return { state, result: user };
    });
  }

  async revokeSessions(userId: string) {
    return mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const user = state.users.find((entry) => entry.id === userId);
      if (!user || user.deletionPending) {
        throw new Error('User not found');
      }

      user.sessionVersion += 1;
      user.updatedAt = new Date().toISOString();
      return { state, result: user };
    });
  }

  async beginAccountDeletion(userId: string): Promise<void> {
    await mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const user = state.users.find((entry) => entry.id === userId);
      if (!user) throw new Error('User not found');
      user.deletionPending = true;
      user.sessionVersion += 1;
      user.updatedAt = new Date().toISOString();
      return { state, result: undefined };
    }, { purgePreviousBackup: true });
  }

  async cancelAccountDeletion(userId: string): Promise<void> {
    await mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const user = state.users.find((entry) => entry.id === userId);
      if (!user) throw new Error('User not found');
      user.deletionPending = false;
      return { state, result: undefined };
    }, { purgePreviousBackup: true });
  }

  async finalizeAccountDeletion(userId: string): Promise<void> {
    await mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const userIndex = state.users.findIndex((entry) => entry.id === userId && entry.deletionPending);
      if (userIndex < 0) throw new Error('Pending deletion not found');
      state.users.splice(userIndex, 1);
      const inviteIndex = state.invites.findIndex((entry) => entry.claimedByUserId === userId);
      if (inviteIndex >= 0) {
        const [invite] = state.invites.splice(inviteIndex, 1);
        state.revokedInviteDigests.push(inviteDigest(invite.email, invite.code));
      }
      return { state, result: undefined };
    }, { purgePreviousBackup: true });
  }

  async listPendingDeletionUserIds(): Promise<string[]> {
    const state = await this.readState();
    return state.users.filter(({ deletionPending }) => deletionPending).map(({ id }) => id);
  }
}
