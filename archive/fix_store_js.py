import sys
content = open('store.html', 'r', encoding='utf-8').read()

# 1. Update updateStats() to read date picker and filter orders
js_target = '''function updateStats() {
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
            .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);'''
js_replace = '''function updateStats() {
    // Global Live Stats (unfiltered)
    const pendingCount = allOrders.filter(o=>o.status==='pending').length;
    const preparingCount = allOrders.filter(o=>o.status==='preparing'||o.status==='confirmed').length;
    const readyCount = allOrders.filter(o=>o.status==='ready').length;
    
    document.getElementById('st-pending').textContent = pendingCount;
    document.getElementById('st-preparing').textContent = preparingCount;
    document.getElementById('st-ready').textContent = readyCount;

    // Dashboard Specific Stats (filtered by date)
    const datePicker = document.getElementById('storeDatePicker');
    if (datePicker && !datePicker.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        datePicker.value = yyyy + '-' + mm + '-' + dd;
    }
    const selectedDate = datePicker ? datePicker.value : null;
    
    let dashOrders = allOrders;
    if (selectedDate) {
        dashOrders = allOrders.filter(o => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            const yyyy = orderDate.getFullYear();
            const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
            const dd = String(orderDate.getDate()).padStart(2, '0');
            return yyyy + '-' + mm + '-' + dd === selectedDate;
        });
    }

    const dashWaitingCount = dashOrders.filter(o=>o.status==='pending').length;
    const dashReadyCount = dashOrders.filter(o=>o.status==='ready').length;
    
    const dashWaiting = document.getElementById('dash-waiting');
    if (dashWaiting) dashWaiting.textContent = dashWaitingCount;
    
    const dashReady = document.getElementById('dash-ready');
    if (dashReady) dashReady.textContent = dashReadyCount;
    
    const dashTotalSales = document.getElementById('dash-total-sales');
    if (dashTotalSales) {
        const totalSales = dashOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);'''
content = content.replace(js_target, js_replace)

# 2. Update calls to initAnalyticsChart and updateDashboardInsights
content = content.replace('initAnalyticsChart();', 'initAnalyticsChart(dashOrders);')
content = content.replace('updateDashboardInsights();', 'updateDashboardInsights(dashOrders);')

# 3. Update signatures and logic in those two functions
# For initAnalyticsChart:
content = content.replace('function initAnalyticsChart() {', 'function initAnalyticsChart(ordersList = allOrders) {')
content = content.replace('allOrders.forEach(o => {', 'ordersList.forEach(o => {')
# Wait, updateDashboardInsights also uses allOrders.forEach:
content = content.replace('function updateDashboardInsights() {', 'function updateDashboardInsights(ordersList = allOrders) {')
# But wait, there are two allOrders in updateDashboardInsights: one for orders and one maybe for products?
# No, the products one uses llProducts. The orders one uses llOrders.

open('store.html', 'w', encoding='utf-8').write(content)
print('Done')
