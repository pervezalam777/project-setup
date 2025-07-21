const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile('Test-Excel-for-data-extraction.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const csvRows = [['activity', 'attribute', 'value', 'url']];
let currentActivity = '';

rows.forEach((row, rowIdx) => {
  // Check all columns in the row
  row.forEach((cellValue, colIdx) => {
    if (!cellValue) return;

    const cellAddress = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
    const cell = sheet[cellAddress];
    const rawText = cellValue.toString().trim();
    const hyperlink = cell?.l?.Target || '';

    // Detect activity
    if (colIdx === 0 && /^activity/i.test(rawText)) {
      currentActivity = rawText;
      return;
    }

    let attribute = '';
    let value = rawText;

    if (/^\d+\.\s*Question/i.test(rawText)) {
      attribute = 'Question';
      value = rawText.replace(/^\d+\.\s*Question\s*[:\-]?\s*/i, '');
    } else if (/^\d+\.\s*Answer/i.test(rawText)) {
      attribute = 'Answer';
      value = rawText.replace(/^\d+\.\s*Answer\s*[:\-]?\s*/i, '');
    } else if (hyperlink) {
      attribute = 'URL';
    } else {
      return;
    }

    csvRows.push([currentActivity, attribute, value, hyperlink]);
  });
});

const output = csvRows.map(cols => cols.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
fs.writeFileSync(path.resolve('output.csv'), output, 'utf8');
console.log('✅ output.csv generated.');
// ...existing code...