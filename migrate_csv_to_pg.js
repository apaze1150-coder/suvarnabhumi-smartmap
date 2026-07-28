require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath}, does not exist.`);
      return resolve([]);
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function migrate() {
  try {
    console.log("Starting Migration...");
    
    // 1. Create Tables and Alter to add Primary Keys if they were created via Supabase auto-import
    try {
      await pool.query(`
        ALTER TABLE airport_map_nodes ADD PRIMARY KEY (node_id);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE store_matrix ADD PRIMARY KEY (shop_number);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE panpuri_orders ADD PRIMARY KEY (order_id);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE panpuri_products ADD PRIMARY KEY (code);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE panpuri_stock_logs ADD PRIMARY KEY (log_id);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE walk_time_matrix ADD PRIMARY KEY (gate_zone);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE flight_matrix ADD PRIMARY KEY (gate_zone);
      `);
    } catch(e) {}
    try {
      await pool.query(`
        ALTER TABLE product_matrix ADD PRIMARY KEY (product_id);
      `);
    } catch(e) {}

    console.log("Tables and constraints configured successfully.");

    // Function to safely extract numbers
    const parseNum = (val) => val && !isNaN(val) ? Number(val) : 0;
    const parseNull = (val) => val === '' ? null : val;

    // 2. Load airport_map_nodes
    const nodes = await readCsv('airport_map_nodes.csv');
    for (let row of nodes) {
      if(!row.node_id) continue;
      await pool.query(`
        INSERT INTO airport_map_nodes (node_id, name, x, y, concourse, type, connections, icon, image_url, floor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (node_id) DO NOTHING
      `, [row.node_id, row.name, parseNum(row.x), parseNum(row.y), row.concourse, row.type, row.connections, row.icon, row.image_url, row.floor]);
    }
    console.log(`Loaded ${nodes.length} nodes.`);

    // 3. Load store_matrix
    const stores = await readCsv('store_matrix.csv');
    for (let row of stores) {
      if(!row.shop_number) continue;
      await pool.query(`
        INSERT INTO store_matrix (shop_number, shop_name, shop_image, category, brands_available, graph_node_id, x, y, parent_node_id, store_id, ai_keywords, top_hero_products, promotion_tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (shop_number) DO NOTHING
      `, [row.shop_number, row.shop_name, row.shop_image, row.category, row.brands_available, row.graph_node_id, parseNum(row.x), parseNum(row.y), row.parent_node_id, row.store_id, row.AI_KEYWORDS, row.TOP_HERO_PRODUCTS, row.PROMOTION_TAGS]);
    }
    console.log(`Loaded ${stores.length} stores.`);

    // 4. Load panpuri_products
    const pProducts = await readCsv('panpuri_products.csv');
    for (let row of pProducts) {
      if(!row.Code) continue;
      await pool.query(`
        INSERT INTO panpuri_products (code, description, reference, category, sub_category, scent, price, image, qty_branch1, qty_branch2, qty_branch3, description_customer, scent_notes, how_to_use, size)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (code) DO NOTHING
      `, [row.Code, row.Description, row.Reference, row.Category, row['Sub-Category'], row.Scent, parseNum(row.Price), row.Image, parseNum(row.Qty_Branch1), parseNum(row.Qty_Branch2), parseNum(row.Qty_Branch3), row.Description_Customer, row.Scent_Notes, row.How_to_Use, row.Size]);
    }
    console.log(`Loaded ${pProducts.length} panpuri products.`);

    // 5. Load panpuri_orders
    const orders = await readCsv('panpuri_orders.csv');
    for (let row of orders) {
      if(!row.order_id) continue;
      let itemsJson = [];
      try { itemsJson = JSON.parse(row.items_json); } catch(e) {}
      await pool.query(`
        INSERT INTO panpuri_orders (order_id, order_number, store_id, customer_name, flight_number, items_json, total_price, status, created_at, updated_at, staff_note)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (order_id) DO NOTHING
      `, [row.order_id, row.order_number, row.store_id, row.customer_name, row.flight_number, JSON.stringify(itemsJson), parseNum(row.total_price), row.status, parseNull(row.created_at), parseNull(row.updated_at), row.staff_note]);
    }
    console.log(`Loaded ${orders.length} orders.`);

    // 6. Load panpuri_stock_logs
    const logs = await readCsv('panpuri_stock_logs.csv');
    for (let row of logs) {
      if(!row.log_id) continue;
      await pool.query(`
        INSERT INTO panpuri_stock_logs (log_id, timestamp, performed_by, transaction_type, ref_no, product_code, product_name, qty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (log_id) DO NOTHING
      `, [row.log_id, parseNull(row.timestamp), row.performed_by, row.transaction_type, row.ref_no, row.product_code, row.product_name, parseNum(row.qty)]);
    }
    console.log(`Loaded ${logs.length} stock logs.`);

    // 7. Load walk_time_matrix
    const walkTimes = await readCsv('walk_time_matrix.csv');
    for (let row of walkTimes) {
      if(!row.gate_zone) continue;
      await pool.query(`
        INSERT INTO walk_time_matrix (gate_zone, walk_time_mins, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (gate_zone) DO NOTHING
      `, [row.gate_zone, parseNum(row.walk_time_mins), row.description]);
    }
    console.log(`Loaded ${walkTimes.length} walk times.`);

    // 8. Load flight_matrix
    const flights = await readCsv('flight_matrix.csv');
    for (let row of flights) {
      if(!row.gate_zone) continue;
      await pool.query(`
        INSERT INTO flight_matrix (gate_zone, walk_time_mins, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (gate_zone) DO NOTHING
      `, [row.gate_zone, parseNum(row.walk_time_mins), row.description]);
    }
    console.log(`Loaded ${flights.length} flights.`);

    // 9. Load product_matrix
    const matrix = await readCsv('product_matrix.csv');
    for (let row of matrix) {
      if(!row.PRODUCT_ID) continue;
      await pool.query(`
        INSERT INTO product_matrix (product_id, shop_number, product_name, product_image_filename, price_thb, target_tags, is_top_seller)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (product_id) DO NOTHING
      `, [row.PRODUCT_ID, row.SHOP_NUMBER, row.PRODUCT_NAME, row.PRODUCT_IMAGE_FILENAME, parseNum(row.PRICE_THB), row.TARGET_TAGS, row.IS_TOP_SELLER]);
    }
    console.log(`Loaded ${matrix.length} product matrix entries.`);

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
