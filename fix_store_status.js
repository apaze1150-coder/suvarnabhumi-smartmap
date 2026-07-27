const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// 1. Replace Store Status Cards HTML
const startCards = html.indexOf('<!-- Store Status Cards -->');
const endCards = html.indexOf('</section>', startCards);

if (startCards !== -1 && endCards !== -1) {
    const newCardsHtml = `<!-- Store Status Cards -->
<section class="space-y-md">
    <div class="flex items-center justify-between">
        <h3 class="font-headline-md text-headline-md">Store Live Status</h3>
        <button class="text-secondary font-label-md hover:underline">View All Stores</button>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-gutter" id="storeLiveStatusGrid">
        <!-- DE40 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group" style="animation-delay: 250ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DE40 Store</h4>
                    <p class="text-label-sm text-outline">Flagship Boutique - Gate 1-4</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input checked class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="de40-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="de40-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="de40-items-sold">0</p>
                </div>
            </div>
        </div>
        <!-- DE12 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group" style="animation-delay: 300ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DE12 Store</h4>
                    <p class="text-label-sm text-outline">Luxury Transit Hub</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input checked class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="de12-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="de12-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="de12-items-sold">0</p>
                </div>
            </div>
        </div>
        <!-- DW41 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group opacity-75" style="animation-delay: 350ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DW41 Store</h4>
                    <p class="text-label-sm text-outline">International Terminal</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="dw41-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="dw41-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="dw41-items-sold">0</p>
                </div>
            </div>
        </div>
    </div>`;
    html = html.substring(0, startCards) + newCardsHtml + html.substring(endCards);
    
    // 2. Add JavaScript Logic
    const jsInsertPoint = html.indexOf('renderTopSellers(topSellers);');
    if (jsInsertPoint !== -1) {
        const logicStr = `
            // 4. Store Live Status Metrics
            const storesList = ['de40', 'de12', 'dw41'];
            const todayRev = { de40: 0, de12: 0, dw41: 0 };
            const activeOrders = { de40: 0, de12: 0, dw41: 0 };
            const itemsSold = { de40: 0, de12: 0, dw41: 0 };
            
            orders.forEach(o => {
                const sid = (o.store_id || '').toLowerCase();
                if (storesList.includes(sid)) {
                    todayRev[sid] += parseFloat(o.total_price || 0);
                    
                    let items = [];
                    try { items = Array.isArray(o.items) ? o.items : JSON.parse(o.items_json || '[]'); } catch(e) {}
                    items.forEach(item => {
                        itemsSold[sid] += parseInt(item.qty || 0);
                    });
                    
                    const status = (o.status || '').toLowerCase();
                    if (status === 'pending' || status === 'ready') {
                        activeOrders[sid]++;
                    }
                }
            });
            
            storesList.forEach(sid => {
                const revEl = document.getElementById(sid + '-revenue');
                const actEl = document.getElementById(sid + '-active-orders');
                const itemsEl = document.getElementById(sid + '-items-sold');
                if(revEl) revEl.innerText = '฿' + todayRev[sid].toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
                if(actEl) actEl.innerText = activeOrders[sid];
                if(itemsEl) itemsEl.innerText = itemsSold[sid];
            });
`;
        html = html.substring(0, jsInsertPoint + 30) + logicStr + html.substring(jsInsertPoint + 30);
    }
    
    fs.writeFileSync('panpuri_admin.html', html);
    console.log('Store Live Status refactored successfully.');
} else {
    console.log('Could not find <!-- Store Status Cards --> in panpuri_admin.html');
}
