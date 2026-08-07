const fs = require('fs');
const html = fs.readFileSync('smartmap.html', 'utf8');

const scriptContentMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
if (scriptContentMatch) {
    scriptContentMatch.forEach((scriptTag, index) => {
        let innerCode = scriptTag.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        try {
            // Test parsing
            new Function(innerCode);
            console.log(`Script block ${index} parses successfully.`);
        } catch (e) {
            // Ignore tailwind config which is not valid JS out of context, just JSON-like
            if (!innerCode.includes('tailwind.config =')) {
                console.log(`Script block ${index} failed to parse:`, e.message);
            }
        }
    });
}
