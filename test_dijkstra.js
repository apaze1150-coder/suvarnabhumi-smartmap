const fs = require('fs');
const csv = require('csv-parser');
const graph = {};
fs.createReadStream('airport_map_nodes.csv')
  .pipe(csv())
  .on('data', (n) => {
    const nodeId = n.node_id.trim();
    graph[nodeId] = { node_id: nodeId, neighbors: {} };
  })
  .on('end', () => {
    fs.createReadStream('airport_map_nodes.csv')
      .pipe(csv())
      .on('data', (n) => {
        const nodeId = n.node_id.trim();
        const connStr = n.connections || '';
        if (connStr.trim()) {
          const parts = connStr.split(';');
          parts.forEach(p => {
            const [targetNode, distStr] = p.split(':');
            if (targetNode && distStr && graph[targetNode.trim()]) {
              const distance = parseInt(distStr.trim(), 10);
              graph[nodeId].neighbors[targetNode.trim()] = distance;
              graph[targetNode.trim()].neighbors[nodeId] = distance;
            }
          });
        }
      })
      .on('end', () => {
        console.log('Graph loaded. Checking path...');
        console.log('Node_Gate_C7 neighbors:', graph['Node_Gate_C7']?.neighbors);
        console.log('Node_Concourse_C neighbors:', graph['Node_Concourse_C']?.neighbors);
        console.log('Node_Intersection_ABC neighbors:', graph['Node_Intersection_ABC']?.neighbors);
        console.log('Node_Concourse_D_West neighbors:', graph['Node_Concourse_D_West']?.neighbors);
        console.log('Node_Intersection_D neighbors:', graph['Node_Intersection_D']?.neighbors);
        console.log('Node_Passport_Control neighbors:', graph['Node_Passport_Control']?.neighbors);
      });
  });
