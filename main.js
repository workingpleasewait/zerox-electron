const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { zerox } = require('zerox');

function createWindow() {
  const nonce = crypto.randomBytes(16).toString('base64');

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PDF Processor</title>
      <style nonce="${nonce}">
        #loading {
          display: none;
          font-size: 1.2em;
          color: blue;
        }
        #instructions {
          margin-top: 20px;
          font-size: 1.1em;
          color: green;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data:; font-src 'self';">
    </head>
    <body>
      <h1>PDF Processor</h1>
      <button id="select-directory">Select Directory</button>
      <input type="text" id="api-key" placeholder="OpenAI API Key">
      <button id="process-pdfs">Process PDFs</button>
      <button id="delete-pdfs">Delete PDFs</button>
      <pre id="output"></pre>
      <div id="loading">Processing PDFs, please wait...</div>
      <div id="instructions">Please verify the combined output in the text file before deleting the PDFs.</div>

      <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
      <script nonce="${nonce}">
        const selectDirectoryButton = document.getElementById('select-directory');
        const processPDFsButton = document.getElementById('process-pdfs');
        const deletePDFsButton = document.getElementById('delete-pdfs');
        const outputElement = document.getElementById('output');
        const loadingElement = document.getElementById('loading');
        const instructionsElement = document.getElementById('instructions');

        let selectedDirectory = '';

        selectDirectoryButton.addEventListener('click', async () => {
          console.log('Select Directory button clicked');
          selectedDirectory = await window.electronAPI.selectDirectory();
          outputElement.textContent = \`Selected Directory: \${selectedDirectory}\`;
        });

        processPDFsButton.addEventListener('click', async () => {
          console.log('Process PDFs button clicked');
          const apiKey = document.getElementById('api-key').value;
          if (!apiKey) {
            Swal.fire('Error', 'Please enter your OpenAI API key.', 'error');
            return;
          }
          loadingElement.style.display = 'block';  // Show the loading indicator
          const result = await window.electronAPI.processPDFs(selectedDirectory, apiKey);
          loadingElement.style.display = 'none';  // Hide the loading indicator
          if (result.error) {
            Swal.fire('Error', result.error, 'error');
          } else {
            outputElement.textContent = result.success;
            instructionsElement.style.display = 'block';  // Show instructions
            Swal.fire('Success', 'PDFs processed successfully.', 'success');
          }
        });

        deletePDFsButton.addEventListener('click', async () => {
          console.log('Delete PDFs button clicked');
          const confirmed = confirm('Have you verified the combined output text file and are sure you want to delete the PDFs?');
          if (confirmed) {
            const result = await window.electronAPI.deletePDFs(selectedDirectory);
            if (result.error) {
              Swal.fire('Error', result.error, 'error');
            } else {
              outputElement.textContent = result.success;
              Swal.fire('Success', 'PDFs deleted successfully.', 'success');
            }
          }
        });
      </script>
    </body>
    </html>
  `;

  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
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
  console.log(`Selected Directory: ${directoryPath}`); // Log the selected directory path

  if (!directoryPath || !apiKey) {
    return { error: 'Directory path and API key are required.' };
  }

  const outputFilePath = path.resolve(directoryPath, 'combined_output.txt');
  const files = fs.readdirSync(directoryPath);
  console.log(`Files in Directory: ${files}`); // Log the files in the directory

  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
  console.log(`PDF Files: ${pdfFiles}`); // Log the identified PDF files

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
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

  for (const pdfFile of pdfFiles) {
    fs.unlinkSync(path.resolve(directoryPath, pdfFile));
  }

  return { success: 'All PDF files deleted.' };
});