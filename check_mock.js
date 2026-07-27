const fs = require('fs');
const html = fs.readFileSync('panpuri_admin.html', 'utf8');

const regex = /let\s+allLogs\s*=\s*\[[\s\S]*?\];/;
const match = html.match(regex);
if (match) {
    console.log("Found hardcoded allLogs:");
    console.log(match[0].substring(0, 300));
} else {
    console.log("No hardcoded allLogs array found.");
}
