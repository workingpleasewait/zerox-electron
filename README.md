# Zerox-Electron

Zerox-Electron is a simple Electron app for processing and converting PDF files using OpenAI's API. This application allows users to select a directory containing PDF files, convert them, verify the combined output, and delete the original PDF files if desired.

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

#### Locate the Application Folder:
1. Open Finder.
2. Navigate to the folder where the Zerox-Electron application files are located.

#### Run the Application:
1. **Open Terminal:**
   - Open the Terminal application on your computer.
   
2. **Navigate to the Application Directory:**
   - Use the `cd` command to change the directory to where the Zerox-Electron application files are located. For example:
     ```bash
     cd /path/to/zerox-electron
     ```
   
3. **Start the Application:**
   - Type the following command to start the application:
     ```bash
     npm start
     ```
   - This will open the application window.

### Using the Application:
1. **Select Directory:**
   - Click the "Select Directory" button.
   - In the dialog that appears, navigate to and select the folder containing the PDF files you want to process.
   
2. **Enter API Key:**
   - Enter your OpenAI API key in the "OpenAI API Key" field.
   
3. **Process PDFs:**
   - Click the "Process PDFs" button.
   - A loading message will appear indicating the processing is in progress.
   - Once processing is complete, the results will be displayed in the application.

4. **Check the Combined Output:**
   - Verify the combined output text file in the selected directory.
   
5. **Delete PDFs:**
   - After verifying the combined output, click the "Delete PDFs" button.
   - Confirm the prompt to delete the original PDF files.

### Important Note
- Make sure to verify the combined output text file before clicking the "Delete PDFs" button to ensure all data has been correctly processed.

## Troubleshooting

- If the application does not respond, ensure you have the correct directory selected and that your OpenAI API key is valid.
- For any issues, please contact your IT support team.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
