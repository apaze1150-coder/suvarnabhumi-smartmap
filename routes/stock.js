const path = require('path');
const express = require('express');
const router = express.Router();
const { readCsv, writeCsvGeneric } = require('../services/dataService');
const db = require('../db');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '6515';
// --- ADMIN: View all orders ---
router.get('/api/admin/orders', async (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) {}
    const result = orders.map(o => {
      let items = [];
      try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []); } catch(e) {}
      return { ...o, items };
    }).reverse();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// PANPURI ADMIN APIS
// ============================================================

const STOCK_LOGS_CSV = path.join(__dirname, 'panpuri_stock_logs.csv');
const STOCK_LOG_HEADERS = ['log_id','timestamp','performed_by','transaction_type','ref_no','product_code','product_name','qty'];

// Duplicate /api/admin/products route removed

router.get('/api/admin/stock-logs', async (req, res) => {
  try {
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    logs.reverse();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Removed duplicate batch-update route

// ============================================================
// PANPURI STAFF APIS
// ============================================================

router.post('/api/staff/stock-transaction', async (req, res) => {
  try {
    const { items, type, branch, ref_no } = req.body;
    if (!items || items.length === 0 || !type || !branch) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let products = await readCsv(PRODUCTS_CSV);
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }

    const branchKey = branch.toLowerCase();
    let qtyField = 'Qty_Branch1';
    if (branchKey === 'te1') qtyField = 'Qty_Branch2';
    if (branchKey === 'tw4') qtyField = 'Qty_Branch3';

    const multiplier = type === 'receipt' ? 1 : -1;
    const transTypeStr = type === 'receipt' ? 'GOODS RECEIPT' : 'STOCK TRANSFER OUT';
    const fallbackRef = `${type === 'receipt' ? 'RCV' : 'TRF'}-${Math.floor(Math.random()*10000)}`;

    for (const item of items) {
      const productIndex = products.findIndex(p => p.Code === item.product_code);
      if (productIndex !== -1) {
        const prod = products[productIndex];
        const oldQty = parseInt(prod[qtyField] || 0);
        const diff = parseInt(item.qty) * multiplier;
        const newQty = oldQty + diff;
        
        prod[qtyField] = newQty.toString();
        
        logs.push({
          log_id: 'TXN-' + Date.now() + Math.floor(Math.random()*1000),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          performed_by: 'Staff User',
          transaction_type: transTypeStr,
          ref_no: ref_no || `${branch.toUpperCase()}-${fallbackRef}`,
          product_code: prod.Code,
          product_name: prod.Description,
          qty: diff.toString()
        });
      }
    }

    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    await writeCsvGeneric(STOCK_LOGS_CSV, logs, STOCK_LOG_HEADERS);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/staff/stock-logs', async (req, res) => {
  try {
    const { branch } = req.query;
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    logs.reverse();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GLOBAL API 404 HANDLER

module.exports = router;

