const fs = require('fs');
const lines = fs.readFileSync('server.js', 'utf8').split('\n');

function getLines(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

// 1. middlewares/rateLimiter.js
const rateLimiterCode = `const rateLimit = require('express-rate-limit');

${getLines(38, 53)}

module.exports = { apiLimiter, authLimiter };
`;
fs.writeFileSync('middlewares/rateLimiter.js', rateLimiterCode);

// 2. middlewares/upload.js
const uploadCode = `const multer = require('multer');
const path = require('path');
const fs = require('fs');

${getLines(60, 82)}

module.exports = upload;
`;
fs.writeFileSync('middlewares/upload.js', uploadCode);

console.log("Middlewares extracted.");
