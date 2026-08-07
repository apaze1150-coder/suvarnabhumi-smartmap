const fs = require('fs');

let smartmap = fs.readFileSync('smartmap.html', 'utf8');
const originalJS = fs.readFileSync('test_syntax_3.js', 'utf8');
const linesJS = originalJS.split('\n');
const blockToRestore = linesJS.slice(0, 459).join('\n'); // Up to end of selectStoreCard

// We will overwrite the entire <script> ... </script> and re-assemble everything correctly to be safe.
// Wait, the previous fix restored everything correctly.
// Let's just do a clean string replacement on smartmap.html.

const targetShowPage = `            const navHome = document.getElementById('nav-home');
            const navMap = document.getElementById('nav-map');
            const navAi = document.getElementById('nav-ai');

            [navHome, navMap, navAi].forEach(btn => {
                btn.classList.remove('text-[#00ffff]', 'bg-white/5');
                btn.classList.add('text-white/40');
                btn.querySelector('span').style.fontVariationSettings = "'FILL' 0";
            });

            if (pageId === 'home-view') {
                navHome.classList.add('text-[#00ffff]', 'bg-white/5');
                navHome.querySelector('span').style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view') {
                navMap.classList.add('text-[#00ffff]', 'bg-white/5');
                navMap.querySelector('span').style.fontVariationSettings = "'FILL' 1";
                if (mapPanzoom) setTimeout(() => mapPanzoom.reset(), 50);
            }
        }`;

const replacementShowPage = `            const navHome = document.getElementById('nav-home');
            const navMap = document.getElementById('nav-map');
            const navPreorder = document.getElementById('nav-preorder');
            const navAi = document.getElementById('nav-ai');

            [navHome, navMap, navPreorder, navAi].forEach(btn => {
                if(!btn) return;
                btn.classList.remove('text-[#00ffff]', 'bg-white/5');
                btn.classList.add('text-white/40');
                const span = btn.querySelector('span');
                if(span) span.style.fontVariationSettings = "'FILL' 0";
            });

            if (pageId === 'home-view') {
                navHome.classList.add('text-[#00ffff]', 'bg-white/5');
                navHome.querySelector('span').style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view') {
                navMap.classList.add('text-[#00ffff]', 'bg-white/5');
                navMap.querySelector('span').style.fontVariationSettings = "'FILL' 1";
                if (mapPanzoom) setTimeout(() => mapPanzoom.reset(), 50);
            } else if (pageId === 'page-preorder' || pageId === 'view-panpuri-boutique') {
                if (navPreorder) {
                    navPreorder.classList.add('text-[#00ffff]', 'bg-white/5');
                    const span = navPreorder.querySelector('span');
                    if (span) span.style.fontVariationSettings = "'FILL' 1";
                }
            }
        }`;

let replaced = false;

// 1. First, restore the file completely to avoid corrupted state!
// Wait, since I don't have the original before `replace_file_content` messed up, let me restore from test_syntax_3.js again
let updated = smartmap.replace(/<\/div>\s*\}\s*\/\/\s*---\s*5\.\s*UI PAGE NAVIGATION UTILITIES\s*---/m, '    </div>\n</nav>\n\n    <!-- JS Integration for Live API Backend -->\n    <script>\n' + blockToRestore + '\n\n        // --- 5. UI PAGE NAVIGATION UTILITIES ---\n');

// 2. Add the modal and the showPage update
let replacementModal = `    </div>
</nav>

    <!-- Image Popup Modal -->
    <div id="image-popup-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-[#000a1e]/80 backdrop-blur-sm transition-opacity duration-300 opacity-0">
        <div class="relative w-[90%] max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300">
            <button onclick="closeImagePopup()" class="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors z-10 border border-gray-200">
                <span class="material-symbols-outlined font-bold">close</span>
            </button>
            <div class="w-full h-[60vh] flex items-center justify-center p-8 bg-gray-50">
                <img id="image-popup-img" src="" alt="Product Image" class="max-w-full max-h-full object-contain drop-shadow-sm">
            </div>
        </div>
    </div>

    <!-- JS Integration for Live API Backend -->
    <script>
` + blockToRestore + `\n\n        // --- 5. UI PAGE NAVIGATION UTILITIES ---`;

