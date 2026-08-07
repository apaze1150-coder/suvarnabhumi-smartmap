const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  const results = [];
  
  fs.createReadStream(path.join(__dirname, 'panpuri_orders.csv'))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Found ${results.length} orders in CSV.`);
      
      try {
        if (results.length > 0) {
          const headers = Object.keys(results[0]);
          
          await client.query('TRUNCATE panpuri_orders');

          const cols = headers.map(h => '"' + h + '"').join(', ');
          
          for (let row of results) {
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
    });
}

run();
