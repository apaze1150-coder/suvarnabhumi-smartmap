const fs = require('fs');
const content = fs.readFileSync('store_selection.html', 'utf8');
const scripts = [...content.matchAll(/<script>([\s\S]*?)<\/script>/g)];
scripts.forEach((s, i) => {
    fs.writeFileSync('store_script_' + i + '.js', s[1]);
});
