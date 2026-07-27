const fs = require('fs');
const path = require('path');

const storeHtmlPath = path.join(__dirname, 'store.html');
let content = fs.readFileSync(storeHtmlPath, 'utf8');

// Replace Total Sales
content = content.replace(
    '<h3 class="font-headline-lg text-4xl text-[#D4AF37]">฿ 142,500</h3>',
    '<h3 id="dash-total-sales" class="font-headline-lg text-4xl text-[#D4AF37]">฿ 0</h3>'
);

// Replace Waiting
content = content.replace(
    '<h3 class="font-headline-lg text-4xl text-on-surface">12</h3>',
    '<h3 id="dash-waiting" class="font-headline-lg text-4xl text-on-surface">0</h3>'
);

// Replace Ready
content = content.replace(
    '<h3 class="font-headline-lg text-4xl text-[#D4AF37]">05</h3>',
    '<h3 id="dash-ready" class="font-headline-lg text-4xl text-[#D4AF37]">0</h3>'
);

// Update updateStats function
const updateStatsOld = `function updateStats() {
    document.getElementById('st-pending').textContent   = allOrders.filter(o=>o.status==='pending').length;
    document.getElementById('st-preparing').textContent = allOrders.filter(o=>o.status==='preparing'||o.status==='confirmed').length;
    document.getElementById('st-ready').textContent     = allOrders.filter(o=>o.status==='ready').length;
}`;

const updateStatsNew = `function updateStats() {
    const pendingCount = allOrders.filter(o=>o.status==='pending').length;
    const preparingCount = allOrders.filter(o=>o.status==='preparing'||o.status==='confirmed').length;
    const readyCount = allOrders.filter(o=>o.status==='ready').length;
    
    document.getElementById('st-pending').textContent = pendingCount;
    document.getElementById('st-preparing').textContent = preparingCount;
    document.getElementById('st-ready').textContent = readyCount;
    
    const dashWaiting = document.getElementById('dash-waiting');
    if (dashWaiting) dashWaiting.textContent = pendingCount;
    
    const dashReady = document.getElementById('dash-ready');
    if (dashReady) dashReady.textContent = readyCount;
    
    const dashTotalSales = document.getElementById('dash-total-sales');
    if (dashTotalSales) {
        const totalSales = allOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
        dashTotalSales.textContent = '฿ ' + totalSales.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
    
    if (window.analyticsChartInitialized) {
        initAnalyticsChart();
    }
}`;

content = content.replace(updateStatsOld, updateStatsNew);

// Update initAnalyticsChart
const initChartOld = `function initAnalyticsChart() {
    const ctx = document.getElementById('peakHoursChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['08:00', '12:00', '16:00', '20:00', '22:00'],
            datasets: [{
                label: 'Order Volume',
                data: [15, 45, 30, 60, 20],`;

const initChartNew = `function initAnalyticsChart() {
    const ctx = document.getElementById('peakHoursChart');
    if (!ctx) return;
    
    const hourCounts = [0, 0, 0, 0, 0];
    allOrders.forEach(o => {
        if (o.status === 'cancelled') return;
        const dt = new Date(o.created_at);
        const hr = dt.getHours();
        if (hr >= 6 && hr < 10) hourCounts[0]++;
        else if (hr >= 10 && hr < 14) hourCounts[1]++;
        else if (hr >= 14 && hr < 18) hourCounts[2]++;
        else if (hr >= 18 && hr < 21) hourCounts[3]++;
        else hourCounts[4]++;
    });

    if (window.peakChartInstance) window.peakChartInstance.destroy();

    window.peakChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['08:00', '12:00', '16:00', '20:00', '22:00'],
            datasets: [{
                label: 'Order Volume',
                data: hourCounts,`;

content = content.replace(initChartOld, initChartNew);

fs.writeFileSync(storeHtmlPath, content, 'utf8');
console.log('store.html updated');
