"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  send: (channel, ...args) => {
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, ...args);
    }
  },
  invoke: (channel, ...args) => {
    const validChannels = ["get-app-info"];
    if (validChannels.includes(channel)) {
      return electron.ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Unauthorized IPC channel: ${channel}`));
  },
  on: (channel, callback) => {
    const validChannels = ["fromMain", "main-process-message"];
    if (validChannels.includes(channel)) {
      const subscription = (_event, ...args) => callback(...args);
      electron.ipcRenderer.on(channel, subscription);
      return () => {
        electron.ipcRenderer.removeListener(channel, subscription);
      };
    }
    return () => {
    };
  },
  notify: (options) => {
    electron.ipcRenderer.send("notify", options);
  },
  scheduleNotification: (options) => {
    electron.ipcRenderer.send("schedule-notification", options);
  },
  cancelNotification: (id) => {
    electron.ipcRenderer.send("cancel-notification", id);
  },
  getAppInfo: () => {
    return electron.ipcRenderer.invoke("get-app-info");
  }
});
