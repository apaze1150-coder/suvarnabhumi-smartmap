import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the Table Container height so the scrollbar floats correctly
old_container = '<div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">'
new_container = '<div class="overflow-x-auto overflow-y-auto h-[calc(100vh-340px)] min-h-[400px] custom-scrollbar" id="productsTableContainer">'
if old_container in content:
    content = content.replace(old_container, new_container)

# 2. Refactor Column Toggle UI to use inline onclick for 100% reliability
old_btn = 'id="columnToggleBtn" class="flex'
new_btn = 'id="columnToggleBtn" onclick="toggleColumnDropdown(event)" class="flex'
if old_btn in content and new_btn not in content:
    content = content.replace(old_btn, new_btn)

# 3. Add toggleColumnDropdown function and ensure init runs
js_injection = """
        function toggleColumnDropdown(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('columnDropdown');
            if(dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }
        
        // Ensure dropdown closes when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('columnDropdown');
            const btn = document.getElementById('columnToggleBtn');
            if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // Initialize immediately
        setTimeout(() => {
            initColumnDropdown();
            applyColumnVisibility();
        }, 500);
"""
if "toggleColumnDropdown(e)" not in content:
    content = content.replace("function initColumnDropdown() {", js_injection + "\n        function initColumnDropdown() {")

# 4. Remove the old event listener logic inside initColumnDropdown to avoid conflicts
# We will just replace it with empty string
old_btn_logic = """            const btn = document.getElementById('columnToggleBtn');
            const dropdown = document.getElementById('columnDropdown');
            if (btn && dropdown) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                };
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target) && e.target !== btn) {
                        dropdown.classList.add('hidden');
                    }
                });
            }"""
if old_btn_logic in content:
    content = content.replace(old_btn_logic, "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixes applied successfully!")
