import { ipcRenderer, contextBridge } from 'electron'

interface AuthCredentials {
  email: string
  password: string
  name?: string
}

// --------- Expose some API to the Renderer process ---------
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
  mvp: {
    getWorkspace: () => ipcRenderer.invoke('mvp:getWorkspace'),
    saveOnboarding: (input: unknown) => ipcRenderer.invoke('mvp:saveOnboarding', input),
    generateWeeklyPlan: (input: unknown) => ipcRenderer.invoke('mvp:generateWeeklyPlan', input),
    confirmPlan: (planId: string) => ipcRenderer.invoke('mvp:confirmPlan', planId),
    updateActionStatus: (actionItemId: string, patch: unknown) =>
      ipcRenderer.invoke('mvp:updateActionStatus', actionItemId, patch),
    saveDailyCheckIn: (input: unknown) => ipcRenderer.invoke('mvp:saveDailyCheckIn', input),
    addReflection: (input: unknown) => ipcRenderer.invoke('mvp:addReflection', input),
    submitFeedback: (input: { rating: number; message: string }) => ipcRenderer.invoke('mvp:submitFeedback', input),
    resetWorkspace: () => ipcRenderer.invoke('mvp:resetWorkspace'),
  },
  // Scalable Resource Handler for all future refactored features
  invokeResource: (resource: string, action: string, ...args: any[]) => ipcRenderer.invoke('resource:invoke', resource, action, ...args),
  legacy: {
    request: (method: string, url: string, body?: any) => ipcRenderer.invoke('api:legacy', method, url, body)
  }
})
