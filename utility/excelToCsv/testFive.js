const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

// 1. Load workbook & sheet
const workbook = XLSX.readFile('Test-Excel-for-data-extraction.xlsx');
const sheet    = workbook.Sheets[workbook.SheetNames[0]];
const range    = XLSX.utils.decode_range(sheet['!ref']);

// 2. Prepare our CSV rows (no quotes)
const csvRows = [];
csvRows.push(['activity','attribute','value','url']);

// 3. Walk down column A, track current activity
let currentActivity = '';
let seenFirstActivity = false;

for (let R = range.s.r; R <= range.e.r; ++R) {
  const addr = XLSX.utils.encode_cell({ c: 0, r: R });
  const cell = sheet[addr];
  if (!cell || cell.v == null) continue;

  const raw = cell.v.toString().trim();
  if (!raw) continue;

  // Detect "activity X"
  if (/^activity\s+\S+/i.test(raw)) {
    currentActivity   = raw;
    seenFirstActivity = true;
    continue;
  }
  if (!seenFirstActivity) continue;

  // Split multi-line cells into individual entries
  const lines = raw.split(/\r?\n/);
  lines.forEach(line => {
    const text = line.trim();
    if (!text) return;

    let attribute = '';
    let url       = '';

    // Hyperlink cells
    if (cell.l && cell.l.Target) {
      attribute = 'URL';
      url = cell.l.Target
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
    }
    // Question rows
    else if (/^\d+\.\s*Question/i.test(text)) {
      attribute = 'Question';
    }
    // Answer rows
    else if (/^\d+\.\s*Answer/i.test(text)) {
      attribute = 'Answer';
    }

    if (attribute) {
      csvRows.push([currentActivity, attribute, text, url]);
    }
  });
}

// 4. Serialize & write CSV (no quoting)
const output = csvRows.map(cols => cols.join(',')).join('\n');
fs.writeFileSync(path.resolve('output.csv'), output, 'utf8');
console.log('✅ output.csv generated with exact structure.');
