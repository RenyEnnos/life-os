import { ipcRenderer, contextBridge } from 'electron'

interface AuthCredentials {
  email: string
  password: string
  name?: string
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

contextBridge.exposeInMainWorld('electron', {
  notify: (options: { title: string; body: string; icon?: string }) => ipcRenderer.send('notify', options),
  scheduleNotification: (options: any) => ipcRenderer.send('schedule-notification', options),
  cancelNotification: (id: string) => ipcRenderer.send('cancel-notification', id),
  getAppInfo: () => ipcRenderer.invoke('get-app-info')
})

contextBridge.exposeInMainWorld('api', {
  auth: {
    check: () => ipcRenderer.invoke('auth:check'),
    login: (credentials: AuthCredentials) => ipcRenderer.invoke('auth:login', credentials),
    register: (credentials: AuthCredentials) => ipcRenderer.invoke('auth:register', credentials),
    logout: () => ipcRenderer.invoke('auth:logout'),
    resetPassword: (email: string, redirectTo?: string) => ipcRenderer.invoke('auth:reset-password', email, redirectTo),
    updatePassword: (password: string) => ipcRenderer.invoke('auth:update-password', password),
    getProfile: (userId: string) => ipcRenderer.invoke('auth:get-profile', userId)
  },
  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    create: (task: any) => ipcRenderer.invoke('tasks:create', task),
    update: (id: string, updates: any) => ipcRenderer.invoke('tasks:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('tasks:delete', id)
  },
  // Scalable Resource Handler for all future refactored features
  invokeResource: (resource: string, action: string, ...args: any[]) => ipcRenderer.invoke('resource:invoke', resource, action, ...args),
  legacy: {
    request: (method: string, url: string, body?: any) => ipcRenderer.invoke('api:legacy', method, url, body)
  }
})
