import fs from 'node:fs/promises';
import path from 'node:path';

export interface InviteSeed {
  code: string;
  email: string;
  fullName?: string;
}

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
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  invites: StoredInvite[];
  users: StoredUser[];
}

function defaultFilePath() {
  return path.join(process.cwd(), '.data', 'auth-state.json');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseInviteSeeds(raw?: string): InviteSeed[] {
  if (!raw?.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as InviteSeed[];
    if (Array.isArray(parsed)) {
      return parsed
        .filter((invite) => invite?.email && invite?.code)
        .map((invite) => ({
          code: invite.code.trim(),
          email: normalizeEmail(invite.email),
          fullName: invite.fullName?.trim() || undefined,
        }));
    }
  } catch {
    // Fall through to compact string parsing.
  }

  return raw
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const [email, code, ...nameParts] = segment.split(':').map((part) => part.trim());
      return {
        email: normalizeEmail(email),
        code,
        fullName: nameParts.join(':') || undefined,
      };
    })
    .filter((invite) => invite.email && invite.code);
}

export class FileBackedAuthRepository {
  private filePath: string;
  private seedInvites: InviteSeed[];

  constructor(filePath = defaultFilePath(), seedInvites?: InviteSeed[]) {
    this.filePath = filePath;
    this.seedInvites = seedInvites ?? parseInviteSeeds(process.env.LIFEOS_INVITES);
  }

  private async readState(): Promise<AuthState> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      return await this.withSeededInvites({
        invites: Array.isArray(parsed.invites) ? parsed.invites : [],
        users: Array.isArray(parsed.users) ? parsed.users : [],
      });
    } catch (error) {
      const emptyState = await this.withSeededInvites({ invites: [], users: [] });
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.writeState(emptyState);
        return emptyState;
      }
      throw error;
    }
  }

  private async writeState(state: AuthState) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  private async withSeededInvites(state: AuthState): Promise<AuthState> {
    const fallbackInvite =
      this.seedInvites.length > 0
        ? this.seedInvites
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
      users: state.users,
    };
  }

  async registerWithInvite(input: {
    email: string;
    passwordHash: string;
    fullName: string;
    inviteCode: string;
  }) {
    const state = await this.readState();
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
      createdAt: now,
      updatedAt: now,
    };

    invite.claimedAt = now;
    invite.claimedByUserId = user.id;
    state.users.push(user);
    await this.writeState(state);
    return user;
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
    const state = await this.readState();
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

    await this.writeState(state);
    return user;
  }
}
