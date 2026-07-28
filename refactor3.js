const fs = require('fs');
let s = fs.readFileSync('server_csv_backup.js', 'utf8');

s = s.replace("const csv = require('csv-parser');", "const db = require('./db');");

const replaceFunc = (funcName, replacement) => {
  const start = s.indexOf('function ' + funcName + '(');
  if (start === -1) { console.error('Could not find', funcName); return; }
  let end = start;
  let braceCount = 0;
  let started = false;
  while (end < s.length) {
    if (s[end] === '{') { braceCount++; started = true; }
    else if (s[end] === '}') {
      braceCount--;
      if (started && braceCount === 0) {
        end++;
        break;
      }
    }
    end++;
  }
  s = s.substring(0, start) + replacement + s.substring(end);
};

replaceFunc('readCsv', `async function readCsv(filePath) {
  const tableMap = {
    [WALK_TIME_CSV]: 'walk_time_matrix',
    [STORE_CSV]: 'store_matrix',
    [MAP_NODES_CSV]: 'airport_map_nodes',
    [PRODUCT_MATRIX_CSV]: 'product_matrix',
    [PRODUCTS_CSV]: 'panpuri_products',
    [ORDERS_CSV]: 'panpuri_orders',
    [STOCK_LOGS_CSV]: 'panpuri_stock_logs',
    [RESERVATIONS_CSV]: 'panpuri_spa_reservations',
    [FLIGHT_CSV]: 'flight_matrix'
  };
  const table = tableMap[filePath];
  if (!table) return [];
  try {
    const res = await db.query('SELECT * FROM ' + table);
    return res.rows;
  } catch(e) {
    console.error('DB Error reading', table, e);
    return [];
  }
}`);

replaceFunc('saveStoresToCsvSync', `async function saveStoresToCsvSync(stores) {
  try {
    await db.query('TRUNCATE store_matrix');
    for (let row of stores) {
      await db.query('INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, Number(row.x)||0, Number(row.y)||0, row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }
  } catch(e) { console.error('Error saving stores to DB:', e); }
}`);

replaceFunc('saveNodesToCsvSync', `async function saveNodesToCsvSync(nodes) {
  try {
    await db.query('TRUNCATE airport_map_nodes');
    for (let row of nodes) {
      await db.query('INSERT INTO airport_map_nodes (node_id, name, x, y, concourse, type, connections, icon, image_url, floor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [row.node_id, row.name, Number(row.x)||0, Number(row.y)||0, row.concourse, row.type, row.connections, row.icon, row.image_url, row.floor]);
    }
  } catch(e) { console.error('Error saving nodes to DB:', e); }
}`);

replaceFunc('writeCsvGeneric', `async function writeCsvGeneric(filePath, rows, headers) {
  const tableMap = {
    [WALK_TIME_CSV]: 'walk_time_matrix',
    [STORE_CSV]: 'store_matrix',
    [MAP_NODES_CSV]: 'airport_map_nodes',
    [PRODUCT_MATRIX_CSV]: 'product_matrix',
    [PRODUCTS_CSV]: 'panpuri_products',
    [ORDERS_CSV]: 'panpuri_orders',
    [STOCK_LOGS_CSV]: 'panpuri_stock_logs',
    [RESERVATIONS_CSV]: 'panpuri_spa_reservations',
    [FLIGHT_CSV]: 'flight_matrix'
  };
  const table = tableMap[filePath];
  if (!table) return;
  try {
    await db.query('TRUNCATE ' + table);
    if (!rows || rows.length === 0) return;
    const cols = headers.map(h => '"' + h + '"').join(', ');
    for (let row of rows) {
      let vals = headers.map(h => {
        if (h === 'items_json' && typeof row[h] === 'string') return row[h];
        if (h === 'items_json' && typeof row[h] === 'object') return JSON.stringify(row[h]);
        return row[h];
      });
      let placeholders = headers.map((_, i) => '$' + (i+1)).join(', ');
      await db.query('INSERT INTO ' + table + ' (' + cols + ') VALUES (' + placeholders + ')', vals);
    }
  } catch(e) { console.error('Error writing to table ' + table, e); }
}`);

// Add await to function calls
s = s.replace(/saveStoresToCsvSync\(/g, 'await saveStoresToCsvSync(');
s = s.replace(/saveNodesToCsvSync\(/g, 'await saveNodesToCsvSync(');
s = s.replace(/writeCsvGeneric\(/g, 'await writeCsvGeneric(');

// Fix definitions because we blindly prefixed await to ALL saveStoresToCsvSync matches!
s = s.replace(/async function await saveStoresToCsvSync/g, 'async function saveStoresToCsvSync');
s = s.replace(/async function await saveNodesToCsvSync/g, 'async function saveNodesToCsvSync');
s = s.replace(/async function await writeCsvGeneric/g, 'async function writeCsvGeneric');

fs.writeFileSync('server.js', s);
console.log('Refactoring finished successfully!');
