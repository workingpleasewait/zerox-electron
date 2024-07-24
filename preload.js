const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: async () => {
    return await ipcRenderer.invoke('select-directory');
  },
  processPDFs: async (directoryPath, apiKey) => {
    return await ipcRenderer.invoke('process-pdfs', directoryPath, apiKey);
  },
  deletePDFs: async (directoryPath) => {
    return await ipcRenderer.invoke('delete-pdfs', directoryPath);
  }
});