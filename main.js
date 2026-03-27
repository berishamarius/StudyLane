/* ══════════════════════════════════════════════════════════════
   StudyLane – main.js  (Electron desktop shell)
   All data stored in localStorage. No backend required.
   ══════════════════════════════════════════════════════════════ */
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width:     1280,
    height:    800,
    minWidth:  360,
    minHeight: 600,
    resizable: true,
    frame:     false,
    fullscreen: true,
    show:      false,
    backgroundColor: '#1E1E2E',
    title: 'StudyLane',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration:  false,
      sandbox:          true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

app.whenReady().then(() => {
  ipcMain.on('window-minimize', () => mainWindow && mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (!mainWindow) return;
    mainWindow.isFullScreen() ? mainWindow.setFullScreen(false) : mainWindow.setFullScreen(true);
  });
  ipcMain.on('window-close', () => mainWindow && mainWindow.close());

  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    cb({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
        ],
      },
    });
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
