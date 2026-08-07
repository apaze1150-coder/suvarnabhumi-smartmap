import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the child of view-products
# Currently it is: class="p-margin-mobile md:p-margin-desktop space-y-lg h-[calc(100vh-64px)] overflow-hidden flex flex-col"
# We want it to be: class="p-margin-mobile md:p-margin-desktop space-y-lg flex-1 flex flex-col min-h-0 overflow-hidden"

# Find view-products
vp_idx = content.find('id="view-products"')
# Find the next div class
child_class_idx = content.find('class="', vp_idx + 20)
child_class_end = content.find('"', child_class_idx + 7)
child_class_str = content[child_class_idx:child_class_end+1]

# Make sure we are modifying the right one
if "h-[calc" in child_class_str or "overflow-y-auto" in child_class_str:
    new_child_class = 'class="p-margin-mobile md:p-margin-desktop space-y-lg flex-1 flex flex-col min-h-0 overflow-hidden"'
    content = content[:child_class_idx] + new_child_class + content[child_class_end+1:]

# Next, make sure the table wrapper is correct
# We did this in the last script but let's be sure
table_wrapper = '<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden bento-shadow flex-1 flex flex-col min-h-0">'
if table_wrapper not in content:
    # Try finding it and replacing
    wrapper_idx = content.find('<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden bento-shadow')
    if wrapper_idx != -1:
        # Find closing quote
        quote_end = content.find('"', wrapper_idx + 12)
        quote_end = content.find('"', quote_end + 1)
        # Just replace the whole class
        content = content[:wrapper_idx] + table_wrapper + content[quote_end+1:]

# Next, the table container itself
# It should be: <div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">
table_container = '<div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">'
if table_container not in content:
    # Try finding it
    tc_idx = content.find('id="productsTableContainer"')
    if tc_idx != -1:
        # It's better to just regex replace it
        content = re.sub(r'<div class="[^"]*?" id="productsTableContainer">', table_container, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Layout strictly constrained to viewport!")
