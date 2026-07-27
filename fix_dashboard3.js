const fs = require('fs');
const path = require('path');

const storeHtmlPath = path.join(__dirname, 'store.html');
let content = fs.readFileSync(storeHtmlPath, 'utf8');

// The function I accidentally appended after </html>
const funcStart = content.indexOf('\nfunction updateDashboardInsights() {');
if (funcStart > -1) {
    const funcStr = content.substring(funcStart).trim();
    
    // Remove it from the end of the file
    content = content.substring(0, funcStart).trim();
    
    // Find the last </script> tag, because it should be inside the script tag
    const scriptEnd = content.lastIndexOf('</script>');
    
    if (scriptEnd > -1) {
        // Insert it right before </script>
        content = content.substring(0, scriptEnd) + '\n\n' + funcStr + '\n\n' + content.substring(scriptEnd);
        fs.writeFileSync(storeHtmlPath, content, 'utf8');
        console.log('Fixed syntax error in store.html');
    } else {
        console.log('Could not find </script>');
    }
} else {
    console.log('Could not find updateDashboardInsights outside script');
}
