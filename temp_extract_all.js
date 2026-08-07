const fs = require('fs');
const lines = fs.readFileSync('server.js', 'utf8').split('\n');

function getLines(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

function writeRoute(filename, start, end, extraImports = '') {
    const code = `const express = require('express');
const router = express.Router();
${extraImports}

${getLines(start, end).replace(/app\.(get|post|put|delete)\(/g, 'router.$1(')}

module.exports = router;
`;
    fs.writeFileSync(filename, code);
}

// 1. Flights
writeRoute('routes/flights.js', 342, 722, "const axios = require('axios');\nconst cheerio = require('cheerio');\n");
// Note: Includes resolveGateToNode, getZoneFromGate, mapIataToIcao, scrapeFlightAwareData, and the route.

// 2. Navigation
// Includes navigation route and dijkstra logic.
writeRoute('routes/navigation.js', 176, 341, "const { readCsv, MAP_NODES_CSV, STORE_CSV } = require('../services/dataService');\n");
// Wait, dijkstra and loadNavigationGraph should probably be in a service, but let's just dump it in the route for now to make it work, or append the route lines.
const navCode = `const express = require('express');
const router = express.Router();
const { readCsv, MAP_NODES_CSV, STORE_CSV } = require('../services/dataService');

${getLines(176, 341)}

${getLines(1032, 1099).replace(/app\.get\(/g, 'router.get(')}

${getLines(1269, 1306).replace(/app\.get\(/g, 'router.get(')}

module.exports = router;
`;
fs.writeFileSync('routes/navigation.js', navCode);

// 3. Stores
writeRoute('routes/stores.js', 1100, 1268, "const { readCsv, STORE_CSV } = require('../services/dataService');\nconst upload = require('../middlewares/upload');\nconst fs = require('fs');\nconst path = require('path');\nconst db = require('../db');\n");

// 4. Nodes
writeRoute('routes/nodes.js', 1307, 1415, "const { readCsv, MAP_NODES_CSV } = require('../services/dataService');\nconst fs = require('fs');\nconst db = require('../db');\n");

// 5. Dashboard
writeRoute('routes/dashboard.js', 1416, 1529, "const { readCsv } = require('../services/dataService');\nconst db = require('../db');\n");

// 6. Orders
writeRoute('routes/orders.js', 1697, 1857, "const { readCsv, writeCsvGeneric } = require('../services/dataService');\nconst db = require('../db');\n");

// 7. Products
writeRoute('routes/products.js', 1858, 2262, "const { readCsv, writeCsvGeneric, PRODUCT_MATRIX_CSV } = require('../services/dataService');\nconst upload = require('../middlewares/upload');\nconst fs = require('fs');\nconst path = require('path');\nconst db = require('../db');\n");

// 8. Stock
writeRoute('routes/stock.js', 2263, 2378, "const { readCsv, writeCsvGeneric } = require('../services/dataService');\nconst db = require('../db');\n");

// 9. Store Settings (1612-1696)
writeRoute('routes/storeSettings.js', 1612, 1696, "const { readCsv } = require('../services/dataService');\nconst fs = require('fs');\nconst path = require('path');\nconst db = require('../db');\n");


console.log('Routes extracted successfully.');
