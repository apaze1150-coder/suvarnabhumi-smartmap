const fs = require('fs');
const content = fs.readFileSync('panpuri_admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('class="spa-view')) console.log(i + 1, l.trim());
});
