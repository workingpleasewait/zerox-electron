const { contextBridge, ipcRenderer } = require('electron');

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const nonce = getQueryParameter('nonce');

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: async () => {
    return await ipcRenderer.invoke('select-directory');
  },
  processPDFs: async (directoryPath, apiKey) => {
    return await ipcRenderer.invoke('process-pdfs', directoryPath, apiKey);
  },
  deletePDFs: async (directoryPath) => {
    return await ipcRenderer.invoke('delete-pdfs', directoryPath);
  },
  getNonce: () => nonce
});