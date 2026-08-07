const fs = require('fs');

const originalJS = fs.readFileSync('test_syntax_3.js', 'utf8');
const linesJS = originalJS.split('\n');
const blockToRestore = linesJS.slice(0, 459).join('\n'); // Up to end of selectStoreCard

let smartmap = fs.readFileSync('smartmap.html', 'utf8');

let replacement = `    </div>
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

let updated = smartmap.replace(/<\/div>\s*\}\s*\/\/\s*---\s*5\.\s*UI PAGE NAVIGATION UTILITIES\s*---/m, replacement);

if (updated !== smartmap) {
    fs.writeFileSync('smartmap.html', updated);
    console.log('Restored smartmap.html!');
} else {
    console.log('Could not find injection point');
}
