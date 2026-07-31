
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
            historyList.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <div class="text-xs font-bold text-gray-400">ประวัติการสั่งจองล่าสุดของคุณ:</div>
                    <button onclick="clearOrderHistory()" class="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors underline">ล้างประวัติ</button>
                </div>
            ` + [...ordersArray].reverse().map(orderId => `
                <button onclick="document.getElementById('track-order-input').value='${orderId}'; trackOrder();" class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 active:scale-95 transition-all shadow-sm">
                    <span>${orderId}</span>
                    <span class="material-symbols-outlined text-amber-500 text-sm">chevron_right</span>
                </button>
            `).join('');
        }

        async function cancelCustomerOrder(orderNum) {
            if(!confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งจองนี้?')) return;
            try {
                const res = await fetch(`/api/orders/customer-cancel/${orderNum}`, { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    alert('ยกเลิก Order สำเร็จ');
                    trackOrder();
                } else {
                    alert(data.error || 'ไม่สามารถยกเลิกได้');
                }
            } catch(e) {
                alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
            }
        }

        function clearOrderHistory() {
            if(!confirm('ต้องการล้างประวัติการสั่งจองในเครื่องนี้หรือไม่? (จะทำให้สัญลักษณ์รถเข็นหายไป)')) return;
            localStorage.removeItem('myOrders');
            localStorage.removeItem('myLastOrder');
            renderOrderHistory([]);
            document.getElementById('track-order-input').value = '';
            document.getElementById('track-result').classList.add('hidden');
            const floatBtn = document.getElementById('floating-track-btn');
            if(floatBtn) floatBtn.classList.add('hidden');
        }
    