const fs = require('fs');
const path = require('path');

const storeHtmlPath = path.join(__dirname, 'store.html');
let content = fs.readFileSync(storeHtmlPath, 'utf8');

// Inject window.globalStoreSales = data.storeSales into loadOrders
const loadOrdersSearch = `        if (!Array.isArray(data.orders)) return;
        const orders = data.orders;`;
const loadOrdersReplace = `        if (!Array.isArray(data.orders)) return;
        const orders = data.orders;
        window.globalStoreSales = data.storeSales || {};`;

if (content.includes(loadOrdersSearch) && !content.includes('window.globalStoreSales')) {
    content = content.replace(loadOrdersSearch, loadOrdersReplace);
}

// Add ID to Store Comparison container
const storeCompSearch = `                            <div class="space-y-6 flex-1">
                                <!-- DE40 -->`;
const storeCompReplace = `                            <div class="space-y-6 flex-1" id="dash-store-comparison">
                                <!-- DE40 -->`;
if (content.includes(storeCompSearch) && !content.includes('id="dash-store-comparison"')) {
    content = content.replace(storeCompSearch, storeCompReplace);
}

// Append Store Comparison logic to updateDashboardInsights
const insertSearch = `        topPerformersContainer.innerHTML = topSales.map(ts => {
            return '<tr>' +
                '<td class="py-4">' +
                    '<div class="flex items-center gap-3">' +
                        '<div class="w-10 h-10 bg-surface-container-high rounded-md overflow-hidden shrink-0">' +
                            '<div class="w-full h-full bg-slate-200 flex items-center justify-center"><span class="material-symbols-outlined text-white text-sm">inventory_2</span></div>' +
                        '</div>' +
                        '<span class="font-bold text-sm">' + ts.name + '</span>' +
                    '</div>' +
                '</td>' +
                '<td class="py-4">' +
                    '<span class="text-xs text-on-surface-variant">' + (ts.scent || 'N/A') + '</span>' +
                '</td>' +
                '<td class="py-4 text-right font-bold text-[#D4AF37]">' + ts.sales + '</td>' +
            '</tr>';
        }).join('');
    }`;

const insertReplace = insertSearch + `

    // 3. Update Store Comparison
    const storeCompContainer = document.getElementById('dash-store-comparison');
    if (storeCompContainer && window.globalStoreSales) {
        let maxSales = 0;
        const salesData = [];
        const STORES_LIST = [
            { id: 'DE40', name: 'DE40 Flagship' },
            { id: 'DE12', name: 'DE12 EmQuartier' },
            { id: 'DW41', name: 'DW41 Boutique' }
        ];
        
        STORES_LIST.forEach(st => {
            const val = window.globalStoreSales[st.id] || 0;
            if (val > maxSales) maxSales = val;
            salesData.push({ id: st.id, name: st.name, val: val });
        });
        
        if (maxSales === 0) maxSales = 1; // prevent div by zero
        
        storeCompContainer.innerHTML = salesData.map((st, index) => {
            const pct = Math.round((st.val / maxSales) * 100);
            const valStr = st.val > 1000 ? (st.val/1000).toFixed(1) + 'k' : st.val.toString();
            const colorClass = index % 2 === 0 ? 'bg-[#1C1C1E]' : 'bg-[#D4AF37]';
            const textClass = index % 2 === 0 ? 'text-[#D4AF37]' : 'text-[#1C1C1E]';
            
            return '<div>' +
                '<div class="flex justify-between items-end mb-2">' +
                    '<span class="font-bold text-sm">' + st.name + '</span>' +
                    '<span class="font-bold text-sm ' + textClass + '">฿ ' + valStr + '</span>' +
                '</div>' +
                '<div class="w-full bg-surface-container-high rounded-full h-3">' +
                    '<div class="' + colorClass + ' h-3 rounded-full" style="width: ' + pct + '%"></div>' +
                '</div>' +
            '</div>';
        }).join('');
    }`;

if (content.includes(insertSearch) && !content.includes('// 3. Update Store Comparison')) {
    content = content.replace(insertSearch, insertReplace);
}

fs.writeFileSync(storeHtmlPath, content, 'utf8');
console.log('store.html updated with store comparison logic');
