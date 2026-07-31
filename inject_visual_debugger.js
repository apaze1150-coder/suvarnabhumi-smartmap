const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

const debugDiv = `
<div id="visual-debugger" class="bg-black text-green-400 font-mono text-xs p-4 rounded-lg mt-4 mb-4 whitespace-pre-wrap max-h-64 overflow-y-auto">
[DEBUG CONSOLE]
</div>
`;

if (!html.includes('visual-debugger')) {
    html = html.replace('<div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">', debugDiv + '\n<div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">');
}

const originalAppend = `tbody.appendChild(tr);`;
const loggedAppend = `
            try {
                tbody.appendChild(tr);
            } catch(e) {
                document.getElementById('visual-debugger').innerText += '\\nError appending row: ' + e.message;
            }
`;

html = html.replace(originalAppend, loggedAppend);

const debugLogic = `
        const debugEl = document.getElementById('visual-debugger');
        if (debugEl) {
            debugEl.innerText += '\\n--- renderTable executed ---';
            debugEl.innerText += '\\nSearch query: "' + search + '"';
            debugEl.innerText += '\\nallProducts length: ' + allProducts.length;
            debugEl.innerText += '\\nfiltered length: ' + filtered.length;
            debugEl.innerText += '\\ntbody children count before: ' + tbody.children.length;
            debugEl.innerText += '\\nFirst product: ' + (allProducts[0] ? JSON.stringify(allProducts[0]).substring(0, 50) + '...' : 'none');
        }
`;

if (!html.includes('--- renderTable executed ---')) {
    const injectPoint = "document.getElementById('paginationInfoProducts').innerText = `Showing ${filtered.length} entries`;";
    html = html.replace(injectPoint, injectPoint + debugLogic);
}

const finalDebugLogic = `
        if (debugEl) {
            debugEl.innerText += '\\ntbody children count after: ' + tbody.children.length;
            debugEl.innerText += '\\ntbody offsetHeight: ' + tbody.offsetHeight;
        }
`;

if (!html.includes('tbody offsetHeight:')) {
    const appendPoint = "applyColumnVisibility();";
    html = html.replace(appendPoint, finalDebugLogic + appendPoint);
}

fs.writeFileSync('panpuri_admin.html', html);
console.log('Injected visual debugger');
