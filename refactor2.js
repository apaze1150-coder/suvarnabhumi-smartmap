const fs = require('fs');

let s = fs.readFileSync('server.js', 'utf8');

s = s.replace("const csv = require('csv-parser');", "const db = require('./db');");

const readCsvOld = `function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      return reject(new Error(\`CSV file not found at \${filePath}\`));
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}`;

const readCsvNew = `async function readCsv(filePath) {
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
}`;
s = s = s.replace(readCsvOld, () => readCsvNew);

const saveStoresOld = `function saveStoresToCsvSync(stores) {
  if (!stores || stores.length === 0) return;
  const headers = ['shop_number','shop_name','shop_image','category','brands_available','graph_node_id','x','y','parent_node_id','store_id','AI_KEYWORDS','TOP_HERO_PRODUCTS','PROMOTION_TAGS'].join(',') + '\\n';
  const escape = (val) => {
    if (val === undefined || val === null) return '""';
    let str = val.toString().replace(/"/g, '""');
    return \`"\${str}"\`;
  };
  const rows = stores.map(s => {
    return [
      escape(s.shop_number), escape(s.shop_name), escape(s.shop_image), escape(s.category),
      escape(s.brands_available), escape(s.graph_node_id), escape(s.x), escape(s.y), escape(s.parent_node_id), escape(s.store_id), escape(s.AI_KEYWORDS), escape(s.TOP_HERO_PRODUCTS), escape(s.PROMOTION_TAGS)
    ].join(',');
  }).join('\\n') + '\\n';
  fs.writeFileSync(STORE_CSV, headers + rows, 'utf8');
}`;

const saveStoresNew = `async function saveStoresToCsvSync(stores) {
  try {
    await db.query('TRUNCATE store_matrix');
    for (let row of stores) {
      await db.query(\`
        INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, "AI_KEYWORDS", "TOP_HERO_PRODUCTS", "PROMOTION_TAGS")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      \`, [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, Number(row.x)||0, Number(row.y)||0, row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }
  } catch(e) {
    console.error('Error saving stores to DB:', e);
  }
}`;
s = s = s.replace(saveStoresOld, () => saveStoresNew);

const saveNodesOld = `function saveNodesToCsvSync(nodes) {
  if (!nodes || nodes.length === 0) return;
  const headers = ['node_id','name','x','y','concourse','type','connections','icon','image_url','floor'].join(',') + '\\n';
  const escape = (val) => {
    if (val === undefined || val === null) return '""';
    let str = val.toString().replace(/"/g, '""');
    return \`"\${str}"\`;
  };
  const rows = nodes.map(n => {
    return [
      escape(n.node_id), escape(n.name), escape(n.x), escape(n.y), escape(n.concourse), escape(n.type),
      escape(n.connections), escape(n.icon), escape(n.image_url), escape(n.floor)
    ].join(',');
  }).join('\\n') + '\\n';
  fs.writeFileSync(MAP_NODES_CSV, headers + rows, 'utf8');
}`;

const saveNodesNew = `async function saveNodesToCsvSync(nodes) {
  try {
    await db.query('TRUNCATE airport_map_nodes');
    for (let row of nodes) {
      await db.query(\`
        INSERT INTO airport_map_nodes (node_id, name, x, y, concourse, type, connections, icon, image_url, floor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      \`, [row.node_id, row.name, Number(row.x)||0, Number(row.y)||0, row.concourse, row.type, row.connections, row.icon, row.image_url, row.floor]);
    }
  } catch(e) {
    console.error('Error saving nodes to DB:', e);
  }
}`;
s = s = s.replace(saveNodesOld, () => saveNodesNew);

const writeCsvOld = `function writeCsvGeneric(filePath, rows, headers) {
  if (!rows || rows.length === 0) {
    fs.writeFileSync(filePath, headers.join(',') + '\\n', 'utf8');
    return;
  }
  const headerLine = headers.join(',') + '\\n';
  const escape = (val) => {
    if (val === undefined || val === null) return '""';
    let str = val.toString().replace(/"/g, '""');
    return \`"\${str}"\`;
  };
  const rowLines = rows.map(r => headers.map(h => escape(r[h])).join(',')).join('\\n');
  fs.writeFileSync(filePath, headerLine + rowLines + '\\n', 'utf8');
}`;

const writeCsvNew = `async function writeCsvGeneric(filePath, rows, headers) {
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
      await db.query(\`INSERT INTO \${table} (\${cols}) VALUES (\${placeholders})\`, vals);
    }
  } catch(e) {
    console.error('Error writing to table ' + table, e);
  }
}`;
s = s = s.replace(writeCsvOld, () => writeCsvNew);

// Function calls renaming - safely!
s = s.replace(/saveStoresToCsvSync\(/g, 'await saveStoresToCsvSync(');
s = s.replace(/saveNodesToCsvSync\(/g, 'await saveNodesToCsvSync(');
s = s.replace(/writeCsvGeneric\(/g, 'await writeCsvGeneric(');

// But we must fix the declarations back:
s = s.replace(/async function await saveStoresToCsvSync/g, 'async function saveStoresToCsvSync');
s = s.replace(/async function await saveNodesToCsvSync/g, 'async function saveNodesToCsvSync');
s = s.replace(/async function await writeCsvGeneric/g, 'async function writeCsvGeneric');

fs.writeFileSync('server.js', s);
console.log('Refactoring complete.');
