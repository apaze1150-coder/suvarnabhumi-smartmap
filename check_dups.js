const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const count = content.split('id="view-products"').length - 1;
const countTbody = content.split('id="productsTableBody"').length - 1;
console.log('Count view-products:', count);
console.log('Count productsTableBody:', countTbody);
