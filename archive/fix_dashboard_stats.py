import sys
content = open('panpuri_admin.html', 'r', encoding='utf-8').read()

# Add IDs to stats
content = content.replace('<span class="font-headline-xl text-headline-xl">1,284</span>', '<span id="dash-total-orders" class="font-headline-xl text-headline-xl">1,284</span>')
content = content.replace('<span class="font-headline-xl text-headline-xl text-on-surface">42</span>', '<span id="dash-pending" class="font-headline-xl text-headline-xl text-on-surface">0</span>')
content = content.replace('<span class="font-headline-xl text-headline-xl text-on-surface">158</span>', '<span id="dash-preparing" class="font-headline-xl text-headline-xl text-on-surface">0</span>')
content = content.replace('<span class="font-headline-xl text-headline-xl text-on-surface">312</span>', '<span id="dash-ready" class="font-headline-xl text-headline-xl text-on-surface">0</span>')

# Inject JS to update stats
js_target = 'const oldToNewStoreId = {'
js_replace = '''
            let pendingCount = 0;
            let preparingCount = 0;
            let readyCount = 0;
            filteredOrders.forEach(o => {
                const st = (o.status || '').toLowerCase();
                if (st === 'pending') pendingCount++;
                else if (st === 'preparing') preparingCount++;
                else if (st === 'ready_for_pickup' || st === 'ready') readyCount++;
            });
            const dashTotal = document.getElementById('dash-total-orders');
            if (dashTotal) dashTotal.innerText = filteredOrders.length.toLocaleString();
            const dashPending = document.getElementById('dash-pending');
            if (dashPending) dashPending.innerText = pendingCount.toLocaleString();
            const dashPreparing = document.getElementById('dash-preparing');
            if (dashPreparing) dashPreparing.innerText = preparingCount.toLocaleString();
            const dashReady = document.getElementById('dash-ready');
            if (dashReady) dashReady.innerText = readyCount.toLocaleString();

            const oldToNewStoreId = {'''
content = content.replace(js_target, js_replace)

open('panpuri_admin.html', 'w', encoding='utf-8').write(content)
print('Done')
