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

// Add to global Window interface
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
