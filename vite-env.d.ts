/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  api: {
    tasks: {
      getAll: () => Promise<any[]>;
      create: (task: any) => Promise<any>;
      update: (id: string, updates: any) => Promise<any>;
      delete: (id: string) => Promise<boolean>;
    };
  };
}
