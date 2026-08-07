const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

const uiLogicCode = `
// --- DASHBOARD ANALYTICS LOGIC ---
let salesChartInstance = null;

async function loadDashboardStats() {
    try {
        const res = await fetch('/api/admin/dashboard-stats?password=6515');
        const data = await res.json();
        
        if(data.success) {
            renderSalesChart(data.salesComparison);
            renderLowStockAlerts(data.lowStockAlerts);
            renderTopSellers(data.topSellers);
            
            // Update Stock Log stats if they exist on the page
            const totalLogsEl = document.getElementById('totalLogs');
            const recentReceiptsEl = document.getElementById('recentReceipts');
            if(totalLogsEl) totalLogsEl.innerText = data.stockLogStats.totalTransactions.toLocaleString();
            if(recentReceiptsEl) recentReceiptsEl.innerText = data.stockLogStats.recentReceipts.toLocaleString();
        }
    } catch(err) {
        console.error('Failed to load dashboard stats:', err);
    }
}

function renderSalesChart(data) {
    const ctx = document.getElementById('salesComparisonChart');
    if(!ctx) return;
    
    if(salesChartInstance) {
        salesChartInstance.destroy();
    }
    
    // Check if Chart is available
    if(typeof Chart === 'undefined') {
        setTimeout(() => renderSalesChart(data), 500); // retry if CDN not loaded yet
        return;
    }

    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.stores,
            datasets: [
                {
                    label: 'Sales Revenue (฿)',
                    data: data.sales,
                    backgroundColor: '#ffe088', // secondary-container
                    borderColor: '#725c10', // secondary
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Order Volume',
                    data: data.orders,
                    backgroundColor: '#0f1c30', // primary-container
                    borderColor: '#3b475d', 
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Revenue (฿)'} },
                y1: { type: 'linear', display: true, position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: 'Orders'} }
            }
        }
    });
}

function renderLowStockAlerts(alerts) {
    const container = document.getElementById('dashboardLowStockList');
    if(!container) return;
    
    if(!alerts || alerts.length === 0) {
        container.innerHTML = '<p class="text-body-sm text-outline">All stocks are optimal.</p>';
        return;
    }
    
    let html = '';
    alerts.forEach(a => {
        html += \`
            <div class="flex items-center justify-between p-sm bg-surface rounded hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div class="flex flex-col">
                    <span class="font-label-md text-primary">\${a.code}</span>
                    <span class="text-[10px] text-on-surface-variant max-w-[150px] truncate" title="\${a.name}">\${a.name}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-error font-bold text-label-sm">Qty: \${a.total}</span>
                    <span class="px-2 py-0.5 bg-error-container text-error text-[9px] font-bold rounded uppercase tracking-wider" title="Low in \${a.branches.join(', ')}">\${a.branches.length} Stores</span>
                </div>
            </div>
        \`;
    });
    container.innerHTML = html;
}

function renderTopSellers(sellers) {
    const container = document.getElementById('dashboardTopSellersList');
    if(!container) return;
    
    if(!sellers || sellers.length === 0) {
        container.innerHTML = '<p class="text-body-sm text-outline">No sales data yet.</p>';
        return;
    }
    
    let html = '';
    sellers.forEach((s, idx) => {
        html += \`
            <div class="flex items-center gap-sm p-sm bg-surface rounded hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0">\${idx+1}</div>
                <div class="flex-1 flex flex-col min-w-0">
                    <span class="font-label-md text-primary truncate">\${s.code}</span>
                    <span class="text-[10px] text-on-surface-variant truncate">\${s.name}</span>
                </div>
                <div class="font-bold text-secondary text-label-md">\${s.qty} sold</div>
            </div>
        \`;
    });
    container.innerHTML = html;
}

// Override switchTab to load dashboard stats
const originalSwitchTab = switchTab;
switchTab = function(viewId) {
    originalSwitchTab(viewId);
    if(viewId === 'view-dashboard') {
        loadDashboardStats();
    }
};

// Also load when document is ready if dashboard is active
document.addEventListener('DOMContentLoaded', () => {
    if(!document.getElementById('view-dashboard').classList.contains('hidden')) {
        loadDashboardStats();
    }
});

// CSV Export for Stock Logs
function exportStockLogsCSV() {
    if(!allLogs || allLogs.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Use filtered logs if we want to respect filters, but requirement says Export CSV
    // We will export the currently filtered logs
    const search = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value.toLowerCase() : 'all';
    const branchFilter = document.getElementById('branchFilter') ? document.getElementById('branchFilter').value.toLowerCase() : 'all';
    
    let filtered = allLogs.filter(log => {
        if (typeFilter !== 'all' && !(log.transaction_type && log.transaction_type.toLowerCase().includes(typeFilter))) {
            return false;
        }
        if (branchFilter !== 'all' && !(log.performed_by && log.performed_by.toLowerCase().includes(branchFilter))) {
            // Note: In a real system branch might be tracked differently, but let's assume it's in ref_no or performed_by or product location. 
            // The prompt says Add Branch Selector (All Branches, DE40, DE12, DW41).
            // For now, if no branch field exists directly in logs, we loosely filter by string.
            // If branch is in ref_no (e.g. DE40-TRF-1234) we can check that.
            const logStr = JSON.stringify(log).toLowerCase();
            if(!logStr.includes(branchFilter)) return false;
        }
        if (!search) return true;
        return (
            (log.product_code && log.product_code.toLowerCase().includes(search)) ||
            (log.product_name && log.product_name.toLowerCase().includes(search)) ||
            (log.log_id && log.log_id.toLowerCase().includes(search))
        );
    });

    if(filtered.length === 0) {
        alert('No data matches the current filters');
        return;
    }

    const headers = ['log_id','timestamp','performed_by','transaction_type','ref_no','product_code','product_name','qty'];
    let csvContent = headers.join(',') + "\\n";
    
    filtered.forEach(log => {
        let row = headers.map(header => {
            let val = log[header] || '';
            // Escape quotes
            val = val.toString().replace(/"/g, '""');
            return \`"\${val}"\`;
        });
        csvContent += row.join(',') + "\\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_logs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
`;

