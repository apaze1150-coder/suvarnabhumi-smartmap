const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const matches = [...content.matchAll(/view-database/g)];
console.log('Count view-database:', matches.length);
