const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetStr = `        function showPage(pageId) {
            document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');`;

const newStr = `        function showPage(pageId) {
            // Update URL so refreshing works correctly
            if (pageId === 'home-view') {
                window.history.pushState(null, '', 'index.html');
            } else if (pageId === 'map-view') {
                window.history.pushState(null, '', 'index.html?view=map');
            }
            
            document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    console.log("Fixed showPage to update URL state.");
} else {
    console.log("Could not find target string.");
}

fs.writeFileSync('index.html', content);
