import sys
content = open('panpuri_admin.html', 'r', encoding='utf-8').read()

# 1. Update allProducts locally instead of loadProducts
target_js = '''            const payload = { ...unsavedChanges };
            unsavedChanges = {};'''
replacement_js = '''            const payload = { ...unsavedChanges };
            // Update local memory to prevent revert on next renderTable
            for (const code in payload) {
                const idx = allProducts.findIndex(p => p.Code == code);
                if (idx !== -1) {
                    for (const field in payload[code]) {
                        allProducts[idx][field] = payload[code][field];
                    }
                }
            }
            unsavedChanges = {};'''
content = content.replace(target_js, replacement_js)

# 2. Remove the loadProducts call
target_js2 = '''                // Refresh products in background to keep UI in sync
                if (typeof loadProducts === 'function') loadProducts();'''
replacement_js2 = ''''''
content = content.replace(target_js2, replacement_js2)

open('panpuri_admin.html', 'w', encoding='utf-8').write(content)
print('Done')
