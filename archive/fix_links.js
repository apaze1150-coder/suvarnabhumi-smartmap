const fs = require('fs');

const files = [
    'panpuri_admin.html',
    'panpuri_admin_orders.html',
    'panpuri_admin_products.html',
    'panpuri_admin_stock.html'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let html = fs.readFileSync(f, 'utf8');
    
    // In panpuri_admin.html, replace the old switchView logic
    if (f === 'panpuri_admin.html') {
        html = html.replace(/<a[^>]*?href="#"[^>]*onclick="switchView\('orders'\)"[^>]*?>[\s\S]*?<\/a>/i, '<a href="panpuri_admin_orders.html" class="flex items-center gap-md px-md py-sm text-on-primary-container hover:text-secondary-fixed hover:bg-on-primary-fixed-variant/20 transition-all rounded-lg"><span class="material-symbols-outlined">shopping_cart</span> Orders</a>');
        html = html.replace(/<a[^>]*?href="#"[^>]*onclick="switchView\('products'\)"[^>]*?>[\s\S]*?<\/a>/i, '<a href="panpuri_admin_products.html" class="flex items-center gap-md px-md py-sm text-on-primary-container hover:text-secondary-fixed hover:bg-on-primary-fixed-variant/20 transition-all rounded-lg"><span class="material-symbols-outlined">database</span> Product Database</a>');
        html = html.replace(/<a[^>]*?href="#"[^>]*onclick="switchView\('stock'\)"[^>]*?>[\s\S]*?<\/a>/i, '<a href="panpuri_admin_stock.html" class="flex items-center gap-md px-md py-sm text-on-primary-container hover:text-secondary-fixed hover:bg-on-primary-fixed-variant/20 transition-all rounded-lg"><span class="material-symbols-outlined">inventory_2</span> Stock Logs</a>');
        html = html.replace(/<a[^>]*?href="#"[^>]*onclick="switchView\('dashboard'\)"[^>]*?>[\s\S]*?<\/a>/i, '<a href="panpuri_admin.html" class="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container rounded-lg font-bold scale-[0.98] duration-150 ease-in-out"><span class="material-symbols-outlined">dashboard</span> Dashboard</a>');
    } else {
        html = html.replace(/href="#"([^>]*?)>(\s*<span.*?>dashboard<\/span>)/gi, 'href="panpuri_admin.html"$1>$2');
        html = html.replace(/href="#"([^>]*?)>(\s*<span.*?>shopping_cart<\/span>)/gi, 'href="panpuri_admin_orders.html"$1>$2');
        html = html.replace(/href="#"([^>]*?)>(\s*<span.*?>database<\/span>)/gi, 'href="panpuri_admin_products.html"$1>$2');
        html = html.replace(/href="#"([^>]*?)>(\s*<span.*?>inventory_2<\/span>)/gi, 'href="panpuri_admin_stock.html"$1>$2');
    }
    
    fs.writeFileSync(f, html, 'utf8');
    console.log(f + ' updated');
});
