const express = require('express');
const router = express.Router();
const path = require('path');

// Serve index.html at root
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve index.html at /index.html as well
router.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve admin.html at /admin
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

// Serve store.html at /store
router.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, '../store.html'));
});

// Serve PANPURI Admin Dashboard at /panpuri-admin
router.get('/panpuri-admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../panpuri_admin.html'));
});

// Serve store_directory.html
router.get('/store_directory.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../store_directory.html'));
});
router.get('/store_directory', (req, res) => {
  res.sendFile(path.join(__dirname, '../store_directory.html'));
});

const fs = require('fs');
const { readCsv, STORE_CSV } = require('../services/dataService');

// Serve store_selection.html with dynamic SSR image replacement to eliminate any flash of old images!
async function serveStoreSelection(req, res) {
  try {
    let html = fs.readFileSync(path.join(__dirname, '../store_selection.html'), 'utf8');
    const stores = await readCsv(STORE_CSV);
    if (Array.isArray(stores)) {
      stores.forEach(s => {
        const sId = (s.shop_number || s.store_id || '').trim();
        if (!sId || !s.shop_image) return;
        const imagePath = (s.shop_image.startsWith('http://') || s.shop_image.startsWith('https://'))
          ? s.shop_image
          : (s.shop_image.startsWith('/') ? s.shop_image : (s.shop_image.startsWith('uploads/') ? '/' + s.shop_image : '/uploads/' + s.shop_image));
        
        // Replace src on <img id="img-TE1" ... src="..." ...>
        const regex = new RegExp(`(<img[^>]*id=["']img-${sId}["'][^>]*src=["'])[^"']*`, 'i');
        html = html.replace(regex, `$1${imagePath}`);
      });
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(html);
  } catch (err) {
    console.error('Error serving store_selection:', err);
    return res.sendFile(path.join(__dirname, '../store_selection.html'));
  }
}

// Serve store_selection.html
router.get('/store_selection.html', serveStoreSelection);
router.get('/store_selection', serveStoreSelection);

module.exports = router;
