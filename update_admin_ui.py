import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add CSS for better scrollbars
css_to_add = """
    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
            border: 3px solid #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        .col-hidden {
            display: none !important;
        }
    </style>
"""
if ".custom-scrollbar::-webkit-scrollbar" not in content:
    content = content.replace("</head>", f"{css_to_add}\n</head>")

# 2. Update table headers to have data-col attribute
# Find the thead section
thead_start = content.find('<thead class="bg-surface-container-low sticky top-0 z-10">')
thead_end = content.find('</thead>', thead_start)
thead_content = content[thead_start:thead_end]

# We need to map columns to keys
columns_map = [
    ("No.", "no"),
    ("Code", "code"),
    ("Description", "desc"),
    ("Reference", "ref"),
    ("Category", "cat"),
    ("Sub Category", "subcat"),
    ("Scent", "scent"),
    ("Size", "size"),
    ("Price", "price"),
    ("Image", "img"),
    ("Qty_Branch1", "qty1"),
    ("Qty_Branch2", "qty2"),
    ("Qty_Branch3", "qty3"),
    ("Description For Customer", "desc_cust"),
    ("SCENT NOTES", "scent_notes"),
    ("How To Use", "how_to_use"),
    ("Actions", "actions")
]

new_thead_content = thead_content
for header_text, col_id in columns_map:
    # use regex to inject data-col
    pattern = r'(<th[^>]*?)(>.*?'+re.escape(header_text)+r'.*?</th>)'
    new_thead_content = re.sub(pattern, r'\1 data-col="'+col_id+r'"\2', new_thead_content, flags=re.IGNORECASE|re.DOTALL)

content = content.replace(thead_content, new_thead_content)

# 3. Add column visibility UI next to search input in the Products view
# Find search input in Products view
search_container_idx = content.find('<div class="relative w-full md:w-auto">')
if search_container_idx != -1 and "columnToggleBtn" not in content:
    # insert after the search input container
    search_end_idx = content.find('</div>', search_container_idx) + 6
    
    col_ui = """
                        <!-- Column Visibility Dropdown -->
                        <div class="relative">
                            <button id="columnToggleBtn" class="flex items-center gap-2 px-md py-3 border-2 border-outline-variant rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-label-md text-on-surface-variant">
                                <span class="material-symbols-outlined text-[18px]">view_column</span>
                                Columns
                            </button>
                            <div id="columnDropdown" class="hidden absolute right-0 mt-2 w-64 bg-white border border-outline-variant shadow-lg rounded-xl z-50 p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <p class="text-xs font-bold text-on-surface-variant uppercase mb-3 tracking-wider">Toggle Columns</p>
                                <div id="columnToggles" class="flex flex-col gap-2">
                                    <!-- Dynamic Checkboxes -->
                                </div>
                            </div>
                        </div>
    """
    content = content[:search_end_idx] + col_ui + content[search_end_idx:]

# 4. Add JS logic for column toggling
js_logic = """
        // --- COLUMN VISIBILITY LOGIC ---
        const columns = [
            { id: 'no', label: 'No.', defaultVisible: true },
            { id: 'code', label: 'Code', defaultVisible: true },
            { id: 'desc', label: 'Description', defaultVisible: true },
            { id: 'ref', label: 'Reference', defaultVisible: true },
            { id: 'cat', label: 'Category', defaultVisible: true },
            { id: 'subcat', label: 'Sub Category', defaultVisible: false },
            { id: 'scent', label: 'Scent', defaultVisible: false },
            { id: 'size', label: 'Size', defaultVisible: false },
            { id: 'price', label: 'Price', defaultVisible: true },
            { id: 'img', label: 'Image', defaultVisible: true },
            { id: 'qty1', label: 'Qty_Branch1', defaultVisible: true },
            { id: 'qty2', label: 'Qty_Branch2', defaultVisible: true },
            { id: 'qty3', label: 'Qty_Branch3', defaultVisible: true },
            { id: 'desc_cust', label: 'Description For Customer', defaultVisible: false },
            { id: 'scent_notes', label: 'Scent Notes', defaultVisible: false },
            { id: 'how_to_use', label: 'How To Use', defaultVisible: false },
            { id: 'actions', label: 'Actions', defaultVisible: true }
        ];

        let visibleColumns = {};
        // Initialize from local storage or defaults
        try {
            const saved = localStorage.getItem('panpuri_visible_columns');
            if (saved) visibleColumns = JSON.parse(saved);
            else columns.forEach(c => visibleColumns[c.id] = c.defaultVisible);
        } catch(e) {
            columns.forEach(c => visibleColumns[c.id] = c.defaultVisible);
        }

        function initColumnDropdown() {
            const container = document.getElementById('columnToggles');
            if (!container) return;
            
            container.innerHTML = '';
            columns.forEach(col => {
                const label = document.createElement('label');
                label.className = 'flex items-center gap-2 cursor-pointer p-2 hover:bg-surface-container rounded-md transition-colors';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'w-4 h-4 text-primary rounded border-outline focus:ring-primary';
                cb.checked = visibleColumns[col.id];
                cb.onchange = (e) => {
                    visibleColumns[col.id] = e.target.checked;
                    localStorage.setItem('panpuri_visible_columns', JSON.stringify(visibleColumns));
                    applyColumnVisibility();
                };
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(col.label));
                container.appendChild(label);
            });
            
            const btn = document.getElementById('columnToggleBtn');
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
            }
        }

        function applyColumnVisibility() {
            // Update Headers
            const ths = document.querySelectorAll('#productsTableBody').length > 0 
                ? document.querySelectorAll('th[data-col]') 
                : [];
            
            ths.forEach(th => {
                const colId = th.getAttribute('data-col');
                if (visibleColumns[colId] === false) {
                    th.classList.add('col-hidden');
                } else {
                    th.classList.remove('col-hidden');
                }
            });
            
            // Update Data Rows
            const trs = document.querySelectorAll('#productsTableBody tr');
            trs.forEach(tr => {
                // We assume td's are in the exact same order as the columns array
                const tds = tr.querySelectorAll('td');
                if (tds.length === columns.length) {
                    columns.forEach((col, index) => {
                        if (visibleColumns[col.id] === false) {
                            tds[index].classList.add('col-hidden');
                        } else {
                            tds[index].classList.remove('col-hidden');
                        }
                    });
                }
            });
        }
        
        // Wait for DOM to init column UI
        document.addEventListener('DOMContentLoaded', () => {
            initColumnDropdown();
            applyColumnVisibility();
        });
"""

if "initColumnDropdown" not in content:
    # insert before function renderProducts
    content = content.replace("function renderProducts(products) {", f"{js_logic}\n\n        function renderProducts(products) {{")


# In renderTable, we need to applyColumnVisibility() at the end
if "applyColumnVisibility();" not in content.split("function renderTable()")[1].split("}")[0]:
    # We will just append it after filtered.forEach(...)
    render_table_block = content.split("function renderTable() {")[1].split("document.getElementById('searchInput').addEventListener('input', renderTable);")[0]
    
    if "filtered.forEach(" in render_table_block:
        new_render_table_block = render_table_block.replace("        });\n    }", "        });\n        applyColumnVisibility();\n    }")
        content = content.replace(render_table_block, new_render_table_block)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated admin html successfully!")
