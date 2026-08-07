const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /function showPage\(pageId\)\s*\{\s*document\.querySelectorAll\('\.page-section'\)\.forEach\(el => el\.classList\.remove\('active'\)\);\s*document\.getElementById\(pageId\)\.classList\.add\('active'\);/;

const newStr = `function showPage(pageId) {
            // Update URL so refreshing works correctly
            if (pageId === 'home-view') {
                window.history.pushState(null, '', 'index.html');
            } else if (pageId === 'map-view') {
                window.history.pushState(null, '', 'index.html?view=map');
            }

            document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');`;

if (regex.test(content)) {
    content = content.replace(regex, newStr);
    fs.writeFileSync('index.html', content);
    console.log("Successfully updated showPage.");
} else {
    console.log("Still could not find the target string.");
}
