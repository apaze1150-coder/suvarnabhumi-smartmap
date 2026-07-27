const fs = require('fs');

const file = 'd:/apaze/Smartindoormap/panpuri_products.csv';
const content = fs.readFileSync(file, 'utf8');
const lines = content.trim().split('\n');

const newLines = [lines[0]]; // Header
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    // The current line has:
    // id, code, name, desc, cat, sub_cat(old scent), scent(old price), price(old de40), de40(old de12), de12(old dw41), dw41(old image), image(old is_active), is_active(empty)
    const parts = line.split('","');
    
    // parts[0] has leading quote: '"p001'
    // parts[12] has trailing quote: '""'
    
    // We need to shift everything from index 5 onwards one position right, and insert an empty string at index 5.
    // wait, we can just extract the original 12 values from the shifted 13 values.
    
    const id = parts[0];
    const code = parts[1];
    const name = parts[2];
    const desc = parts[3];
    const cat = parts[4];
    
    // parts[5] is old scent
    const scent = parts[5];
    const price = parts[6];
    const de40 = parts[7];
    const de12 = parts[8];
    const dw41 = parts[9];
    const image = parts[10];
    const is_active = parts[11]; // it was 'true'
    
    // The new correct order:
    // id, code, name, desc, cat, sub_cat (empty), scent, price, de40, de12, dw41, image, is_active
    const newRow = [
        id, code, name, desc, cat,
        '', // sub_category empty for now
        scent, price, de40, de12, dw41, image, is_active
    ];
    
    // Reconstruct the line
    newLines.push(newRow.join('","'));
}

fs.writeFileSync(file, newLines.join('\n') + '\n');
console.log('Fixed CSV');
