const express = require('express');
const router = express.Router();
const { readCsv } = require('../services/dataService');
const db = require('../db');
const path = require('path');


// --- ADMIN: Dashboard Stats (Dynamic) ---
router.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) {}
    
    let products = [];
    try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
        try { logs = await readCsv(STOCK_LOGS_CSV); } catch(e) {}
    }

    // 1. Sales & Order Comparison (TE3, TE1, TW4)
    const stores = ['te3', 'te1', 'tw4'];
    const salesByStore = { te3: 0, te1: 0, tw4: 0 };
    const ordersByStore = { te3: 0, te1: 0, tw4: 0 };
    
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
        if(q1 < 5) branches.push('TE3');
        if(q2 < 5) branches.push('TE1');
        if(q3 < 5) branches.push('TW4');
        
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
        try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : (o.items_json || []); } catch(e) {}
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
            stores: ['TE3 Flagship', 'TE1 EmQuartier', 'TW4 Boutique'],
            sales: [salesByStore.te3, salesByStore.te1, salesByStore.tw4],
            orders: [ordersByStore.te3, ordersByStore.te1, ordersByStore.tw4]
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

// ============================================================
// PANPURI PRE-ORDER SYSTEM
// ============================================================

const PRODUCTS_CSV = path.join(__dirname, 'panpuri_products.csv');
const ORDERS_CSV = path.join(__dirname, 'panpuri_orders.csv');
const STORE_SETTINGS_FILE = path.join(__dirname, 'store_settings.json');

// ── Passwords from Environment Variables ──────────────────────────
const ADMIN_PASSWORD     = process.env.ADMIN_PASSWORD     || '6515';
const STORE_CREDENTIALS = {
  'TE3': process.env.STORE_PASSWORD_TE3 || '6570',
  'TE1': process.env.STORE_PASSWORD_TE1 || '6515',
  'TW4': process.env.STORE_PASSWORD_TW4 || '6555'
};

// Store info for display
const STORE_INFO = {
  'TE3': { name: 'PANPURI Concourse D East (Gate 1-4)', location: 'Concourse D East, Level 4', zone: 'TE3' },
  'TE1': { name: 'PANPURI Concourse D East (Gate 1-2)', location: 'Concourse D East, Level 4', zone: 'TE1' },
  'TW4': { name: 'PANPURI Concourse D West (Gate 5-8)', location: 'Concourse D West, Level 4', zone: 'TW4' }
};


module.exports = router;
