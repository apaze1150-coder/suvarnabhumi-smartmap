import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Clean up the messed up thead
messed_up_thead = '<thead class="bg-surface-container-low sticky top-0 z-10" data-col="no" data-col="code" data-col="desc" data-col="ref" data-col="cat" data-col="subcat" data-col="scent" data-col="size" data-col="price" data-col="img" data-col="qty1" data-col="qty2" data-col="qty3" data-col="desc_cust" data-col="scent_notes" data-col="how_to_use" data-col="actions">'
clean_thead = '<thead class="bg-surface-container-low sticky top-0 z-10">'
if messed_up_thead in content:
    content = content.replace(messed_up_thead, clean_thead)

# 2. Extract the table headers correctly and inject data-col
columns_map = {
    "No.": "no",
    "Code": "code",
    "Description": "desc",
    "Reference": "ref",
    "Category": "cat",
    "Sub Category": "subcat",
    "Scent": "scent",
    "Size": "size",
    "Price": "price",
    "Image": "img",
    "Qty_Branch1": "qty1",
    "Qty_Branch2": "qty2",
    "Qty_Branch3": "qty3",
    "Description For Customer": "desc_cust",
    "SCENT NOTES": "scent_notes",
    "How To Use": "how_to_use",
    "Actions": "actions"
}

# The block is inside <thead ...> <tr> ... </tr> </thead>
start_thead = content.find(clean_thead)
end_thead = content.find('</thead>', start_thead)
thead_block = content[start_thead:end_thead]

new_thead_block = thead_block
# Clean up any existing data-col from the ths in case they were wrongly added
new_thead_block = re.sub(r'\s*data-col="[^"]*"', '', new_thead_block)

# Now, properly inject them
for header_text, col_id in columns_map.items():
    # Find the precise th that contains this exact text
    # E.g. <th class="...">Description</th>
    pattern = r'(<th\b[^>]*>)([^<]*?\b' + re.escape(header_text) + r'\b[^<]*?)(</th>)'
    # We must iterate carefully or just replace
    new_thead_block = re.sub(pattern, r'\1\2\3', new_thead_block, flags=re.IGNORECASE)
    # Actually simpler:
    pattern2 = r'(<th\b[^>]*?)(>([^<]*?)' + re.escape(header_text) + r'([^<]*?)</th>)'
    new_thead_block = re.sub(pattern2, r'\1 data-col="' + col_id + r'"\2', new_thead_block, flags=re.IGNORECASE)

content = content.replace(thead_block, new_thead_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Headers fixed!")
