const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { zerox } = require('zerox');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('process-pdfs', async (event, directoryPath, apiKey) => {
  if (!directoryPath || !apiKey) {
    return { error: 'Directory path and API key are required.' };
  }

  const outputFilePath = path.resolve(directoryPath, 'combined_output.txt');
  const files = fs.readdirSync(directoryPath);
  const pdfFiles = files.filter(file => file.endsWith('.pdf'));

  if (pdfFiles.length === 0) {
    return { error: 'No PDF files found in the directory.' };
  }

  let combinedOutput = '';

  for (const pdfFile of pdfFiles) {
    try {
      const result = await zerox({
        filePath: path.resolve(directoryPath, pdfFile),
        openaiAPIKey: apiKey,
      });
      combinedOutput += `Result for ${pdfFile}:\n${JSON.stringify(result, null, 2)}\n\n`;
    } catch (error) {
      return { error: `Error processing ${pdfFile}: ${error.message}` };
    }
  }

  fs.writeFileSync(outputFilePath, combinedOutput);
  return { success: `Combined output written to ${outputFilePath}` };
});

ipcMain.handle('delete-pdfs', async (event, directoryPath) => {
  const files = fs.readdirSync(directoryPath);
  const pdfFiles = files.filter(file => file.endsWith('.pdf'));

  for (const pdfFile of pdfFiles) {
    fs.unlinkSync(path.resolve(directoryPath, pdfFile));
  }

  return { success: 'All PDF files deleted.' };
});