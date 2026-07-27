const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// Replace desktop sidebar buttons
html = html.replace(/<button([^>]*?)onclick="switchView\('dashboard'\)"([^>]*?)>([\s\S]*?)<\/button>/gi, '<a href="panpuri_admin.html"$1$2>$3</a>');
html = html.replace(/<button([^>]*?)onclick="switchView\('orders'\)"([^>]*?)>([\s\S]*?)<\/button>/gi, '<a href="panpuri_admin_orders.html"$1$2>$3</a>');
html = html.replace(/<button([^>]*?)onclick="switchView\('database'\)"([^>]*?)>([\s\S]*?)<\/button>/gi, '<a href="panpuri_admin_products.html"$1$2>$3</a>');
html = html.replace(/<button([^>]*?)onclick="switchView\('stocklogs'\)"([^>]*?)>([\s\S]*?)<\/button>/gi, '<a href="panpuri_admin_stock.html"$1$2>$3</a>');
html = html.replace(/<button([^>]*?)onclick="switchView\('settings'\)"([^>]*?)>([\s\S]*?)<\/button>/gi, '<a href="#"$1$2>$3</a>');

fs.writeFileSync('panpuri_admin.html', html, 'utf8');
console.log('Fixed buttons in panpuri_admin.html');
