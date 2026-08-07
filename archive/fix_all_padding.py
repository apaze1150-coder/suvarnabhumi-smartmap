import re

file_path = "d:/apaze/Smartindoormap/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace all occurrences of pb-28 with pb-40 in page-section divs
# (which gives padding for the bottom nav)
content = re.sub(r'(class="page-section[^"]*?)\s+pb-28([^"]*?")', r'\1 pb-40\2', content)

# Just in case there are other pb-20 or pb-24 that need increasing for page-section
# pb-32 is 8rem, pb-36 is 9rem, pb-40 is 10rem
content = re.sub(r'(class="page-section[^"]*?)\s+pb-24([^"]*?")', r'\1 pb-40\2', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("All page sections updated with pb-40")
