const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix the corrupted block
const corruptedBlockRegex = /           function closeClearHistoryModal\(\) \{[\s\S]*?if \(typeof showToast === 'function'\) showToast\('Order history cleared', 'success'\);\s*\}\s*trackOrder\(\);/;

if (corruptedBlockRegex.test(content)) {
    content = content.replace(corruptedBlockRegex, '                    trackOrder();');
    console.log("Fixed corrupted cancelCustomerOrder block");
} else {
    console.log("Could not find corrupted block");
}

// Replace the real clearOrderHistory
const oldClearHistory = `        function clearOrderHistory() {
            if(!confirm('ต้องการClear historyการสั่งจองในเครื่องนี้หรือไม่? (จะทำให้สัญลักษณ์รถเข็นหายไป)')) return;
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            renderOrderHistory([]);
            document.getElementById('track-order-input').value = '';
            document.getElementById('track-result').classList.add('hidden');
            const floatBtn = document.getElementById('floating-track-btn');
            if(floatBtn) floatBtn.classList.add('hidden');
        }`;

const newClearHistory = `        function closeClearHistoryModal() {
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

if (content.includes(oldClearHistory)) {
    content = content.replace(oldClearHistory, newClearHistory);
    console.log("Successfully replaced actual clearOrderHistory");
} else {
    console.log("Could not find oldClearHistory block");
}

fs.writeFileSync('index.html', content);
