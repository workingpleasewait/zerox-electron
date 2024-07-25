const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { zerox } = require('zerox');

async function createWindow() {
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
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
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
        #selected-directory, #output {
          margin-top: 10px;
          font-size: 1em;
          color: black;
          word-wrap: break-word; /* Ensure text wraps */
          white-space: pre-wrap; /* Preserve whitespace and line breaks */
        }
        #output a {
          color: blue;
          text-decoration: underline;
          cursor: pointer;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" nonce="${nonce}">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net; style-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net; img-src 'self' data:; font-src 'self';">
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
      <div id="selected-directory"></div>

      <script nonce="${nonce}">
        let selectedDirectory = ''; // Store selected directory globally

        const selectDirectoryButton = document.getElementById('select-directory');
        const processPDFsButton = document.getElementById('process-pdfs');
        const deletePDFsButton = document.getElementById('delete-pdfs');
        const apiKeyInput = document.getElementById('api-key');
        const outputElement = document.getElementById('output');
        const loadingElement = document.getElementById('loading');
        const selectedDirectoryElement = document.getElementById('selected-directory');

        selectDirectoryButton.addEventListener('click', async () => {
          const directory = await window.electronAPI.selectDirectory();
          selectedDirectory = directory; // Store selected directory
          console.log(\`Selected Directory: \${directory}\`);
          selectedDirectoryElement.textContent = \`Selected Directory: \${directory}\`; // Display selected directory
        });

        processPDFsButton.addEventListener('click', async () => {
          // Clear previous output
          outputElement.innerHTML = '';
          const apiKey = apiKeyInput.value;
          if (!selectedDirectory || !apiKey) {
            Swal.fire('Error', 'Directory path and API key are required.', 'error');
            return;
          }
          loadingElement.style.display = 'block';
          const result = await window.electronAPI.processPDFs(selectedDirectory, apiKey);
          loadingElement.style.display = 'none';
          if (result.error) {
            Swal.fire('Error', result.error, 'error');
          } else {
            const outputPath = result.success;
            outputElement.innerHTML = \`Combined output written to <a href="#" id="output-link">\${outputPath}</a>\`;
            document.getElementById('output-link').addEventListener('click', (event) => {
              event.preventDefault();
              window.electronAPI.openPath(outputPath);
            });
          }
        });

        deletePDFsButton.addEventListener('click', async () => {
          if (!selectedDirectory) {
            Swal.fire('Error', 'Directory path is required.', 'error');
            return;
          }
          const result = await window.electronAPI.deletePDFs(selectedDirectory);
          if (result.error) {
            Swal.fire('Error', result.error, 'error');
          } else {
            Swal.fire('Success', result.success, 'success');
          }
        });

        // Inject SweetAlert2 script with nonce dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js';
        script.nonce = '${nonce}';
        document.head.appendChild(script);
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
  const files = await fs.readdir(directoryPath);
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
      combinedOutput += `Error processing ${pdfFile}: ${error.message}\n\n`;
    }
  }

  await fs.writeFile(outputFilePath, combinedOutput);
  return { success: outputFilePath };
});

ipcMain.handle('delete-pdfs', async (event, directoryPath) => {
  const files = await fs.readdir(directoryPath);
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

  for (const pdfFile of pdfFiles) {
    await fs.unlink(path.resolve(directoryPath, pdfFile));
  }

  return { success: 'All PDF files deleted.' };
});

ipcMain.handle('open-path', async (event, filePath) => {
  const directory = path.dirname(filePath);
  await shell.openPath(directory);
});