const fs = require('fs');
const files = ['panpuri_admin_orders.html', 'panpuri_admin_products.html', 'panpuri_admin_stock.html'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Fixed files');
