const express = require('express');
const router = express.Router();
const { readCsv, writeCsvGeneric, PRODUCT_MATRIX_CSV, PRODUCTS_CSV } = require('../services/dataService');
const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');
const db = require('../db');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '6515';

// GET /api/products - public, get all active products
router.get('/api/products', async (req, res) => {
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const filtered = products.filter(p => p.is_active !== 'false');
    const mappedProducts = filtered.map(p => ({
        ...p,
        product_id: p.Code || p.code || p.product_id, // fallback
        product_code: p.Code || p.code || p.product_code,
        product_name: p.Description || p.description || p.product_name,
        name: p.Description || p.description || p.name,
        description: p.Description || p.description,
        category: p.Category || p.category,
        sub_category: p['Sub-Category'] || p['sub-category'] || p.sub_category,
        scent: p.Scent || p.scent,
        price: p.Price || p.price,
        te3: p.Qty_Branch1 || p.qty_branch1,
        te1: p.Qty_Branch2 || p.qty_branch2,
        tw4: p.Qty_Branch3 || p.qty_branch3,
        qty_te3: p.Qty_Branch1 || p.qty_branch1 || p.qty_te3,
        qty_te1: p.Qty_Branch2 || p.qty_branch2 || p.qty_te1,
        qty_tw4: p.Qty_Branch3 || p.qty_branch3 || p.qty_tw4,
        image: p.Image || p.image,
        size: p.Size || p.size,
        Size: p.Size || p.size,
        description_customer: p.Description_Customer || p.description_customer,
        Description_Customer: p.Description_Customer || p.description_customer,
        scent_notes: p.Scent_Notes || p.scent_notes,
        Scent_Notes: p.Scent_Notes || p.scent_notes,
        how_to_use: p.How_to_Use || p.how_to_use,
        How_to_Use: p.How_to_Use || p.how_to_use,
        Scent: p.Scent || p.scent,
        is_active: p.is_active !== 'false' && p.is_active !== false
    }));
    res.json({ success: true, products: mappedProducts });
  } catch (err) {
    res.json({ success: false, error: err.message, products: [] });
  }
});

// --- ADMIN: PANPURI Products CRUD ---

