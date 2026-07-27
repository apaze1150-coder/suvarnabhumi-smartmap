const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

const newScript = `
// --- DASHBOARD ANALYTICS LOGIC ---
let salesChartInstance = null;

async function loadDashboardStats() {
    try {
        // Fetch raw data streams directly as requested
        const [ordersRes, productsRes] = await Promise.all([
            fetch('/api/admin/orders?password=6515'),
            fetch('/api/products')
        ]);
        
        const orders = await ordersRes.json();
        const productsData = await productsRes.json();
        const products = productsData.products || productsData || []; // handle if it's wrapped or array
        
        if(orders) {
            // 1. Calculate sales and order counts grouped by branch
            const stores = ['de40', 'de12', 'dw41'];
            const salesByStore = { de40: 0, de12: 0, dw41: 0 };
            const ordersByStore = { de40: 0, de12: 0, dw41: 0 };
            
            orders.forEach(o => {
                const sid = (o.store_id || '').toLowerCase();
                if (stores.includes(sid)) {
                    ordersByStore[sid]++;
                    salesByStore[sid] += parseFloat(o.total_price || 0);
                }
            });
            
            renderSalesChart({
                stores: ['DE40 Flagship', 'DE12 EmQuartier', 'DW41 Boutique'],
                sales: [salesByStore.de40, salesByStore.de12, salesByStore.dw41],
                orders: [ordersByStore.de40, ordersByStore.de12, ordersByStore.dw41]
            });
            
            // 3. Top 5 Best Sellers
            const productSales = {};
            orders.forEach(o => {
                let items = [];
                try { items = Array.isArray(o.items) ? o.items : JSON.parse(o.items_json || '[]'); } catch(e) {}
                items.forEach(item => {
                    if(!productSales[item.product_code]) {
                        productSales[item.product_code] = { code: item.product_code, name: item.name, qty: 0, revenue: 0 };
                    }
                    productSales[item.product_code].qty += parseInt(item.qty || 0);
                    productSales[item.product_code].revenue += (parseFloat(item.price || 0) * parseInt(item.qty || 0));
                });
            });
            
            let topSellers = Object.values(productSales).sort((a,b) => b.qty - a.qty).slice(0, 5);
            renderTopSellers(topSellers);
        }
        
        if (products) {
            // 2. Low Stock Alerts
            let lowStockAlerts = [];
            products.forEach(p => {
                let q1 = parseInt(p.Qty_Branch1) || 0;
                let q2 = parseInt(p.Qty_Branch2) || 0;
                let q3 = parseInt(p.Qty_Branch3) || 0;
                
                let branches = [];
                if(q1 <= 5) branches.push('DE40');
                if(q2 <= 5) branches.push('DE12');
                if(q3 <= 5) branches.push('DW41');
                
                let totalStock = q1 + q2 + q3;
                
                if (branches.length > 0 || totalStock <= 10) {
                    lowStockAlerts.push({
                        code: p.Code,
                        name: p.Description,
                        branches: branches,
                        total: totalStock
                    });
                }
            });
            lowStockAlerts.sort((a,b) => a.total - b.total);
            renderLowStockAlerts(lowStockAlerts);
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
    
    if(typeof Chart === 'undefined') {
        setTimeout(() => renderSalesChart(data), 500); 
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
                    backgroundColor: '#735C00', // Gold brand color
                    borderColor: '#735C00', 
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Order Volume',
                    data: data.orders,
                    type: 'line', // Dual-Axis Line chart for order volume
                    backgroundColor: '#1E293B', // Charcoal/Navy brand color
                    borderColor: '#1E293B', 
                    borderWidth: 2,
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
        let badgeHtml = '';
        if (a.branches.length > 0) {
            badgeHtml = \`<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded uppercase tracking-wider">\${a.branches.join(', ')} (\${a.total})</span>\`;
        } else {
            badgeHtml = \`<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded uppercase tracking-wider">TOTAL <= 10 (\${a.total})</span>\`;
        }
        
        html += \`
            <div class="flex items-center justify-between p-sm bg-surface rounded hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div class="flex flex-col min-w-0 pr-2 flex-1">
                    <span class="font-label-md text-primary truncate">\${a.code}</span>
                    <span class="text-[10px] text-on-surface-variant truncate" title="\${a.name}">\${a.name}</span>
                </div>
                <div class="flex items-center">
                    \${badgeHtml}
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
                    <span class="font-label-md text-primary truncate">\${s.code} - \${s.name}</span>
                </div>
                <div class="flex flex-col items-end shrink-0">
                    <span class="font-bold text-secondary text-label-md">\${s.qty} units</span>
                    <span class="text-[10px] text-outline">฿\${s.revenue.toLocaleString()}</span>
                </div>
            </div>
        \`;
    });
    container.innerHTML = html;
}
`;

// Extract old logic
const startIndex = html.indexOf('// --- DASHBOARD ANALYTICS LOGIC ---');
const endIndex = html.indexOf('// Override switchTab to load dashboard stats');

if (startIndex !== -1 && endIndex !== -1) {
    html = html.substring(0, startIndex) + newScript + '\n' + html.substring(endIndex);
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Successfully updated panpuri_admin.html with client-side widget calculation.');
} else {
    console.log('Could not find the DASHBOARD ANALYTICS LOGIC block.');
}
