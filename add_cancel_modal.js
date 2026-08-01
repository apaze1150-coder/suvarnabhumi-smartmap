const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
<!-- Cancel Order Confirmation Modal -->
<div id="cancel-order-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 pointer-events-auto">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0" id="cancel-order-backdrop" onclick="closeCancelOrderModal()"></div>
    
    <div class="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-95 opacity-0 transition-all duration-300" id="cancel-order-content">
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 border border-red-200 shadow-inner">
                <span class="material-symbols-outlined text-red-600 text-3xl">warning</span>
            </div>
            <h3 class="text-lg font-black text-[#000a1e] mb-2">Cancel Order?</h3>
            <p class="text-sm font-medium text-gray-500 mb-6">Are you sure you want to cancel this order?<br><span class="text-xs text-gray-400">This action cannot be undone.</span></p>
            
            <div class="flex w-full gap-3">
                <button onclick="closeCancelOrderModal()" class="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all active:scale-95 text-sm border border-gray-200">
                    No
                </button>
                <button id="confirm-cancel-order-btn" class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 active:scale-95 text-sm border border-red-600">
                    Yes, Cancel
                </button>
            </div>
        </div>
    </div>
</div>
`;

const oldFunctionCode = `        async function cancelCustomerOrder(orderNum) {
            if(!confirm('Are you sure you want to cancel this order?')) return;
            try {
                const res = await fetch(\`/api/orders/customer-cancel/\${orderNum}\`, { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    alert('Order cancelled successfully');
                    trackOrder();
                } else {
                    alert(data.error || 'Unable to cancel');
                }
            } catch(e) {
                alert('Unable to connect to server');
            }
        }`;

const newFunctionCode = `        let orderToCancel = null;

        function closeCancelOrderModal() {
            const modal = document.getElementById('cancel-order-modal');
            const backdrop = document.getElementById('cancel-order-backdrop');
            const content = document.getElementById('cancel-order-content');
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

        function cancelCustomerOrder(orderNum) {
            orderToCancel = orderNum;
            const modal = document.getElementById('cancel-order-modal');
            const backdrop = document.getElementById('cancel-order-backdrop');
            const content = document.getElementById('cancel-order-content');
            if (!modal) return;
            
            document.getElementById('confirm-cancel-order-btn').onclick = () => proceedCancelOrder();
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            setTimeout(() => {
                backdrop.classList.remove('opacity-0');
                backdrop.classList.add('opacity-100');
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        async function proceedCancelOrder() {
            if (!orderToCancel) return;
            const orderNum = orderToCancel;
            closeCancelOrderModal();
            try {
                const res = await fetch(\`/api/orders/customer-cancel/\${orderNum}\`, { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    // Quick feedback modal or just alert, but user mostly cares about the confirm box being ugly
                    alert('Order cancelled successfully');
                    trackOrder();
                } else {
                    alert(data.error || 'Unable to cancel');
                }
            } catch(e) {
                alert('Unable to connect to server');
            }
        }`;


// Replace the function
if (content.includes("async function cancelCustomerOrder(orderNum) {")) {
    content = content.replace(oldFunctionCode, newFunctionCode);
    
    // Add the modal HTML before exit-store-modal
    if (content.includes('<!-- Exit Store Confirmation Modal -->')) {
        content = content.replace('<!-- Exit Store Confirmation Modal -->', modalHtml + '\n\n<!-- Exit Store Confirmation Modal -->');
        fs.writeFileSync('index.html', content);
        console.log("Successfully added the custom modal and updated the function");
    } else {
        console.log("Could not find <!-- Exit Store Confirmation Modal --> to inject HTML");
    }
} else {
    console.log("Could not find cancelCustomerOrder function");
}
