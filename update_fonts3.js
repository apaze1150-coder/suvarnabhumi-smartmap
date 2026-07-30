const fs = require('fs');
let html = fs.readFileSync('smartmap.html', 'utf8');
if (!html.includes('family=Noto+Sans+SC')) {
  html = html.replace('<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined', '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />\n    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
  fs.writeFileSync('smartmap.html', html);
  console.log('Link added');
}