router.get('/api/admin/products', async (req, res) => {
  const { password } = req.query;
  const storePws = ['6570', '6515', '6555'];
  if (password !== ADMIN_PASSWORD && !storePws.includes(password)) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const mappedProducts = products.map(p => ({
        ...p, // keep original keys like Code, Description, Qty_Branch1
        product_id: p.Code || p.code || p.product_id,
        product_code: p.Code || p.code || p.product_code,
        product_name: p.Description || p.description || p.product_name,
        name: p.Description || p.description || p.name,
        description: p.Description || p.description,
        category: p.Category || p.category,
        sub_category: p['Sub-Category'] || p['sub-category'] || p.sub_category,
        scent: p.Reference || p.reference || p.scent,
        price: p.Price || p.price,
        te3: p.Qty_Branch1 || p.qty_branch1,
        te1: p.Qty_Branch2 || p.qty_branch2,
        tw4: p.Qty_Branch3 || p.qty_branch3,
        qty_te3: p.Qty_Branch1 || p.qty_branch1 || p.qty_te3,
        qty_te1: p.Qty_Branch2 || p.qty_branch2 || p.qty_te1,
        qty_tw4: p.Qty_Branch3 || p.qty_branch3 || p.qty_tw4,
        image: p.Image || p.image,
        size: p.Size || p.size,
        Size: p.Size || p.size,
        // Fix: map Description_Customer, Scent_Notes, How_to_Use so frontend can read them
        description_customer: p.Description_Customer || p.description_customer || '',
        Description_Customer: p.Description_Customer || p.description_customer || '',
        scent_notes: p.Scent_Notes || p.scent_notes || '',
        Scent_Notes: p.Scent_Notes || p.scent_notes || '',
        how_to_use: p.How_to_Use || p.how_to_use || '',
        How_to_Use: p.How_to_Use || p.how_to_use || '',
        is_active: p.is_active !== 'false' && p.is_active !== false
    }));
    res.json(mappedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products
router.post('/api/admin/products', async (req, res) => {
  const { password, Code, Description, Reference, Category, 'Sub-Category': SubCategory, Scent, Price, Qty_Branch1, Qty_Branch2, Qty_Branch3, Image, Size, Description_Customer, Scent_Notes, How_to_Use } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    let products = [];
    try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    const newProduct = {
      Code: (Code || '').trim(),
      Description: (Description || '').trim(),
      Reference: (Reference || '').trim(),
      Category: (Category || '').trim(),
      'Sub-Category': (SubCategory || '').trim(),
      Price: (Price || '0').toString(),
      Image: (Image || '').trim(),
      Qty_Branch1: (Qty_Branch1 || '0').toString(),
      Qty_Branch2: (Qty_Branch2 || '0').toString(),
      Qty_Branch3: (Qty_Branch3 || '0').toString(),
      Size: (Size || '').trim(),
      Description_Customer: (Description_Customer || '').trim(),
      Scent_Notes: (Scent_Notes || '').trim(),
      How_to_Use: (How_to_Use || '').trim(),
      Scent: (Scent || '').trim()
    };
    products.push(newProduct);
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    console.log(`[Admin] Created product ${newProduct.Code}`);
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let productsLock = false;
async function withProductsLock(fn) {
    while (productsLock) {
        await new Promise(r => setTimeout(r, 50));
    }
    productsLock = true;
    try {
        return await fn();
    } finally {
        productsLock = false;
    }
}

router.post('/api/admin/products/batch-update', async (req, res) => {
  const { password, updates, insertAfterCode } = req.body;
  // Fix: require password always - reject if missing or wrong
  if (!password || password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'Invalid updates payload' });

  try {
    let updatedCount = 0;
    await withProductsLock(async () => {
      let products = [];
      try { products = await readCsv(PRODUCTS_CSV); } catch(e) {}
    
    let logs = [];
    if (fs.existsSync(STOCK_LOGS_CSV)) {
      logs = await readCsv(STOCK_LOGS_CSV);
    }
    
    let updatedCount = 0;
    
    // First, process updates to existing records
    for (const code of Object.keys(updates)) {
      const changes = updates[code];
      let idx = -1;
      
      if (changes._originalIndex !== undefined) {
        idx = parseInt(changes._originalIndex);
      } else {
        idx = products.findIndex(p => p.Code === code);
      }
      
      console.log(`Updating code=${code}, idx=${idx}, products[idx].Code=${products[idx] ? products[idx].Code : 'undef'}`);
      
      if (idx !== -1 && idx < products.length) {
        // Log stock changes
        const storesMap = { Qty_Branch1: 'te3', Qty_Branch2: 'te1', Qty_Branch3: 'tw4' };
        for (const [qtyField, frontendField] of Object.entries(storesMap)) {
          const changedVal = changes[qtyField] !== undefined ? changes[qtyField] : changes[frontendField];
          
          if (changedVal !== undefined) {
            const oldQty = parseInt(products[idx][qtyField] || 0);
            const newQty = parseInt(changedVal);
            if (!isNaN(newQty) && oldQty !== newQty) {
              const diff = newQty - oldQty;
              logs.push({
                log_id: 'TXN-' + Date.now() + Math.floor(Math.random()*1000),
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                performed_by: 'Global Admin',
                transaction_type: diff > 0 ? 'GOODS RECEIPT' : (diff < 0 && Math.abs(diff) > 10 ? 'STOCK TRANSFER OUT' : 'Adjustment'),
                ref_no: `ADJ-${Math.floor(Math.random()*10000)}`,
                product_code: products[idx].Code,
                product_name: products[idx].Description,
                qty: diff.toString()
              });
            }
            products[idx][qtyField] = newQty.toString();
          }
        }

        // Update existing product
        if (changes.Description !== undefined) products[idx].Description = changes.Description.trim();
        if (changes.product_name !== undefined) products[idx].Description = changes.product_name.trim();
        if (changes.name !== undefined) products[idx].Description = changes.name.trim();
        
        if (changes.Reference !== undefined) products[idx].Reference = changes.Reference.trim();
        if (changes.Scent !== undefined) products[idx].Scent = changes.Scent.trim();
        
        if (changes.Category !== undefined) products[idx].Category = changes.Category.trim();
        if (changes.category !== undefined) products[idx].Category = changes.category.trim();
        if (changes['Sub-Category'] !== undefined) products[idx]['Sub-Category'] = changes['Sub-Category'].trim();
        if (changes.sub_category !== undefined) products[idx]['Sub-Category'] = changes.sub_category.trim();
        if (changes.Size !== undefined) products[idx].Size = changes.Size.trim();
        if (changes.size !== undefined) products[idx].Size = changes.size.trim();
        if (changes.Price !== undefined) products[idx].Price = changes.Price.toString();
        if (changes.price !== undefined) products[idx].Price = changes.price.toString();
        
        if (changes.Image !== undefined) products[idx].Image = changes.Image.trim();
        if (changes.image !== undefined) products[idx].Image = changes.image.trim();
        if (changes.Description_Customer !== undefined) products[idx].Description_Customer = changes.Description_Customer.trim();
        if (changes.Scent_Notes !== undefined) products[idx].Scent_Notes = changes.Scent_Notes.trim();
        if (changes.How_to_Use !== undefined) products[idx].How_to_Use = changes.How_to_Use.trim();
        if (changes.Code !== undefined && changes.Code.trim() !== '') products[idx].Code = changes.Code.trim(); // Handle Code change itself if applicable
        updatedCount++;
      } else {
        // Handle inserts if product doesn't exist (bulk import often mixes updates/inserts)
        const newProduct = {
          Code: (changes.Code || code).trim(),
          Description: (changes.Description || changes.product_name || changes.name || '').trim(),
          Reference: (changes.Reference || '').trim(),
          Category: (changes.Category || changes.category || '').trim(),
          'Sub-Category': (changes['Sub-Category'] || changes.sub_category || '').trim(),
          Scent: (changes.Scent || changes.scent || '').trim(),
          Price: (changes.Price || changes.price || '0').toString(),
          Image: (changes.Image || changes.image || '').trim(),
          Qty_Branch1: (changes.Qty_Branch1 || changes.te3 || '0').toString(),
          Qty_Branch2: (changes.Qty_Branch2 || changes.te1 || '0').toString(),
          Qty_Branch3: (changes.Qty_Branch3 || changes.tw4 || '0').toString(),
          Size: (changes.Size || changes.size || '').trim(),
          Description_Customer: (changes.Description_Customer || '').trim(),
          Scent_Notes: (changes.Scent_Notes || '').trim(),
          How_to_Use: (changes.How_to_Use || '').trim()
        };
        
        if (insertAfterCode) {
            const afterIdx = products.findIndex(p => p.Code === insertAfterCode);
            if (afterIdx !== -1) {
                products.splice(afterIdx + 1, 0, newProduct);
            } else {
                products.push(newProduct);
            }
        } else {
            products.push(newProduct);
        }
        updatedCount++;
      }
    }
    
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    await writeCsvGeneric(STOCK_LOGS_CSV, logs, STOCK_LOG_HEADERS);
    }); // end withProductsLock
    console.log(`[Admin] Batch updated ${updatedCount} products`);
    res.json({ success: true, updatedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products/reorder
router.post('/api/admin/products/reorder', async (req, res) => {
  const { password, orderedCodes } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  if (!orderedCodes || !Array.isArray(orderedCodes)) return res.status(400).json({ error: 'Invalid payload' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const newProducts = [];
    const prodMap = new Map();
    products.forEach(p => prodMap.set(p.Code, p));
    
    // Add in specified order
    orderedCodes.forEach(code => {
      if (prodMap.has(code)) {
        newProducts.push(prodMap.get(code));
        prodMap.delete(code);
      }
    });
    // Add any remaining products that weren't in the ordered list
    prodMap.forEach(p => newProducts.push(p));
    
    await writeCsvGeneric(PRODUCTS_CSV, newProducts, PRODUCT_HEADERS);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/api/admin/products/:Code', async (req, res) => {
  const { password, Description, Reference, Category, 'Sub-Category': SubCategory, Scent, Price, Qty_Branch1, Qty_Branch2, Qty_Branch3, Image, Size, Description_Customer, Scent_Notes, How_to_Use } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const idx = products.findIndex(p => p.Code === req.params.Code);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    if (Description !== undefined) products[idx].Description = Description.trim();
    if (Reference !== undefined) products[idx].Reference = Reference.trim();
    if (Category !== undefined) products[idx].Category = Category.trim();
    if (SubCategory !== undefined) products[idx]['Sub-Category'] = SubCategory.trim();
    if (Scent !== undefined) products[idx].Scent = Scent.trim();
    if (Price !== undefined) products[idx].Price = Price.toString();
    if (Qty_Branch1 !== undefined) products[idx].Qty_Branch1 = Qty_Branch1.toString();
    if (Qty_Branch2 !== undefined) products[idx].Qty_Branch2 = Qty_Branch2.toString();
    if (Qty_Branch3 !== undefined) products[idx].Qty_Branch3 = Qty_Branch3.toString();
    if (Image !== undefined) products[idx].Image = Image.trim();
    if (Size !== undefined) products[idx].Size = Size.trim();
    if (Description_Customer !== undefined) products[idx].Description_Customer = Description_Customer.trim();
    if (Scent_Notes !== undefined) products[idx].Scent_Notes = Scent_Notes.trim();
    if (How_to_Use !== undefined) products[idx].How_to_Use = How_to_Use.trim();
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    res.json({ success: true, product: products[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/products/:product_id
router.delete('/api/admin/products/:Code', async (req, res) => {
  const password = req.body?.password || req.query?.password;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const products = await readCsv(PRODUCTS_CSV);
    const idx = products.findIndex(p => String(p.Code).trim() === String(req.params.Code).trim());
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    products.splice(idx, 1);
    await writeCsvGeneric(PRODUCTS_CSV, products, PRODUCT_HEADERS);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products/upload-image - Upload product image
router.post('/api/admin/products/upload-image', upload.single('image'), (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(403).json({ success: false, error: 'Invalid password' });
  }
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image provided' });
  }

  // Construct URL path
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});


// --- ADMIN FEATURE: CRUD Operations on product_matrix.csv ---

async function saveProductMatrixToCsvSync(products) {
  const headersArr = ['PRODUCT_ID','SHOP_NUMBER','PRODUCT_NAME','PRODUCT_IMAGE_FILENAME','PRICE_THB','TARGET_TAGS','IS_TOP_SELLER'];
  const headers = headersArr.join(',') + '\n';
  const rows = products.map(p => {
    const escape = (val) => {
      if (val === undefined || val === null) return '""';
      let str = val.toString().replace(/"/g, '""');
      return `"${str}"`;
    };
    return `${escape(p.PRODUCT_ID)},${escape(p.SHOP_NUMBER)},${escape(p.PRODUCT_NAME)},${escape(p.PRODUCT_IMAGE_FILENAME)},${escape(p.PRICE_THB)},${escape(p.TARGET_TAGS)},${escape(p.IS_TOP_SELLER)}`;
  }).join('\n');
  fs.writeFileSync(PRODUCT_MATRIX_CSV, headers + rows, 'utf8');
  await writeCsvGeneric(PRODUCT_MATRIX_CSV, products, headersArr);
}

// GET /api/admin/product_matrix
router.get('/api/admin/product_matrix', async (req, res) => {
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
router.post('/api/admin/product_matrix', async (req, res) => {
  const { password, PRODUCT_ID, SHOP_NUMBER, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
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
      SHOP_NUMBER: (SHOP_NUMBER || '').trim(),
      PRODUCT_NAME: (PRODUCT_NAME || '').trim(),
      PRODUCT_IMAGE_FILENAME: (PRODUCT_IMAGE_FILENAME || '').trim(),
      PRICE_THB: (PRICE_THB || '').trim(),
      TARGET_TAGS: (TARGET_TAGS || '').trim(),
      IS_TOP_SELLER: (IS_TOP_SELLER || 'false').trim()
    };
    products.push(newProd);
    await saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: newProd });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save database.' });
  }
});

// PUT /api/admin/product_matrix/:id
router.put('/api/admin/product_matrix/:id', async (req, res) => {
  const { password, PRODUCT_ID, SHOP_NUMBER, PRODUCT_NAME, PRODUCT_IMAGE_FILENAME, PRICE_THB, TARGET_TAGS, IS_TOP_SELLER } = req.body;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const idx = products.findIndex(p => p.PRODUCT_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found.' });
    
    products[idx].PRODUCT_ID = PRODUCT_ID !== undefined ? String(PRODUCT_ID).trim() : products[idx].PRODUCT_ID;
    products[idx].SHOP_NUMBER = SHOP_NUMBER !== undefined ? String(SHOP_NUMBER).trim() : products[idx].SHOP_NUMBER;
    products[idx].PRODUCT_NAME = PRODUCT_NAME !== undefined ? String(PRODUCT_NAME).trim() : products[idx].PRODUCT_NAME;
    products[idx].PRODUCT_IMAGE_FILENAME = PRODUCT_IMAGE_FILENAME !== undefined ? String(PRODUCT_IMAGE_FILENAME).trim() : products[idx].PRODUCT_IMAGE_FILENAME;
    products[idx].PRICE_THB = PRICE_THB !== undefined ? String(PRICE_THB).trim() : products[idx].PRICE_THB;
    products[idx].TARGET_TAGS = TARGET_TAGS !== undefined ? String(TARGET_TAGS).trim() : products[idx].TARGET_TAGS;
    products[idx].IS_TOP_SELLER = IS_TOP_SELLER !== undefined ? String(IS_TOP_SELLER).trim() : products[idx].IS_TOP_SELLER;
    
    await saveProductMatrixToCsvSync(products);
    return res.json({ success: true, product: products[idx] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update database.' });
  }
});

// DELETE /api/admin/product_matrix/:id
router.delete('/api/admin/product_matrix/:id', async (req, res) => {
  const password = req.body?.password || req.query?.password;
  if (password !== '6515') return res.status(403).json({ error: 'Unauthorized: Invalid password.' });
  try {
    if (!fs.existsSync(PRODUCT_MATRIX_CSV)) return res.status(404).json({ error: 'No products found.' });
    let products = await readCsv(PRODUCT_MATRIX_CSV);
    const idx = products.findIndex(p => p.PRODUCT_ID === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found.' });
    
    products.splice(idx, 1);
    await saveProductMatrixToCsvSync(products);
    
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});


// Temporary debug route
router.get('/api/debug/db', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM panpuri_products ORDER BY sort_order ASC NULLS LAST');
        res.json({ success: true, count: result.rows.length, rows: result.rows.slice(0, 1) });
    } catch(e) {
        try {
            const result2 = await db.query('SELECT * FROM panpuri_products');
            res.json({ success: true, warning: 'Failed with sort_order, but works without it', error: e.message, count: result2.rows.length });
        } catch(e2) {
            res.json({ success: false, error: e2.message });
        }
    }
});

const XLSX = require('xlsx');
const multer = require('multer');

const excelUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed.'), false);
    }
  }
});

router.post('/api/admin/sap-stock-import', excelUpload.single('file'), async (req, res) => {
  const { password } = req.body;
  const storePws = ['6570', '6515', '6555'];
  if (password !== ADMIN_PASSWORD && !storePws.includes(password)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Create table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
          code TEXT PRIMARY KEY,
          description TEXT,
          category TEXT,
          reference TEXT,
          price NUMERIC,
          stock_3630 INTEGER DEFAULT 0,
          stock_3632 INTEGER DEFAULT 0,
          stock_3651 INTEGER DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });

    let currentCategory = '';
    const itemsToUpsert = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const firstCol = String(row[0] || '').trim();
      
      if (firstCol.startsWith('CATE :')) {
        currentCategory = firstCol.replace('CATE :', '').trim();
        continue;
      }

      // Check if code is a 7-digit number
      if (/^\d{7}$/.test(firstCol)) {
        const code = firstCol;
        const description = String(row[3] || '').trim();
        const reference = String(row[14] || '').trim();
        const priceStr = String(row[18] || '').replace(/,/g, '');
        const price = parseFloat(priceStr) || 0;
        
        const stock_3630 = parseInt(String(row[20] || '0').replace(/,/g, ''), 10) || 0;
        const stock_3632 = parseInt(String(row[22] || '0').replace(/,/g, ''), 10) || 0;
        const stock_3651 = parseInt(String(row[24] || '0').replace(/,/g, ''), 10) || 0;

        itemsToUpsert.push({
          code,
          description,
          category: currentCategory,
          reference,
          price,
          stock_3630,
          stock_3632,
          stock_3651
        });
      }
    }

    if (itemsToUpsert.length === 0) {
      return res.json({ success: true, count: 0, message: 'No products found to update.' });
    }

    // Upsert to Supabase in batches
    const BATCH_SIZE = 200;
    for (let i = 0; i < itemsToUpsert.length; i += BATCH_SIZE) {
      const batch = itemsToUpsert.slice(i, i + BATCH_SIZE);
      
      const values = [];
      const queryStrParts = [];
      
      batch.forEach((item, index) => {
        const offset = index * 8;
        queryStrParts.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, NOW())`);
        values.push(item.code, item.description, item.category, item.reference, item.price, item.stock_3630, item.stock_3632, item.stock_3651);
      });

      const upsertQuery = `
        INSERT INTO products (code, description, category, reference, price, stock_3630, stock_3632, stock_3651, updated_at)
        VALUES ${queryStrParts.join(', ')}
        ON CONFLICT (code) DO UPDATE SET
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          reference = EXCLUDED.reference,
          price = EXCLUDED.price,
          stock_3630 = EXCLUDED.stock_3630,
          stock_3632 = EXCLUDED.stock_3632,
          stock_3651 = EXCLUDED.stock_3651,
          updated_at = NOW();
      `;
      
      await db.query(upsertQuery, values);
    }

    res.json({ success: true, count: itemsToUpsert.length, message: `อัปเดตสำเร็จทั้งหมด ${itemsToUpsert.length} รายการ (จุด 3630, 3632, 3651)` });
  } catch (error) {
    console.error('SAP Import Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
