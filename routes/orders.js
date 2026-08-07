const path = require('path');
const express = require('express');
const router = express.Router();
const { readCsv, writeCsvGeneric } = require('../services/dataService');
const db = require('../db');


router.post('/api/orders', async (req, res) => {
  try {
    const { store_id, customer_name, flight_number, items } = req.body;

    if (!store_id || !customer_name || !flight_number || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Missing required fields: store_id, customer_name, flight_number, items' });
    }

    // Check if store is accepting orders
    const settings = getStoreSettings();
    if (settings[store_id] && settings[store_id].accepting_orders === false) {
      return res.json({ success: false, error: 'ขณะนี้ร้านค้านี้ปิดรับ Order ชั่วคราว กรุณาลองใหม่ภายหลัง' });
    }

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }

    const orderId = `ORD-${Date.now()}`;
    const orderNumber = `KP-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);

    const newOrder = {
      order_id: orderId,
      order_number: orderNumber,
      store_id: store_id,
      customer_name: customer_name.trim(),
      flight_number: flight_number.trim().toUpperCase(),
      items_json: JSON.stringify(items),
      total_price: total.toFixed(2),
      status: 'pending',
      created_at: now,
      updated_at: now,
      staff_note: ''
    };

    orders.push(newOrder);
    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    console.log(`[Order] New order ${orderNumber} from ${customer_name} (${flight_number}) at store ${store_id}`);

    res.json({ success: true, order_number: orderNumber, order_id: orderId, total: total.toFixed(2) });
  } catch (err) {
    console.error('[Order] Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/track/:order_number - customer track order
router.get('/api/orders/track/:order_number', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }
    const order = orders.find(o => o.order_number === req.params.order_number);
    if (!order) return res.json({ success: false, error: 'ไม่พบหมายเลข Order นี้' });
    let itemsParsed = [];
    try { itemsParsed = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : (order.items_json || []); } catch(e) {}
    res.json({ success: true, order: { ...order, items: itemsParsed } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/customer-cancel/:order_number - customer cancels their own order
router.post('/api/orders/customer-cancel/:order_number', async (req, res) => {
  try {
    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { return res.json({ success: false, error: 'No orders found' }); }
    
    const idx = orders.findIndex(o => o.order_number === req.params.order_number);
    if (idx === -1) return res.json({ success: false, error: 'ไม่พบหมายเลข Order นี้' });
    
    if (orders[idx].status !== 'pending') {
      return res.json({ success: false, error: 'ไม่สามารถยกเลิกได้ (รับเรื่องหรือเตรียมของแล้ว)' });
    }
    
    orders[idx].status = 'cancelled';
    orders[idx].updated_at = new Date().toISOString();
    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    
    console.log(`[Order] ${orders[idx].order_number} status → cancelled (by customer)`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders - staff/admin get all orders for their store
router.get('/api/orders', async (req, res) => {
  try {
    const { store_id, password } = req.query;
    let authorized = false;
    if (password === ADMIN_PASSWORD) authorized = true;
    if (store_id && STORE_CREDENTIALS[store_id] && STORE_CREDENTIALS[store_id] === password) authorized = true;
    if (!authorized) return res.status(403).json({ success: false, error: 'Unauthorized' });

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { orders = []; }

    // Staff only sees their store's orders; admin sees all (unless they specify a store)
    const filtered = store_id
      ? orders.filter(o => o.store_id === store_id)
      : orders;

    // Parse items and reverse (newest first)
    const result = filtered.map(o => {
      let items = [];
      try { items = typeof o.items_json === 'string' ? JSON.parse(o.items_json) : (o.items_json || []); } catch(e) {}
      return { ...o, items };
    }).reverse();

    // Calculate total sales for all stores for Store Comparison
    const storeSales = {};
    orders.forEach(o => {
        if (o.status === 'cancelled') return;
        const sid = o.store_id;
        if (!storeSales[sid]) storeSales[sid] = 0;
        storeSales[sid] += parseFloat(o.total_price || 0);
    });

    res.json({ success: true, orders: result, storeSales: storeSales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:order_id - staff updates order status
router.put('/api/orders/:order_id', async (req, res) => {
  try {
    const { store_id, password, status, staff_note } = req.body;
    let authorized = false;
    if (password === ADMIN_PASSWORD) authorized = true;
    if (store_id && STORE_CREDENTIALS[store_id] && STORE_CREDENTIALS[store_id] === password) authorized = true;
    if (!authorized) return res.status(403).json({ success: false, error: 'Unauthorized' });

    let orders = [];
    try { orders = await readCsv(ORDERS_CSV); } catch(e) { return res.json({ success: false, error: 'No orders found' }); }

    const idx = orders.findIndex(o => o.order_id === req.params.order_id);
    if (idx === -1) return res.json({ success: false, error: 'Order not found' });

    const validStatuses = ['pending','confirmed','preparing','ready','cancelled','out_of_stock'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    orders[idx].status = status;
    orders[idx].updated_at = new Date().toISOString();
    if (staff_note !== undefined) orders[idx].staff_note = staff_note.toString().trim();

    await writeCsvGeneric(ORDERS_CSV, orders, ORDER_HEADERS);
    console.log(`[Order] ${orders[idx].order_number} status → ${status}`);

    let itemsParsed = [];
    try { itemsParsed = typeof orders[idx].items_json === 'string' ? JSON.parse(orders[idx].items_json) : (orders[idx].items_json || []); } catch(e) {}
    res.json({ success: true, order: { ...orders[idx], items: itemsParsed } });
  } catch (err) {
    console.error('[Order] Error updating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;

