const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    const csvData = fs.readFileSync(path.join(__dirname, 'panpuri_orders.csv'), 'utf8');
    const records = parse(csvData, { columns: true, skip_empty_lines: true });

    console.log(`Found ${records.length} orders in CSV.`);

    if (records.length > 0) {
      const headers = Object.keys(records[0]);
      
      // We will do TRUNCATE just like server.js to reset it
      await client.query('TRUNCATE panpuri_orders');

      const cols = headers.map(h => '"' + h + '"').join(', ');
      
      for (let row of records) {
        let vals = headers.map(h => {
          if (h === 'items_json' && typeof row[h] === 'string') return row[h];
          if (h === 'items_json' && typeof row[h] === 'object') return JSON.stringify(row[h]);
          return String(row[h]);
        });
        
        let placeholders = headers.map((_, i) => '$' + (i + 1)).join(', ');
        await client.query(`INSERT INTO panpuri_orders (${cols}) VALUES (${placeholders})`, vals);
      }
      
      console.log('Successfully seeded panpuri_orders into Postgres!');
    }
  } catch (err) {
    console.error("Error seeding DB:", err);
  } finally {
    await client.end();
  }
}

run();
