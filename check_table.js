const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const matches = [...content.matchAll(/productsTableBody/g)];
console.log('Count productsTableBody:', matches.length);

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('productsTableBody')) console.log(i + 1, l.trim());
});
