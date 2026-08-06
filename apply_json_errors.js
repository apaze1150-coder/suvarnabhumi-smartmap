const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');
const target = \// Serve index.html at root\;
const insert = \// GLOBAL API 404 HANDLER
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found: ' + req.method + ' ' + req.originalUrl });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Internal Server Error' });
  } else {
    next(err);
  }
});

// Serve index.html at root\;
content = content.replace(target, insert);
fs.writeFileSync('server.js', content);
console.log('done server.js');
