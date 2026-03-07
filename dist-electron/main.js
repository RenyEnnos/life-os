import { app, ipcMain, Notification, BrowserWindow, globalShortcut, shell, Tray, Menu } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import windowStateKeeper from "electron-window-state";
import schedule from "node-schedule";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env.DIST = path.join(__dirname$1, "../dist");
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname$1, "../public");
let win;
let tray;
const scheduledJobs = /* @__PURE__ */ new Map();
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("lifeos", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("lifeos");
}
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createTray() {
  const iconCandidates = ["icon-192.png", "icon-512.png", "favicon.svg"];
  let trayIcon;
  for (const candidate of iconCandidates) {
    const candidatePath = path.join(process.env.PUBLIC, candidate);
    if (fs.existsSync(candidatePath)) {
      trayIcon = candidatePath;
      break;
    }
  }
  if (!trayIcon) {
    console.warn("No tray icon found – system tray disabled");
    return;
  }
  try {
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Abrir Life OS",
        click: () => {
          win == null ? void 0 : win.show();
        }
      },
      { type: "separator" },
      {
        label: "Sair",
        click: () => {
          app.quit();
        }
      }
    ]);
    tray.setToolTip("Life OS");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
      if (win == null ? void 0 : win.isVisible()) {
        win.hide();
      } else {
        win == null ? void 0 : win.show();
      }
    });
  } catch (err) {
    console.error("Failed to create system tray:", err);
  }
}
function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  });
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(process.env.PUBLIC, "favicon.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    backgroundColor: "#050505",
    titleBarStyle: "hidden",
    // Modern frameless look
    titleBarOverlay: process.platform === "win32" ? {
      color: "#050505",
      symbolColor: "#ffffff",
      height: 32
    } : false
  });
  mainWindowState.manage(win);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
  win.on("closed", () => {
    win = null;
  });
}
ipcMain.on("notify", (_event, options) => {
  new Notification({
    title: options.title,
    body: options.body,
    icon: options.icon || path.join(process.env.PUBLIC, "favicon.svg")
  }).show();
});
ipcMain.on("schedule-notification", (_event, options) => {
  var _a;
  if (scheduledJobs.has(options.id)) {
    (_a = scheduledJobs.get(options.id)) == null ? void 0 : _a.cancel();
  }
  const date = new Date(options.scheduledAt);
  if (date > /* @__PURE__ */ new Date()) {
    const job = schedule.scheduleJob(date, () => {
      const notification = new Notification({
        title: options.title,
        body: options.body,
        icon: options.icon || path.join(process.env.PUBLIC, "favicon.svg")
      });
      notification.on("click", () => {
        if (win) {
          if (win.isMinimized()) win.restore();
          win.focus();
          win.show();
        }
      });
      notification.show();
      scheduledJobs.delete(options.id);
    });
    if (job) {
      scheduledJobs.set(options.id, job);
      console.log(`Notification scheduled: ${options.title} at ${date.toISOString()}`);
    }
  }
});
ipcMain.on("cancel-notification", (_event, id) => {
  var _a;
  if (scheduledJobs.has(id)) {
    (_a = scheduledJobs.get(id)) == null ? void 0 : _a.cancel();
    scheduledJobs.delete(id);
    console.log(`Notification cancelled: ${id}`);
  }
});
ipcMain.handle("get-app-info", () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    isPackaged: app.isPackaged
  };
});
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
      win.show();
    }
    const url = commandLine.pop();
    if (url == null ? void 0 : url.startsWith("lifeos://")) {
      console.log("Deep link received:", url);
    }
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  app.whenReady().then(() => {
    createWindow();
    createTray();
    globalShortcut.register("Alt+Space", () => {
      if (win) {
        if (win.isVisible()) {
          win.hide();
        } else {
          win.show();
          win.focus();
        }
      }
    });
  });
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
}
