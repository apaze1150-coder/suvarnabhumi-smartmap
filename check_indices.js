const fs = require('fs');
const html = fs.readFileSync('panpuri_admin.html', 'utf8');
console.log('start:', html.indexOf('<!-- Floating Mobile Nav Placeholder -->'));
console.log('end:', html.indexOf('<div id="view-orders"'));
console.log('tbody before append (from debug script):');
