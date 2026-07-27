const fs = require('fs');
let serverJs = fs.readFileSync('server.js', 'utf8');

// 1. Inject /api/admin/dashboard-stats into server.js
const dashboardApiCode = `
// --- ADMIN: Dashboard Stats (Dynamic) ---
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) {}
    
    let products = [];
    try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
        try { logs = await readCsv(STOCK_LOGS_CSV); } catch(e) {}
    }

    // 1. Sales & Order Comparison (DE40, DE12, DW41)
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

    // 2. Cross-Store Low Stock Alerts
    let lowStockAlerts = [];
    products.forEach(p => {
        let q1 = parseInt(p.Qty_Branch1) || 0;
        let q2 = parseInt(p.Qty_Branch2) || 0;
        let q3 = parseInt(p.Qty_Branch3) || 0;
        
        let branches = [];
        if(q1 < 5) branches.push('DE40');
        if(q2 < 5) branches.push('DE12');
        if(q3 < 5) branches.push('DW41');
        
        if (branches.length > 0) {
            lowStockAlerts.push({
                code: p.Code,
                name: p.Description,
                branches: branches,
                total: q1 + q2 + q3
            });
        }
    });
    // Sort by lowest total stock
    lowStockAlerts.sort((a,b) => a.total - b.total);
    lowStockAlerts = lowStockAlerts.slice(0, 10); // top 10 worst

    // 3. Top 5 Best Sellers (from Orders)
    const productSales = {};
    orders.forEach(o => {
        let items = [];
        try { items = JSON.parse(o.items_json || '[]'); } catch(e) {}
        items.forEach(item => {
            if(!productSales[item.product_code]) {
                productSales[item.product_code] = { code: item.product_code, name: item.name, qty: 0 };
            }
            productSales[item.product_code].qty += parseInt(item.qty || 0);
        });
    });
    
    let topSellers = Object.values(productSales).sort((a,b) => b.qty - a.qty).slice(0, 5);

    // 4. Stock Logs Stats
    const totalTransactions = logs.length;
    const recentReceipts = logs.filter(l => (l.transaction_type || '').toLowerCase().includes('receipt')).length;

    res.json({
        success: true,
        salesComparison: {
            stores: ['DE40 Flagship', 'DE12 EmQuartier', 'DW41 Boutique'],
            sales: [salesByStore.de40, salesByStore.de12, salesByStore.dw41],
            orders: [ordersByStore.de40, ordersByStore.de12, ordersByStore.dw41]
        },
        lowStockAlerts,
        topSellers,
        stockLogStats: {
            totalTransactions,
            recentReceipts
        }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
`;

if (!serverJs.includes('/api/admin/dashboard-stats')) {
    const insertPoint = serverJs.indexOf('// ============================================================');
    if (insertPoint !== -1) {
        serverJs = serverJs.substring(0, insertPoint) + dashboardApiCode + '\n' + serverJs.substring(insertPoint);
        fs.writeFileSync('server.js', serverJs);
        console.log('Injected /api/admin/dashboard-stats into server.js');
    }
}
