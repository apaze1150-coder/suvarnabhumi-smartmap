const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// Inject the reset logic right before the columns are defined or visibleColumns is used
const target = "let visibleColumns = {};";
const resetCode = "localStorage.removeItem('panpuri_visible_columns');\n        let visibleColumns = {};";

if (html.includes(target) && !html.includes("localStorage.removeItem('panpuri_visible_columns');")) {
    html = html.replace(target, resetCode);
    fs.writeFileSync('panpuri_admin.html', html);
    console.log("Injected localStorage reset");
} else {
    console.log("Already injected or target not found");
}
