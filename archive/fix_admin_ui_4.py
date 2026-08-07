import sys
content = open('panpuri_admin.html', 'r', encoding='utf-8').read()

# 1. Update tableBody 'input' event to not set _originalIndex
target_js = '''                const originalIndex = e.target.getAttribute('data-index');
                if(!unsavedChanges[id]) unsavedChanges[id] = { _originalIndex: originalIndex };'''
replacement_js = '''                if(!unsavedChanges[id]) unsavedChanges[id] = {};'''
content = content.replace(target_js, replacement_js)

# 2. Update commitChanges to refresh allProducts so the UI is up to date
target_js2 = '''                setTimeout(() => {
                    toast.classList.remove('opacity-100');
                    toast.classList.add('opacity-0');
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
            } catch (err) {'''
replacement_js2 = '''                setTimeout(() => {
                    toast.classList.remove('opacity-100');
                    toast.classList.add('opacity-0');
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
                // Refresh products in background to keep UI in sync
                if (typeof loadProducts === 'function') loadProducts();
            } catch (err) {'''
content = content.replace(target_js2, replacement_js2)

open('panpuri_admin.html', 'w', encoding='utf-8').write(content)
print('Done')
