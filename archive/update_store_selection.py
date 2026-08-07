import re

file_path = "d:/apaze/Smartindoormap/store_selection.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

img_html = '''<div class="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border border-outline-variant/30">
<img src="uploads/panpuri_Banner.jpg" class="w-full h-full object-cover" onerror="this.src='https://panpuri.com/wp-content/uploads/2023/10/Siamese-Water-Extract-Perfume-Oil_50ml_1-1050x1050.jpg'" alt="Store Front">
</div>'''

# Replace Store 1
# From:
# <div class="w-12 h-12 bg-[#fff8e7] rounded-xl flex items-center justify-center"> ... </svg>\n</div>
# <div>\n<h4 class="font-bold text-sm">PANPURI Concourse D East</h4>
store1_pattern = r'<div class="w-12 h-12 bg-\[#[a-fA-F0-9]+\] rounded-xl flex items-center justify-center">.*?<\/svg>\s*<\/div>\s*<div>\s*<h4 class="font-bold text-sm">PANPURI Concourse D East<\/h4>'
store1_repl = f'{img_html}\n<div>\n<h4 class="font-bold text-sm">[TE1] PANPURI Concourse D East</h4>'
content = re.sub(store1_pattern, store1_repl, content, flags=re.DOTALL)

# Replace Store 2
store2_pattern = r'<div class="w-12 h-12 bg-\[#[a-fA-F0-9]+\] rounded-xl flex items-center justify-center">.*?<\/svg>\s*<\/div>\s*<div>\s*<h4 class="font-bold text-sm">PANPURI Concourse D East 2<\/h4>'
store2_repl = f'{img_html}\n<div>\n<h4 class="font-bold text-sm">[TE3] PANPURI Concourse D East 2</h4>'
content = re.sub(store2_pattern, store2_repl, content, flags=re.DOTALL)

# Replace Store 3
store3_pattern = r'<div class="w-12 h-12 bg-\[#[a-fA-F0-9]+\] rounded-xl flex items-center justify-center">.*?<\/svg>\s*<\/div>\s*<div>\s*<h4 class="font-bold text-sm">PANPURI Concourse D West<\/h4>'
store3_repl = f'{img_html}\n<div>\n<h4 class="font-bold text-sm">[TW4] PANPURI Concourse D West</h4>'
content = re.sub(store3_pattern, store3_repl, content, flags=re.DOTALL)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Store selection updated!")
