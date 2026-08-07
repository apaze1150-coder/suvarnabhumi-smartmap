const express = require('express');
const router = express.Router();
const { readCsv } = require('../services/dataService');
const fs = require('fs');
const path = require('path');
const db = require('../db');


function getStoreSettings() {
  if (!fs.existsSync(STORE_SETTINGS_FILE)) {
    const defaults = { TE3: { accepting_orders: true }, TE1: { accepting_orders: true }, TW4: { accepting_orders: true } };
    fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try {
    return JSON.parse(fs.readFileSync(STORE_SETTINGS_FILE, 'utf8'));
  } catch(e) {
    return { TE3: { accepting_orders: true }, TE1: { accepting_orders: true }, TW4: { accepting_orders: true } };
  }
}

function saveStoreSettings(settings) {
  fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// --- Serve store.html staff portal ---
router.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'store.html'));
});

// GET /api/products - public, get all active products
router.get('/api/products', async (req, res) => {
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const filtered = products.filter(p => p.is_active !== 'false');
    const mappedProducts = filtered.map(p => ({
        ...p,
        product_id: p.Code || p.product_id, // fallback
        product_code: p.Code,
        product_name: p.Description,
        name: p.Description,
        description: p.Description,
        category: p.Category,
        sub_category: p['Sub-Category'],
        scent: p.Scent,
        price: p.Price,
        te3: p.Qty_Branch1,
        te1: p.Qty_Branch2,
        tw4: p.Qty_Branch3,
        qty_te3: p.Qty_Branch1,
        qty_te1: p.Qty_Branch2,
        qty_tw4: p.Qty_Branch3,
        image: p.Image,
        size: p.Size,
        Size: p.Size,
        description_customer: p.Description_Customer,
        Description_Customer: p.Description_Customer,
        scent_notes: p.Scent_Notes,
        Scent_Notes: p.Scent_Notes,
        how_to_use: p.How_to_Use,
        How_to_Use: p.How_to_Use,
        Scent: p.Scent,
        is_active: p.is_active !== 'false'
    }));
    res.json({ success: true, products: mappedProducts });
  } catch (err) {
    res.json({ success: false, error: err.message, products: [] });
  }
});

// GET /api/store/settings - public, check if stores are accepting orders
router.get('/api/store/settings', (req, res) => {
  const settings = getStoreSettings();
  res.json({ success: true, settings, stores: STORE_INFO });
});

// POST /api/store/settings - staff only, toggle accepting_orders
router.post('/api/store/settings', (req, res) => {
  const { store_id, password, accepting_orders } = req.body;
  const isGlobalAdmin = password === '6515';
  
  if (!isGlobalAdmin && (!STORE_CREDENTIALS[store_id] || STORE_CREDENTIALS[store_id] !== password)) {
    return res.status(403).json({ success: false, error: 'Invalid credentials' });
  }
  const settings = getStoreSettings();
  if (!settings[store_id]) settings[store_id] = {};
  settings[store_id].accepting_orders = accepting_orders;
  saveStoreSettings(settings);
  console.log(`[Store ${store_id}] accepting_orders set to ${accepting_orders} by ${isGlobalAdmin ? 'Admin' : 'Store Staff'}`);
  res.json({ success: true, settings });
});

// POST /api/orders - customer creates new order

module.exports = router;
