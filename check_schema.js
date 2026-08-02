const db = require('./db');
require('dotenv').config();

async function main() {
  try {
    const r = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'panpuri_products' ORDER BY ordinal_position");
    console.log(JSON.stringify(r.rows, null, 2));
  } catch(e) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}
main();
