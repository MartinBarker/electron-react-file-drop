const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged; // Check if the app is in development mode
  const startUrl = isDev
    ? 'http://localhost:3000' // Load from React dev server
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools(); // Open DevTools in development mode
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('files-dropped', (event, files) => {
  console.log('Files dropped:', files);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
