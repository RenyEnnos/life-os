/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import type { Session, User } from '@supabase/supabase-js'
import type { UserProfile } from './src/shared/types/profile'

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

interface AuthCheckResult {
  session: Session | null;
  profile: UserProfile | null;
}

interface AuthResult {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
}

// Global Electron Window API Types
interface Window {
  api: {
    auth: {
      check: () => Promise<AuthCheckResult>;
      login: (credentials: AuthCredentials) => Promise<AuthResult>;
      register: (credentials: AuthCredentials) => Promise<AuthResult>;
      logout: () => Promise<boolean>;
      resetPassword: (email: string, redirectTo?: string) => Promise<boolean>;
      updatePassword: (password: string) => Promise<AuthResult>;
      getProfile: (userId: string) => Promise<UserProfile | null>;
    };
    tasks: {
      getAll: () => Promise<any[]>;
      create: (task: any) => Promise<any>;
      update: (id: string, updates: any) => Promise<any>;
      delete: (id: string) => Promise<boolean>;
    };
    invokeResource: (resource: string, action: string, ...args: any[]) => Promise<any>;
    legacy: {
      request: (method: string, url: string, body?: any) => Promise<any>;
    };
  };
  electron: {
    notify: (options: { title: string; body: string; icon?: string }) => void;
    scheduleNotification: (options: any) => void;
    cancelNotification: (id: string) => void;
    getAppInfo: () => Promise<{ version: string; name: string; isPackaged: boolean }>;
  };
}
