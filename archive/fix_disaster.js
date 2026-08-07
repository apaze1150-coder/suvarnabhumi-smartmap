const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const missingBlock = `            renderOrderHistory([]);
            document.getElementById('track-order-input').value = '';
            document.getElementById('track-result').classList.add('hidden');
            const floatBtn = document.getElementById('floating-track-btn');
            if(floatBtn) floatBtn.classList.add('hidden');
            if (typeof showToast === 'function') showToast('Order history cleared', 'success');
        }

        function openImagePreview(url) {
            const lightbox = document.getElementById('image-lightbox');
            document.getElementById('lightbox-img').src = url;
            lightbox.classList.remove('hidden');
            lightbox.classList.add('flex');
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
            }, 10);
        }

        function closeImagePreview() {
            const lightbox = document.getElementById('image-lightbox');
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
                document.getElementById('lightbox-img').src = '';
            }, 300);
        }
        function renderOrderHistory(ordersArray) {
            const historyList = document.getElementById('order-history-list');
            if (!historyList) return;
            if (!ordersArray || ordersArray.length === 0) {
                historyList.innerHTML = '';
                return;
            }
            historyList.innerHTML = \`
                <div class="flex justify-between items-center mb-1">
                    <div class="text-xs font-bold text-gray-400">Your recent order history:</div>
                    <button onclick="clearOrderHistory()" class="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors underline">Clear history</button>
                </div>
            \` + [...ordersArray].reverse().map(orderId => \`
                <button onclick="document.getElementById('track-order-input').value='\${orderId}'; trackOrder();" class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 active:scale-95 transition-all shadow-sm">
                    <span>\${orderId}</span>
                    <span class="material-symbols-outlined text-amber-500 text-sm">chevron_right</span>
                </button>
            \`).join('');
        }

        
    </script>
    <!-- Floating Track Order Button -->
    <div id="floating-track-btn" class="hidden fixed bottom-28 right-4 z-[90] animate-bounce">
        <button onclick="showPage('page-preorder'); showPreorderStep('track');" class="bg-gray-900 text-[#ffe088] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-gray-900/40 hover:scale-110 transition-transform relative border-2 border-[#ffe088]">
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">shopping_cart</span>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">1</span>
        </button>
    </div>


<div id="main-mobile-menubar" class="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none transition-transform duration-300 ease-in-out transform translate-y-0">
    <div class="bg-white/95 backdrop-blur-md py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[500px] pointer-events-auto border border-gray-200 rounded-3xl">
        <div class="px-6 w-full flex items-center justify-between relative">
            <!-- Home -->
            <div id="nav-home" class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('home-view')">
                <span class="material-symbols-outlined text-[#001a3d] hover:text-[#d8aa3d] transition-colors">home</span>
                <span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>
`;

const anchorStr = `            closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            </div>
            <!-- Navigate -->
            <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="navigateToGate()">`;

const badBlock = `            closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            </div>
            <!-- Navigate -->
            <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="navigateToGate()">`;


if (content.includes(anchorStr)) {
    content = content.replace(anchorStr, `            closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');\n${missingBlock}`);
    console.log("Restored missing block and injected fix.");
} else {
    // maybe spacing is different, let's use regex
    const regex = /closeClearHistoryModal\(\);\s*localStorage\.removeItem\('myOrders'\);\s*localStorage\.removeItem\('myLastOrder'\);\s*<\/div>\s*<!-- Navigate -->\s*<div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-\[#001a3d\] transition-all duration-200 active:text-\[#d8aa3d\] active:drop-shadow-\[0_0_8px_rgba\(216,170,61,0\.8\)\] active:scale-95" onclick="navigateToGate\(\)">/s;
    if (regex.test(content)) {
        content = content.replace(regex, `            closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');\n${missingBlock}`);
        console.log("Restored missing block using regex.");
    } else {
        console.log("Anchor string not found.");
    }
}

// Ensure Navigate button is also correct
const navigateRegex = /<!-- Navigate -->\s*<div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-\[#001a3d\] transition-all duration-200 active:text-\[#d8aa3d\] active:drop-shadow-\[0_0_8px_rgba\(216,170,61,0\.8\)\] active:scale-95" onclick="navigateToGate\(\)">/s;
if (navigateRegex.test(content)) {
    content = content.replace(navigateRegex, `<!-- Navigate -->
            <div id="nav-map" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('map-view')">`);
    console.log("Fixed navigate button onclick.");
}

// Add ID to AI Assist
const aiRegex = /<!-- AI Assist -->\s*<div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-\[#001a3d\] transition-all duration-200 active:text-\[#d8aa3d\] active:drop-shadow-\[0_0_8px_rgba\(216,170,61,0\.8\)\] active:scale-95" onclick="openAIModal\(\)">/s;
if (aiRegex.test(content)) {
    content = content.replace(aiRegex, `<!-- AI Assist -->
            <div id="nav-ai" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="openAIModal()">`);
    console.log("Fixed AI assist button.");
}


fs.writeFileSync('index.html', content);
