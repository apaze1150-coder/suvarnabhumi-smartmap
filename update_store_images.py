import re

file_path = "d:/apaze/Smartindoormap/store_selection.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace image for TE1 (DE40)
te1_pattern = r'(\[TE1\].*?<div class="w-14 h-14[^>]*>\s*<img src=")[^"]+(")'
# Since the img tag is BEFORE the h4 tag, we need to match from the img tag to the h4 tag.
# Actually, the easiest way is to find the h4 tag, then go backwards.
content_parts = content.split('<!-- Store Item')

for i in range(1, len(content_parts)):
    part = content_parts[i]
    if '[TE1]' in part:
        part = re.sub(r'<img src="[^"]+"', '<img src="uploads/1783484420656-404489505.jpg"', part, count=1)
    elif '[TE3]' in part:
        part = re.sub(r'<img src="[^"]+"', '<img src="uploads/1783484658834-936969808.jpg"', part, count=1)
    elif '[TW4]' in part:
        part = re.sub(r'<img src="[^"]+"', '<img src="uploads/1783484828814-840131804.jpg"', part, count=1)
    content_parts[i] = part

content = '<!-- Store Item'.join(content_parts)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Store images updated from store_matrix.csv!")
