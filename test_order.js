require('dotenv').config();
const db = require('./db');

async function writeCsvGeneric(table, rows, headers) {
  try {
    await db.query('TRUNCATE ' + table);
    if (!rows || rows.length === 0) return;
    const cols = headers.map(h => '"' + h + '"').join(', ');
    for (let row of rows) {
      let vals = headers.map(h => {
        if (h === 'items_json' && typeof row[h] === 'string') return row[h];
        if (h === 'items_json' && typeof row[h] === 'object') return JSON.stringify(row[h]);
        return row[h] !== undefined ? row[h] : null;
      });
      let placeholders = headers.map((_, i) => '$' + (i+1)).join(', ');
      await db.query('INSERT INTO ' + table + ' (' + cols + ') VALUES (' + placeholders + ')', vals);
    }
    console.log("Write success!");
  } catch(e) { 
    console.error('Error writing to table ' + table, e); 
  }
}

async function test() {
    try {
        const res = await db.query('SELECT * FROM panpuri_orders');
        let orders = res.rows;
        const newOrder = {
            order_id: 'ORD-' + Date.now(),
            order_number: 'KP-2026-TEST',
            store_id: 'DE40',
            customer_name: 'Test',
            flight_number: 'TG123',
            items_json: JSON.stringify([{product_id: 'test', qty: 1, price: '100'}]),
            total_price: '100.00',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            staff_note: ''
        };
        orders.push(newOrder);
        
        const ORDER_HEADERS = ['order_id','order_number','store_id','customer_name','flight_number','items_json','total_price','status','created_at','updated_at','staff_note'];
        await writeCsvGeneric('panpuri_orders', orders, ORDER_HEADERS);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
