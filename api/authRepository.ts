import path from 'node:path';
import { z } from 'zod';

import { parseInviteSeeds, type InviteSeed } from '../shared/operatingMode';
import { mutateJsonFile, readJsonFile } from './atomicJsonFile';

interface StoredInvite extends InviteSeed {
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
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  invites: StoredInvite[];
  users: StoredUser[];
}

const inviteSchema = z.object({
  email: z.string(), code: z.string(), fullName: z.string().optional(),
  claimedAt: z.string().nullable(), claimedByUserId: z.string().nullable(),
}).strict();
const userSchema = z.object({
  id: z.string(), email: z.string(), passwordHash: z.string(), fullName: z.string(), inviteCode: z.string(),
  theme: z.enum(['dark', 'light']), onboardingCompleted: z.boolean(), sessionVersion: z.number().int().nonnegative().optional(),
  createdAt: z.string(), updatedAt: z.string(),
}).strict();
export const authStateSchema = z.object({ invites: z.array(inviteSchema), users: z.array(userSchema) }).strict()
  .transform((state): AuthState => ({
    invites: state.invites,
    users: state.users.map((user) => ({ ...user, sessionVersion: user.sessionVersion ?? 0 })),
  })) as z.ZodType<AuthState>;

function emptyAuthState(): AuthState {
  return { invites: [], users: [] };
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

    const byEmailCode = new Set(state.invites.map((invite) => `${invite.email}::${invite.code}`));
    const mergedInvites = [...state.invites];

    for (const invite of fallbackInvite) {
      const normalizedInvite = {
        email: normalizeEmail(invite.email),
        code: invite.code.trim(),
        fullName: invite.fullName?.trim() || undefined,
      };
      const key = `${normalizedInvite.email}::${normalizedInvite.code}`;
      if (!byEmailCode.has(key)) {
        mergedInvites.push({
          ...normalizedInvite,
          claimedAt: null,
          claimedByUserId: null,
        });
      }
    }

    return {
      invites: mergedInvites,
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
    return state.users.find((user) => user.email === normalizeEmail(email)) ?? null;
  }

  async findUserById(userId: string) {
    const state = await this.readState();
    return state.users.find((user) => user.id === userId) ?? null;
  }

  async updateUser(userId: string, patch: Partial<Pick<StoredUser, 'fullName' | 'theme' | 'onboardingCompleted'>>) {
    return mutateJsonFile(this.filePath, authStateSchema, emptyAuthState, async (stored) => {
      const state = await this.withSeededInvites(stored);
      const user = state.users.find((entry) => entry.id === userId);
      if (!user) {
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
      if (!user) {
        throw new Error('User not found');
      }

      user.sessionVersion += 1;
      user.updatedAt = new Date().toISOString();
      return { state, result: user };
    });
  }
}
