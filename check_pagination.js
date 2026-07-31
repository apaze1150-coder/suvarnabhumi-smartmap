const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const matches = [...content.matchAll(/paginationInfo/g)];
console.log('Count paginationInfo:', matches.length);

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('paginationInfo')) console.log(i + 1, l.trim());
});
