const fs = require('fs');

let smartmap = fs.readFileSync('smartmap.html', 'utf8');
const originalJS = fs.readFileSync('test_syntax_3.js', 'utf8');
const linesJS = originalJS.split('\n');
const blockToRestore = linesJS.slice(0, 459).join('\n'); 

// 1. Restore the file completely to avoid corrupted state
// First, strip out all the <script> ... </script> content and inject from test_syntax_3.js
const scriptStartStr = '    <!-- JS Integration for Live API Backend -->\r\n    <script>';
const scriptStartStrUnix = '    <!-- JS Integration for Live API Backend -->\n    <script>';

let restored = smartmap;
// find the index of the start
let startIdx = restored.indexOf(scriptStartStr);
if (startIdx === -1) startIdx = restored.indexOf(scriptStartStrUnix);

if (startIdx !== -1) {
    let scriptContentStart = startIdx + (restored.includes(scriptStartStr) ? scriptStartStr.length : scriptStartStrUnix.length);
    // Find where the script ends (we want to replace all JS with the original JS)
    let endIdx = restored.lastIndexOf('    </script>');
    
    // We only need to replace up to UI PAGE NAVIGATION UTILITIES? No, wait. 
    // test_syntax_3.js only contains up to `const SAT1_MAP = ...` to `function selectStoreCard(...) { ... }` 
    // Ah, wait! `test_syntax_3.js` contains the ENTIRE script? Let's check `test_syntax_3.js` lines.
    // I know from previous check that linesJS.slice(0, 459) is up to selectStoreCard. 
}

// Actually, I can just restore from test_syntax_3.js by replacing the block from `let mapPanzoom;` up to `// --- 5. UI PAGE NAVIGATION UTILITIES ---`
const startMarker = '        let mapPanzoom;';
const endMarker = '        // --- 5. UI PAGE NAVIGATION UTILITIES ---';

let startMatch = smartmap.indexOf(startMarker);
let endMatch = smartmap.indexOf(endMarker);

if (startMatch !== -1 && endMatch !== -1) {
    smartmap = smartmap.substring(0, startMatch) + blockToRestore + '\n\n' + smartmap.substring(endMatch);
} else {
    // If it's mangled, we might need a more aggressive regex
    smartmap = smartmap.replace(/let mapPanzoom;[\s\S]*?\/\/\s*---\s*5\.\s*UI PAGE NAVIGATION UTILITIES\s*---/m, blockToRestore + '\n\n        // --- 5. UI PAGE NAVIGATION UTILITIES ---');
}

// Now `smartmap` has the correct block from test_syntax_3.js restored.

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

// 2. Add the modal and the showPage update
let replacementModal = `</nav>

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

    <!-- JS Integration for Live API Backend -->`;

smartmap = smartmap.replace(/<\/nav>\s*<!-- JS Integration for Live API Backend -->/m, replacementModal);
// clean up if multiple injected previously
while (smartmap.split('id="image-popup-modal"').length > 2) {
    smartmap = smartmap.replace(/<!-- Image Popup Modal -->[\s\S]*?<!-- JS Integration for Live API Backend -->/, '<!-- JS Integration for Live API Backend -->');
}

// 3. Update showPage
smartmap = smartmap.replace(/const navHome = document\.getElementById\('nav-home'\);[\s\S]*?if \(mapPanzoom\) setTimeout\(\(\) => mapPanzoom\.reset\(\), 50\);\s*\}/, replacementShowPage.trim());

// 4. Update cart product image
const targetCartImg = `                return \`<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group border-b border-gray-100 last:border-0">
                    <div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100">
                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>\``;
const replacementCartImg = `                return \`<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group border-b border-gray-100 last:border-0">
                    <div onclick="showImagePopup('\${imgSrc}')" class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100 cursor-pointer hover:border-[#000a1e]/30 hover:shadow-sm transition-all">
                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>\``;

smartmap = smartmap.replace(targetCartImg, replacementCartImg);
smartmap = smartmap.replace(/<div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100">\s*<img alt="Product" class="w-full h-full object-contain" src="\$\{imgSrc\}" onerror="this\.src='https:\/\/via\.placeholder\.com\/150\?text=No\+Image'"\/>\s*<\/div>/, `<div onclick="showImagePopup('\${imgSrc}')" class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100 cursor-pointer hover:border-[#000a1e]/30 hover:shadow-sm transition-all">\n                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>\n                    </div>`);


// 5. Add showImagePopup functions at the end of the script
if (!smartmap.includes('function showImagePopup')) {
    smartmap = smartmap.replace(/function exitBoutique\(\) \{\s*showPage\('home-view'\);\s*\}/, `function exitBoutique() {
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

fs.writeFileSync('smartmap.html', smartmap);
console.log('Fixed completely!');
