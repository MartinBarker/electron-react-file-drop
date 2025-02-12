const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendFiles: (files) => ipcRenderer.send('files-dropped', files)
});