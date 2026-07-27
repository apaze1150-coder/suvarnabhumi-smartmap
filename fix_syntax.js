const fs = require('fs');
const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /document\.getElementById\('drawerCartBtnContainer'\)\.innerHTML\s*=\s*'<button onclick="addToBoutiqueCart\(\\\\'\s*\+\s*p\.product_id\s*\+\s*'\\\\', '\s*\+\s*window\.currentDrawerQty\s*\+\s*'\); closeDrawer\(\)"[^>]+>.*?<\/button>';/g;

const replacement = `document.getElementById('drawerCartBtnContainer').innerHTML = \`<button onclick="addToBoutiqueCart('\${p.product_id}', \${window.currentDrawerQty}); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>\`;`;

if(content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed syntax error!');
} else {
    console.log('Regex did not match.');
}
