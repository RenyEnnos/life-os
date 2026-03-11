"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electron", {
  notify: (options) => electron.ipcRenderer.send("notify", options),
  scheduleNotification: (options) => electron.ipcRenderer.send("schedule-notification", options),
  cancelNotification: (id) => electron.ipcRenderer.send("cancel-notification", id),
  getAppInfo: () => electron.ipcRenderer.invoke("get-app-info")
});
electron.contextBridge.exposeInMainWorld("api", {
  auth: {
    check: () => electron.ipcRenderer.invoke("auth:check"),
    login: (credentials) => electron.ipcRenderer.invoke("auth:login", credentials),
    register: (credentials) => electron.ipcRenderer.invoke("auth:register", credentials),
    logout: () => electron.ipcRenderer.invoke("auth:logout"),
    resetPassword: (email, redirectTo) => electron.ipcRenderer.invoke("auth:reset-password", email, redirectTo),
    updatePassword: (password) => electron.ipcRenderer.invoke("auth:update-password", password),
    getProfile: (userId) => electron.ipcRenderer.invoke("auth:get-profile", userId)
  },
  tasks: {
    getAll: () => electron.ipcRenderer.invoke("tasks:getAll"),
    create: (task) => electron.ipcRenderer.invoke("tasks:create", task),
    update: (id, updates) => electron.ipcRenderer.invoke("tasks:update", id, updates),
    delete: (id) => electron.ipcRenderer.invoke("tasks:delete", id)
  },
  // Scalable Resource Handler for all future refactored features
  invokeResource: (resource, action, ...args) => electron.ipcRenderer.invoke("resource:invoke", resource, action, ...args),
  legacy: {
    request: (method, url, body) => electron.ipcRenderer.invoke("api:legacy", method, url, body)
  }
});
