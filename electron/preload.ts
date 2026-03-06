import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, ...args: any[]) => {
    // Whitelist channels
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args)
    }
  },
  
  invoke: (channel: string, ...args: any[]) => {
    // Whitelist channels
    const validChannels = ['get-app-info']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    return Promise.reject(new Error(`Unauthorized IPC channel: ${channel}`))
  },

  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['fromMain', 'main-process-message']
    if (validChannels.includes(channel)) {
      const subscription = (_event: any, ...args: any[]) => callback(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
    return () => {}
  },

  notify: (options: { title: string; body: string; icon?: string }) => {
    ipcRenderer.send('notify', options)
  },

  scheduleNotification: (options: { 
    id: string; 
    title: string; 
    body: string; 
    scheduledAt: number; 
    icon?: string;
  }) => {
    ipcRenderer.send('schedule-notification', options)
  },

  cancelNotification: (id: string) => {
    ipcRenderer.send('cancel-notification', id)
  },
  
  getAppInfo: () => {
    return ipcRenderer.invoke('get-app-info')
  }
})
