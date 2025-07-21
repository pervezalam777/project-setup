const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ⚙️ Change these as needed
const excelFilePath = 'your_file.xlsx';
const targetColumn = 'A'; // Column to scan for hyperlinks
const csvFilePath = 'output.csv';

// Load workbook and select the first sheet
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Utility to convert column letter to number (A = 1, B = 2, ...)
const columnToIndex = col => XLSX.utils.decode_col(col);

// Extract text and hyperlink
let data = [['Display Text', 'URL']];
const range = XLSX.utils.decode_range(sheet['!ref']);
const colIndex = columnToIndex(targetColumn);

for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = { c: colIndex, r: row };
    const cellRef = XLSX.utils.encode_cell(cellAddress);
    const cell = sheet[cellRef];

    if (!cell) continue;

    const displayText = cell.v || '';
    let url = '';

    if (cell.l && cell.l.Target) {
        url = cell.l.Target;
    } else if (typeof displayText === 'string' && displayText.includes('http')) {
        url = displayText;
    }

    if (url) {
        data.push([displayText, url]);
    }
}

// Write to CSV
const csvContent = data.map(row =>
    row.map(val => `"${val.replace(/"/g, '""')}"`).join(',')
).join('\n');

fs.writeFileSync(path.resolve(csvFilePath), csvContent);
console.log('✅ CSV created:', csvFilePath);
