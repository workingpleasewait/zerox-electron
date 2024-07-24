const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: async () => {
    console.log('selectDirectory invoked');
    return await ipcRenderer.invoke('select-directory');
  },
  processPDFs: async (directoryPath, apiKey) => {
    console.log('processPDFs invoked', directoryPath, apiKey);
    return await ipcRenderer.invoke('process-pdfs', directoryPath, apiKey);
  },
  deletePDFs: async (directoryPath) => {
    console.log('deletePDFs invoked', directoryPath);
    return await ipcRenderer.invoke('delete-pdfs', directoryPath);
  }
});