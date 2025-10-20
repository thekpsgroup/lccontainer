const fs = require('fs');

const csvContent = fs.readFileSync('src/data/lccontainer_keyword_plan.csv', 'utf8');
const lines = csvContent.split('\n');

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

// Parse header
const header = parseCSVLine(lines[0]);
console.log('Header fields:', header);
console.log('Header count:', header.length);

// Parse first data row
const firstRow = parseCSVLine(lines[1]);
console.log('\nFirst row field count:', firstRow.length);
console.log('Priority field (index 11):', firstRow[11]);
console.log('Notes field (index 12):', firstRow[12]);

// Check P1 pages - trying both priority field and notes field
let p1Count = 0;
let p1CountFromNotes = 0;
let shortMetaCount = 0;
let statsFromNotes = { p1: 0, p2: 0, p3: 0, other: 0 };

for (let i = 1; i < lines.length && i < 500; i++) {
  if (!lines[i].trim()) continue;
  const fields = parseCSVLine(lines[i]);
  const priority = parseInt(fields[11]?.replace(/"/g, '')) || 3;
  const notesField = fields[12]?.replace(/"/g, '');
  const metaDesc = fields[7] || '';

  // Check if priority is in notes field
  if (notesField === '1') statsFromNotes.p1++;
  else if (notesField === '2') statsFromNotes.p2++;
  else if (notesField === '3') statsFromNotes.p3++;
  else statsFromNotes.other++;

  if (priority === 1) {
    p1Count++;
    if (metaDesc.length < 120) {
      shortMetaCount++;
    }
  }

  if (notesField === '1') {
    p1CountFromNotes++;
  }
}

console.log(`\nIn first 500 rows:`);
console.log(`P1 pages (from priority field): ${p1Count}`);
console.log(`P1 pages (from notes field): ${p1CountFromNotes}`);
console.log(`P1 with short meta: ${shortMetaCount}`);
console.log(`\nPriority distribution from notes field:`, statsFromNotes);
