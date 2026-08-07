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

// Serve store_selection.html
router.get('/store_selection.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../store_selection.html'));
});
router.get('/store_selection', (req, res) => {
  res.sendFile(path.join(__dirname, '../store_selection.html'));
});

module.exports = router;