if (!html.includes('loadDashboardStats()')) {
    html = html.replace('</script>\r\n\r\n<!-- Add Product Modal -->', '\n' + uiLogicCode + '\n</script>\r\n\r\n<!-- Add Product Modal -->');
    if (!html.includes('loadDashboardStats()')) { // Fallback if \r\n replacement failed
        html = html.replace('</script>\n\n<!-- Add Product Modal -->', '\n' + uiLogicCode + '\n</script>\n\n<!-- Add Product Modal -->');
    }
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Injected UI logic into panpuri_admin.html');
}

// Update renderLogs function in panpuri_admin.html to support branchFilter
const renderLogsReplacement = `
    function renderLogs() {
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '';
        
        const search = document.getElementById('searchInput').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value.toLowerCase() : 'all';
        const branchFilter = document.getElementById('branchFilter') ? document.getElementById('branchFilter').value.toLowerCase() : 'all';
        
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
        });

        document.getElementById('paginationInfo').innerText = \`Showing \${filtered.length} of \${allLogs.length} logs\`;
`;
html = fs.readFileSync('panpuri_admin.html', 'utf8');
const renderLogsStart = html.indexOf('function renderLogs() {');
const filteredStart = html.indexOf('document.getElementById(\'paginationInfo\').innerText', renderLogsStart);
if(renderLogsStart !== -1 && filteredStart !== -1 && !html.includes('branchFilter')) {
    html = html.substring(0, renderLogsStart) + renderLogsReplacement + html.substring(filteredStart);
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Updated renderLogs function');
}

// Ensure the branch filter has an event listener
if(!html.includes("document.getElementById('branchFilter').addEventListener")) {
    html = html.replace(
        "document.getElementById('typeFilter').addEventListener('change', renderLogs);",
        "document.getElementById('typeFilter').addEventListener('change', renderLogs);\n    const bFilter = document.getElementById('branchFilter');\n    if(bFilter) bFilter.addEventListener('change', renderLogs);"
    );
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Added event listener for branchFilter');
}

