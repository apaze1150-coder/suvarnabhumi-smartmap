const fs = require('fs');

const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /        async function selectPreorderStore\(storeId, name\) \{[\s\S]*?showPage\('view-panpuri-boutique'\);\s*\}/;

const replaceStr = `        async function selectPreorderStore(storeId, name) {
            try {
                preorderStoreId = storeId;
                preorderStoreName = name;
                const storeLabel = document.getElementById('boutique-store-name');
                if (storeLabel) storeLabel.textContent = '📍 ' + name;
                preorderCart = {};
                await loadProducts();
                filterProducts('all'); // Initialize UI highlight state and render
                showPage('view-panpuri-boutique');
            } catch (e) {
                alert("Error in selectPreorderStore: " + e.message + "\\n" + e.stack);
            }
        }`;

content = content.replace(regex, replaceStr);

fs.writeFileSync(file, content, 'utf8');
console.log('Added alert to selectPreorderStore');
