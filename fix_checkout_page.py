import re

file_path = "d:/apaze/Smartindoormap/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Padding fix for preorder-step-confirm
# Replace 'py-6' with 'pt-6 pb-40' for preorder-step-confirm
content = re.sub(r'(id="preorder-step-confirm"[^>]*class="[^"]*)py-6([^"]*")', r'\1pt-6 pb-40\2', content)

# 2. Translations
content = content.replace('ข้อมูลลูกค้า', 'Customer Information')
content = content.replace('>ชื่อ-นามสกุล *<', '>Full Name *<')
content = content.replace('placeholder="กรอกชื่อ-นามสกุล"', 'placeholder="Enter your full name"')
content = content.replace('>หมายเลขเที่ยวบิน *<', '>Flight Number *<')
content = content.replace('placeholder="เช่น TG679"', 'placeholder="e.g. TG679"')
content = content.replace('>ยืนยันการสั่งจอง<', '>Confirm Pre-order<')

# For the dynamic "Total (X ชิ้น)" in HTML (the initial empty state)
content = content.replace('>Total (0 ชิ้น)<', '>Total (0 items)<')

# Also in the JavaScript code:
# document.getElementById('cart-total-qty').textContent = 'Total (0 ชิ้น)';
content = content.replace("textContent = 'Total (0 ชิ้น)';", "textContent = 'Total (0 items)';")
# document.getElementById('cart-total-qty').textContent = `Total (${totalQty} ชิ้น)`;
content = content.replace("textContent = `Total (${totalQty} ชิ้น)`;", "textContent = `Total (${totalQty} items)`;")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Checkout page translated and padded!")
