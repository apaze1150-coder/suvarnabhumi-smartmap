const http = require('http');

const data = JSON.stringify({ query: 'DE12', from_node: 'Node_Intersection_D' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/search-store',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.write(data);
req.end();
