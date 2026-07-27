const fs = require('fs');
const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const deletedBlock = `                <!-- Category Filter -->
                <div class="flex gap-2 overflow-x-auto pb-2 mb-4" id="product-category-tabs">
                    <button onclick="filterProducts('all')" id="pcat-all" class="shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-amber-600 text-white transition-all">ทั้งหมด</button>
                    <button onclick="filterProducts('Bath & Body')" id="pcat-bath" class="shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 transition-all">Bath & Body</button>
                    <button onclick="filterProducts('Face')" id="pcat-face" class="shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 transition-all">Face</button>
                    <button onclick="filterProducts('Hair Care')" id="pcat-hair" class="shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 transition-all">Hair Care</button>
                    <button onclick="filterProducts('Gift Sets')" id="pcat-gift" class="shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 transition-all">Gift Sets</button>
                </div>
                <div id="product-grid" class="grid grid-cols-2 gap-3"></div>
            </div>
`;

const anchor = `<div id="preorder-step-confirm" class="hidden max-w-lg mx-auto px-4 py-6">`;

if (content.includes(anchor)) {
    content = content.replace(anchor, deletedBlock + '            ' + anchor);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Restored successfully');
} else {
    console.log('Anchor not found');
}
