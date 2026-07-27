const fs = require('fs');
let html = fs.readFileSync('panpuri_admin.html', 'utf8');

// 1. Remove the duplicate inner views (view-database and view-stocklogs) that are inside view-dashboard.
// They start with <!-- View: Product Database --> and end before <!-- Floating Mobile Nav Placeholder -->
const startDuplicate = html.indexOf('<!-- View: Product Database -->');
const endDuplicate = html.indexOf('<!-- Floating Mobile Nav Placeholder -->');
if(startDuplicate !== -1 && endDuplicate !== -1) {
    html = html.substring(0, startDuplicate) + html.substring(endDuplicate);
}

// 2. Remove id="view-dashboard" from the inner div (line ~207)
html = html.replace('<div class="flex-1 overflow-y-auto p-margin-desktop space-y-lg custom-scrollbar" id="view-dashboard">', '<div class="flex-1 overflow-y-auto p-margin-desktop space-y-lg custom-scrollbar">');

// 3. Move Mobile Nav outside of all views.
const mobileNavStart = html.indexOf('<!-- Floating Mobile Nav Placeholder -->');
const mobileNavEnd = html.indexOf('</div>\r\n        </div>\r\n        <div id="view-orders"');
let actualMobileNavEnd = mobileNavEnd;
if(mobileNavEnd === -1) {
    actualMobileNavEnd = html.indexOf('</div>\n        </div>\n        <div id="view-orders"');
}
if (mobileNavStart !== -1 && actualMobileNavEnd !== -1) {
    const mobileNavStr = html.substring(mobileNavStart, actualMobileNavEnd + 6); // include the </div>
    // Remove it from current position
    html = html.substring(0, mobileNavStart) + html.substring(actualMobileNavEnd + 6);
    // Insert before </main>
    const mainEnd = html.indexOf('</main>');
    html = html.substring(0, mainEnd) + mobileNavStr + '\n    ' + html.substring(mainEnd);
}

// 4. Inject Chart.js script tag into <head>
if (!html.includes('chart.js')) {
    html = html.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>');
}

// 5. Inject new widgets into Dashboard
const dashboardWidgetsHtml = `
                <!-- NEW: Charts & Alerts -->
                <section class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                    <!-- Chart Widget 1: Store Sales & Order Comparison -->
                    <div class="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                        <div class="flex justify-between items-center mb-md">
                            <h3 class="font-headline-md text-headline-md text-primary">Store Sales & Order Comparison</h3>
                            <button class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
                        </div>
                        <div class="flex-1 min-h-[300px] relative">
                            <canvas id="salesComparisonChart"></canvas>
                        </div>
                    </div>
                    
                    <!-- Widget 2: Side-by-Side -->
                    <div class="flex flex-col gap-lg">
                        <!-- Cross-Store Low Stock Alerts -->
                        <div class="flex-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                            <div class="flex justify-between items-center mb-sm">
                                <h3 class="font-headline-md text-on-surface">Low Stock Alerts</h3>
                                <span class="material-symbols-outlined text-error">warning</span>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[150px] space-y-2" id="dashboardLowStockList">
                                <p class="text-body-sm text-outline">Loading...</p>
                            </div>
                        </div>

                        <!-- Top 5 Overall Best Sellers -->
                        <div class="flex-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                            <div class="flex justify-between items-center mb-sm">
                                <h3 class="font-headline-md text-on-surface">Top 5 Best Sellers</h3>
                                <span class="material-symbols-outlined text-status-gold" style="font-variation-settings: 'FILL' 1;">star</span>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[150px] space-y-2" id="dashboardTopSellersList">
                                <p class="text-body-sm text-outline">Loading...</p>
                            </div>
                        </div>
                    </div>
                </section>
`;

const storeStatusStart = html.indexOf('<!-- Store Status Cards -->');
if (storeStatusStart !== -1 && !html.includes('salesComparisonChart')) {
    html = html.substring(0, storeStatusStart) + dashboardWidgetsHtml + '\n                ' + html.substring(storeStatusStart);
}

// 6. Fix Stock Logs Top Control Bar and Summary cards
const stockLogsViewStart = html.indexOf('<div id="view-stocklogs"');
if(stockLogsViewStart !== -1) {
    const totalTransactionsStart = html.indexOf('<div class="col-span-12 lg:col-span-4 glass-panel p-lg rounded-xl flex items-center justify-between">', stockLogsViewStart);
    if(totalTransactionsStart !== -1 && !html.includes('RECENT RECEIPTS')) {
        // We want to add RECENT RECEIPTS. Let's replace the whole grid for stock logs filters.
        const gridEnd = html.indexOf('</div>\n</div>\n\n<div class="bg-white rounded-xl', stockLogsViewStart);
        let actualGridEnd = gridEnd;
        if(gridEnd === -1) actualGridEnd = html.indexOf('</div>\r\n</div>\r\n\r\n<div class="bg-white rounded-xl', stockLogsViewStart);
        
        if (actualGridEnd !== -1) {
            const newGridHtml = `
<div class="grid grid-cols-12 gap-lg">
    <div class="col-span-12 xl:col-span-8 glass-panel p-lg rounded-xl flex flex-wrap items-end gap-lg">
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">DATE RANGE</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">calendar_today</span>
                <select class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
            </div>
        </div>
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">BRANCH</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">store</span>
                <select id="branchFilter" class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option value="all">All Branches</option>
                    <option value="de40">DE40</option>
                    <option value="de12">DE12</option>
                    <option value="dw41">DW41</option>
                </select>
            </div>
        </div>
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">TRANSACTION TYPE</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">category</span>
                <select id="typeFilter" class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option value="all">All Types</option>
                    <option value="transfer">Transfer</option>
                    <option value="receipt">Receipt</option>
                    <option value="adjustment">Adjustment</option>
                </select>
            </div>
        </div>
        <div>
            <button onclick="exportStockLogsCSV()" class="h-[48px] px-lg bg-surface-container border-2 border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-body-sm font-bold">
                <span class="material-symbols-outlined">download</span> Export CSV
            </button>
        </div>
    </div>
    
    <div class="col-span-12 xl:col-span-4 flex gap-lg">
        <div class="flex-1 glass-panel p-lg rounded-xl flex items-center justify-between">
            <div>
                <p class="text-label-sm text-on-surface-variant">TOTAL TRANSACTIONS</p>
                <h3 id="totalLogs" class="text-headline-lg font-bold text-primary">0</h3>
            </div>
            <div class="h-12 w-12 bg-secondary-container/30 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-secondary text-2xl">insights</span>
            </div>
        </div>
        <div class="flex-1 glass-panel p-lg rounded-xl flex items-center justify-between">
            <div>
                <p class="text-label-sm text-on-surface-variant">RECENT RECEIPTS</p>
                <h3 id="recentReceipts" class="text-headline-lg font-bold text-green-700">0</h3>
            </div>
            <div class="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 text-2xl">inventory</span>
            </div>
        </div>
    </div>`;
            const gridStart = html.indexOf('<div class="grid grid-cols-12 gap-lg">', stockLogsViewStart);
            html = html.substring(0, gridStart) + newGridHtml + html.substring(actualGridEnd);
        }
    }
}

fs.writeFileSync('panpuri_admin.html', html);
console.log('Done');
