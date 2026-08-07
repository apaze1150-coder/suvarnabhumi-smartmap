const fs = require('fs');
const html = fs.readFileSync('panpuri_admin.html', 'utf8');
const idx = html.indexOf('id="branchFilter"');
console.log(html.substring(Math.max(0, idx - 200), idx + 200));
