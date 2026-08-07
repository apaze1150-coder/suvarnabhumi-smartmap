const fs = require('fs');
const indexPath = 'index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// 1. Inject video background into page-preorder and make it transparent
const pagePreorderRegex = /<div\s+id="page-preorder"\s+class="([^"]*?)bg-gray-50([^"]*?)"\s*>/;
if (pagePreorderRegex.test(content)) {
    content = content.replace(pagePreorderRegex, `<div id="page-preorder" class="$1bg-transparent$2">
            <!-- Aura Background Layer -->
            <div class="fixed inset-0 z-0 pointer-events-none">
                <video src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_flowers.mp4" playsinline muted loop autoplay class="w-full h-full object-cover object-bottom opacity-35 bg-[#000000]"></video>
                <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90"></div>
            </div>`);
    console.log("Replaced page-preorder background.");
} else {
    console.log("pagePreorderRegex not matched.");
}

// 2. Add relative z-10 to preorder-step-select-store
const stepSelectRegex = /<div\s+id="preorder-step-select-store"\s+class="(.*?)"\s*>/;
if (stepSelectRegex.test(content)) {
    content = content.replace(stepSelectRegex, `<div id="preorder-step-select-store" class="$1 relative z-10">`);
    console.log("Added z-10 to preorder-step-select-store");
}

// 3. Add relative z-10 to preorder-step-confirm
const stepConfirmRegex = /<div\s+id="preorder-step-confirm"\s+class="(.*?)"\s*>/;
if (stepConfirmRegex.test(content)) {
    content = content.replace(stepConfirmRegex, `<div id="preorder-step-confirm" class="$1 relative z-10">`);
    console.log("Added z-10 to preorder-step-confirm");
}

// 4. Update PAÑPURI and PRE-ORDER text colors
content = content.replace(/<h2 class="([^"]*?)text-\[#000a1e\]([^"]*?)">PAÑPURI<\/h2>/, '<h2 class="$1text-[#fdfbf6]$2">PAÑPURI</h2>');
content = content.replace(/<h3 class="([^"]*?)text-\[#000a1e\]([^"]*?)">PRE-ORDER<\/h3>/, '<h3 class="$1text-[#c2ba9b]$2">PRE-ORDER</h3>');
content = content.replace(/<p class="([^"]*?)text-gray-500([^"]*?)">เลือกร้านค้าที่ต้องการรับสินค้า<\/p>/, '<p class="$1text-white/70$2">เลือกร้านค้าที่ต้องการรับสินค้า</p>');
content = content.replace(/<h1 class="([^"]*?)text-\[#000a1e\]([^"]*?)">Confirm Pre-order<\/h1>/, '<h1 class="$1text-[#fdfbf6]$2">Confirm Pre-order</h1>');

// 5. Update BACK button for select-store
content = content.replace(/<button class="haptic-btn flex items-center gap-3 group text-\[#000a1e\] hover:bg-white\/50([^"]*?)" onclick="showPage\('home-view'\)">/, '<button class="haptic-btn flex items-center gap-3 group text-white hover:bg-white/10$1" onclick="showPage(\'home-view\')">');
content = content.replace(/<div class="flex items-center justify-center w-8 h-8 rounded-full border border-\[#000a1e\]\/10 bg-white group-hover:border-\[#000a1e\]\/30">/, '<div class="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-transparent group-hover:border-white/40 group-hover:bg-white group-hover:text-black transition-all">');

// 6. Update BACK button for confirm step
content = content.replace(/<a href="#" onclick="showPage\('view-panpuri-boutique'\); return false;" class="inline-flex items-center gap-2 text-\[#000a1e\] transition-colors group">/, '<a href="#" onclick="showPage(\'view-panpuri-boutique\'); return false;" class="inline-flex items-center gap-2 text-white transition-colors group hover:text-[#c2ba9b]">');
content = content.replace(/<div class="flex items-center justify-center w-8 h-8 rounded-full border border-\[#000a1e\]\/10 bg-white group-hover:border-\[#000a1e\]\/30">/, '<div class="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-transparent group-hover:border-[#c2ba9b] transition-all">');

fs.writeFileSync(indexPath, content, 'utf-8');
console.log('Script executed completely.');
