const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const regex = /async function cancelCustomerOrder\(orderNum\) \{\s*if\(!confirm\('Are you sure you want to cancel this order\?'\)\) return;\s*try \{\s*const res = await fetch\(`\/api\/orders\/customer-cancel\/\$\{orderNum\}`\, \{ method: 'POST' \}\);\s*const data = await res\.json\(\);\s*if\(data\.success\) \{\s*alert\('Order cancelled successfully'\);\s*trackOrder\(\);\s*\} else \{\s*alert\(data\.error \|\| 'Unable to cancel'\);\s*\}\s*\} catch\(e\) \{\s*alert\('Unable to connect to server'\);\s*\}\s*\}/;

if (regex.test(c)) {
    c = c.replace(regex, '');
    fs.writeFileSync('index.html', c);
    console.log('Removed duplicate successfully.');
} else {
    console.log('Regex did not match.');
}
