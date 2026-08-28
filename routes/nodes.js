const path = require('path');
const express = require('express');
const router = express.Router();
const { readCsv, MAP_NODES_CSV } = require('../services/dataService');
const fs = require('fs');
const db = require('../db');
const { loadNavigationGraph } = require('./navigation');


// --- ADMIN FEATURE: CRUD Operations on airport_map_nodes.csv ---
async function saveNodesToCsvSync(nodes) {
  try {
    await db.query('TRUNCATE airport_map_nodes');
    for (let row of nodes) {
      await db.query('INSERT INTO airport_map_nodes (node_id, name, x, y, concourse, type, connections, icon, image_url, floor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [row.node_id, row.name, Number(row.x)||0, Number(row.y)||0, row.concourse, row.type, row.connections, row.icon, row.image_url, row.floor]);
    }
  } catch(e) { console.error('Error saving nodes to DB:', e); }
}

router.get('/api/admin/nodes', async (req, res) => {
  if (req.query.password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try { return res.json(await readCsv(MAP_NODES_CSV)); }
  catch (error) { return res.status(500).json({ error: 'Failed to read nodes database.' }); }
});

router.post('/api/admin/nodes', async (req, res) => {
  const { password, node_id, name, x, y, concourse, type, connections, icon, image_url, floor } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    if (nodes.find(n => n.node_id === node_id)) return res.status(400).json({ error: 'node_id already exists.' });
    const newNode = { node_id, name, x, y, concourse, type, connections, icon, image_url, floor };
    nodes.push(newNode);
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true, node: newNode });
  } catch (error) { return res.status(500).json({ error: 'Failed to create node.' }); }
});

router.put('/api/admin/nodes/:node_id', async (req, res) => {
  const { password, name, x, y, concourse, type, connections, icon, image_url, floor } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    const idx = nodes.findIndex(n => n.node_id === req.params.node_id);
    if (idx === -1) return res.status(404).json({ error: 'Node not found.' });
    if (name !== undefined) nodes[idx].name = name;
    if (x !== undefined) nodes[idx].x = x;
    if (y !== undefined) nodes[idx].y = y;
    if (concourse !== undefined) nodes[idx].concourse = concourse;
    if (type !== undefined) nodes[idx].type = type;
    if (connections !== undefined) nodes[idx].connections = connections;
    if (icon !== undefined) nodes[idx].icon = icon;
    if (image_url !== undefined) nodes[idx].image_url = image_url;
    if (floor !== undefined) nodes[idx].floor = floor;
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true, node: nodes[idx] });
  } catch (error) { return res.status(500).json({ error: 'Failed to update node.' }); }
});

router.delete('/api/admin/nodes/:node_id', async (req, res) => {
  const password = req.body.password || req.query.password;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized.' });
  try {
    const nodes = await readCsv(MAP_NODES_CSV);
    const idx = nodes.findIndex(n => n.node_id === req.params.node_id);
    if (idx === -1) return res.status(404).json({ error: 'Node not found.' });
    nodes.splice(idx, 1);
    await saveNodesToCsvSync(nodes);
    await loadNavigationGraph();
    return res.json({ success: true });
  } catch (error) { return res.status(500).json({ error: 'Failed to delete node.' }); }
});


// --- ADMIN FEATURE: Update Coordinates ---
router.post('/api/admin/update-coordinates', async (req, res) => {
  const { password, shop_number, x, y } = req.body;
  if (password !== '6515') {
    return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  }

  const shopNum = (shop_number || '').toString().trim();
  const coordX = parseInt(x);
  const coordY = parseInt(y);

  if (!shopNum || isNaN(coordX) || isNaN(coordY)) {
    return res.status(400).json({ error: 'Invalid input parameters.' });
  }

  try {
    const stores = await readCsv(STORE_CSV);
    const storeIdx = stores.findIndex(s => s.shop_number.toString().trim() === shopNum);
    if (storeIdx === -1) {
      return res.status(404).json({ error: `Shop number ${shopNum} not found in database.` });
    }

    // Update coordinates
    stores[storeIdx].x = coordX.toString();
    stores[storeIdx].y = coordY.toString();

    // Save back to CSV
    await saveStoresToCsvSync(stores);
    console.log(`[Admin] Updated Shop ${shopNum} coordinates to (${coordX}, ${coordY})`);

    // Reload navigation graph so Dijkstra path is updated instantly
    await loadNavigationGraph();

    return res.json({ success: true });
  } catch (error) {
    console.error('[Admin] Error saving coordinates:', error);
    return res.status(500).json({ error: 'Failed to write data.', details: error.message });
  }
});




module.exports = router;

