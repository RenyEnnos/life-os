/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  api: {
    legacy: {
      request: (method: string, url: string, body?: any) => Promise<any>;
    };
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
  };
}
