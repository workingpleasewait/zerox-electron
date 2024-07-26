# Zerox-Electron

Zerox-Electron is a user-friendly application designed for processing and converting PDF files into a combined text file using OpenAI's API. This tool allows users to easily select a directory of PDF files, process them, and access the combined output file.

## Features

- **Select Directory**: Choose a directory containing PDF files for processing.
- **Enter API Key**: Provide your OpenAI API key for processing the PDFs.
- **Process PDFs**: Convert PDF files in the selected directory to a combined text output.
- **Real-time Processing Feedback**: The application now includes an animation effect in the "Processing, please wait..." message, providing real-time feedback during the processing phase.
- **Clickable Output File Link**: Once processing is complete, the output file is displayed as a clickable link, allowing you to open it directly with your default text file viewer.

## How to Use

1. **Select Directory**: Click the "Select Directory" button and choose the folder containing your PDF files.
2. **Enter API Key**: Input your OpenAI API key in the provided field.
3. **Process PDFs**: Click the "Process PDFs" button to start the conversion process.
4. **View Output**: Once processing is complete, click the output file link to open the combined text file.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zerox-electron.git
   ```
2. Navigate to the project directory:
   ```bash
   cd zerox-electron
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Changelog

### July 26, 2024

#### Enhancements and Fixes

1. **Processing Animation**:
    - Added an animation effect to the "Processing, please wait..." message for improved user feedback.
2. **Hyperlink for Output File**:
    - Enhanced the functionality to display the output file as a clickable hyperlink, allowing users to open the file directly.
3. **Removed "Delete PDFs" Button**:
    - Removed the "Delete PDFs" button to streamline the interface and focus on core functionalities.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
