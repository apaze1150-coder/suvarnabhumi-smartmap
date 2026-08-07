const fs = require('fs');
const path = require('path');

const storeHtmlPath = path.join(__dirname, 'store.html');
let content = fs.readFileSync(storeHtmlPath, 'utf8');

// Fix 1: Chart flickering
const chartOld = `    if (window.peakChartInstance) window.peakChartInstance.destroy();

    window.peakChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['08:00', '12:00', '16:00', '20:00', '22:00'],
            datasets: [{
                label: 'Order Volume',
                data: hourCounts,`;

const chartNew = `    if (window.peakChartInstance) {
        window.peakChartInstance.data.datasets[0].data = hourCounts;
        window.peakChartInstance.update();
        return;
    }

    window.peakChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['08:00', '12:00', '16:00', '20:00', '22:00'],
            datasets: [{
                label: 'Order Volume',
                data: hourCounts,`;

if (content.includes(chartOld)) {
    content = content.replace(chartOld, chartNew);
} else {
    // try shorter
    const chartOld2 = `if (window.peakChartInstance) window.peakChartInstance.destroy();`;
    const chartNew2 = `if (window.peakChartInstance) {
        window.peakChartInstance.data.datasets[0].data = hourCounts;
        window.peakChartInstance.update();
        return;
    }`;
    content = content.replace(chartOld2, chartNew2);
}

// Fix 2: Inventory Insights ID
const inventoryOld = `<h3 class="font-bold text-lg text-on-surface mb-6">Inventory Insights</h3>
                            
                            <div class="space-y-4">`;
const inventoryNew = `<h3 class="font-bold text-lg text-on-surface mb-6">Inventory Insights</h3>
                            
                            <div class="space-y-4" id="dash-inventory-insights">`;
content = content.replace(inventoryOld, inventoryNew);

// Fix 3: Top Performers ID
const performersOld = `<h3 class="font-bold text-lg text-on-surface mb-6">Top Performers</h3>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse min-w-[400px]">
                                    <thead>
                                        <tr class="text-on-surface-variant uppercase font-label-sm text-[10px] tracking-widest border-b border-outline-variant/20">
                                            <th class="pb-3 font-bold">Product</th>
                                            <th class="pb-3 font-bold">Scent Profile</th>
                                            <th class="pb-3 font-bold text-right">Sales</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-outline-variant/10">`;
const performersNew = `<h3 class="font-bold text-lg text-on-surface mb-6">Top Performers</h3>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse min-w-[400px]">
                                    <thead>
                                        <tr class="text-on-surface-variant uppercase font-label-sm text-[10px] tracking-widest border-b border-outline-variant/20">
                                            <th class="pb-3 font-bold">Product</th>
                                            <th class="pb-3 font-bold">Scent Profile</th>
                                            <th class="pb-3 font-bold text-right">Sales</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-outline-variant/10" id="dash-top-performers">`;
content = content.replace(performersOld, performersNew);

// Fix 4: Add updateDashboardInsights function and call it
const updateStatsFind = `    if (window.analyticsChartInitialized) {
        initAnalyticsChart();
    }
}`;
const updateStatsReplace = `    if (window.analyticsChartInitialized) {
        initAnalyticsChart();
    }
    updateDashboardInsights();
}`;
content = content.replace(updateStatsFind, updateStatsReplace);

const newFunction = `
function updateDashboardInsights() {
    // 1. Update Inventory Insights
    const inventoryContainer = document.getElementById('dash-inventory-insights');
    if (inventoryContainer && allProducts && allProducts.length > 0) {
        const qtyField = 'qty_' + (currentStore || 'de40').toLowerCase();
        // Get products with lowest stock
        const lowStock = allProducts.map(p => {
            const stock = parseInt(p[qtyField] || p[(currentStore||'de40').toLowerCase()] || p.Qty_Branch1 || 0);
            return { ...p, stock };
        }).sort((a,b) => a.stock - b.stock).slice(0, 3);
        
        inventoryContainer.innerHTML = lowStock.map(p => {
            const name = p.name || p.Description || p.product_name || 'Unknown';
            if (p.stock <= 0) {
                return '<div class="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/10">' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">' +
                            '<span class="material-symbols-outlined text-red-500">error</span>' +
                        '</div>' +
                        '<div>' +
                            '<p class="font-bold text-sm text-on-surface">' + name + '</p>' +
                            '<p class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">OUT OF STOCK</p>' +
                        '</div>' +
                    '</div>' +
                    '<button class="px-4 py-1 border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs rounded-full transition-colors uppercase tracking-wide">Reorder</button>' +
                '</div>';
            } else {
                return '<div class="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/10">' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">' +
                            '<span class="material-symbols-outlined text-orange-500">warning</span>' +
                        '</div>' +
                        '<div>' +
                            '<p class="font-bold text-sm text-on-surface">' + name + '</p>' +
                            '<p class="text-xs text-on-surface-variant uppercase tracking-wider mt-1">LOW STOCK</p>' +
                        '</div>' +
                    '</div>' +
                    '<span class="px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full border border-orange-200">' + p.stock + ' Left</span>' +
                '</div>';
            }
        }).join('');
    }

    // 2. Update Top Performers
    const topPerformersContainer = document.getElementById('dash-top-performers');
    if (topPerformersContainer && allOrders && allOrders.length > 0) {
        const productSales = {};
        allOrders.forEach(o => {
            if (o.status === 'cancelled') return;
            if (Array.isArray(o.items)) {
                o.items.forEach(item => {
                    const pid = item.product_id || item.product_code || item.name;
                    if (!productSales[pid]) {
                        productSales[pid] = { name: item.name, sales: 0, scent: '' };
                    }
                    productSales[pid].sales += parseInt(item.qty || 1);
                });
            }
        });
        
        const topSales = Object.values(productSales).sort((a,b) => b.sales - a.sales).slice(0, 3);
        topSales.forEach(ts => {
            if (allProducts && allProducts.length > 0) {
                const prod = allProducts.find(p => (p.Description && p.Description === ts.name) || (p.name && p.name === ts.name) || (p.product_name && p.product_name === ts.name));
                if (prod) ts.scent = prod.Scent || prod.scent || prod.scent_profile || prod.Reference || 'N/A';
            }
        });

        topPerformersContainer.innerHTML = topSales.map(ts => {
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
    }
}
`;

if (!content.includes('function updateDashboardInsights')) {
    content += '\n' + newFunction;
}

fs.writeFileSync(storeHtmlPath, content, 'utf8');
console.log('store.html updated for fix 2');
