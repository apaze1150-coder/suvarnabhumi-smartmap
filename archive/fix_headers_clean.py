import re

file_path = "d:/apaze/Smartindoormap/panpuri_admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Target the thead block for exact replacements
thead_start = content.find('<thead class="bg-surface-container-low sticky top-0 z-10">')
if thead_start == -1:
    thead_start = content.find('<thead')

thead_end = content.find('</thead>', thead_start)
thead_block = content[thead_start:thead_end]

# Strip ALL data-col attributes first to get a clean slate
clean_thead = re.sub(r'\s+data-col="[^"]+"', '', thead_block)

# Exact match replacements
replacements = [
    ('>No.</th>', ' data-col="no">No.</th>'),
    ('>Code</th>', ' data-col="code">Code</th>'),
    ('>Description</th>', ' data-col="desc">Description</th>'),
    ('>Reference</th>', ' data-col="ref">Reference</th>'),
    ('>Category</th>', ' data-col="cat">Category</th>'),
    ('>Sub Category</th>', ' data-col="subcat">Sub Category</th>'),
    ('>Scent</th>', ' data-col="scent">Scent</th>'),
    ('>Size</th>', ' data-col="size">Size</th>'),
    ('>Price</th>', ' data-col="price">Price</th>'),
    ('>Image</th>', ' data-col="img">Image</th>'),
    ('>Qty_Branch1</th>', ' data-col="qty1">Qty_Branch1</th>'),
    ('>Qty_Branch2</th>', ' data-col="qty2">Qty_Branch2</th>'),
    ('>Qty_Branch3</th>', ' data-col="qty3">Qty_Branch3</th>'),
    ('>Description For Customer</th>', ' data-col="desc_cust">Description For Customer</th>'),
    ('>SCENT NOTES</th>', ' data-col="scent_notes">SCENT NOTES</th>'),
    ('>How To Use</th>', ' data-col="how_to_use">How To Use</th>'),
    ('>Actions</th>', ' data-col="actions">Actions</th>')
]

for old, new in replacements:
    clean_thead = clean_thead.replace(old, new)

# Replace the block back into content
content = content.replace(thead_block, clean_thead)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned up table headers successfully!")
