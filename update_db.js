const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  for (let i = 2; i <= 9; i++) {
    const nodeId = 'Node_Gate_C' + i;
    const res = await client.query('UPDATE airport_map_nodes SET connections = $1 WHERE node_id = $2', ['Node_Concourse_C:100', nodeId]);
    console.log('Updated ' + nodeId + ':', res.rowCount);
  }
  await client.end();
}
run().catch(console.error);
