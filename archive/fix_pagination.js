const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// 1. Fix duplicate IDs for paginationInfo
html = html.replace(/<p([^>]*)id="paginationInfo"([^>]*)>/g, (match, p1, p2, offset) => {
    // The first one is around line 450 (Orders), the second around line 562 (Products)
    // We can just rely on the order of occurrence in the HTML structure
    if (html.substring(0, offset).indexOf('id="view-orders"') > -1 && html.substring(offset).indexOf('id="view-products"') > -1) {
        return `<p${p1}id="paginationInfoOrders"${p2}>`;
    } else {
        return `<p${p1}id="paginationInfoProducts"${p2}>`;
    }
});

// Update the script references
html = html.replace(/document\.getElementById\('paginationInfo'\)\.innerText = \`Showing \$\{filteredOrders\.length\} entries\`;/g, 
    "document.getElementById('paginationInfoOrders').innerText = `Showing ${filteredOrders.length} entries`;");

html = html.replace(/document\.getElementById\('paginationInfo'\)\.innerText = \`Showing \$\{filtered\.length\} entries\`;/g, 
    "document.getElementById('paginationInfoProducts').innerText = `Showing ${filtered.length} entries`;");

// 2. Inject debug console logs in renderTable
const debugInject = `
        console.log('--- renderTable DEBUG ---');
        console.log('Search query:', search);
        console.log('allProducts.length:', allProducts.length);
        console.log('filtered.length:', filtered.length);
        console.log('tbody before append:', tbody.children.length);
`;
const injectPoint = "document.getElementById('paginationInfoProducts').innerText = `Showing ${filtered.length} entries`;";
if (html.includes(injectPoint)) {
    html = html.replace(injectPoint, injectPoint + debugInject);
}

const appendInject = `
        console.log('tbody after append:', tbody.children.length);
        console.log('Table height:', tbody.offsetHeight);
`;
const appendPoint = "applyColumnVisibility();";
if (html.includes(appendPoint)) {
    html = html.replace(appendPoint, appendInject + appendPoint);
}

fs.writeFileSync('panpuri_admin.html', html);
console.log('Patched panpuri_admin.html');
