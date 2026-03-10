import type { Session, User } from '@supabase/supabase-js';
import { apiClient } from '@/shared/api/http';
import type { UserProfile } from '@/shared/types/profile';
import type { LoginRequest, RegisterRequest } from '@/shared/types';

const AUTH_API_BASE = '/' + 'api/auth';

interface AuthResponse {
  token?: string;
  user: User;
}

interface AuthResult {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
}

interface AuthCheckResult {
  session: Session | null;
  profile: UserProfile | null;
}

interface DesktopAuthBridge {
  check?: () => Promise<AuthCheckResult>;
  login?: (credentials: LoginRequest) => Promise<AuthResult>;
  register?: (credentials: RegisterRequest) => Promise<AuthResult>;
  logout?: () => Promise<void>;
  resetPassword?: (email: string, redirectTo?: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<AuthResult>;
  getProfile?: (userId: string) => Promise<UserProfile | null>;
}

const getDesktopAuthBridge = (): DesktopAuthBridge | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (window as unknown as { api?: { auth?: DesktopAuthBridge } }).api?.auth ?? null;
};

const hasBridgeMethod = <T extends keyof DesktopAuthBridge>(
  bridge: DesktopAuthBridge | null,
  method: T
): bridge is DesktopAuthBridge & Required<Pick<DesktopAuthBridge, T>> => {
  return !!bridge && typeof bridge[method] === 'function';
};

export const authApi = {
  checkSession: async (): Promise<AuthCheckResult> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'check')) {
      return authBridge.check();
    }

    const user = await apiClient.get<User>(`${AUTH_API_BASE}/verify`);
    return {
      session: null,
      profile: user
        ? {
            id: user.id,
            full_name: (user.user_metadata?.full_name as string | undefined) ?? undefined,
            nickname: (user.user_metadata?.nickname as string | undefined) ?? undefined,
          }
        : null,
    };
  },

  login: async (credentials: LoginRequest): Promise<AuthResult> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'login')) {
      return authBridge.login(credentials);
    }

    const data = await apiClient.post<AuthResponse>(`${AUTH_API_BASE}/login`, credentials);
    return { user: data.user, session: null, profile: null };
  },

  register: async (credentials: RegisterRequest): Promise<AuthResult> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'register')) {
      return authBridge.register(credentials);
    }

    const data = await apiClient.post<AuthResponse>(`${AUTH_API_BASE}/register`, credentials);
    return { user: data.user, session: null, profile: null };
  },

  logout: async (): Promise<void> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'logout')) {
      await authBridge.logout();
      return;
    }

    await apiClient.post(`${AUTH_API_BASE}/logout`, {});
  },

  verify: async () => {
    return apiClient.get<User>(`${AUTH_API_BASE}/verify`);
  },

  updateProfile: async (data: {
    name?: string;
    avatar_url?: string;
    preferences?: Record<string, unknown>;
    theme?: 'light' | 'dark';
  }) => {
    return apiClient.patch<AuthResponse>(`${AUTH_API_BASE}/profile`, data);
  },

  resetPassword: async (email: string, redirectTo?: string): Promise<void> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'resetPassword')) {
      await authBridge.resetPassword(email, redirectTo);
      return;
    }

    if (redirectTo) {
      await apiClient.post(`${AUTH_API_BASE}/reset-password`, { email, redirectTo });
      return;
    }

    await apiClient.post(`${AUTH_API_BASE}/reset-password`, { email });
  },

  updatePassword: async (password: string): Promise<AuthResult> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'updatePassword')) {
      return authBridge.updatePassword(password);
    }

    await apiClient.post(`${AUTH_API_BASE}/update-password`, { password });
    return { user: null, session: null, profile: null };
  },

  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const authBridge = getDesktopAuthBridge();
    if (hasBridgeMethod(authBridge, 'getProfile')) {
      return authBridge.getProfile(userId);
    }

    return null;
  },
};
