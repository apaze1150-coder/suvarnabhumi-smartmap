import sys
content = open('store.html', 'r', encoding='utf-8').read()

# 1. Replace the static date with Date Picker
html_target = '''                        <div class="flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                            <span class="material-symbols-outlined text-on-surface-variant text-[20px]">calendar_today</span>
                            <span class="font-bold text-sm text-on-surface">From Oct 01, 2023 To Oct 31, 2023</span>
                        </div>'''
html_replace = '''                        <div class="flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                            <label for="storeDatePicker" class="text-label-md text-on-surface-variant font-medium">Select Date:</label>
                            <input type="date" id="storeDatePicker" class="bg-transparent text-on-surface border-none outline-none font-bold text-sm cursor-pointer" onchange="if(typeof updateStats === 'function') updateStats()">
                        </div>'''
content = content.replace(html_target, html_replace)

# Also replace it for True Analytics View (line 452 block)
true_target = '''                        <div class="flex flex-wrap gap-2">
                            <button class="px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-all">Today</button>'''
true_replace = html_replace + '''
                        <div class="flex flex-wrap gap-2">
                            <button class="px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-all">Today</button>'''
content = content.replace(true_target, true_replace)

open('store.html', 'w', encoding='utf-8').write(content)
print('Done')
