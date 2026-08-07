const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

const oldFunc = `    function renderLogs() {
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '';
        
        const search = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
        
        let filtered = allLogs.filter(log => {
            if (typeFilter !== 'all' && !(log.transaction_type && log.transaction_type.toLowerCase().includes(typeFilter))) {
                return false;
            }
            if (!search) return true;
            return (
                (log.product_code && log.product_code.toLowerCase().includes(search)) ||
                (log.product_name && log.product_name.toLowerCase().includes(search)) ||
                (log.log_id && log.log_id.toLowerCase().includes(search))
            );
        });`;

const newFunc = `    function renderLogs() {
        const tbody = document.getElementById('logsTableBody');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        const searchInput = document.getElementById('searchInput');
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        const typeFilterEl = document.getElementById('typeFilter');
        const typeFilter = typeFilterEl ? typeFilterEl.value.toLowerCase() : 'all';
        const branchFilterEl = document.getElementById('branchFilter');
        const branchFilter = branchFilterEl ? branchFilterEl.value.toLowerCase() : 'all';
        
        let filtered = allLogs.filter(log => {
            if (typeFilter !== 'all' && !(log.transaction_type && log.transaction_type.toLowerCase().includes(typeFilter))) {
                return false;
            }
            if (branchFilter !== 'all') {
                const logStr = JSON.stringify(log).toLowerCase();
                if(!logStr.includes(branchFilter)) return false;
            }
            if (!search) return true;
            return (
                (log.product_code && log.product_code.toLowerCase().includes(search)) ||
                (log.product_name && log.product_name.toLowerCase().includes(search)) ||
                (log.log_id && log.log_id.toLowerCase().includes(search))
            );
        });`;

if (html.includes(oldFunc)) {
    html = html.replace(oldFunc, newFunc);
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Fixed renderLogs successfully');
} else {
    // If we can't find it exactly, try index based replacement
    const startIdx = html.indexOf('function renderLogs() {');
    const endIdx = html.indexOf('document.getElementById(\'paginationInfo\').innerText', startIdx);
    if(startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + newFunc + '\n\n        ' + html.substring(endIdx);
        fs.writeFileSync('panpuri_admin.html', html);
        console.log('Fixed renderLogs using index based replacement');
    } else {
        console.log('Could not find renderLogs to fix');
    }
}
