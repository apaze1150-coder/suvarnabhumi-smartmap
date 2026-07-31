const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

const mainEnd = html.indexOf('</main>');
if (mainEnd > -1) {
    // See what was injected before </main>
    const tail = html.substring(mainEnd - 200, mainEnd);
    console.log('Before </main>:', tail);
}

// Count occurrences of view-orders
const matches = [...html.matchAll(/id="view-orders"/g)];
console.log('Count view-orders:', matches.length);
