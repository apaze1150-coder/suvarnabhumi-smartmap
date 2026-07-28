const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

const tableMapRegex = /const tableMap = \{.*?\};/s;
const tableMapNew = `let table = null;
  if (filePath.includes('walk_time_matrix')) table = 'walk_time_matrix';
  else if (filePath.includes('store_matrix')) table = 'store_matrix';
  else if (filePath.includes('airport_map_nodes')) table = 'airport_map_nodes';
  else if (filePath.includes('product_matrix')) table = 'product_matrix';
  else if (filePath.includes('panpuri_products')) table = 'panpuri_products';
  else if (filePath.includes('panpuri_orders')) table = 'panpuri_orders';
  else if (filePath.includes('panpuri_stock_logs')) table = 'panpuri_stock_logs';
  else if (filePath.includes('panpuri_spa_reservations')) table = 'panpuri_spa_reservations';
  else if (filePath.includes('flight_matrix')) table = 'flight_matrix';`;

s = s.replace(tableMapRegex, tableMapNew);
s = s.replace(tableMapRegex, tableMapNew); // In case it appears twice (readCsv and writeCsvGeneric)
s = s.replace(/const table = tableMap\[filePath\];/g, '');

fs.writeFileSync('server.js', s);
console.log('Fixed TDZ issue');
