const fs = require('fs');
let html = fs.readFileSync('d:/apaze/Smartindoormap/smartmap.html', 'utf8');

// 1. Add ID to grid
html = html.replace(
    '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">',
    '<div id="boutique-product-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">'
);

// 2. Add ID to Category Pills container
html = html.replace(
    '<div class="flex gap-sm overflow-x-auto pb-md no-scrollbar mb-lg">',
    '<div id="boutique-category-pills" class="flex gap-sm overflow-x-auto pb-md no-scrollbar mb-lg">'
);

// 3. Update selectPreorderStore
const oldSelect = `async function selectPreorderStore(storeId, name) {
            preorderStoreId = storeId;
            preorderStoreName = name;
            document.getElementById('preorder-selected-store-label').textContent = '📍 ' + name;
            preorderCart = {};
            currentProductCategory = 'all';
            await loadProducts();
            showPreorderStep('products');
        }`;

const newSelect = `async function selectPreorderStore(storeId, name) {
            preorderStoreId = storeId;
            preorderStoreName = name;
            // document.getElementById('preorder-selected-store-label').textContent = '📍 ' + name;
            preorderCart = {};
            currentProductCategory = 'all';
            await loadProducts();
            showPage('view-panpuri-boutique');
        }`;
html = html.replace(oldSelect, newSelect);

// 4. Update the drawer HTML IDs to be unique or just reuse them since they are now in smartmap.html.
// 5. Replace renderProductGrid
const oldRenderGrid = /function renderProductGrid\(\) \{[\s\S]*?updateCartButton\(\);\s*\}/;
const newRenderGrid = `function renderProductGrid() {
            const grid = document.getElementById('boutique-product-grid');
            if(!grid) return;
            const filtered = currentProductCategory === 'all'
                ? allProducts
                : allProducts.filter(p => p.category === currentProductCategory || p.category.startsWith(currentProductCategory));

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center text-on-surface-variant py-8 font-body-lg">No products found in this category.</div>';
                return;
            }

            // Determine which QTY field to use based on preorderStoreId
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';

            grid.innerHTML = filtered.map(p => {
                const cartQty = preorderCart[p.product_id]?.qty || 0;
                const stockQty = parseInt(p[qtyField]) || 0;
                const outOfStock = stockQty <= 0;
                const imgUrl = p.image || '';

                return \`<div class="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden cursor-pointer haptic-active shadow-sm hover:shadow-md transition-all" onclick="openBoutiqueDrawer('\${p.product_id}')">
                    <div class="relative aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
                        \${imgUrl ? \`<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\${imgUrl}" onerror="this.src='https://placehold.co/400x400/ffffff/1e293b?text=Image+Not+Found'"/>\` : \`<span class="material-symbols-outlined text-4xl text-outline">image</span>\`}
                        \${p.is_bestseller ? \`<div class="absolute top-4 left-4 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container text-label-sm font-bold">BESTSELLER</div>\` : ''}
                        \${outOfStock ? \`<div class="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center"><span class="bg-error text-on-error px-4 py-2 rounded-full font-label-md">OUT OF STOCK</span></div>\` : ''}
                    </div>
                    <div class="p-md flex flex-col h-40">
                        <p class="text-label-sm text-secondary uppercase tracking-widest mb-1 truncate">\${p.category || 'Product'}</p>
                        <h3 class="font-headline-md text-headline-md text-primary mb-1 line-clamp-2">\${p.product_name}</h3>
                        <div class="flex items-center justify-between mt-auto">
                            <span class="font-headline-md text-headline-md text-primary">฿\${parseFloat(p.price).toLocaleString()}</span>
                            \${outOfStock ? '' : (cartQty === 0 
                                ? \`<button onclick="event.stopPropagation(); addToBoutiqueCart('\${p.product_id}')" class="bg-secondary text-secondary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><span class="material-symbols-outlined">add</span></button>\` 
                                : \`<div class="flex items-center bg-secondary-container rounded-full px-1 py-1" onclick="event.stopPropagation()">
                                    <button onclick="changeBoutiqueCartQty('\${p.product_id}', -1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                                    <span class="w-6 text-center font-bold text-on-secondary-container text-sm">\${cartQty}</span>
                                    <button onclick="changeBoutiqueCartQty('\${p.product_id}', 1)" \${cartQty >= stockQty ? 'disabled class="w-8 h-8 rounded-full flex items-center justify-center opacity-50"' : 'class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"'} onclick="changeBoutiqueCartQty('\${p.product_id}', 1)"><span class="material-symbols-outlined text-sm">add</span></button>
                                   </div>\`
                            )}
                        </div>
                    </div>
                </div>\`;
            }).join('');
            
            updateBoutiqueCartUI();
        }`;
html = html.replace(oldRenderGrid, newRenderGrid);

