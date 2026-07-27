const fs = require('fs');

const file = 'smartmap.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /        function closeDrawer\(\) \{/;

const insertCode = `        function updateDrawerAddToCartBtn(outOfStock, p) {
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
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button onclick="addToBoutiqueCart(\\'' + p.product_id + '\\', ' + window.currentDrawerQty + '); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>';
            }
        }

        function changeDrawerQty(delta) {
            if (!window.currentDrawerProductId) return;
            const p = allProducts.find(x => x.product_id === window.currentDrawerProductId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;
            
            let newQty = window.currentDrawerQty + delta;
            if (newQty < 1) newQty = 1;
            if (newQty > stockQty) newQty = stockQty;
            
            window.currentDrawerQty = newQty;
            document.getElementById('drawerQtyDisplay').innerText = window.currentDrawerQty;
            updateDrawerAddToCartBtn(stockQty <= 0, p);
        }

        function closeDrawer() {`;

content = content.replace(regex, insertCode);

fs.writeFileSync(file, content, 'utf8');
console.log('Inserted logic functions!');
