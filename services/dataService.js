const db = require('../db');
const path = require('path');
const fs = require('fs');

const WALK_TIME_CSV = path.join(__dirname, '../walk_time_matrix.csv');
const STORE_CSV = path.join(__dirname, '../store_matrix.csv');
const MAP_NODES_CSV = path.join(__dirname, '../airport_map_nodes.csv');
const PRODUCT_MATRIX_CSV = path.join(__dirname, '../product_matrix.csv');
const PRODUCTS_CSV = path.join(__dirname, '../panpuri_products.csv');

// --- CSV Helper Functions ---
async function readCsv(filePath) {
  let table = null;
  if (filePath.includes('walk_time_matrix')) table = 'walk_time_matrix';
  else if (filePath.includes('store_matrix')) table = 'store_matrix';
  else if (filePath.includes('airport_map_nodes')) table = 'airport_map_nodes';
  else if (filePath.includes('product_matrix')) table = 'product_matrix';
  else if (filePath.includes('panpuri_products')) table = 'panpuri_products';
  else if (filePath.includes('panpuri_orders')) table = 'panpuri_orders';
  else if (filePath.includes('panpuri_stock_logs')) table = 'panpuri_stock_logs';
  else if (filePath.includes('panpuri_spa_reservations')) table = 'panpuri_spa_reservations';
  else if (filePath.includes('flight_matrix')) table = 'flight_matrix';
  else if (filePath.includes('flight_override')) table = 'flight_override';
  
  if (!table) return [];
  try {
    // Order panpuri_products by sort_order to preserve insertion order
    const orderClause = (table === 'panpuri_products') ? ' ORDER BY sort_order ASC NULLS LAST' : '';
    const res = await db.query('SELECT * FROM ' + table + orderClause);
    return res.rows;
  } catch(e) {
    console.error('DB Error reading', table, e);
    return [];
  }
}

// Helper to hash string for mock random selection
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}


// --- CSV write helper for orders & products ---
async function writeCsvGeneric(filePath, rows, headers) {
  let table = null;
  if (filePath.includes('walk_time_matrix')) table = 'walk_time_matrix';
  else if (filePath.includes('store_matrix')) table = 'store_matrix';
  else if (filePath.includes('airport_map_nodes')) table = 'airport_map_nodes';
  else if (filePath.includes('product_matrix')) table = 'product_matrix';
  else if (filePath.includes('panpuri_products')) table = 'panpuri_products';
  else if (filePath.includes('panpuri_orders')) table = 'panpuri_orders';
  else if (filePath.includes('panpuri_stock_logs')) table = 'panpuri_stock_logs';
  else if (filePath.includes('panpuri_spa_reservations')) table = 'panpuri_spa_reservations';
  else if (filePath.includes('flight_matrix')) table = 'flight_matrix';
  else if (filePath.includes('flight_override')) table = 'flight_override';
  
  if (!table) return;
  
  // Dedup logic based on primary key for products to prevent transaction aborts
  let dedupedRows = rows;
  if (table === 'panpuri_products' && rows && rows.length > 0) {
      const seen = new Set();
      dedupedRows = [];
      for (let r of rows) {
          if (!seen.has(r.Code)) {
              seen.add(r.Code);
              dedupedRows.push(r);
          } else {
              console.warn('[Admin] Skipping duplicate product Code:', r.Code);
          }
      }
  }
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE ' + table);
    if (!dedupedRows || dedupedRows.length === 0) {
      await client.query('COMMIT');
      return;
    }
    const cols = headers.map(h => '"' + h + '"').join(', ');
    const isProducts = (table === 'panpuri_products');
    const colsSQL = isProducts ? cols + ', sort_order' : cols;
    
    // Batch insert: build multi-row VALUES in chunks of 50 to avoid param limits
    const BATCH_SIZE = 50;
    for (let batchStart = 0; batchStart < dedupedRows.length; batchStart += BATCH_SIZE) {
      const batch = dedupedRows.slice(batchStart, batchStart + BATCH_SIZE);
      const allVals = [];
      const valueClauses = [];
      const colCount = isProducts ? headers.length + 1 : headers.length;
      
      for (let i = 0; i < batch.length; i++) {
        const row = batch[i];
        const rowVals = headers.map(h => {
          if (h === 'items_json' && typeof row[h] === 'string') return row[h];
          if (h === 'items_json' && typeof row[h] === 'object') return JSON.stringify(row[h]);
          return row[h];
        });
        if (isProducts) rowVals.push(batchStart + i + 1); // sort_order
        
        const offset = i * colCount;
        const placeholders = rowVals.map((_, j) => '$' + (offset + j + 1)).join(', ');
        valueClauses.push('(' + placeholders + ')');
        allVals.push(...rowVals);
      }
      
      await client.query(
        'INSERT INTO ' + table + ' (' + colsSQL + ') VALUES ' + valueClauses.join(', '),
        allVals
      );
    }
    await client.query('COMMIT');
  } catch(e) { 
    await client.query('ROLLBACK');
    console.error('Error writing to table (Transaction Rolled Back) ' + table, e); 
  } finally {
    client.release();
  }
}

const PRODUCT_HEADERS = ['Code','Description','Reference','Category','Sub-Category','Scent','Price','Image','Qty_Branch1','Qty_Branch2','Qty_Branch3','Description_Customer','Scent_Notes','How_to_Use','Size'];
const ORDER_HEADERS = ['order_id','order_number','store_id','customer_name','flight_number','items_json','total_price','status','created_at','updated_at','staff_note'];

module.exports = { readCsv, hashString, writeCsvGeneric, WALK_TIME_CSV, STORE_CSV, MAP_NODES_CSV, PRODUCT_MATRIX_CSV, PRODUCTS_CSV, PRODUCT_HEADERS };

