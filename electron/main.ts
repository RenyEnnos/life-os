import { app, BrowserWindow, shell, ipcMain, Notification, Tray, Menu, globalShortcut } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import windowStateKeeper from 'electron-window-state'
import schedule from 'node-schedule'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ └── main.js
// │ │ └── preload.js
//
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null
let tray: Tray | null

// Keep track of scheduled jobs
const scheduledJobs = new Map<string, schedule.Job>()

// Handle deep links
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('lifeos', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('lifeos')
}

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createTray() {
  try {
    const iconPath = path.join(process.env.PUBLIC, 'favicon.svg')
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Abrir Life OS', 
        click: () => {
          win?.show()
        } 
      },
      { type: 'separator' },
      { 
        label: 'Sair', 
        click: () => {
          app.quit()
        } 
      }
    ])

    tray.setToolTip('Life OS')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      if (win?.isVisible()) {
        win.hide()
      } else {
        win?.show()
      }
    })
  } catch (err) {
    console.error('Failed to create system tray:', err)
  }
}

function createWindow() {
  // Load the previous state with fallback to default values
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  })

  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(process.env.PUBLIC, 'favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    backgroundColor: '#050505',
    titleBarStyle: 'hidden', // Modern frameless look
    titleBarOverlay: process.platform === 'win32' ? {
      color: '#050505',
      symbolColor: '#ffffff',
      height: 32
    } : false
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized state, if it was maximized when it was closed
  mainWindowState.manage(win)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  win.on('closed', () => {
    win = null
  })
}

// IPC Handlers
ipcMain.on('notify', (_event, options: { title: string; body: string; icon?: string }) => {
  new Notification({
    title: options.title,
    body: options.body,
    icon: options.icon || path.join(process.env.PUBLIC, 'favicon.svg')
  }).show()
})

ipcMain.on('schedule-notification', (_event, options: { 
  id: string; 
  title: string; 
  body: string; 
  scheduledAt: number; 
  icon?: string;
}) => {
  // Cancel if exists
  if (scheduledJobs.has(options.id)) {
    scheduledJobs.get(options.id)?.cancel()
  }

  const date = new Date(options.scheduledAt)
  
  // Only schedule if in the future
  if (date > new Date()) {
    const job = schedule.scheduleJob(date, () => {
      const notification = new Notification({
        title: options.title,
        body: options.body,
        icon: options.icon || path.join(process.env.PUBLIC, 'favicon.svg')
      })
      
      notification.on('click', () => {
        if (win) {
          if (win.isMinimized()) win.restore()
          win.focus()
          win.show()
        }
      })

      notification.show()
      scheduledJobs.delete(options.id)
    })

    if (job) {
      scheduledJobs.set(options.id, job)
      console.log(`Notification scheduled: ${options.title} at ${date.toISOString()}`)
    }
  }
})

ipcMain.on('cancel-notification', (_event, id: string) => {
  if (scheduledJobs.has(id)) {
    scheduledJobs.get(id)?.cancel()
    scheduledJobs.delete(id)
    console.log(`Notification cancelled: ${id}`)
  }
})

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    isPackaged: app.isPackaged
  }
})

// Handle second instance (deep links)
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
      win.show()
    }
    
    // Handle the deep link
    const url = commandLine.pop()
    if (url?.startsWith('lifeos://')) {
      // Process URL here if needed
      console.log('Deep link received:', url)
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.whenReady().then(() => {
    createWindow()
    createTray()

    // Register Global Shortcut (Alt+Space) to show/hide app
    globalShortcut.register('Alt+Space', () => {
      if (win) {
        if (win.isVisible()) {
          win.hide()
        } else {
          win.show()
          win.focus()
        }
      }
    })
  })

  app.on('will-quit', () => {
    // Unregister all shortcuts
    globalShortcut.unregisterAll()
  })
}
