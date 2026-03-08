/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global Electron Window API Types
interface Window {
  api: {
    auth: {
      check: () => Promise<any>;
      login: (credentials: any) => Promise<any>;
      logout: () => Promise<any>;
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