updated = updated.replace(/<\/nav>\s*<!-- JS Integration for Live API Backend -->\s*<script>\s*(let mapPanzoom;)/, replacementModal.replace(blockToRestore + '\\n\\n        // --- 5. UI PAGE NAVIGATION UTILITIES ---', '') + '$1');
updated = updated.replace('</nav>\r\n\r\n    <!-- JS Integration for Live API Backend -->\r\n    <script>\r\n        let mapPanzoom;', replacementModal.replace(blockToRestore + '\\n\\n        // --- 5. UI PAGE NAVIGATION UTILITIES ---', '') + '        let mapPanzoom;');

// Re-apply the modal correctly (in case regex failed)
if (!updated.includes('image-popup-modal')) {
    updated = updated.replace(/<\/nav>[\s\S]*?<!-- JS Integration for Live API Backend -->/m, `</nav>

    <!-- Image Popup Modal -->
    <div id="image-popup-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-[#000a1e]/80 backdrop-blur-sm transition-opacity duration-300 opacity-0">
        <div class="relative w-[90%] max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300">
            <button onclick="closeImagePopup()" class="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-colors z-10 border border-gray-200">
                <span class="material-symbols-outlined font-bold">close</span>
            </button>
            <div class="w-full h-[60vh] flex items-center justify-center p-8 bg-gray-50">
                <img id="image-popup-img" src="" alt="Product Image" class="max-w-full max-h-full object-contain drop-shadow-sm">
            </div>
        </div>
    </div>

    <!-- JS Integration for Live API Backend -->`);
}

// 3. Update showPage
if (updated.includes(targetShowPage)) {
    updated = updated.replace(targetShowPage, replacementShowPage);
} else {
    console.log("Could not find targetShowPage to replace. Using regex.");
    updated = updated.replace(/const navHome = document\.getElementById\('nav-home'\);[\s\S]*?if \(mapPanzoom\) setTimeout\(\(\) => mapPanzoom\.reset\(\), 50\);\s*\}/, replacementShowPage.trim());
}

// 4. Update cart product image
const targetCartImg = `                return \`<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group border-b border-gray-100 last:border-0">
                    <div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100">
                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>\``;
const replacementCartImg = `                return \`<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group border-b border-gray-100 last:border-0">
                    <div onclick="showImagePopup('\${imgSrc}')" class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100 cursor-pointer hover:border-[#000a1e]/30 hover:shadow-sm transition-all">
                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>\``;
if (updated.includes(targetCartImg)) {
    updated = updated.replace(targetCartImg, replacementCartImg);
} else {
    // try flexible replace
    updated = updated.replace(/<div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100">\s*<img alt="Product" class="w-full h-full object-contain" src="\$\{imgSrc\}" onerror="this\.src='https:\/\/via\.placeholder\.com\/150\?text=No\+Image'"\/>\s*<\/div>/, `<div onclick="showImagePopup('\${imgSrc}')" class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100 cursor-pointer hover:border-[#000a1e]/30 hover:shadow-sm transition-all">\n                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>\n                    </div>`);
}

// 5. Add showImagePopup functions at the end of the script
if (!updated.includes('function showImagePopup')) {
    updated = updated.replace(/function exitBoutique\(\) \{\s*showPage\('home-view'\);\s*\}/, `function exitBoutique() {
            showPage('home-view');
        }

        function showImagePopup(src) {
            const modal = document.getElementById('image-popup-modal');
            const img = document.getElementById('image-popup-img');
            if(modal && img) {
                img.src = src;
                modal.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0');
                    const inner = modal.querySelector('div');
                    if(inner) {
                        inner.classList.remove('scale-95');
                        inner.classList.add('scale-100');
                    }
                });
            }
        }

        function closeImagePopup() {
            const modal = document.getElementById('image-popup-modal');
            if(modal) {
                modal.classList.add('opacity-0');
                const inner = modal.querySelector('div');
                if(inner) {
                    inner.classList.remove('scale-100');
                    inner.classList.add('scale-95');
                }
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }`);
}

fs.writeFileSync('smartmap.html', updated);
console.log('Fixed completely!');
