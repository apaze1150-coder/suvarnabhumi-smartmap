const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// Remove the debug box HTML
const debugHtmlStart = html.indexOf('<div id="visual-debugger"');
if (debugHtmlStart > -1) {
    const debugHtmlEnd = html.indexOf('</div>', debugHtmlStart) + 6;
    html = html.substring(0, debugHtmlStart) + html.substring(debugHtmlEnd);
}

// Remove the debug logic from renderTable
html = html.replace(/const debugEl = document\.getElementById\('visual-debugger'\);[\s\S]*?debugEl\.innerText \+= '\\nFirst product: ' \+ \(allProducts\[0\] \? JSON\.stringify\(allProducts\[0\]\)\.substring\(0, 50\) \+ '\.\.\.' : 'none'\);\n        }/g, '');
html = html.replace(/if \(debugEl\) {\n            debugEl\.innerText \+= '\\ntbody children count after: ' \+ tbody\.children\.length;\n            debugEl\.innerText \+= '\\ntbody offsetHeight: ' \+ tbody\.offsetHeight;\n        }/g, '');

fs.writeFileSync('panpuri_admin.html', html);
console.log('Removed visual debugger');
