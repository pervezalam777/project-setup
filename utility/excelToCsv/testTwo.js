const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Load workbook & sheet
const workbook = XLSX.readFile('Test-Excel-for-data-extraction.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
console.log('📖 Loaded sheet:', workbook.SheetNames[0]);
// 2. Prepare CSV rows
const csvRows = [
  ['activity', 'attribute', 'value', 'url']  // header
];

const range = XLSX.utils.decode_range(sheet['!ref']);
let currentActivity = '';
let started = false;

// 3. Walk down column A
for (let r = range.s.r; r <= range.e.r; r++) {
  const cellRef = XLSX.utils.encode_cell({ c: 0, r });
  const cell = sheet[cellRef];
  const rawText = cell && cell.v ? cell.v.toString().trim() : '';
  if (!rawText) continue;

  // 3.a Detect only real activity lines (e.g. "activity one")
  if (/^activity\s+\S+/i.test(rawText)) {
    currentActivity = rawText;
    started = true;
    continue;
  }
  // skip until the first activity appears
  if (!started) continue;

  // 3.b Decide attribute & URL
  let attribute = '';
  let url = '';

  // Hyperlink cell → URL
  if (cell.l && cell.l.Target) {
    attribute = 'URL';
    url = cell.l.Target
      .replace(/^https?:\/\//, '')   // strip protocol
      .replace(/\/$/, '');           // strip trailing slash
  }
  // Question line
  else if (/^\d+\.\s*Question/i.test(rawText)) {
    attribute = 'Question';
  }
  // Answer line
  else if (/^\d+\.\s*Answer/i.test(rawText)) {
    attribute = 'Answer';
  }

  // 3.c Push if we found something
  if (attribute) {
    csvRows.push([ currentActivity, attribute, rawText, url ]);
  }
}

// 4. Serialize & write CSV
const output = csvRows
  .map(cols => cols.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
  .join('\n');

fs.writeFileSync(path.resolve('output.csv'), output, 'utf8');
console.log('✅ output.csv generated with the exact structure you wanted.');
