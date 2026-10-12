const express = require('express');
const router = express.Router();
const db = require('../db');

function checkPassword(pass) {
  return pass === '6515';
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. RESTAURANTS
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/restaurants (Public)
router.get('/api/restaurants', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM restaurant_matrix ORDER BY id ASC');
    return res.json({ success: true, restaurants: result.rows });
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/restaurants
router.get('/api/admin/restaurants', async (req, res) => {
  const { password } = req.query;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const result = await db.query('SELECT * FROM restaurant_matrix ORDER BY id ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin restaurants error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/restaurants
router.post('/api/admin/restaurants', async (req, res) => {
  const { password, restaurant_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const idVal = (restaurant_id || `REST-${Date.now()}`).trim();
    const result = await db.query(
      `INSERT INTO restaurant_matrix (restaurant_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [idVal, name || 'New Restaurant', image_url || 'cutlery.png', category || 'Restaurant', concourse || 'D', floor || '4', Number(x) || 500, Number(y) || 250, graph_node_id || '', description || '']
    );
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Create restaurant error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/restaurants/:id
router.put('/api/admin/restaurants/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password, restaurant_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (restaurant_id !== undefined) { updates.push(`restaurant_id = $${idx++}`); values.push(restaurant_id); }
    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
    if (image_url !== undefined) { updates.push(`image_url = $${idx++}`); values.push(image_url); }
    if (category !== undefined) { updates.push(`category = $${idx++}`); values.push(category); }
    if (concourse !== undefined) { updates.push(`concourse = $${idx++}`); values.push(concourse); }
    if (floor !== undefined) { updates.push(`floor = $${idx++}`); values.push(floor); }
    if (x !== undefined) { updates.push(`x = $${idx++}`); values.push(Number(x)); }
    if (y !== undefined) { updates.push(`y = $${idx++}`); values.push(Number(y)); }
    if (graph_node_id !== undefined) { updates.push(`graph_node_id = $${idx++}`); values.push(graph_node_id); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }

    if (updates.length === 0) return res.json({ success: true });

    values.push(targetId);
    const query = `UPDATE restaurant_matrix SET ${updates.join(', ')} WHERE restaurant_id = $${idx} OR id::text = $${idx} RETURNING *`;
    const result = await db.query(query, values);
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Update restaurant error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/restaurants/:id
router.delete('/api/admin/restaurants/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    await db.query('DELETE FROM restaurant_matrix WHERE restaurant_id = $1 OR id::text = $1', [targetId]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete restaurant error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SERVICES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/services (Public)
router.get('/api/services', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM service_matrix ORDER BY id ASC');
    return res.json({ success: true, services: result.rows });
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/services
router.get('/api/admin/services', async (req, res) => {
  const { password } = req.query;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const result = await db.query('SELECT * FROM service_matrix ORDER BY id ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin services error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/services
router.post('/api/admin/services', async (req, res) => {
  const { password, service_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const idVal = (service_id || `SRV-${Date.now()}`).trim();
    const result = await db.query(
      `INSERT INTO service_matrix (service_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [idVal, name || 'New Service', image_url || 'information.png', category || 'Airport information', concourse || 'D', floor || '4', Number(x) || 500, Number(y) || 250, graph_node_id || '', description || '']
    );
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Create service error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/services/:id
router.put('/api/admin/services/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password, service_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (service_id !== undefined) { updates.push(`service_id = $${idx++}`); values.push(service_id); }
    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
    if (image_url !== undefined) { updates.push(`image_url = $${idx++}`); values.push(image_url); }
    if (category !== undefined) { updates.push(`category = $${idx++}`); values.push(category); }
    if (concourse !== undefined) { updates.push(`concourse = $${idx++}`); values.push(concourse); }
    if (floor !== undefined) { updates.push(`floor = $${idx++}`); values.push(floor); }
    if (x !== undefined) { updates.push(`x = $${idx++}`); values.push(Number(x)); }
    if (y !== undefined) { updates.push(`y = $${idx++}`); values.push(Number(y)); }
    if (graph_node_id !== undefined) { updates.push(`graph_node_id = $${idx++}`); values.push(graph_node_id); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }

    if (updates.length === 0) return res.json({ success: true });

    values.push(targetId);
    const query = `UPDATE service_matrix SET ${updates.join(', ')} WHERE service_id = $${idx} OR id::text = $${idx} RETURNING *`;
    const result = await db.query(query, values);
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Update service error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/services/:id
router.delete('/api/admin/services/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    await db.query('DELETE FROM service_matrix WHERE service_id = $1 OR id::text = $1', [targetId]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete service error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOUNGES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/lounges (Public)
router.get('/api/lounges', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lounge_matrix ORDER BY id ASC');
    return res.json({ success: true, lounges: result.rows });
  } catch (err) {
    console.error('Error fetching lounges:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/lounges
router.get('/api/admin/lounges', async (req, res) => {
  const { password } = req.query;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const result = await db.query('SELECT * FROM lounge_matrix ORDER BY id ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin lounges error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/lounges
router.post('/api/admin/lounges', async (req, res) => {
  const { password, lounge_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const idVal = (lounge_id || `LNG-${Date.now()}`).trim();
    const result = await db.query(
      `INSERT INTO lounge_matrix (lounge_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [idVal, name || 'New Lounge', image_url || 'lounge.png', category || 'Lounge', concourse || 'D', floor || '4', Number(x) || 500, Number(y) || 250, graph_node_id || '', description || '']
    );
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Create lounge error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/lounges/:id
router.put('/api/admin/lounges/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password, lounge_id, name, image_url, category, concourse, floor, x, y, graph_node_id, description } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (lounge_id !== undefined) { updates.push(`lounge_id = $${idx++}`); values.push(lounge_id); }
    if (name !== undefined) { updates.push(`name = $${idx++}`); values.push(name); }
    if (image_url !== undefined) { updates.push(`image_url = $${idx++}`); values.push(image_url); }
    if (category !== undefined) { updates.push(`category = $${idx++}`); values.push(category); }
    if (concourse !== undefined) { updates.push(`concourse = $${idx++}`); values.push(concourse); }
    if (floor !== undefined) { updates.push(`floor = $${idx++}`); values.push(floor); }
    if (x !== undefined) { updates.push(`x = $${idx++}`); values.push(Number(x)); }
    if (y !== undefined) { updates.push(`y = $${idx++}`); values.push(Number(y)); }
    if (graph_node_id !== undefined) { updates.push(`graph_node_id = $${idx++}`); values.push(graph_node_id); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description); }

    if (updates.length === 0) return res.json({ success: true });

    values.push(targetId);
    const query = `UPDATE lounge_matrix SET ${updates.join(', ')} WHERE lounge_id = $${idx} OR id::text = $${idx} RETURNING *`;
    const result = await db.query(query, values);
    return res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    console.error('Update lounge error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/lounges/:id
router.delete('/api/admin/lounges/:id', async (req, res) => {
  const targetId = req.params.id;
  const { password } = req.body;
  if (!checkPassword(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    await db.query('DELETE FROM lounge_matrix WHERE lounge_id = $1 OR id::text = $1', [targetId]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete lounge error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMBINED MAP POIS (For Map View & Fast Filtering)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/api/map/all-pois', async (req, res) => {
  try {
    const [shopsRes, restRes, srvRes, lngRes] = await Promise.all([
      db.query('SELECT shop_number, shop_name, shop_image, category, x, y, graph_node_id FROM store_matrix'),
      db.query('SELECT restaurant_id, name, image_url, category, x, y, floor, concourse FROM restaurant_matrix'),
      db.query('SELECT service_id, name, image_url, category, x, y, floor, concourse FROM service_matrix'),
      db.query('SELECT lounge_id, name, image_url, category, x, y, floor, concourse FROM lounge_matrix')
    ]);

    return res.json({
      success: true,
      shops: shopsRes.rows,
      restaurants: restRes.rows,
      services: srvRes.rows,
      lounges: lngRes.rows
    });
  } catch (err) {
    console.error('Error fetching all map POIs:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
