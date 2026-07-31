const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const matches = [...content.matchAll(/id=["']searchInput["']/g)];
console.log('Count:', matches.length);
