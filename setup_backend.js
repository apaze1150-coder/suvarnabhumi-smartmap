const fs = require('fs');
const path = require('path');

// 1. Fix and migrate panpuri_products.csv
const productsPath = path.join(__dirname, 'panpuri_products.csv');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Fix broken quotes from copy-pasting
productsContent = productsContent.replace(/"true\r?\n""p/g, '"true"\n"p');
productsContent = productsContent.replace(/"true\r?\n"""true\r?\n"/g, '"true"');
productsContent = productsContent.replace(/""true\r?\n"/g, '"true"');

const rows = productsContent.split('\n').filter(r => r.trim().length > 0);
const headers = rows[0].split(',');
if (!headers.includes('how_to_use')) {
    headers.push('how_to_use');
    rows[0] = headers.join(',');
    for (let i = 1; i < rows.length; i++) {
        // Just append empty how_to_use column for existing rows
        if (!rows[i].endsWith(',')) rows[i] += ',""';
    }
}
fs.writeFileSync(productsPath, rows.join('\n') + '\n', 'utf8');
console.log('Migrated panpuri_products.csv');

// 2. Initialize panpuri_stock_logs.csv
const logsPath = path.join(__dirname, 'panpuri_stock_logs.csv');
if (!fs.existsSync(logsPath)) {
    const logHeaders = 'log_id,timestamp,performed_by,transaction_type,ref_no,product_code,product_name,qty\n';
    fs.writeFileSync(logsPath, logHeaders, 'utf8');
    console.log('Created panpuri_stock_logs.csv');
}

// 3. Patch server.js
const serverPath = path.join(__dirname, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Add how_to_use to headers
if (!serverContent.includes("'how_to_use'")) {
    serverContent = serverContent.replace(
        "const PRODUCT_HEADERS = ['product_id','product_code','product_name','description','category','sub_category','scent','price','qty_de40','qty_de12','qty_dw41','image','is_active'];",
        "const PRODUCT_HEADERS = ['product_id','product_code','product_name','description','category','sub_category','scent','price','qty_de40','qty_de12','qty_dw41','image','is_active','how_to_use'];"
    );
}

// Add API endpoints
const apiBlock = `
// ============================================================
// PANPURI ADMIN APIS
// ============================================================

const STOCK_LOGS_CSV = path.join(__dirname, 'panpuri_stock_logs.csv');
const STOCK_LOG_HEADERS = ['log_id','timestamp','performed_by','transaction_type','ref_no','product_code','product_name','qty'];

app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await readCsv(PRODUCTS_CSV);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stock-logs', async (req, res) => {
  try {
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    // Sort descending by log_id or timestamp (assuming ID is sequential)
    logs.reverse();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products/batch-update', async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.json({ success: true });
    }

    let products = await readCsv(PRODUCTS_CSV);
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }

    for (const [productId, changes] of Object.entries(updates)) {
      const productIndex = products.findIndex(p => p.product_id === productId);
      if (productIndex !== -1) {
        const prod = products[productIndex];
        
        // Log quantity changes
        const stores = ['de40', 'de12', 'dw41'];
        for (const store of stores) {
          const qtyField = \`qty_\${store}\`;
          if (changes[qtyField] !== undefined) {
            const oldQty = parseInt(prod[qtyField] || 0);
            const newQty = parseInt(changes[qtyField]);
            if (!isNaN(newQty) && oldQty !== newQty) {
              const diff = newQty - oldQty;
              logs.push({
                log_id: 'TXN-' + Date.now() + Math.floor(Math.random()*1000),
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                performed_by: 'Global Admin',
                transaction_type: diff > 0 ? 'GOODS RECEIPT' : (diff < 0 && Math.abs(diff) > 10 ? 'STOCK TRANSFER OUT' : 'Adjustment'),
                ref_no: \`ADJ-\${Math.floor(Math.random()*10000)}\`,
                product_code: prod.product_code,
                product_name: prod.product_name,
                qty: diff.toString()
              });
            }
          }
        }

        // Apply changes
        Object.assign(prod, changes);
      }
    }

    writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    writeCsvGeneric(STOCK_LOGS_CSV, logs, STOCK_LOG_HEADERS);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
`;

if (!serverContent.includes('/api/admin/products/batch-update')) {
    serverContent = serverContent.replace(
        "// POST /api/orders - customer creates new order",
        apiBlock + "\\n// POST /api/orders - customer creates new order"
    );
    fs.writeFileSync(serverPath, serverContent, 'utf8');
    console.log('Patched server.js with admin APIs');
} else {
    console.log('Admin APIs already exist in server.js');
}
