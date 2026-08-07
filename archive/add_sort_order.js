const db = require('./db');

async function main() {
  try {
    // Add sort_order column if not exists
    await db.query(`
      ALTER TABLE panpuri_products 
      ADD COLUMN IF NOT EXISTS sort_order SERIAL
    `);
    console.log('sort_order column added (or already exists).');
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
main();
