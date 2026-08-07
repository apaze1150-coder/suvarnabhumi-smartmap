const fs = require('fs');
const path = 'd:\\apaze\\Smartindoormap\\server.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const PRODUCT_MATRIX_CSV =')) {
    content = content.replace(
        "const MAP_NODES_CSV = path.join(__dirname, 'airport_map_nodes.csv');",
        "const MAP_NODES_CSV = path.join(__dirname, 'airport_map_nodes.csv');\nconst PRODUCT_MATRIX_CSV = path.join(__dirname, 'product_matrix.csv');"
    );
}

const endpointsToAdd = `
// --- ADMIN FEATURE: CRUD Operations on product_matrix.csv ---

function saveProductMatrixToCsvSync(products) {
  const headers = 'PRODUCT_ID,STORE_ID,PRODUCT_NAME,PRODUCT_IMAGE_FILENAME,PRICE_THB,TARGET_TAGS,IS_TOP_SELLER\\n';
  const rows = products.map(p => {
    const escape = (val) => {
      if (val === undefined || val === null) return '""';
      let str = val.toString().replace(/"/g, '""');
      return \`"\${str}"\`;
    };
    return \`\${escape(p.PRODUCT_ID)},\${escape(p.STORE_ID)},\${escape(p.PRODUCT_NAME)},\${escape(p.PRODUCT_IMAGE_FILENAME)},\${escape(p.PRICE_THB)},\${escape(p.TARGET_TAGS)},\${escape(p.IS_TOP_SELLER)}\`;
  }).join('\\n');
  fs.writeFileSync(PRODUCT_MATRIX_CSV, headers + rows, 'utf8');
}

// GET /api/admin/product_matrix
app.get('/api/admin/product_matrix', async (req, res) => {
  const { password } = req.query;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    let products = [];
    if (fs.existsSync(PRODUCT_MATRIX_CSV)) {
      products = await readCsv(PRODUCT_MATRIX_CSV);
    }
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read database.' });
  }
});

// POST /api/admin/product_matrix
app.post('/api/admin/product_matrix', async (req, res) => {
  const { password, PRODUCT_ID, STORE_ID, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    let products = [];
    if (fs.existsSync(PRODUCT_MATRIX_CSV)) {
      products = await readCsv(PRODUCT_MATRIX_CSV);
    }
    let resolvedId = (PRODUCT_ID || '').trim();
    if (!resolvedId) {
      resolvedId = 'PROD_' + Date.now();
    }
    const newProd = {
      PRODUCT_ID: resolvedId,
      STORE_ID: (STORE_ID || '').trim(),
      PRODUCT_NAME: (PRODUCT_NAME || '').trim(),
      PRODUCT_IMAGE_FILENAME: (PRODUCT_IMAGE_FILENAME || '').trim(),
      PRICE_THB: (PRICE_THB || '').trim(),
      TARGET_TAGS: (TARGET_TAGS || '').trim(),
      IS_TOP_SELLER: (IS_TOP_SELLER || 'false').trim()
    };
    products.push(newProd);
    saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: newProd });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save database.' });
  }
});

// PUT /api/admin/product_matrix/:id
app.put('/api/admin/product_matrix/:id', async (req, res) => {
  const { password, STORE_ID, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const idx = products.findIndex(p => p.PRODUCT_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found.' });
    
    products[idx].STORE_ID = STORE_ID !== undefined ? String(STORE_ID).trim() : products[idx].STORE_ID;
    products[idx].PRODUCT_NAME = PRODUCT_NAME !== undefined ? String(PRODUCT_NAME).trim() : products[idx].PRODUCT_NAME;
    products[idx].PRODUCT_IMAGE_FILENAME = PRODUCT_IMAGE_FILENAME !== undefined ? String(PRODUCT_IMAGE_FILENAME).trim() : products[idx].PRODUCT_IMAGE_FILENAME;
    products[idx].PRICE_THB = PRICE_THB !== undefined ? String(PRICE_THB).trim() : products[idx].PRICE_THB;
    products[idx].TARGET_TAGS = TARGET_TAGS !== undefined ? String(TARGET_TAGS).trim() : products[idx].TARGET_TAGS;
    products[idx].IS_TOP_SELLER = IS_TOP_SELLER !== undefined ? String(IS_TOP_SELLER).trim() : products[idx].IS_TOP_SELLER;
    
    saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: products[idx] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update database.' });
  }
});

// DELETE /api/admin/product_matrix/:id
app.delete('/api/admin/product_matrix/:id', async (req, res) => {
  const { password } = req.query;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const newProducts = products.filter(p => p.PRODUCT_ID !== req.params.id);
    if (newProducts.length === products.length) return res.status(404).json({ error: 'Product not found.' });
    
    saveProductMatrixToCsvSync(newProducts);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});
`;

if (!content.includes('// --- ADMIN FEATURE: CRUD Operations on product_matrix.csv ---')) {
    content = content.replace('// --- ADMIN: View all orders ---', endpointsToAdd + '\n// --- ADMIN: View all orders ---');
}

fs.writeFileSync(path, content, 'utf8');

const emptyCsvPath = 'd:\\apaze\\Smartindoormap\\product_matrix.csv';
if (!fs.existsSync(emptyCsvPath)) {
    fs.writeFileSync(emptyCsvPath, 'PRODUCT_ID,STORE_ID,PRODUCT_NAME,PRODUCT_IMAGE_FILENAME,PRICE_THB,TARGET_TAGS,IS_TOP_SELLER\\nPROD_1,PANPURI,"Extract Perfume Oil","1783484420656-404489505.jpg","3000","best seller, fragrance","true"\\nPROD_2,PANPURI,"Lotus Defense Face Oil","1783484420656-404489505.jpg","2500","skincare, top rated","true"\\n', 'utf8');
}
