import sys
content = open('store.html', 'r', encoding='utf-8').read()

# 1. Update updateTrueAnalytics signature
content = content.replace('function updateTrueAnalytics() {', 'function updateTrueAnalytics(ordersList = allOrders) {')

# 2. Update the call in updateStats
content = content.replace('if (typeof updateTrueAnalytics === \\'function\\') updateTrueAnalytics();', 'if (typeof updateTrueAnalytics === \\'function\\') updateTrueAnalytics(dashOrders);')

open('store.html', 'w', encoding='utf-8').write(content)
print('Done')
