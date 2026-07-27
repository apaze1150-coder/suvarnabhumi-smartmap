const fs = require('fs');

const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const regexConfirmDiv = /<div id="preorder-step-confirm".*?✅ ยืนยันการสั่งจอง\s*<\/button>\s*<\/div>/s;

const newConfirmDiv = `<div id="preorder-step-confirm" class="hidden w-full max-w-4xl mx-auto px-4 py-6 space-y-4">
                <!-- Back Navigation -->
                <div class="animate-fade-in-up stagger-1">
                    <a href="#" onclick="showPreorderStep('products'); return false;" class="inline-flex items-center gap-1 text-gray-500 hover:text-[#000a1e] transition-colors group">
                        <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">chevron_left</span>
                        <span class="font-bold text-sm">กลับเลือกสินค้า</span>
                    </a>
                </div>
                <header class="animate-fade-in-up stagger-1">
                    <h1 class="text-2xl font-black text-[#000a1e] tracking-tight">ยืนยันคำสั่งจอง</h1>
                </header>

                <!-- Order List & Confirmation Card -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up stagger-2">
                    <!-- Header -->
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-sm text-[#000a1e] tracking-tight">รายการสินค้า — <span id="cart-store-name"></span></span>
                        </div>
                    </div>
                    
                    <!-- Item List -->
                    <div id="cart-summary" class="divide-y divide-gray-100">
                        <!-- Dynamic Content Goes Here -->
                    </div>

                    <!-- Summary Section & Customer Info -->
                    <div class="p-5 bg-gray-50/50 border-t border-gray-200 flex flex-col md:flex-row gap-6">
                        <!-- Customer Info Form -->
                        <div class="flex-grow space-y-4">
                            <h2 class="font-black text-[15px] text-[#000a1e]">ข้อมูลลูกค้า</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1.5">
                                    <label class="text-[13px] font-bold text-gray-500" for="order-customer-name">ชื่อ-นามสกุล *</label>
                                    <input class="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-[#000a1e] placeholder-gray-400 focus:outline-none focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] transition-all" id="order-customer-name" placeholder="กรอกชื่อ-นามสกุล" type="text"/>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-[13px] font-bold text-gray-500" for="order-flight-number">หมายเลขเที่ยวบิน *</label>
                                    <input class="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm font-bold uppercase text-[#000a1e] placeholder-gray-400 focus:outline-none focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] transition-all" id="order-flight-number" placeholder="เช่น TG679" type="text"/>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Total Column -->
                        <div class="md:w-64 flex flex-col items-end justify-end space-y-1">
                            <div class="flex items-center gap-3 mt-2">
                                <span class="text-sm font-bold text-gray-500" id="cart-total-qty">Total (0 ชิ้น)</span>
                                <span class="text-2xl text-[#000a1e] font-black" id="cart-total-price">฿0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="order-error-msg" class="hidden bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-700 font-semibold mb-4 text-center"></div>

                <!-- Action Button -->
                <div class="animate-fade-in-up stagger-3 flex justify-end mt-4">
                    <button onclick="submitPreorder()" id="submit-order-btn" class="w-full md:w-80 bg-[#000a1e] text-[#ffe088] h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-[15px] tracking-wide shadow-lg shadow-[#000a1e]/20 hover:bg-black active:scale-[0.98] transition-all">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                        ยืนยันการสั่งจอง
                    </button>
                </div>
            </div>`;

content = content.replace(regexConfirmDiv, newConfirmDiv);


const renderRegex = /function renderCartSummary\(\) \{[\s\S]*?return total;\s*\}/;

const newRenderCartSummary = `function renderCartSummary() {
            const items = Object.values(preorderCart);
            document.getElementById('cart-store-name').textContent = preorderStoreName;
            
            if (items.length === 0) {
                document.getElementById('cart-summary').innerHTML = '<p class="text-gray-400 text-sm text-center py-8">ตะกร้าว่างเปล่า</p>';
                document.getElementById('cart-total-qty').textContent = 'Total (0 ชิ้น)';
                document.getElementById('cart-total-price').textContent = '฿0';
                return 0;
            }
            let total = 0;
            let totalQty = 0;
            const rows = items.map(i => {
                const subtotal = parseFloat(i.product.price) * i.qty;
                total += subtotal;
                totalQty += i.qty;
                
                // Fallback image if product image is empty
                const imgSrc = i.product.image || 'https://via.placeholder.com/150?text=No+Image';

                return \`<div class="p-4 flex flex-col md:flex-row md:items-center gap-4 group">
                    <div class="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-1 border border-gray-100">
                        <img alt="Product" class="w-full h-full object-contain" src="\${imgSrc}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'"/>
                    </div>
                    <div class="flex-grow space-y-1">
                        <h3 class="font-black text-[15px] text-[#000a1e] leading-tight line-clamp-2">\${i.product.product_name}</h3>
                        <p class="text-xs font-bold text-gray-500">SKU: \${i.product.product_code}</p>
                        \${i.product.description && i.product.description !== i.product.product_name ? \`<p class="text-[11px] text-gray-400 font-medium line-clamp-1">\${i.product.description}</p>\` : ''}
                    </div>
                    <div class="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0">
                        <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-white">
                            <button onclick="changeQty('\${i.product.product_id}', -1)" class="w-9 h-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"><span class="material-symbols-outlined text-[18px]">remove</span></button>
                            <span class="w-10 text-center font-bold text-[#000a1e] text-sm">\${i.qty}</span>
                            <button onclick="changeQty('\${i.product.product_id}', 1)" class="w-9 h-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"><span class="material-symbols-outlined text-[18px]">add</span></button>
                        </div>
                        <div class="w-28 text-right shrink-0">
                            <span class="font-black text-[16px] text-[#000a1e]">฿\${subtotal.toLocaleString()}</span>
                        </div>
                        <button onclick="changeQty('\${i.product.product_id}', -9999)" class="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0">delete</button>
                    </div>
                </div>\`;
            }).join('');
            
            document.getElementById('cart-summary').innerHTML = rows;
            document.getElementById('cart-total-qty').textContent = \`Total (\${totalQty} ชิ้น)\`;
            document.getElementById('cart-total-price').textContent = \`฿\${total.toLocaleString()}\`;
            
            return total;
        }`;

content = content.replace(renderRegex, newRenderCartSummary);

fs.writeFileSync(file, content, 'utf8');
console.log('Stitch UI integration completed.');
