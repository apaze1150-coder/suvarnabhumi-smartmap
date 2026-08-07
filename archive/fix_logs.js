const fs = require('fs');

const file = 'panpuri_stock_logs.csv';
let content = fs.readFileSync(file, 'utf8');
let lines = content.trim().split('\n');
const headers = lines[0];

const branches = ['DE40', 'DE12', 'DW41'];

for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    if (!line) continue;
    let parts = line.split(',');
    // ref_no is index 4
    let refNo = parts[4];
    if (refNo) {
        // Strip quotes
        refNo = refNo.replace(/"/g, '');
        // If it doesn't already have a branch
        if (!refNo.startsWith('DE40-') && !refNo.startsWith('DE12-') && !refNo.startsWith('DW41-')) {
            const randomBranch = branches[Math.floor(Math.random() * branches.length)];
            parts[4] = `"${randomBranch}-${refNo}"`;
            lines[i] = parts.join(',');
        }
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Stock logs updated with branch codes in ref_no.');
