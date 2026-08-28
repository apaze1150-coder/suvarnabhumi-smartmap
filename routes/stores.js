const express = require('express');
const router = express.Router();
const { readCsv, STORE_CSV } = require('../services/dataService');
const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { loadNavigationGraph } = require('./navigation');


// --- ADMIN FEATURE: CRUD Operations on store_matrix.csv ---

// POST /api/search-store - Search stores
router.post('/api/search-store', async (req, res) => {
  const query = req.body.query || req.query.q || req.query.query || '';
  const qLower = query.toLowerCase().trim();

  try {
    const stores = await readCsv(STORE_CSV);
    const scoredStores = [];

    for (const store of stores) {
      let isMatch = false;
      if (!qLower) {
        isMatch = true;
      } else if (
        (store.shop_name && store.shop_name.toLowerCase().includes(qLower)) ||
        (store.shop_number && String(store.shop_number).toLowerCase().includes(qLower)) ||
        (store.store_id && store.store_id.toLowerCase().includes(qLower)) ||
        (store.brands_available && store.brands_available.toLowerCase().includes(qLower)) ||
        (store.category && store.category.toLowerCase().includes(qLower)) ||
        (store.AI_KEYWORDS && store.AI_KEYWORDS.toLowerCase().includes(qLower))
      ) {
        isMatch = true;
      }

      if (isMatch) {
        scoredStores.push({
          shop_number: store.shop_number || null,
          shop_name: store.shop_name || store.brand_name || 'Store',
          brand_name: store.brand_name || store.shop_name || 'Store',
          shop_image: store.shop_image || `${store.store_id}.jpg`,
          category: store.category || 'Duty Free',
          brands_available: store.brands_available || store.brand_name,
          store_id: store.store_id || `store_shop_${store.shop_number}`,
          concourse: store.concourse || 'D',
          node_id: store.graph_node_id || store.node_id,
          coordinates: { x: parseFloat(store.x), y: parseFloat(store.y) }
        });
      }
    }

    return res.json({
      query: query,
      results: scoredStores
    });
  } catch (error) {
    console.error('Retail Search API Error:', error);
    return res.status(500).json({ error: 'Search failed.', details: error.message });
  }
});

// Helper function to save stores to csv (synchronously to match existing pattern)
async function saveStoresToCsvSync(stores) {
  try {
    await db.query('TRUNCATE store_matrix');
    for (let row of stores) {
      await db.query('INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, Number(row.x)||0, Number(row.y)||0, row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }
  } catch(e) { console.error('Error saving stores to DB:', e); }
}

// POST /api/admin/upload-image - Upload a shop image
router.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
  const { password } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const relativePath = `/uploads/${req.file.filename}`;
  return res.json({ success: true, filename: req.file.filename, path: relativePath });
});

// GET /api/admin/stores - Read all stores
router.get('/api/admin/stores', async (req, res) => {
  const { password } = req.query;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }
  try {
    const stores = await readCsv(STORE_CSV);
    const parsed = stores.map(s => ({
      ...s,
      shop_number: s.shop_number ? s.shop_number.toString() : ''
    }));
    return res.json(parsed);
  } catch (error) {
    console.error('[Admin] Error reading stores:', error);
    return res.status(500).json({ error: 'Failed to read database.', details: error.message });
  }
});

// POST /api/admin/stores - Create a store
router.post('/api/admin/stores', async (req, res) => {
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, AI_KEYWORDS, TOP_HERO_PRODUCTS, PROMOTION_TAGS } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    
    let resolvedShopNum = (shop_number || '').trim();
    if (!resolvedShopNum) {
      let nextShopNum = 1;
      if (stores.length > 0) {
        const numbers = stores.map(s => parseInt(s.shop_number.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
        nextShopNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      }
      resolvedShopNum = `DE${nextShopNum}`;
    }

    const newStore = {
      shop_number: resolvedShopNum,
      shop_name: (shop_name || '').trim(),
      shop_image: (shop_image || 'default.jpg').trim(),
      category: (category || 'Duty Free').trim(),
      brands_available: (brands_available || '').trim(),
      graph_node_id: (graph_node_id || `Node_Shop_${resolvedShopNum}`).trim(),
      x: (x !== undefined && x !== '') ? x.toString() : '500',
      y: (y !== undefined && y !== '') ? y.toString() : '250',
      parent_node_id: (parent_node_id || 'Node_Intersection_D').trim(),
      store_id: (store_id || `store_shop_${resolvedShopNum}`).trim(),
      AI_KEYWORDS: (AI_KEYWORDS || '').trim(),
      TOP_HERO_PRODUCTS: (TOP_HERO_PRODUCTS || '').trim(),
      PROMOTION_TAGS: (PROMOTION_TAGS || '').trim()
    };

    stores.push(newStore);
    
    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Created Shop ${resolvedShopNum}: ${newStore.shop_name}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, store: newStore });
  } catch (error) {
    console.error('[Admin] Error creating store:', error);
    return res.status(500).json({ error: 'Failed to create store.', details: error.message });
  }
});

// PUT /api/admin/stores/:shop_number - Update a store
router.put('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = req.params.shop_number.trim();
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, AI_KEYWORDS, TOP_HERO_PRODUCTS, PROMOTION_TAGS } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const idx = stores.findIndex(s => s.shop_number.toString().trim() === shopNumStr);
    if (idx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNumStr} not found in database.` });
    }

    // Update store details
    if (shop_number !== undefined) stores[idx].shop_number = shop_number.trim();
    if (shop_name !== undefined) stores[idx].shop_name = shop_name.trim();
    if (shop_image !== undefined) stores[idx].shop_image = shop_image.trim();
    if (category !== undefined) stores[idx].category = category.trim();
    if (brands_available !== undefined) stores[idx].brands_available = brands_available.trim();
    if (graph_node_id !== undefined) stores[idx].graph_node_id = graph_node_id.trim();
    if (x !== undefined) stores[idx].x = x.toString();
    if (y !== undefined) stores[idx].y = y.toString();
    if (parent_node_id !== undefined) stores[idx].parent_node_id = parent_node_id.trim();
    if (store_id !== undefined) stores[idx].store_id = store_id.trim();
    if (AI_KEYWORDS !== undefined) stores[idx].AI_KEYWORDS = AI_KEYWORDS.trim();
    if (TOP_HERO_PRODUCTS !== undefined) stores[idx].TOP_HERO_PRODUCTS = TOP_HERO_PRODUCTS.trim();
    if (PROMOTION_TAGS !== undefined) stores[idx].PROMOTION_TAGS = PROMOTION_TAGS.trim();

    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Updated Shop ${shopNumStr}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, store: stores[idx] });
  } catch (error) {
    console.error('[Admin] Error updating store:', error);
    return res.status(500).json({ error: 'Failed to update store.', details: error.message });
  }
});

// DELETE /api/admin/stores/:shop_number - Delete a store
router.delete('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = req.params.shop_number.trim();
  const { password } = req.body;
  const checkPassword = password || req.query.password;

  if (checkPassword !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const idx = stores.findIndex(s => s.shop_number.toString().trim() === shopNumStr);
    if (idx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNumStr} not found in database.` });
    }

    const deletedStore = stores.splice(idx, 1)[0];

    // Save to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Deleted Shop ${shopNumStr}: ${deletedStore.shop_name}`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, shop_number: shopNumStr });
  } catch (error) {
    console.error('[Admin] Error deleting store:', error);
    return res.status(500).json({ error: 'Failed to delete store.', details: error.message });
  }
});


module.exports = router;
