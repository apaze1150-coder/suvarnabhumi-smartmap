const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    const res = await client.query("SELECT * FROM panpuri_orders WHERE order_number = 'KP-2026-0001'");
    console.log("Order from DB:", res.rows);
    const all = await client.query("SELECT order_number FROM panpuri_orders");
    console.log("All orders in DB:", all.rows);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
