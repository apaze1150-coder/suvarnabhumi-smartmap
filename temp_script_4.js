
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'th', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element');
        }
        
        function setLang(langCode) {
            document.getElementById('lang-dropdown').classList.add('hidden');
            const selectField = document.querySelector(".goog-te-combo");
            if (selectField) {
                selectField.value = langCode;
                if (typeof window.Event === 'function') {
                    selectField.dispatchEvent(new window.Event('change', { bubbles: true }));
                } else {
                    const event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, false);
                    selectField.dispatchEvent(event);
                }
            } else {
                // Fallback: Set cookie directly if script isn't fully loaded
                document.cookie = `googtrans=/auto/${langCode}; path=/;`;
                window.location.reload();
            }
        }
        
        function showOtherLang() {
            document.getElementById('lang-dropdown').classList.add('hidden');
            document.getElementById('google-translate-wrapper').classList.add('show');
        }
        
        // Close dropdowns on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.relative')) {
                document.getElementById('lang-dropdown')?.classList.add('hidden');
                document.getElementById('google-translate-wrapper')?.classList.remove('show');
            }
        });

        // Boutique Logic
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
                document.getElementById('drawerCartBtnContainer').innerHTML = '<button onclick="addToBoutiqueCart(\'' + p.product_id + '\', ' + currentQty + '); closeDrawer()" class="w-full bg-primary text-on-primary font-label-md text-label-md py-5 rounded-full haptic-active flex items-center justify-center gap-3 shadow-xl"><span class="material-symbols-outlined">shopping_cart</span> ADD TO CART</button>';
            }
            
            drawer.classList.remove('invisible');
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                backdrop.classList.add('opacity-100');
            }, 10);
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
    
