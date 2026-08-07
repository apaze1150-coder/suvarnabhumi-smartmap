import sys
content = open('panpuri_admin.html', 'r', encoding='utf-8').read()

# 1. Inject Date Picker HTML
html_target = '<!-- Global Stats Bento Grid -->'
html_replace = '''<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-4">
    <h3 class="text-title-lg font-bold text-on-surface">Daily Sales Dashboard</h3>
    <div class="flex items-center gap-3">
        <label for="dashboardDatePicker" class="text-label-md text-on-surface-variant font-medium">Select Date:</label>
        <input type="date" id="dashboardDatePicker" class="bg-surface-container-high text-on-surface border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all cursor-pointer" onchange="if (typeof loadDashboardStats === 'function') loadDashboardStats()">
    </div>
</div>
<!-- Global Stats Bento Grid -->'''
content = content.replace(html_target, html_replace)

# 2. Update Total Orders text
txt_target = 'Total Orders (24h)'
txt_replace = 'Total Orders (Selected)'
content = content.replace(txt_target, txt_replace)

# 3. Inject JS Filtering Logic into loadDashboardStats
js_target = 'const oldToNewStoreId = {'
js_replace = '''const datePicker = document.getElementById('dashboardDatePicker');
            if (datePicker && !datePicker.value) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                datePicker.value = ${yyyy}--;
            }
            const selectedDate = datePicker ? datePicker.value : null;
            
            let filteredOrders = orders;
            if (selectedDate) {
                filteredOrders = orders.filter(o => {
                    if (!o.created_at) return false;
                    const orderDate = new Date(o.created_at);
                    const yyyy = orderDate.getFullYear();
                    const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(orderDate.getDate()).padStart(2, '0');
                    return ${yyyy}-- === selectedDate;
                });
            }
            
            // Update Total Orders text in DOM
            const totalOrdersTextEl = document.querySelector('p.text-label-sm.text-on-primary-container');
            if(totalOrdersTextEl) {
                totalOrdersTextEl.innerText = TOTAL ORDERS ();
            }
            
            const oldToNewStoreId = {'''
content = content.replace(js_target, js_replace)

# 4. Replace 'orders.forEach' with 'filteredOrders.forEach' in two places
content = content.replace('orders.forEach(o => {', 'filteredOrders.forEach(o => {')

# 5. Fix the Global Total Orders display (where it says 1,284 right now, it needs to reflect filteredOrders.length)
# Wait, currently the dashboard sets the stats somewhere? Let's check where the stats are updated.
open('panpuri_admin.html', 'w', encoding='utf-8').write(content)
print('Done')
