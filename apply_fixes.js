const fs = require('fs');
const indexPath = 'd:\\apaze\\Smartindoormap\\index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. Fix showPreorderStep to include 'done' and 'track'
content = content.replace(
    /if \(step === 'confirm'\) \{([\s\S]*?)renderCartSummary\(\);\s*\}/,
    `if (['confirm', 'done', 'track'].includes(step)) {$1if (step === 'confirm') renderCartSummary();\n            }`
);

// 2. Add cancel route banner
const cancelBannerHtml = `
            <!-- Floating Cancel Navigation Banner Button -->
            <div id="cancel-route-banner" class="absolute top-36 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto hidden transition-all duration-300">
                <button onclick="clearSearch()" class="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/90 cursor-pointer text-xs group tracking-wide">
                    <span class="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">cancel</span>
                    <span>ปิดการนำทาง</span>
                </button>
            </div>

            <!-- Full Screen Map Canvas -->
            <div class="absolute inset-0 z-0 bg-[#f8fafc] overflow-hidden flex items-center justify-center" id="panzoom-wrapper">`;

content = content.replace(
    /<!-- Full Screen Map Canvas -->\s*<div class="absolute inset-0 z-0 bg-\[#f8fafc\] overflow-hidden flex items-center justify-center" id="panzoom-wrapper">/,
    cancelBannerHtml
);

// 3. Change path stroke color to blue
content = content.replace(
    /pathElement\.setAttribute\('stroke', '#22c55e'\);/g,
    `pathElement.setAttribute('stroke', '#0ea5e9');`
);

fs.writeFileSync(indexPath, content, 'utf-8');
console.log('Successfully applied all fixes to index.html!');
