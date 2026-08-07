const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
<!-- Clear History Confirmation Modal -->
<div id="clear-history-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 pointer-events-auto">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="clear-history-backdrop" onclick="closeClearHistoryModal()"></div>
    
    <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-95 opacity-0 transition-all duration-300" id="clear-history-content">
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 border border-red-200 shadow-inner">
                <span class="material-symbols-outlined text-red-600 text-3xl">delete</span>
            </div>
            <h3 class="text-lg font-black text-[#000a1e] mb-2">Clear History?</h3>
            <p class="text-sm font-medium text-gray-500 mb-6">Do you want to clear the order history on this device?<br><span class="text-xs text-gray-400">The cart icon will disappear.</span></p>
            
            <div class="flex w-full gap-3">
                <button onclick="closeClearHistoryModal()" class="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all active:scale-95 text-sm border border-gray-200">
                    Cancel
                </button>
                <button onclick="proceedClearHistory()" class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-sm border border-red-600">
                    Clear
                </button>
            </div>
        </div>
    </div>
</div>
`;

const oldFunctionCodeRegex = /function clearOrderHistory\(\) \{\s*if\(!confirm\('Do you want to clear the order history on this device\? \(The cart icon will disappear\)'\)\) return;\s*localStorage\.removeItem\('myOrders'\);\s*localStorage\.removeItem\('myLastOrder'\);\s*renderOrderHistory\(\[\]\);\s*document\.getElementById\('track-order-input'\)\.value = '';\s*document\.getElementById\('track-result'\)\.classList\.add\('hidden'\);\s*const floatBtn = document\.getElementById\('floating-track-btn'\);\s*if\(floatBtn\) floatBtn\.classList\.add\('hidden'\);\s*\}/;

const newFunctionCode = `        function closeClearHistoryModal() {
            const modal = document.getElementById('clear-history-modal');
            const backdrop = document.getElementById('clear-history-backdrop');
            const content = document.getElementById('clear-history-content');
            if (!modal) return;
            
            backdrop.classList.remove('opacity-100');
            backdrop.classList.add('opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        function clearOrderHistory() {
            const modal = document.getElementById('clear-history-modal');
            const backdrop = document.getElementById('clear-history-backdrop');
            const content = document.getElementById('clear-history-content');
            if (!modal) return;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function proceedClearHistory() {
            closeClearHistoryModal();
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            renderOrderHistory([]);
            document.getElementById('track-order-input').value = '';
            document.getElementById('track-result').classList.add('hidden');
            const floatBtn = document.getElementById('floating-track-btn');
            if(floatBtn) floatBtn.classList.add('hidden');
            if (typeof showToast === 'function') showToast('Order history cleared', 'success');
        }`;

if (oldFunctionCodeRegex.test(c)) {
    c = c.replace(oldFunctionCodeRegex, newFunctionCode);
    
    // Add the modal HTML before Cancel Order Confirmation Modal
    if (c.includes('<!-- Cancel Order Confirmation Modal -->')) {
        c = c.replace('<!-- Cancel Order Confirmation Modal -->', modalHtml + '\n\n<!-- Cancel Order Confirmation Modal -->');
        fs.writeFileSync('index.html', c);
        console.log("Successfully added the custom modal and updated clearOrderHistory");
    } else {
        console.log("Could not find <!-- Cancel Order Confirmation Modal --> to inject HTML");
    }
} else {
    console.log("Could not find clearOrderHistory function");
}
