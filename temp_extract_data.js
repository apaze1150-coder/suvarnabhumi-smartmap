const fs = require('fs');
const lines = fs.readFileSync('server.old.js', 'utf8').split('\n');
function getLines(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

const dataServiceCode = `const db = require('../db');
const path = require('path');
const fs = require('fs');

const WALK_TIME_CSV = path.join(__dirname, '../walk_time_matrix.csv');
const STORE_CSV = path.join(__dirname, '../store_matrix.csv');
const MAP_NODES_CSV = path.join(__dirname, '../airport_map_nodes.csv');
const PRODUCT_MATRIX_CSV = path.join(__dirname, '../product_matrix.csv');

${getLines(142, 175)}

${getLines(1530, 1611)}

module.exports = { readCsv, hashString, writeCsvGeneric, WALK_TIME_CSV, STORE_CSV, MAP_NODES_CSV, PRODUCT_MATRIX_CSV };
`;

fs.writeFileSync('services/dataService.js', dataServiceCode);
console.log('dataService.js extracted');
