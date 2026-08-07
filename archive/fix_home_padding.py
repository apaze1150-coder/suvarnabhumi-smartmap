import re

file_path = "d:/apaze/Smartindoormap/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace pb-28 with pb-40 in home-view to give more space for the bottom FAB
old_str = 'id="home-view" class="page-section active absolute inset-0 overflow-y-auto pb-28"'
new_str = 'id="home-view" class="page-section active absolute inset-0 overflow-y-auto pb-40"'

if old_str in content:
    content = content.replace(old_str, new_str)
else:
    # Use regex
    content = re.sub(r'id="home-view" class="page-section([^"]*) pb-28"', r'id="home-view" class="page-section\1 pb-40"', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Home view bottom padding increased!")
