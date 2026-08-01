const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const badBlock = `            [navHome, navMap, navPreorder, navAi].forEach(btn => {
                if(!btn) return;
                btn.classList.remove('text-[#00ffff]', 'bg-white/5', 'drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]');
                btn.classList.add('text-white/40');
                const span = btn.querySelector('span');
                if(span) span.style.fontVariationSettings = "'FILL' 0";
            });

            if (pageId === 'home-view' && navHome) {
                navHome.classList.add('text-[#00ffff]', 'bg-white/5', 'drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]');
                const span = navHome.querySelector('span');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view' && navMap) {
                navMap.classList.add('text-[#00ffff]', 'bg-white/5', 'drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]');
                const span = navMap.querySelector('span');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
                setTimeout(() => fitMapToScreen(), 50);
            } else if (pageId === 'page-preorder' || pageId === 'view-panpuri-boutique') {
                if (navPreorder) {
                    navPreorder.classList.add('text-[#00ffff]', 'bg-white/5', 'drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]');
                    const span = navPreorder.querySelector('span');
                    if (span) span.style.fontVariationSettings = "'FILL' 1";
                }
            }`;

const goodBlock = `            [navHome, navMap, navPreorder, navAi].forEach(btn => {
                if(!btn) return;
                btn.classList.remove('text-[#001a3d]');
                btn.classList.add('text-gray-400');
                
                // Clean up hardcoded active colors from inner spans (like Home originally had)
                const spans = btn.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('text-[#001a3d]');
                    if(span.classList.contains('material-symbols-outlined')) {
                         span.style.fontVariationSettings = "'FILL' 0";
                    }
                });
            });

            if (pageId === 'home-view' && navHome) {
                navHome.classList.remove('text-gray-400');
                navHome.classList.add('text-[#001a3d]');
                const span = navHome.querySelector('.material-symbols-outlined');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
            } else if (pageId === 'map-view' && navMap) {
                navMap.classList.remove('text-gray-400');
                navMap.classList.add('text-[#001a3d]');
                const span = navMap.querySelector('.material-symbols-outlined');
                if (span) span.style.fontVariationSettings = "'FILL' 1";
                setTimeout(() => fitMapToScreen(), 50);
            } else if (pageId === 'page-preorder' || pageId === 'view-panpuri-boutique') {
                if (navPreorder) {
                    navPreorder.classList.remove('text-gray-400');
                    navPreorder.classList.add('text-[#001a3d]');
                    const span = navPreorder.querySelector('.material-symbols-outlined');
                    if (span) span.style.fontVariationSettings = "'FILL' 1";
                }
            }`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, goodBlock);
    console.log("Fixed showPage menubar highlight logic.");
} else {
    console.log("Could not find the block. Attempting regex...");
    // Fallback regex if spacing differs
    const fallbackRegex = /\[navHome, navMap, navPreorder, navAi\]\.forEach.*?if \(navPreorder\).*?\}\s*\}/s;
    if (fallbackRegex.test(content)) {
        content = content.replace(fallbackRegex, goodBlock);
        console.log("Fixed via regex fallback.");
    }
}

fs.writeFileSync('index.html', content);
