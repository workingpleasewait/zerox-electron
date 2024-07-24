# Zerox-Electron

Zerox-Electron is a simple macOS application for processing and converting PDF files using OpenAI's API. This application allows users to select a directory containing PDF files, convert them, verify the combined output, and delete the original PDF files if desired.

## Features

- Select a directory containing PDF files.
- Enter an OpenAI API key for processing.
- Convert PDF files to a combined text output.
- Verify the combined output before deleting original PDF files.
- Delete original PDF files after verification.

## Prerequisites

- Ensure you have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).

## How to Use

### Step-by-Step Instructions

1. **Locate the Application Folder**:
   - Open Finder.
   - Navigate to the folder where the Zerox-Electron application files are located.

2. **Run the Application**:
   - **Double-Click the `index.html` File**:
     - Locate the `index.html` file in the Zerox-Electron folder.
     - Double-click on the `index.html` file to open it in your default web browser.

3. **Using the Application**:
   - **Select Directory**:
     1. Click the "Select Directory" button.
     2. In the dialog that appears, navigate to and select the folder containing the PDF files you want to process.
   - **Enter API Key**:
     1. Enter your OpenAI API key in the "OpenAI API Key" field.
   - **Process PDFs**:
     1. Click the "Process PDFs" button.
     2. A loading message will appear indicating the processing is in progress.
     3. Once processing is complete, the results will be displayed in the application.
   - **Check the Combined Output**:
     1. Verify the combined output text file in the selected directory.
   - **Delete PDFs**:
     1. After verifying the combined output, click the "Delete PDFs" button.
     2. Confirm the prompt to delete the original PDF files.

### Important Note
- Make sure to verify the combined output text file before clicking the "Delete PDFs" button to ensure all data has been correctly processed.

## Troubleshooting

- If the application does not respond, ensure you have the correct directory selected and that your OpenAI API key is valid.
- For any issues, please contact your IT support team.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
