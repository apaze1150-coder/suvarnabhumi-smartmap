const fs = require('fs');

function checkFile(filename) {
    console.log('Checking ' + filename + '...');
    const html = fs.readFileSync(filename, 'utf8');
    const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    let foundMock = false;
    while ((match = regex.exec(html)) !== null) {
        const scriptContent = match[1];
        if (scriptContent.includes('const mock') || scriptContent.includes('let mock') || scriptContent.includes('var mock') || scriptContent.match(/(const|let|var)\s+[a-zA-Z_]+\s*=\s*\[\s*\{/)) {
            // Find snippet around the array
            const arrMatch = scriptContent.match(/(const|let|var)\s+([a-zA-Z_]+)\s*=\s*\[\s*\{/);
            if (arrMatch) {
                console.log('Possible mock array found: ' + arrMatch[2]);
                foundMock = true;
            }
        }
    }
    if(!foundMock) console.log('No obvious mock arrays found in ' + filename);
}

checkFile('store.html');
checkFile('smartmap.html');
