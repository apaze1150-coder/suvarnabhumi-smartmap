const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// 1. Fix the duplicate paginationInfo ID in Stock Logs
// In Stock Logs View
const logsPaginationIdx = html.indexOf('id="paginationInfo" class="text-body-sm text-on-surface-variant">Showing 0 logs</p>');
if (logsPaginationIdx !== -1) {
    html = html.replace('id="paginationInfo" class="text-body-sm text-on-surface-variant">Showing 0 logs</p>', 'id="stockPaginationInfo" class="text-body-sm text-on-surface-variant">Showing 0 logs</p>');
}

// 2. Fix the Javascript for renderLogs to update KPIs and correct pagination ID
const jsInsert = `
        document.getElementById('stockPaginationInfo').innerText = \`Showing \${filtered.length} of \${allLogs.length} logs\`;

        // Update KPIs dynamically
        document.getElementById('totalLogs').innerText = filtered.length.toLocaleString();
        
        let receiptsCount = 0;
        filtered.forEach(log => {
            if (log.transaction_type && log.transaction_type.toUpperCase().includes('RECEIPT')) {
                receiptsCount++;
            }
        });
        document.getElementById('recentReceipts').innerText = receiptsCount.toLocaleString();

        filtered.forEach(log => {
`;

html = html.replace(/document\.getElementById\('paginationInfo'\)\.innerText = `Showing \$\{filtered\.length\} of \$\{allLogs\.length\} logs`;\s+filtered\.forEach\(log => \{/, jsInsert);

fs.writeFileSync('panpuri_admin.html', html);
console.log('Fixed Stock Logs mock KPIs and pagination.');
