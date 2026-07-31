import re

file_path = "d:/apaze/Smartindoormap/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace any occurrence of the Thai text with the English translation
content = content.replace('ยืนยันการสั่งจอง', 'Confirm Pre-order')
content = content.replace('ยืนยันคำสั่งจอง', 'Confirm Pre-order')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced button text!")
