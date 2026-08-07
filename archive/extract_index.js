const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const scripts = [...content.matchAll(/<script>([\s\S]*?)<\/script>/g)];
scripts.forEach((s, i) => {
    fs.writeFileSync('temp_index_script_' + i + '.js', s[1]);
});
