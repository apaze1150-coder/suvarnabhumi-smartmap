import re

file_path = "d:/apaze/Smartindoormap/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace padding-bottom: 95px !important; with padding-bottom: 140px !important;
content = re.sub(r'#drawer-bottom-area\s*\{\s*padding-bottom:\s*\d+px\s*!important;\s*\}', '#drawer-bottom-area {\n            padding-bottom: 140px !important;\n        }', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated drawer-bottom-area padding!")