// Add boutique cart logic
const scriptEnd = '</script>\n</body>';
const boutiqueLogic = `
        function openBoutiqueDrawer(productId) {
            const p = allProducts.find(x => x.product_id === productId);
            if(!p) return;
            const drawer = document.getElementById('productDrawer');
            const panel = document.getElementById('drawerPanel');
            const backdrop = document.getElementById('drawerBackdrop');
            
            document.getElementById('drawerTitle').innerText = p.product_name;
            document.getElementById('drawerCategory').innerText = p.category;
            document.getElementById('drawerPrice').innerText = '฿' + parseFloat(p.price).toLocaleString();
            
            const imgElem = document.getElementById('drawerImage');
            if (p.image) {
                imgElem.src = p.image;
            } else {
                imgElem.src = 'https://placehold.co/800x800/ffffff/1e293b?text=Image+Not+Found';
            }
            
            // Set qty logic in drawer
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;
            const outOfStock = stockQty <= 0;
            const currentQty = preorderCart[productId]?.qty || (outOfStock ? 0 : 1);
            
            const btnContainer = document.getElementById('drawerCartBtnContainer');
            if(!btnContainer) {
                // inject container if not exists
                const btn = document.querySelector('#drawerPanel .p-md.bg-surface-container-lowest button');
                if(btn) {
                    btn.outerHTML = '<div id="drawerCartBtnContainer"></div>';
                }
            }
            
            if (outOfStock) {
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button disabled class="w-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md py-5 rounded-full flex items-center justify-center gap-3">OUT OF STOCK</button>';
            } else {
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button onclick="addToBoutiqueCart(\\'' + p.product_id + '\\', ' + currentQty + '); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>';
            }
            
            drawer.classList.remove('invisible');
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                backdrop.classList.add('opacity-100');
            }, 10);
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

        function addToBoutiqueCart(productId, qtyToAdd = 1) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;
            
            if (!preorderCart[productId]) preorderCart[productId] = { qty: 0, product: p };
            
            if (preorderCart[productId].qty + qtyToAdd > stockQty) {
                alert('Insufficient stock');
                return;
            }
            preorderCart[productId].qty += qtyToAdd;
            renderProductGrid();
        }

        function changeBoutiqueCartQty(productId, delta) {
            const p = allProducts.find(x => x.product_id === productId);
            if (!p) return;
            const qtyField = preorderStoreId ? 'qty_' + preorderStoreId.toLowerCase() : 'qty_de40';
            const stockQty = parseInt(p[qtyField]) || 0;

            if (!preorderCart[productId]) return;
            
            if (preorderCart[productId].qty + delta > stockQty) {
                alert('Insufficient stock');
                return;
            }
            
            preorderCart[productId].qty += delta;
            if (preorderCart[productId].qty <= 0) delete preorderCart[productId];
            renderProductGrid();
        }

        function updateBoutiqueCartUI() {
            const totalItems = Object.values(preorderCart).reduce((s, i) => s + i.qty, 0);
            const badges = document.querySelectorAll('.boutique-cart-badge');
            badges.forEach(b => {
                if(totalItems > 0) {
                    b.classList.remove('hidden');
                    b.textContent = totalItems;
                } else {
                    b.classList.add('hidden');
                }
            });
        }
        
        function checkoutBoutique() {
            if(Object.keys(preorderCart).length === 0) {
                alert('Your cart is empty');
                return;
            }
            // Transition back to confirm step
            showPage('page-preorder');
            showPreorderStep('confirm');
            renderCartSummary();
        }
        
        function exitBoutique() {
            showPage('home-view');
        }
`;

html = html.replace(scriptEnd, boutiqueLogic + '\n' + scriptEnd);

// Add badges and onClick to Shopping bags in HTML
// Desktop Shopping Bag
html = html.replace(
    '<button class="p-2 relative">',
    '<button class="p-2 relative haptic-active" onclick="checkoutBoutique()">'
);
// Make the span inside into badge
html = html.replace(
    '<span class="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>',
    '<span class="absolute top-0 right-0 w-4 h-4 bg-secondary rounded-full text-[10px] font-bold text-white flex items-center justify-center hidden boutique-cart-badge"></span>'
);
// Exit button in sidebar
html = html.replace(
    '<a class="flex items-center gap-3 text-navy-luxury px-4 py-2 hover:text-error transition-colors" href="#">\n<span class="material-symbols-outlined text-[20px]">logout</span>\n<span class="font-label-md text-label-md">Exit</span>\n</a>',
    '<a class="flex items-center gap-3 text-navy-luxury px-4 py-2 hover:text-error transition-colors cursor-pointer" onclick="exitBoutique()">\n<span class="material-symbols-outlined text-[20px]">logout</span>\n<span class="font-label-md text-label-md">Exit</span>\n</a>'
);
// Back button for mobile nav (Home)
html = html.replace(
    '<a class="flex flex-col items-center gap-1 text-on-primary-fixed" href="#">\n<span class="material-symbols-outlined">home</span>\n<span class="text-label-sm uppercase">Home</span>\n</a>',
    '<a class="flex flex-col items-center gap-1 text-on-primary-fixed cursor-pointer" onclick="exitBoutique()">\n<span class="material-symbols-outlined">home</span>\n<span class="text-label-sm uppercase">Home</span>\n</a>'
);
// Mobile checkout (Receipt / Orders / or floating action button?)
// Let's use the big Plus button for Checkout
html = html.replace(
    '<button class="bg-secondary text-secondary-container w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">',
    '<button class="bg-secondary text-secondary-container w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform relative" onclick="checkoutBoutique()">'
);
html = html.replace(
    '<span class="material-symbols-outlined text-[32px]">add</span>',
    '<span class="material-symbols-outlined text-[32px]">shopping_cart</span>\n<span class="absolute top-0 right-0 w-5 h-5 bg-error rounded-full text-[12px] font-bold text-white flex items-center justify-center hidden boutique-cart-badge border-2 border-primary-container"></span>'
);

fs.writeFileSync('d:/apaze/Smartindoormap/smartmap.html', html);
console.log('Logic updated.');
