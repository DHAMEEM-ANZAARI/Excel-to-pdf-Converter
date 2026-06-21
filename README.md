# Excel to PDF Converter

A modern, browser-based **Excel to PDF Converter** that enables users to convert Excel spreadsheets and CSV files into professionally formatted PDF documents. The application runs entirely in the browser, ensuring that files remain private and are never uploaded to a server.

---

## Overview

This project provides a simple and efficient solution for converting spreadsheet data into PDF format. Users can upload Excel or CSV files, preview their contents, customize PDF settings, and download the generated PDF instantly.

The application supports multiple worksheets, customizable page layouts, and responsive design for both desktop and mobile devices.

---

## Features

### File Upload

* Drag-and-drop file upload
* Manual file selection
* Supports Excel and CSV formats

### Supported Formats

* XLSX
* XLS
* CSV

### Spreadsheet Preview

* Live data preview before conversion
* Displays worksheet information
* Configurable preview row count
* Handles multiple sheets

### Multi-Sheet Support

* Detects all worksheets automatically
* Switch between sheets using tabs
* Includes all worksheets in the generated PDF

### PDF Customization

* Multiple page sizes:

  * A4
  * Letter
  * A3
  * Legal
* Portrait and Landscape orientation
* Adjustable font size
* Custom output filename

### PDF Export

* Converts spreadsheet data into formatted tables
* Includes worksheet titles
* Automatic page creation for multiple sheets
* Pagination support
* Professional table styling

### Privacy & Security

* No server-side processing
* No file uploads
* No data storage
* Complete client-side operation

### Responsive Design

* Desktop-friendly layout
* Mobile-responsive interface
* Modern dark-themed user interface

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### External Libraries

* SheetJS (XLSX)
* jsPDF
* jsPDF AutoTable
* Google Fonts (Inter)

---

## Project Structure

```text
Excel-to-PDF-Converter/
│
├── index.html
├── script.js
├── styles.css
└── README.md
```

### File Description

| File       | Purpose                                         |
| ---------- | ----------------------------------------------- |
| index.html | Application structure and user interface        |
| script.js  | Spreadsheet processing and PDF generation logic |
| styles.css | Styling and responsive design                   |
| README.md  | Project documentation                           |

---

## How It Works

### 1. Upload a Spreadsheet

Users can drag and drop a file or select one manually from their device.

### 2. Preview Data

The application reads the spreadsheet and displays a preview of the selected worksheet.

### 3. Configure PDF Settings

Users can customize:

* Page size
* Orientation
* Font size
* Output filename
* Preview row count

### 4. Generate PDF

The application converts the spreadsheet data into formatted tables and creates a downloadable PDF document.

### 5. Download

The generated PDF is downloaded directly to the user's device.

---

## Key Advantages

* Fast conversion process
* Browser-only execution
* No backend required
* Supports multiple worksheets
* Easy-to-use interface
* Secure local processing
* Free to use

---

## Browser Compatibility

The application works on modern browsers including:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
* Opera

---

## Installation

1. Download or clone the project.
2. Ensure all project files are located in the same folder.
3. Open `index.html` in a modern web browser.
4. Upload a spreadsheet file and start converting.

No additional installation or configuration is required.

---

## Future Improvements

* Export selected sheets only
* Separate PDF generation per worksheet
* Custom PDF themes
* Header and footer customization
* Support for charts and images
* Password-protected PDF export
* Batch conversion support
* Drag-and-drop multiple files

---

## Limitations

* Internet connection is required to load external CDN libraries.
* Original Excel formatting may not be preserved exactly.
* Very large spreadsheets may increase processing time.
* Complex formulas and embedded objects are exported as displayed values only.

---

## License

This project is available for educational, personal, and learning purposes. Feel free to modify and extend it according to your requirements.

---

## Author

Developed using HTML, CSS, JavaScript, SheetJS, and jsPDF to provide a secure and efficient browser-based Excel-to-PDF conversion experience.
