const express = require('express');
const router = express.Router();
const { readCsv, STORE_CSV } = require('../services/dataService');
const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { loadNavigationGraph } = require('./navigation');


// --- ADMIN FEATURE: CRUD Operations on store_matrix.csv ---

// GET /api/stores - Public list of all stores for store selection and customer UI
router.get('/api/stores', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const stores = await readCsv(STORE_CSV);
    return res.json({ success: true, stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch stores' });
  }
});

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

// Helper function to save stores to csv and DB
async function saveStoresToCsvSync(stores) {
  try {
    await db.query('TRUNCATE store_matrix');
    for (let row of stores) {
      await db.query('INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, Number(row.x)||0, Number(row.y)||0, row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }

    // Also write back to store_matrix.csv so local file copy stays synced
    try {
      const headers = ['shop_number','shop_name','shop_image','category','brands_available','graph_node_id','x','y','parent_node_id','store_id','AI_KEYWORDS','TOP_HERO_PRODUCTS','PROMOTION_TAGS'];
      const escapeCsv = (v) => {
        if (v === null || v === undefined) return '""';
        const s = String(v);
        return '"' + s.replace(/"/g, '""') + '"';
      };
      const lines = [headers.join(',')];
      for (let row of stores) {
        lines.push(headers.map(h => escapeCsv(row[h])).join(','));
      }
      fs.writeFileSync(STORE_CSV, lines.join('\n'), 'utf8');
    } catch (csvErr) {
      console.warn('Could not write STORE_CSV:', csvErr.message);
    }
  } catch(e) { console.error('Error saving stores to DB:', e); }
}

// POST /api/admin/upload-image - Upload a shop image
router.post('/api/admin/upload-image', upload.single('image'), async (req, res) => {
  const { password } = req.body;
  if (password && password !== '6515') {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  try {
    // Save image permanently to PostgreSQL uploaded_files table
    const buffer = fs.readFileSync(req.file.path);
    const ext = path.extname(req.file.filename).toLowerCase();
    let mime = req.file.mimetype || 'image/jpeg';
    if (ext === '.png') mime = 'image/png';
    else if (ext === '.webp') mime = 'image/webp';
    else if (ext === '.gif') mime = 'image/gif';
    else if (ext === '.svg') mime = 'image/svg+xml';

    await db.query(`
      INSERT INTO uploaded_files (filename, mime_type, data, size, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (filename) DO UPDATE
      SET mime_type = EXCLUDED.mime_type, data = EXCLUDED.data, size = EXCLUDED.size, updated_at = NOW()
    `, [req.file.filename, mime, buffer, buffer.length]);
  } catch (err) {
    console.error('[Upload Image] Error saving to DB:', err);
  }

  const relativePath = `/uploads/${req.file.filename}`;
  return res.json({ success: true, filename: req.file.filename, path: relativePath });
});

// GET /api/admin/stores - Read all stores
router.get('/api/admin/stores', async (req, res) => {
  const { password } = req.query;
  if (password && password !== '6515') {
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
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, icon, AI_KEYWORDS, TOP_HERO_PRODUCTS, PROMOTION_TAGS } = req.body;
  if (password && password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    let resolvedShopNum = (shop_number || '').trim();
    if (!resolvedShopNum) {
      const existing = await db.query('SELECT shop_number FROM store_matrix');
      let nextShopNum = 1;
      if (existing.rows.length > 0) {
        const numbers = existing.rows.map(s => parseInt((s.shop_number || '').replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
        nextShopNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      }
      resolvedShopNum = `DE${nextShopNum}`;
    }

    const sName = (shop_name || 'New Shop').trim();
    const sImg = (shop_image || 'default.jpg').trim();
    const sCat = (category || 'Duty Free').trim();
    const sBrands = (brands_available || sName).trim();
    const sGraph = (graph_node_id || `Node_Shop_${resolvedShopNum}`).trim();
    const sX = (x !== undefined && x !== '') ? Math.round(Number(x)) : 500;
    const sY = (y !== undefined && y !== '') ? Math.round(Number(y)) : 250;
    const sParent = (parent_node_id || 'Node_Intersection_D').trim();
    const sStoreId = (store_id || sName || `store_shop_${resolvedShopNum}`).trim();
    const sIcon = (icon || 'shopping_bag').trim();
    const sKw = (AI_KEYWORDS || '').trim();
    const sHero = (TOP_HERO_PRODUCTS || '').trim();
    const sPromo = (PROMOTION_TAGS || '').trim();

    const insertQuery = `
      INSERT INTO store_matrix (
        shop_number, shop_name, shop_image, category, brands_available, 
        graph_node_id, x, y, parent_node_id, store_id, icon, 
        "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (shop_number) DO UPDATE SET
        shop_name = EXCLUDED.shop_name,
        shop_image = EXCLUDED.shop_image,
        category = EXCLUDED.category,
        x = EXCLUDED.x,
        y = EXCLUDED.y,
        icon = EXCLUDED.icon
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      resolvedShopNum, sName, sImg, sCat, sBrands, 
      sGraph, sX, sY, sParent, sStoreId, sIcon, 
      sKw, sHero, sPromo
    ]);

    const createdStore = result.rows[0];
    console.log(`[Admin] Created Shop ${resolvedShopNum}: ${createdStore.shop_name}`);

    // Sync CSV in background
    (async () => {
      try {
        const allRows = await db.query('SELECT * FROM store_matrix');
        const headers = ['shop_number','shop_name','shop_image','category','brands_available','graph_node_id','x','y','parent_node_id','store_id','AI_KEYWORDS','TOP_HERO_PRODUCTS','PROMOTION_TAGS'];
        const escapeCsv = (v) => {
          if (v === null || v === undefined) return '""';
          const s = String(v);
          return '"' + s.replace(/"/g, '""') + '"';
        };
        const lines = [headers.join(',')];
        for (let row of allRows.rows) {
          lines.push(headers.map(h => escapeCsv(row[h])).join(','));
        }
        fs.writeFileSync(STORE_CSV, lines.join('\n'), 'utf8');
      } catch (csvErr) {
        console.warn('Could not write STORE_CSV:', csvErr.message);
      }
    })();

    // Reload navigation graph
    loadNavigationGraph().catch(e => console.error('[Admin] Error reloading navigation graph:', e));

    return res.json({ success: true, store: createdStore });
  } catch (error) {
    console.error('[Admin] Error creating store:', error);
    return res.status(500).json({ error: 'Failed to create store.', details: error.message });
  }
});

// PUT /api/admin/stores/:shop_number - Update a store
router.put('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = decodeURIComponent(req.params.shop_number).trim();
  const { password, shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, icon, AI_KEYWORDS, TOP_HERO_PRODUCTS, PROMOTION_TAGS } = req.body;
  if (password && password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (shop_number !== undefined) { updates.push(`shop_number = $${idx++}`); values.push(shop_number.trim()); }
    if (shop_name !== undefined) { updates.push(`shop_name = $${idx++}`); values.push(shop_name.trim()); }
    if (shop_image !== undefined) { updates.push(`shop_image = $${idx++}`); values.push(shop_image.trim()); }
    if (category !== undefined) { updates.push(`category = $${idx++}`); values.push(category.trim()); }
    if (brands_available !== undefined) { updates.push(`brands_available = $${idx++}`); values.push(brands_available.trim()); }
    if (graph_node_id !== undefined) { updates.push(`graph_node_id = $${idx++}`); values.push(graph_node_id.trim()); }
    if (x !== undefined && x !== '') { updates.push(`x = $${idx++}`); values.push(Math.round(Number(x))); }
    if (y !== undefined && y !== '') { updates.push(`y = $${idx++}`); values.push(Math.round(Number(y))); }
    if (parent_node_id !== undefined) { updates.push(`parent_node_id = $${idx++}`); values.push(parent_node_id.trim()); }
    if (store_id !== undefined) { updates.push(`store_id = $${idx++}`); values.push(store_id.trim()); }
    if (icon !== undefined) { updates.push(`icon = $${idx++}`); values.push(icon.trim()); }
    if (AI_KEYWORDS !== undefined) { updates.push(`"AI_KEYWORDS" = $${idx++}`); values.push(AI_KEYWORDS.trim()); }
    if (TOP_HERO_PRODUCTS !== undefined) { updates.push(`"TOP_HERO_PRODUCTS" = $${idx++}`); values.push(TOP_HERO_PRODUCTS.trim()); }
    if (PROMOTION_TAGS !== undefined) { updates.push(`"PROMOTION_TAGS" = $${idx++}`); values.push(PROMOTION_TAGS.trim()); }

    if (updates.length === 0) {
      return res.json({ success: true });
    }

    values.push(shopNumStr);
    const query = `
      UPDATE store_matrix 
      SET ${updates.join(', ')} 
      WHERE LOWER(TRIM(shop_number)) = LOWER(TRIM($${idx})) 
         OR LOWER(TRIM(store_id)) = LOWER(TRIM($${idx}))
         OR LOWER(TRIM(shop_name)) = LOWER(TRIM($${idx}))
      RETURNING *
    `;
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      // Fallback: match by graph_node_id
      const fallbackQuery = `UPDATE store_matrix SET ${updates.join(', ')} WHERE graph_node_id = $${idx} RETURNING *`;
      const fallbackResult = await db.query(fallbackQuery, values);
      if (fallbackResult.rows.length === 0) {
        return res.status(404).json({ error: `Shop number "${shopNumStr}" not found in database.` });
      }
      result.rows = fallbackResult.rows;
    }

    const updatedStore = result.rows[0];
    console.log(`[Admin] Updated Shop ${shopNumStr}:`, updatedStore.shop_name, `(x=${updatedStore.x}, y=${updatedStore.y})`);

    // Asynchronously sync local store_matrix.csv in background
    (async () => {
      try {
        const allRows = await db.query('SELECT * FROM store_matrix');
        const headers = ['shop_number','shop_name','shop_image','category','brands_available','graph_node_id','x','y','parent_node_id','store_id','AI_KEYWORDS','TOP_HERO_PRODUCTS','PROMOTION_TAGS'];
        const escapeCsv = (v) => {
          if (v === null || v === undefined) return '""';
          const s = String(v);
          return '"' + s.replace(/"/g, '""') + '"';
        };
        const lines = [headers.join(',')];
        for (let row of allRows.rows) {
          lines.push(headers.map(h => escapeCsv(row[h])).join(','));
        }
        fs.writeFileSync(STORE_CSV, lines.join('\n'), 'utf8');
      } catch (err) {
        console.warn('[Admin] Could not write STORE_CSV:', err.message);
      }
    })();

    // Reload navigation graph
    loadNavigationGraph().catch(e => console.error('[Admin] Error reloading navigation graph:', e));

    return res.json({ success: true, store: updatedStore });
  } catch (error) {
    console.error('[Admin] Error updating store:', error);
    return res.status(500).json({ error: 'Failed to update store.', details: error.message });
  }
});

// DELETE /api/admin/stores/:shop_number - Delete a store
router.delete('/api/admin/stores/:shop_number', async (req, res) => {
  const shopNumStr = decodeURIComponent(req.params.shop_number || '').trim();
  const password = req.body?.password || req.query?.password;

  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  try {
    // 1. Delete from PostgreSQL store_matrix table
    await db.query('DELETE FROM store_matrix WHERE LOWER(TRIM(shop_number)) = LOWER(TRIM($1)) OR LOWER(TRIM(store_id)) = LOWER(TRIM($1)) OR LOWER(TRIM(shop_name)) = LOWER(TRIM($1))', [shopNumStr]);

    // 2. Delete from CSV if present
    const stores = await readCsv(STORE_CSV);
    const filteredStores = stores.filter(s => 
      (s.shop_number || '').toString().trim().toLowerCase() !== shopNumStr.toLowerCase() &&
      (s.store_id || '').toString().trim().toLowerCase() !== shopNumStr.toLowerCase() &&
      (s.shop_name || '').toString().trim().toLowerCase() !== shopNumStr.toLowerCase()
    );

    await saveStoresToCsvSync(filteredStores);
    console.log(`[Admin] Deleted Shop ${shopNumStr} from DB and CSV`);

    // Reload navigation graph
    await loadNavigationGraph();

    return res.json({ success: true, shop_number: shopNumStr });
  } catch (error) {
    console.error('[Admin] Error deleting store:', error);
    return res.status(500).json({ error: 'Failed to delete store.', details: error.message });
  }
});


module.exports = router;
