/**
 * Interface for the Electron IPC Bridge
 */
export interface ElectronAPI {
  /**
   * Send a one-way message to the main process
   */
  send: (channel: string, ...args: any[]) => void;

  /**
   * Invoke a method in the main process and wait for a result
   */
  invoke: (channel: string, ...args: any[]) => Promise<any>;

  /**
   * Listen for messages from the main process
   * Returns a function to unsubscribe
   */
  on: (channel: string, callback: (...args: any[]) => void) => () => void;

  /**
   * Send a native notification immediately
   */
  notify: (options: { title: string; body: string; icon?: string }) => void;

  /**
   * Schedule a native notification for a future time
   */
  scheduleNotification: (options: { 
    id: string; 
    title: string; 
    body: string; 
    scheduledAt: number; // timestamp in ms
    icon?: string;
  }) => void;

  /**
   * Cancel a previously scheduled notification
   */
  cancelNotification: (id: string) => void;
  
  /**
   * Get application information
   */
  getAppInfo: () => Promise<{
    version: string;
    name: string;
    isPackaged: boolean;
  }>;
}

import type { Task } from './common';

export interface TasksBridge {
  getAll(): Promise<Task[]>;
  create(task: Partial<Task>): Promise<Task>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

export interface BridgeAPI {
  tasks: TasksBridge;
  // Generic resource bridge, returns a typed result
  invokeResource: <R = unknown>(resource: string, action: string, ...args: unknown[]) => Promise<R>;
}

// Add to global Window interface
declare global {
  interface Window {
    electron: ElectronAPI;
    // Expose a permissive runtime bridge surface for tests: keep exported BridgeAPI type
    // but allow actual value to be treated as any to accommodate partial mocks.
    api: any;
  }
}
