import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject UI if not already there
if "id=\"columnToggleBtn\"" not in content:
    # Find the button Add Product
    add_btn_str = '<button onclick="openAddProductModal()"'
    idx = content.find(add_btn_str)
    
    if idx != -1:
        col_ui = """
                        <!-- Column Visibility Dropdown -->
                        <div class="relative inline-block">
                            <button id="columnToggleBtn" class="flex items-center gap-2 bg-surface-container-high text-on-surface px-lg py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all">
                                <span class="material-symbols-outlined text-[20px]">view_column</span>
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
        content = content[:idx] + col_ui + content[idx:]

# 2. Make custom scrollbar even bigger and ALWAYS visible
better_css = """
        .custom-scrollbar::-webkit-scrollbar {
            width: 16px;
            height: 16px;
            background-color: #f5f5f5;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #f5f5f5;
            border-radius: 8px;
            box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #b0b0b0;
            border-radius: 8px;
            border: 3px solid #f5f5f5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #909090;
        }
"""

if "width: 12px" in content:
    content = content.replace("width: 12px;", "width: 16px; background-color: #f5f5f5;")
    content = content.replace("height: 12px;", "height: 16px;")
    content = content.replace("background: #f1f1f1;", "background-color: #f5f5f5; box-shadow: inset 0 0 6px rgba(0,0,0,0.1);")
    content = content.replace("background: #c1c1c1;", "background-color: #b0b0b0;")
    content = content.replace("background: #a8a8a8;", "background-color: #909090;")

# Make sure the table wrapper has custom-scrollbar class
table_wrapper = '<div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">'
if table_wrapper not in content:
    old_wrapper = '<div class="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">'
    content = content.replace(old_wrapper, table_wrapper)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UI fixed successfully!")
