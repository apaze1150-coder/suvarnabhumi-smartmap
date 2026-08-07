const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const res = await client.query("SELECT node_id, name, connections FROM airport_map_nodes WHERE node_id LIKE 'Node_Gate_C%'");
  console.table(res.rows);
  await client.end();
}
run().catch(console.error);
