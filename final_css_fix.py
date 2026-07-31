import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Force inject .col-hidden
if ".col-hidden" not in content:
    content = content.replace("</style>", "    .col-hidden { display: none !important; }\n    </style>")

# 2. Force replace custom scrollbar CSS
old_scrollbar = """        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c5c6cd;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }"""

new_scrollbar = """        .custom-scrollbar::-webkit-scrollbar {
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
        }"""

if old_scrollbar in content:
    content = content.replace(old_scrollbar, new_scrollbar)
else:
    # Try regex fallback just in case spaces differ
    content = re.sub(r'\.custom-scrollbar::-webkit-scrollbar\s*\{[^}]+\}', '.custom-scrollbar::-webkit-scrollbar { width: 16px; height: 16px; background-color: #f5f5f5; }', content)
    content = re.sub(r'\.custom-scrollbar::-webkit-scrollbar-track\s*\{[^}]+\}', '.custom-scrollbar::-webkit-scrollbar-track { background-color: #f5f5f5; border-radius: 8px; box-shadow: inset 0 0 6px rgba(0,0,0,0.1); }', content)
    content = re.sub(r'\.custom-scrollbar::-webkit-scrollbar-thumb\s*\{[^}]+\}', '.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #b0b0b0; border-radius: 8px; border: 3px solid #f5f5f5; }', content)
    content = re.sub(r'\.custom-scrollbar::-webkit-scrollbar-thumb:hover\s*\{[^}]+\}', '.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #909090; }', content)

# 3. Ensure the Outer View-Products container does not scroll vertically so much
# We want the page to not scroll, and let the table scroll
outer_view_str = '<div class="p-margin-mobile md:p-margin-desktop space-y-lg overflow-y-auto custom-scrollbar">'
outer_view_new = '<div class="p-margin-mobile md:p-margin-desktop space-y-lg h-[calc(100vh-64px)] overflow-hidden flex flex-col">'
if outer_view_str in content:
    content = content.replace(outer_view_str, outer_view_new)

# Now find the wrapper around the table container
# We need to make sure the flex takes effect
wrapper_old = '<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden bento-shadow">'
wrapper_new = '<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden bento-shadow flex-1 flex flex-col min-h-0">'
if wrapper_old in content:
    content = content.replace(wrapper_old, wrapper_new)

# Now make the table container flex-1
table_old = '<div class="overflow-x-auto overflow-y-auto h-[calc(100vh-340px)] min-h-[400px] custom-scrollbar" id="productsTableContainer">'
table_new = '<div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">'
if table_old in content:
    content = content.replace(table_old, table_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("CSS and Layout fixed!")
