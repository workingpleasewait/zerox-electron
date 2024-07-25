const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  processPDFs: (directory, apiKey) => ipcRenderer.invoke('process-pdfs', directory, apiKey),
  deletePDFs: (directory) => ipcRenderer.invoke('delete-pdfs', directory),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath)
});