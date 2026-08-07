import sys
content = open('panpuri_admin.html', 'r', encoding='utf-8').read()

# 1. Add fields to Add Product form
target_html = '''                    <input type="text" id="newProductSize" class="w-full bg-surface-container border border-outline-variant rounded-lg p-3 focus:border-primary">
                </div>
                <div>
                    <label class="block text-label-sm text-on-surface-variant mb-1">Price (THB)</label>'''
replacement_html = '''                    <input type="text" id="newProductSize" class="w-full bg-surface-container border border-outline-variant rounded-lg p-3 focus:border-primary">
                </div>
                <div class="col-span-2">
                    <label class="block text-label-sm text-on-surface-variant mb-1">Description For Customer</label>
                    <textarea id="newProductDescCust" rows="2" class="w-full bg-surface-container border border-outline-variant rounded-lg p-3 focus:border-primary"></textarea>
                </div>
                <div class="col-span-2">
                    <label class="block text-label-sm text-on-surface-variant mb-1">Scent Notes</label>
                    <textarea id="newProductScentNotes" rows="2" class="w-full bg-surface-container border border-outline-variant rounded-lg p-3 focus:border-primary"></textarea>
                </div>
                <div class="col-span-2">
                    <label class="block text-label-sm text-on-surface-variant mb-1">How To Use</label>
                    <textarea id="newProductHowToUse" rows="2" class="w-full bg-surface-container border border-outline-variant rounded-lg p-3 focus:border-primary"></textarea>
                </div>
                <div>
                    <label class="block text-label-sm text-on-surface-variant mb-1">Price (THB)</label>'''
content = content.replace(target_html, replacement_html)

# 2. Add fields to saveNewProduct object
target_js = '''        Qty_Branch3: document.getElementById('newProductStockTW4').value || (existing ? existing.Qty_Branch3 : '0'),
        Image: existing ? existing.Image : '''''
replacement_js = '''        Qty_Branch3: document.getElementById('newProductStockTW4').value || (existing ? existing.Qty_Branch3 : '0'),
        Description_Customer: document.getElementById('newProductDescCust').value || (existing ? existing.Description_Customer : ''),
        Scent_Notes: document.getElementById('newProductScentNotes').value || (existing ? existing.Scent_Notes : ''),
        How_to_Use: document.getElementById('newProductHowToUse').value || (existing ? existing.How_to_Use : ''),
        Image: existing ? existing.Image : '''''
content = content.replace(target_js, replacement_js)

open('panpuri_admin.html', 'w', encoding='utf-8').write(content)
print('Done')
