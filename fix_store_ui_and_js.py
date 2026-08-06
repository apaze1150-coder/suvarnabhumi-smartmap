import sys
content = open('store.html', 'r', encoding='utf-8').read()

# 1. Remove left date picker from true_analytics
target1 = '''                        <div class="flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                            <label for="storeDatePicker" class="text-label-md text-on-surface-variant font-medium">Select Date:</label>
                            <input type="date" id="storeDatePicker" class="bg-transparent text-on-surface border-none outline-none font-bold text-sm cursor-pointer" onchange="if(typeof updateStats === 'function') updateStats()">
                        </div>
                        <div class="flex flex-wrap gap-2">'''
replace1 = '''                        <div class="flex flex-wrap gap-2">'''
content = content.replace(target1, replace1)

# 2. Fix updateTrueAnalytics JS crash
target_js = '''    if (!ordersList || ordersList.length === 0) {
        // Reset top metrics if no orders
        document.getElementById('ta-revenue').innerText = '? 0';
        document.getElementById('ta-items').innerText = '0';
        document.getElementById('ta-orders').innerText = '0';
        document.getElementById('ta-success').innerText = '0%';
        return;
    }'''
replace_js = '''    if (!ordersList || ordersList.length === 0) {
        return;
    }'''
content = content.replace(target_js, replace_js)

# Wait, I already fixed the ? 0 to ? 0 in previous script! Let me check what it currently says.

