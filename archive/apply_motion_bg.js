const fs = require('fs');

const indexPath = 'index.html';
let content = fs.readFileSync(indexPath, 'utf-8');

// Replacement 1
const target1 = `        <!-- 1b. PRE-ORDER PAGE -->
        <div id="page-preorder" class="page-section absolute inset-0 pt-20 pb-40 overflow-y-auto bg-gray-50">
            <!-- Steps -->
            <div id="preorder-step-select-store" class="max-w-lg mx-auto px-4 py-6">`;
            
const replace1 = `        <!-- 1b. PRE-ORDER PAGE -->
        <div id="page-preorder" class="page-section absolute inset-0 pt-20 pb-40 overflow-y-auto bg-transparent">
            <!-- Aura Background Layer -->
            <div class="fixed inset-0 z-0 pointer-events-none">
                <video src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_flowers.mp4" playsinline muted loop autoplay class="w-full h-full object-cover object-bottom opacity-35 bg-[#000000]"></video>
                <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90"></div>
            </div>
            <!-- Steps -->
            <div id="preorder-step-select-store" class="max-w-lg mx-auto px-4 py-6 relative z-10">`;

// Replacement 2
const target2 = `    <nav class="mb-10" data-purpose="navigation-area">
        <button class="haptic-btn flex items-center gap-3 group text-[#000a1e] hover:bg-white/50 px-3 py-2 -ml-3 rounded-full" onclick="showPage('home-view')">
            <div class="flex items-center justify-center w-8 h-8 rounded-full border border-[#000a1e]/10 bg-white group-hover:border-[#000a1e]/30">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                </svg>
            </div>
            <span class="text-sm font-semibold tracking-tight uppercase">BACK</span>
        </button>
    </nav>
    <!-- END: Premium Back Navigation -->
    <!-- BEGIN: Brand Header -->
    <section class="mb-8" data-purpose="brand-info">
        <h2 class="text-3xl font-extrabold tracking-[0.15em] mb-1 text-[#000a1e]">PAÑPURI</h2>
        <h3 class="text-xl font-bold tracking-wider mb-4 text-[#000a1e]">PRE-ORDER</h3>
        <p class="text-gray-500 text-sm font-medium">เลือกร้านค้าที่ต้องการรับสินค้า</p>
    </section>`;

const replace2 = `    <nav class="mb-10" data-purpose="navigation-area">
        <button class="haptic-btn flex items-center gap-3 group text-white hover:bg-white/10 px-3 py-2 -ml-3 rounded-full" onclick="showPage('home-view')">
            <div class="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-transparent group-hover:border-white/40 group-hover:bg-white group-hover:text-black transition-all">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                </svg>
            </div>
            <span class="text-sm font-semibold tracking-tight uppercase">BACK</span>
        </button>
    </nav>
    <!-- END: Premium Back Navigation -->
    <!-- BEGIN: Brand Header -->
    <section class="mb-8" data-purpose="brand-info">
        <h2 class="text-3xl font-extrabold tracking-[0.15em] mb-1 text-[#fdfbf6]">PAÑPURI</h2>
        <h3 class="text-xl font-bold tracking-wider mb-4 text-[#c2ba9b]">PRE-ORDER</h3>
        <p class="text-white/70 text-sm font-medium">เลือกร้านค้าที่ต้องการรับสินค้า</p>
    </section>`;

// Replacement 3
const target3 = `            <div id="preorder-step-confirm" class="hidden w-full max-w-4xl mx-auto px-4 pt-6 pb-40 space-y-4">
                <!-- Back Navigation -->
                <div class="animate-fade-in-up stagger-1">
                    <a href="#" onclick="showPage('view-panpuri-boutique'); return false;" class="inline-flex items-center gap-2 text-[#000a1e] transition-colors group">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full border border-[#000a1e]/10 bg-white group-hover:border-[#000a1e]/30">
                            <svg class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                            </svg>
                        </div>
                        <span class="font-bold text-sm">กลับเลือกสินค้า</span>
                    </a>
                </div>
                <header class="animate-fade-in-up stagger-1">
                    <h1 class="text-2xl font-black text-[#000a1e] tracking-tight">Confirm Pre-order</h1>
                </header>`;
                
const replace3 = `            <div id="preorder-step-confirm" class="hidden w-full max-w-4xl mx-auto px-4 pt-6 pb-40 space-y-4 relative z-10">
                <!-- Back Navigation -->
                <div class="animate-fade-in-up stagger-1">
                    <a href="#" onclick="showPage('view-panpuri-boutique'); return false;" class="inline-flex items-center gap-2 text-white transition-colors group hover:text-[#c2ba9b]">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-transparent group-hover:border-[#c2ba9b] transition-all">
                            <svg class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                            </svg>
                        </div>
                        <span class="font-bold text-sm">กลับเลือกสินค้า</span>
                    </a>
                </div>
                <header class="animate-fade-in-up stagger-1">
                    <h1 class="text-2xl font-black text-[#fdfbf6] tracking-tight">Confirm Pre-order</h1>
                </header>`;

if (content.includes(target1)) {
    content = content.replace(target1, replace1);
    console.log('Replaced block 1 successfully.');
} else {
    console.log('Block 1 not found.');
}

if (content.includes(target2)) {
    content = content.replace(target2, replace2);
    console.log('Replaced block 2 successfully.');
} else {
    console.log('Block 2 not found.');
}

if (content.includes(target3)) {
    content = content.replace(target3, replace3);
    console.log('Replaced block 3 successfully.');
} else {
    console.log('Block 3 not found.');
}

fs.writeFileSync(indexPath, content, 'utf-8');
console.log('Done.');
