const fs = require('fs');
const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('// Boutique Logic');
const endIdx = content.indexOf('function addToBoutiqueCart');

if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    
    const replacement = `// Boutique Logic
        function openBoutiqueDrawer(productId) {
            const p = allProducts.find(x => x.product_id === productId);
            if(!p) return;
            const drawer = document.getElementById('productDrawer');
            const panel = document.getElementById('drawerPanel');
            const backdrop = document.getElementById('drawerBackdrop');
            
            document.getElementById('drawerTitle').innerText = (p.scent || p.Scent) && (p.scent || p.Scent) !== '-' ? (p.scent || p.Scent) : 'Information not available';
            document.getElementById('drawerCategory').innerText = (p.sub_category || p['Sub-Category']) && (p.sub_category || p['Sub-Category']) !== '-' ? (p.sub_category || p['Sub-Category']) : 'Information not available';
            const drawerSizeEl = document.getElementById('drawerSize');
            if (drawerSizeEl) drawerSizeEl.innerText = p.size || 'N/A';
            document.getElementById('drawerPrice').innerText = '฿' + parseFloat(p.price).toLocaleString();
            
            const drawerSkuEl = document.getElementById('drawerSKU');
            if (drawerSkuEl) drawerSkuEl.innerText = p.product_code || p.Code || 'N/A';
            
            const descCustomerEl = document.getElementById('drawerDescCustomer');
            if (descCustomerEl) {
                const val = p.description_customer || p.Description_Customer;
                descCustomerEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }
            
            const howToUseEl = document.getElementById('drawerHowToUse');
            if (howToUseEl) {
                const val = p.how_to_use || p.How_to_Use;
                howToUseEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }

            const scentNotesEl = document.getElementById('drawerScentNotes');
            if (scentNotesEl) {
                const val = p.scent_notes || p.Scent_Notes;
                scentNotesEl.innerHTML = (!val || val === '-') ? 'Information not available' : val;
            }
            
            const imgElem = document.getElementById('drawerImage');
            if (p.image) {
                imgElem.src = p.image;
            } else {
                imgElem.src = 'https://placehold.co/800x800/ffffff/1e293b?text=Image+Not+Found';
            }
            
            // Set qty logic in drawer
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;
            const cartQty = preorderCart[productId]?.qty || 0;
            const remainingStock = stockQty - cartQty;
            const outOfStock = remainingStock <= 0;
            
            const stockEl = document.getElementById('drawerStock');
            if (stockEl) {
                stockEl.innerText = \`คงเหลือ: \${remainingStock}\`;
                stockEl.className = remainingStock <= 5 ? 'text-sm font-bold text-red-500' : 'text-sm font-bold text-gray-500';
            }
            
            window.currentDrawerProductId = productId;
            window.currentDrawerQty = outOfStock ? 0 : 1;
            
            if (document.getElementById('drawerQtyDisplay')) {
                document.getElementById('drawerQtyDisplay').innerText = window.currentDrawerQty;
            }
            
            updateDrawerAddToCartBtn(outOfStock, p);
            
            drawer.classList.remove('invisible');
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                backdrop.classList.add('opacity-100');
            }, 10);
        }

        function updateDrawerAddToCartBtn(outOfStock, p) {
            const btnContainer = document.getElementById('drawerCartBtnContainer');
            if(!btnContainer) {
                // inject container if not exists
                const btn = document.querySelector('#drawerPanel .border-t.bg-surface-container-lowest button');
                if(btn) {
                    btn.outerHTML = '<div id="drawerCartBtnContainer"></div>';
                }
            }
            if (outOfStock || window.currentDrawerQty <= 0) {
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button disabled class="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md py-5 rounded-full flex items-center justify-center gap-3">OUT OF STOCK</button>';
            } else {
                document.getElementById('drawerCartBtnContainer').innerHTML = \`<button onclick="addToBoutiqueCart('\${p.product_id}', \${window.currentDrawerQty}); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>\`;
            }
        }

        function changeDrawerQty(delta) {
            if (!window.currentDrawerProductId) return;
            const p = allProducts.find(x => x.product_id === window.currentDrawerProductId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;
            const cartQty = preorderCart[p.product_id]?.qty || 0;
            const remainingStock = stockQty - cartQty;
            
            let newQty = window.currentDrawerQty + delta;
            if (newQty < 1) newQty = 1;
            if (newQty > remainingStock) newQty = remainingStock;
            
            window.currentDrawerQty = newQty;
            if (document.getElementById('drawerQtyDisplay')) {
                document.getElementById('drawerQtyDisplay').innerText = window.currentDrawerQty;
            }
            updateDrawerAddToCartBtn(remainingStock <= 0, p);
        }

        function closeDrawer() {
            const drawer = document.getElementById('productDrawer');
            const panel = document.getElementById('drawerPanel');
            const backdrop = document.getElementById('drawerBackdrop');
            
            panel.classList.add('translate-x-full');
            backdrop.classList.remove('opacity-100');
            
            setTimeout(() => {
                drawer.classList.add('invisible');
            }, 300);
        }

        `;
    
    fs.writeFileSync(file, before + replacement + after, 'utf8');
    console.log('Fixed correctly by cutting out everything in between!');
} else {
    console.log('Could not find start or end index.');
}
