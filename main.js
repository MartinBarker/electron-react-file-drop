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
      preload: path.join(__dirname, 'preload.js')  // Add this line
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

ipcMain.on('get-filepaths', (event, files) => {
  console.log('get-filepaths: ', files);

  // Get filepaths for each file
  files.forEach(file => {
    console.log('file = ', file.name)
  });

  // Send filepaths back to front end
  event.reply('get-filepaths-response', ['filepath1','filepath2']);
});

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
