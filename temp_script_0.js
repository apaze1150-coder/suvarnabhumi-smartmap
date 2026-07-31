
// SPA Navigation
function switchTab(viewId) {
    document.querySelectorAll('.spa-view').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex', 'flex-col');
    });
    const activeView = document.getElementById(viewId);
    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.classList.add('flex', 'flex-col', 'flex-1', 'overflow-hidden');
    }
    
    // Update Page Header
    const title = document.getElementById('page-title');
    const indicator = document.getElementById('live-indicator');
    if (title && indicator) {
        if (viewId === 'view-dashboard') {
            title.innerText = 'Global Dashboard';
            indicator.innerText = 'LIVE';
            indicator.classList.remove('hidden');
        } else if (viewId === 'view-orders') {
            title.innerText = 'Orders Management';
            indicator.innerText = 'LIVE';
            indicator.classList.remove('hidden');
        } else if (viewId === 'view-products') {
            title.innerText = 'Product Database';
            indicator.classList.add('hidden');
        } else if (viewId === 'view-stocklogs') {
            title.innerText = 'Stock Transaction Logs';
            indicator.classList.add('hidden');
        }
    }
    
    // Reset sidebar styling
    document.querySelectorAll('aside nav a').forEach(el => {
        el.classList.remove('bg-secondary-container', 'text-on-secondary-container');
        el.classList.add('text-on-surface-variant', 'hover:bg-surface-container');
    });
    
    let activeNav;
    if(viewId === 'view-dashboard') activeNav = document.getElementById('nav-dashboard');
    if(viewId === 'view-orders') activeNav = document.getElementById('nav-orders');
    if(viewId === 'view-products') activeNav = document.getElementById('nav-database');
    if(viewId === 'view-stocklogs') activeNav = document.getElementById('nav-stocklogs');
    
    if (activeNav) {
        activeNav.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');
        activeNav.classList.add('bg-secondary-container', 'text-on-secondary-container');
    }

    if(viewId === 'view-orders' && typeof loadOrders === 'function') loadOrders();
    if(viewId === 'view-products' && typeof loadProducts === 'function') loadProducts();
    if(viewId === 'view-stocklogs' && typeof loadStockLogs === 'function') loadStockLogs();
}


        // Navigation View Switching
        function switchView(viewId) {
            const views = ['dashboard', 'database', 'stocklogs'];
            views.forEach(v => {
                const el = document.getElementById('view-' + v);
                const nav = document.getElementById('nav-' + v);
                if (el) el.classList.add('hidden');
                if (nav) {
                    nav.classList.remove('bg-secondary-container', 'text-on-secondary-container');
                    nav.classList.add('text-on-surface-variant', 'hover:bg-surface-container');
                }
            });

            const activeView = document.getElementById('view-' + viewId);
            const activeNav = document.getElementById('nav-' + viewId);
            if (activeView) activeView.classList.remove('hidden');
            if (activeNav) {
                activeNav.classList.add('bg-secondary-container', 'text-on-secondary-container');
                activeNav.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');
            }

            // Update Page Header
            const title = document.getElementById('page-title');
            const indicator = document.getElementById('live-indicator');
            if (viewId === 'view-dashboard') {
                title.innerText = 'Global Dashboard';
                indicator.innerText = 'LIVE';
                indicator.classList.remove('hidden');
            } else if (viewId === 'view-orders') {
                title.innerText = 'Orders Management';
                indicator.innerText = 'LIVE';
                indicator.classList.remove('hidden');
            } else if (viewId === 'view-products') {
                title.innerText = 'Product Database';
                indicator.classList.add('hidden');
                if (typeof loadProducts === 'function') loadProducts();
            } else if (viewId === 'view-stocklogs') {
                title.innerText = 'Stock Transaction Logs';
                indicator.classList.add('hidden');
                if (typeof loadStockLogs === 'function') loadStockLogs();
            }
        }

        // Fetch products
        async function loadProducts() {
            try {
                const res = await fetch(`/api/admin/products?password=6515&_t=${Date.now()}`);
                const rawProducts = await res.json();
                allProducts = rawProducts.map((p, i) => ({ ...p, _originalIndex: i }));
                
                // Calculate Stats
                const totalSKUsEl = document.getElementById('totalSKUs');
                if (totalSKUsEl) totalSKUsEl.innerText = allProducts.length;
                
                let lowStock = 0;
                let uniqueScents = new Set();
                
                allProducts.forEach(p => {
                    let qty1 = parseInt(p.Qty_Branch1) || 0;
                    let qty2 = parseInt(p.Qty_Branch2) || 0;
                    let qty3 = parseInt(p.Qty_Branch3) || 0;
                    if ((qty1 + qty2 + qty3) < 10) lowStock++;
                    if (p.Reference) uniqueScents.add(p.Reference);
                });
                
                const lowStockCountEl = document.getElementById('lowStockCount');
                const activeScentsCountEl = document.getElementById('activeScentsCount');
                if (lowStockCountEl) lowStockCountEl.innerText = lowStock;
                if (activeScentsCountEl) activeScentsCountEl.innerText = uniqueScents.size;

                if (typeof renderTable === 'function') renderTable();
                if (typeof renderProducts === 'function') renderProducts(allProducts);
            } catch (err) {
                console.error('Error loading products:', err);
            }
        }


        
        // --- COLUMN VISIBILITY LOGIC ---
        const columns = [
            { id: 'no', label: 'No.', defaultVisible: true },
            { id: 'code', label: 'Code', defaultVisible: true },
            { id: 'desc', label: 'Description', defaultVisible: true },
            { id: 'ref', label: 'Reference', defaultVisible: true },
            { id: 'cat', label: 'Category', defaultVisible: true },
            { id: 'subcat', label: 'Sub Category', defaultVisible: false },
            { id: 'scent', label: 'Scent', defaultVisible: false },
            { id: 'size', label: 'Size', defaultVisible: false },
            { id: 'price', label: 'Price', defaultVisible: true },
            { id: 'img', label: 'Image', defaultVisible: true },
            { id: 'qty1', label: 'Qty_Branch1', defaultVisible: true },
            { id: 'qty2', label: 'Qty_Branch2', defaultVisible: true },
            { id: 'qty3', label: 'Qty_Branch3', defaultVisible: true },
            { id: 'desc_cust', label: 'Description For Customer', defaultVisible: false },
            { id: 'scent_notes', label: 'Scent Notes', defaultVisible: false },
            { id: 'how_to_use', label: 'How To Use', defaultVisible: false },
            { id: 'actions', label: 'Actions', defaultVisible: true }
        ];

        let visibleColumns = {};
        // Initialize from local storage or defaults
        try {
            const saved = localStorage.getItem('panpuri_visible_columns');
            if (saved) visibleColumns = JSON.parse(saved);
            else columns.forEach(c => visibleColumns[c.id] = c.defaultVisible);
        } catch(e) {
            columns.forEach(c => visibleColumns[c.id] = c.defaultVisible);
        }

        
        function toggleColumnDropdown(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('columnDropdown');
            if(dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }
        
        // Ensure dropdown closes when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('columnDropdown');
            const btn = document.getElementById('columnToggleBtn');
            if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // Initialize immediately
        setTimeout(() => {
            initColumnDropdown();
            
        console.log('tbody after append:', tbody.children.length);
        console.log('Table height:', tbody.offsetHeight);

        if (debugEl) {
            debugEl.innerText += '\ntbody children count after: ' + tbody.children.length;
            debugEl.innerText += '\ntbody offsetHeight: ' + tbody.offsetHeight;
        }
applyColumnVisibility();
        }, 500);

        function initColumnDropdown() {
            const container = document.getElementById('columnToggles');
            if (!container) return;
            
            container.innerHTML = '';
            columns.forEach(col => {
                const label = document.createElement('label');
                label.className = 'flex items-center gap-2 cursor-pointer p-2 hover:bg-surface-container rounded-md transition-colors';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'w-4 h-4 text-primary rounded border-outline focus:ring-primary';
                cb.checked = visibleColumns[col.id];
                cb.onchange = (e) => {
                    visibleColumns[col.id] = e.target.checked;
                    localStorage.setItem('panpuri_visible_columns', JSON.stringify(visibleColumns));
                    applyColumnVisibility();
                };
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(col.label));
                container.appendChild(label);
            });
            

        }

        function applyColumnVisibility() {
            // Update Headers
            const ths = document.querySelectorAll('#productsTableBody').length > 0 
                ? document.querySelectorAll('th[data-col]') 
                : [];
            
            ths.forEach(th => {
                const colId = th.getAttribute('data-col');
                if (visibleColumns[colId] === false) {
                    th.classList.add('col-hidden');
                } else {
                    th.classList.remove('col-hidden');
                }
            });
            
            // Update Data Rows
            const trs = document.querySelectorAll('#productsTableBody tr');
            trs.forEach(tr => {
                // We assume td's are in the exact same order as the columns array
                const tds = tr.querySelectorAll('td');
                if (tds.length === columns.length) {
                    columns.forEach((col, index) => {
                        if (visibleColumns[col.id] === false) {
                            tds[index].classList.add('col-hidden');
                        } else {
                            tds[index].classList.remove('col-hidden');
                        }
                    });
                }
            });
        }
        
        // Wait for DOM to init column UI
        document.addEventListener('DOMContentLoaded', () => {
            initColumnDropdown();
            applyColumnVisibility();
        });


        function renderProducts(products) {
            const tbody = document.getElementById('productTableBody');
            if(!tbody) return;
            tbody.innerHTML = '';
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.className = 'border-b border-outline-variant hover:bg-surface-container-low transition-colors group';
                tr.innerHTML = `
                    <td class="px-md py-4 font-mono text-label-md">${p.Code || ''}</td>
                    <td class="px-md py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-surface-container rounded-lg overflow-hidden shrink-0">
                                <img class="w-full h-full object-cover" src="${p.Image || ''}"/>
                            </div>
                            <span class="font-body-sm font-medium text-primary">${p.Description || ''}</span>
                        </div>
                    </td>
                    <td class="px-md py-4 font-body-sm text-on-surface-variant">${p.Reference || '-'}</td>
                    <td class="px-md py-4">
                        <span class="px-2 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-wider">${p.Category || ''}</span>
                    </td>
                    <td class="px-md py-4 font-body-sm font-bold text-primary text-right">${p.Price || '0'}</td>
                    <td class="px-md py-4 text-center font-bold text-status-gold">${p.Qty_Branch1 || 0}</td>
                    <td class="px-md py-4 text-center font-bold text-status-gold">${p.Qty_Branch2 || 0}</td>
                    <td class="px-md py-4 text-center font-bold text-status-gold">${p.Qty_Branch3 || 0}</td>
                `;
                
            try {
                tbody.appendChild(tr);
            } catch(e) {
                document.getElementById('visual-debugger').innerText += '\nError appending row: ' + e.message;
            }

            });
        }

        // Fetch stock logs
        async function loadStockLogs() {
            try {
                const res = await fetch('/api/admin/stock-logs');
                const logs = await res.json();
                renderStockLogs(logs);
            } catch (err) {
                console.error('Error loading stock logs:', err);
            }
        }

        function renderStockLogs(logs) {
            const tbody = document.getElementById('stockLogTableBody');
            tbody.innerHTML = '';
            logs.forEach(log => {
                let badgeClass = 'bg-surface-container text-on-surface';
                if (log.transaction_type === 'GOODS RECEIPT') badgeClass = 'bg-green-100 text-green-700';
                else if (log.transaction_type === 'STOCK TRANSFER OUT') badgeClass = 'bg-secondary-container text-on-secondary-container';
                else if (log.transaction_type === 'Adjustment') badgeClass = 'bg-blue-100 text-blue-700';

                let qtyClass = '';
                if (parseFloat(log.qty) > 0) qtyClass = 'text-green-700';
                else if (parseFloat(log.qty) < 0) qtyClass = 'text-status-gold';

                const tr = document.createElement('tr');
                tr.className = 'border-b border-outline-variant hover:bg-surface-container-low transition-colors';
                tr.innerHTML = `
                    <td class="px-md py-4 font-mono text-label-sm">#${log.log_id || ''}</td>
                    <td class="px-md py-4 whitespace-nowrap">${log.timestamp || ''}</td>
                    <td class="px-md py-4">
                        <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">${log.performed_by ? log.performed_by.substring(0,2).toUpperCase() : 'SYS'}</span>
                            <span>${log.performed_by || 'System'}</span>
                        </div>
                    </td>
                    <td class="px-md py-4">
                        <span class="px-3 py-1 ${badgeClass} text-[11px] font-bold rounded-full uppercase">${log.transaction_type || ''}</span>
                    </td>
                    <td class="px-md py-4 font-mono text-label-sm text-outline">${log.ref_no || ''}</td>
                    <td class="px-md py-4 font-mono">${log.product_code || ''}</td>
                    <td class="px-md py-4">${log.product_name || ''}</td>
                    <td class="px-md py-4 text-right font-bold ${qtyClass}">${parseFloat(log.qty) > 0 ? '+' : ''}${log.qty || 0}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Track changes in Excel mode
        const tableBody = document.getElementById('productsTableBody');
        const saveBtn = document.getElementById('saveBtn');
        const modal = document.getElementById('saveModal');
        let unsavedChanges = {};

        tableBody.addEventListener('input', (e) => {
            if (e.target.classList.contains('excel-cell')) {
                const id = e.target.getAttribute('data-id');
                const field = e.target.getAttribute('data-field');
                const val = e.target.innerText;
                const originalIndex = e.target.getAttribute('data-index');
                if(!unsavedChanges[id]) unsavedChanges[id] = { _originalIndex: originalIndex };
                unsavedChanges[id][field] = val;
            }
        });

        tableBody.addEventListener('focusout', (e) => {
            if (e.target.classList.contains('excel-cell')) {
                e.target.classList.remove('bg-white', 'text-black', 'ring-1', 'ring-primary', 'shadow-inner');
                if (Object.keys(unsavedChanges).length > 0) {
                    commitChanges();
                }
            }
        });

        function closeModal() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        async function commitChanges() {
            if (Object.keys(unsavedChanges).length === 0) return;
            const payload = { ...unsavedChanges };
            unsavedChanges = {}; 
            
            try {
                await fetch('/api/admin/products/batch-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: '6515', updates: payload })
                });
                
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-10 right-10 bg-on-background text-on-primary px-lg py-3 rounded-full shadow-lg z-[200] font-label-md transition-opacity duration-500 opacity-100 flex items-center gap-2';
                toast.innerHTML = '<span class="material-symbols-outlined text-[20px]">cloud_done</span> Auto-saved';
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.classList.remove('opacity-100');
                    toast.classList.add('opacity-0');
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
            } catch (err) {
                console.error('Failed to auto-save changes:', err);
            }
        }

        // Default view
        switchView('dashboard');

        // Haptic Feedback Simulation
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                if ('vibrate' in navigator) {
                    navigator.vibrate(5);
                }
            });
        });
    

        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('scale-95');
            });
            button.addEventListener('mouseup', () => {
                button.classList.remove('scale-95');
            });
            button.addEventListener('mouseleave', () => {
                button.classList.remove('scale-95');
            });
        });

        // Tab switcher logic
        let currentStatusFilter = 'all';
        const filterTabs = document.querySelectorAll('#statusFilter button');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => {
                    t.classList.remove('bg-white', 'shadow-sm', 'text-primary', 'font-bold');
                    t.classList.add('text-on-surface-variant');
                });
                tab.classList.add('bg-white', 'shadow-sm', 'text-primary', 'font-bold');
                tab.classList.remove('text-on-surface-variant');
                currentStatusFilter = tab.getAttribute('data-status');
                renderOrders();
            });
        });

        document.getElementById('searchInput').addEventListener('input', renderOrders);

        let allOrders = [];

        async function fetchOrders() {
            try {
                // Using the existing endpoint and password from server.js
                const response = await fetch('/api/admin/orders?password=6515');
                allOrders = await response.json();
                
                // Update stats
                document.getElementById('totalVolume').innerText = allOrders.length;
                document.getElementById('pendingCount').innerText = allOrders.filter(o => o.status === 'pending').length;
                document.getElementById('readyCount').innerText = allOrders.filter(o => o.status === 'ready').length;

                renderOrders();
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
        }

        function renderOrders() {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = '';

            const searchQuery = document.getElementById('searchInput').value.toLowerCase();

            let filteredOrders = allOrders.filter(o => {
                if (currentStatusFilter !== 'all' && o.status !== currentStatusFilter) return false;
                
                if (searchQuery) {
                    return (
                        (o.order_number && o.order_number.toLowerCase().includes(searchQuery)) ||
                        (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery)) ||
                        (o.store_id && o.store_id.toLowerCase().includes(searchQuery))
                    );
                }
                return true;
            });

            document.getElementById('paginationInfo').innerText = `Showing ${filteredOrders.length} of ${allOrders.length} entries`;

            filteredOrders.forEach(order => {
                let statusBadge = '';
                if (order.status === 'pending') statusBadge = '<span class="px-sm py-1 bg-red-100 text-red-700 text-[11px] font-bold uppercase rounded-full border border-red-200">Pending</span>';
                else if (order.status === 'preparing') statusBadge = '<span class="px-sm py-1 bg-secondary-container/30 text-on-secondary-container text-[11px] font-bold uppercase rounded-full border border-secondary-container/50">Preparing</span>';
                else if (order.status === 'ready') statusBadge = '<span class="px-sm py-1 bg-green-100 text-green-700 text-[11px] font-bold uppercase rounded-full border border-green-200">Ready</span>';
                else if (order.status === 'completed') statusBadge = '<span class="px-sm py-1 bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase rounded-full border border-outline-variant">Completed</span>';
                else if (order.status === 'cancelled') statusBadge = '<span class="px-sm py-1 bg-gray-200 text-gray-700 text-[11px] font-bold uppercase rounded-full border border-gray-300">Cancelled</span>';

                let itemsSummary = order.items && order.items.length > 0 
                    ? order.items.map(i => `${i.name} (x${i.qty})`).join(', ') 
                    : 'No items';

                if (itemsSummary.length > 50) itemsSummary = itemsSummary.substring(0, 50) + '...';

                const formattedDate = new Date(order.created_at).toLocaleString('en-GB', { 
                    day: 'numeric', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                });

                const tr = document.createElement('tr');
                tr.className = 'transition-colors hover:bg-surface-container-low/50';
                tr.innerHTML = `
                    <td class="px-lg py-md">
                        <span class="font-label-md text-label-md text-primary font-bold">${order.order_number}</span>
                    </td>
                    <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">
                        ${formattedDate}
                    </td>
                    <td class="px-lg py-md">
                        <div class="flex flex-col">
                            <span class="font-label-md text-label-md text-on-surface font-bold">${order.customer_name}</span>
                            <span class="text-[10px] text-on-surface-variant uppercase">Store: ${order.store_id} / Flight: ${order.flight_number}</span>
                        </div>
                    </td>
                    <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">
                        ${itemsSummary}
                    </td>
                    <td class="px-lg py-md font-label-md text-label-md text-primary font-bold">
                        ${parseFloat(order.total_price || 0).toLocaleString('en-US', {minimumFractionDigits:2})}
                    </td>
                    <td class="px-lg py-md">
                        ${statusBadge}
                    </td>
                    <td class="px-lg py-md text-right space-x-sm">
                        <button class="bg-primary text-white px-md py-1.5 rounded font-label-sm text-label-sm hover:bg-secondary-fixed hover:text-primary-container transition-all active:scale-95">Update</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Initialize
        fetchOrders();
    

    let allProducts = [];


    function renderTable() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        const search = document.getElementById('searchInput').value.toLowerCase();
        
        let filtered = allProducts.filter(p => {
            if (!search) return true;
            return (
                (p.Code && p.Code.toLowerCase().includes(search)) ||
                (p.Description && p.Description.toLowerCase().includes(search)) ||
                (p.Reference && p.Reference.toLowerCase().includes(search)) ||
                (p.Category && p.Category.toLowerCase().includes(search))
            );
        });

        // Optional filter if needed:
        if (currentStatusFilter !== 'all') {
            // Note: We don't have is_active in the 10 cols currently, but if we did, filter here.
        }

        document.getElementById('paginationInfoProducts').innerText = `Showing ${filtered.length} entries`;
        const debugEl = document.getElementById('visual-debugger');
        if (debugEl) {
            debugEl.innerText += '\n--- renderTable executed ---';
            debugEl.innerText += '\nSearch query: "' + search + '"';
            debugEl.innerText += '\nallProducts length: ' + allProducts.length;
            debugEl.innerText += '\nfiltered length: ' + filtered.length;
            debugEl.innerText += '\ntbody children count before: ' + tbody.children.length;
            debugEl.innerText += '\nFirst product: ' + (allProducts[0] ? JSON.stringify(allProducts[0]).substring(0, 50) + '...' : 'none');
        }

        console.log('--- renderTable DEBUG ---');
        console.log('Search query:', search);
        console.log('allProducts.length:', allProducts.length);
        console.log('filtered.length:', filtered.length);
        console.log('tbody before append:', tbody.children.length);


        filtered.forEach((p, index) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low transition-colors group';
            
            tr.innerHTML = `
                <td class="px-md py-md font-body-sm text-on-surface-variant text-center">${index + 1}</td>
                <td class="px-md py-md font-mono font-bold text-primary">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Code">${p.Code || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm font-medium text-primary">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Description">${p.Description || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Reference">${p.Reference || '-'}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Category">${p.Category || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Sub-Category">${p['Sub-Category'] || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Scent">${p.Scent || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant text-center">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Size">${p.Size || ''}</span>
                </td>
                <td class="px-md py-md font-body-sm text-primary font-bold text-right">
                    <span class="excel-cell px-2 py-1 rounded" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Price">${p.Price || '0'}</span>
                </td>
                <td class="px-md py-md text-center">
                    <div class="cursor-pointer inline-block overflow-hidden rounded-md border border-outline-variant hover:border-primary transition-colors" onclick="openImageModal('${p.Code}')" id="img-preview-container-${p.Code}">
                        ${p.Image ? `<img class="w-10 h-10 object-cover bg-surface-container" src="${p.Image}" id="img-preview-${p.Code}" />` : `<div class="w-10 h-10 bg-surface-container flex items-center justify-center material-symbols-outlined text-outline" id="img-preview-${p.Code}">image</div>`}
                    </div>
                </td>
                <td class="px-md py-md text-center">
                    <span class="excel-cell px-2 py-1 rounded font-bold text-status-gold" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Qty_Branch1">${p.Qty_Branch1 || 0}</span>
                </td>
                <td class="px-md py-md text-center">
                    <span class="excel-cell px-2 py-1 rounded font-bold text-status-gold" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Qty_Branch2">${p.Qty_Branch2 || 0}</span>
                </td>
                <td class="px-md py-md text-center">
                    <span class="excel-cell px-2 py-1 rounded font-bold text-status-gold" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Qty_Branch3">${p.Qty_Branch3 || 0}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant max-w-[200px]">
                    <span class="excel-cell px-2 py-1 rounded block truncate w-full" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Description_Customer" title="${p.Description_Customer || ''}">${p.Description_Customer || '-'}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant max-w-[200px]">
                    <span class="excel-cell px-2 py-1 rounded block truncate w-full" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="Scent_Notes" title="${p.Scent_Notes || ''}">${p.Scent_Notes || '-'}</span>
                </td>
                <td class="px-md py-md font-body-sm text-on-surface-variant max-w-[200px]">
                    <span class="excel-cell px-2 py-1 rounded block truncate w-full" contenteditable="false" data-id="${p.Code}" data-index="${p._originalIndex}" data-field="How_to_Use" title="${p.How_to_Use || ''}">${p.How_to_Use || '-'}</span>
                </td>
                <td class="px-md py-md text-center w-[120px]">
                    <div class="flex items-center gap-2 justify-center">
                        <button onclick="editProductRow('${p.Code}')" class="p-1 text-on-surface-variant hover:text-primary transition-colors material-symbols-outlined" title="Edit inline">edit</button>
                        <button onclick="deleteProduct('${p.Code}')" class="p-1 text-on-surface-variant hover:text-error transition-colors material-symbols-outlined" title="Delete">delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        applyColumnVisibility();
    }

    document.getElementById('searchInput').addEventListener('input', renderTable);
    
    loadProducts();


    let allLogs = [];

    async function loadLogs() {
        try {
            const res = await fetch('/api/admin/stock-logs');
            allLogs = await res.json();
            
            document.getElementById('totalLogs').innerText = allLogs.length.toLocaleString();
            renderLogs();
        } catch(e) {
            console.error('Error loading stock logs', e);
        }
    }

    function renderLogs() {
        const tbody = document.getElementById('logsTableBody');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        const searchInput = document.getElementById('searchInput');
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        const typeFilterEl = document.getElementById('typeFilter');
        const typeFilter = typeFilterEl ? typeFilterEl.value.toLowerCase() : 'all';
        const branchFilterEl = document.getElementById('branchFilter');
        const branchFilter = branchFilterEl ? branchFilterEl.value.toLowerCase() : 'all';
        
        let filtered = allLogs.filter(log => {
            if (typeFilter !== 'all' && !(log.transaction_type && log.transaction_type.toLowerCase().includes(typeFilter))) {
                return false;
            }
            if (branchFilter !== 'all') {
                const logStr = JSON.stringify(log).toLowerCase();
                if(!logStr.includes(branchFilter)) return false;
            }
            if (!search) return true;
            return (
                (log.product_code && log.product_code.toLowerCase().includes(search)) ||
                (log.product_name && log.product_name.toLowerCase().includes(search)) ||
                (log.log_id && log.log_id.toLowerCase().includes(search))
            );
        });

        
        document.getElementById('stockPaginationInfo').innerText = `Showing ${filtered.length} of ${allLogs.length} logs`;

        // Update KPIs dynamically
        document.getElementById('totalLogs').innerText = filtered.length.toLocaleString();
        
        let receiptsCount = 0;
        filtered.forEach(log => {
            if (log.transaction_type && log.transaction_type.toUpperCase().includes('RECEIPT')) {
                receiptsCount++;
            }
        });
        document.getElementById('recentReceipts').innerText = receiptsCount.toLocaleString();

        filtered.forEach(log => {

            // Determine styling for Transaction Type
            let typeStyle = 'bg-surface-container-high text-on-surface-variant border-outline-variant';
            const tType = (log.transaction_type || '').toUpperCase();
            if (tType.includes('RECEIPT')) typeStyle = 'bg-green-100 text-green-800 border-green-200';
            else if (tType.includes('TRANSFER')) typeStyle = 'bg-amber-100 text-amber-800 border-amber-200';
            else if (tType.includes('ADJUST')) typeStyle = 'bg-blue-100 text-blue-800 border-blue-200';

            // Initials for avatar
            const performedBy = log.performed_by || 'System';
            const initials = performedBy.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() || 'SY';

            // Qty color
            const qtyNum = parseInt(log.qty) || 0;
            const qtyColor = qtyNum > 0 ? 'text-green-700' : (qtyNum < 0 ? 'text-red-700' : 'text-on-surface');
            const qtyDisplay = qtyNum > 0 ? '+' + qtyNum : qtyNum;

            // Date format
            let dateDisplay = log.timestamp || '';
            try {
                if (log.timestamp) {
                    const d = new Date(log.timestamp);
                    dateDisplay = `${d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })} <span class="text-on-surface-variant/60 ml-1">${d.toLocaleTimeString('en-GB')}</span>`;
                }
            } catch(e) {}

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface transition-colors';
            tr.innerHTML = `
                <td class="px-md py-md font-mono text-xs text-on-surface-variant">${log.log_id || '-'}</td>
                <td class="px-md py-md text-body-sm whitespace-nowrap">${dateDisplay}</td>
                <td class="px-md py-md">
                    <div class="flex items-center gap-sm">
                        <div class="w-6 h-6 rounded-full bg-primary-container text-[10px] text-secondary-fixed flex items-center justify-center font-bold">${initials}</div>
                        <span class="text-body-sm">${performedBy}</span>
                    </div>
                </td>
                <td class="px-md py-md">
                    <span class="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border ${typeStyle}">${tType}</span>
                </td>
                <td class="px-md py-md text-body-sm font-semibold">${log.ref_no || '-'}</td>
                <td class="px-md py-md text-body-sm text-on-surface-variant">${log.product_code || '-'}</td>
                <td class="px-md py-md text-body-sm max-w-[200px] truncate" title="${log.product_name}">${log.product_name || '-'}</td>
                <td class="px-md py-md text-body-sm font-bold text-right ${qtyColor}">${qtyDisplay}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('searchInput').addEventListener('input', renderLogs);
    document.getElementById('typeFilter').addEventListener('change', renderLogs);
    const bFilter = document.getElementById('branchFilter');
    if(bFilter) bFilter.addEventListener('change', renderLogs);
    
    loadLogs();


function searchProductCode() {
    const code = document.getElementById('admin-code-search').value.trim().toLowerCase();
    if (!code) return;

    // Remove previous highlights
    document.querySelectorAll('.highlight-row').forEach(el => el.classList.remove('highlight-row', 'bg-yellow-100', 'bg-surface-container-low'));

    let found = false;
    const rows = document.querySelectorAll('#productsTableBody tr');
    for (let tr of rows) {
        const codeSpan = tr.querySelector('span[data-field="Code"]');
        if (codeSpan && codeSpan.innerText.trim().toLowerCase() === code) {
            found = true;
            // Temporarily disable hover class so highlight is clear, and add highlight bg
            tr.classList.add('highlight-row', 'bg-yellow-100');
            tr.classList.remove('hover:bg-surface-container-low');
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                tr.classList.remove('bg-yellow-100');
                tr.classList.add('hover:bg-surface-container-low');
            }, 3000);
            break;
        }
    }

    if (!found) {
        alert('ไม่มีพบรายการค้นหา');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    switchTab('view-dashboard');
});



// --- DASHBOARD ANALYTICS LOGIC ---
let salesChartInstance = null;

async function loadDashboardStats() {
    try {
        // Fetch raw data streams directly as requested
        const [ordersRes, productsRes] = await Promise.all([
            fetch('/api/admin/orders?password=6515'),
            fetch('/api/products')
        ]);
        
        const orders = await ordersRes.json();
        const productsData = await productsRes.json();
        const products = productsData.products || productsData || []; // handle if it's wrapped or array
        
        if(orders) {
            // 1. Calculate sales and order counts grouped by branch
            const stores = ['de40', 'de12', 'dw41'];
            const salesByStore = { de40: 0, de12: 0, dw41: 0 };
            const ordersByStore = { de40: 0, de12: 0, dw41: 0 };
            
            orders.forEach(o => {
                const sid = (o.store_id || '').toLowerCase();
                if (stores.includes(sid)) {
                    ordersByStore[sid]++;
                    salesByStore[sid] += parseFloat(o.total_price || 0);
                }
            });
            
            renderSalesChart({
                stores: ['DE40 Flagship', 'DE12 EmQuartier', 'DW41 Boutique'],
                sales: [salesByStore.de40, salesByStore.de12, salesByStore.dw41],
                orders: [ordersByStore.de40, ordersByStore.de12, ordersByStore.dw41]
            });
            
            // 3. Top 5 Best Sellers
            const productSales = {};
            orders.forEach(o => {
                let items = [];
                try { items = Array.isArray(o.items) ? o.items : JSON.parse(o.items_json || '[]'); } catch(e) {}
                items.forEach(item => {
                    if(!productSales[item.product_code]) {
                        productSales[item.product_code] = { code: item.product_code, name: item.name, qty: 0, revenue: 0 };
                    }
                    productSales[item.product_code].qty += parseInt(item.qty || 0);
                    productSales[item.product_code].revenue += (parseFloat(item.price || 0) * parseInt(item.qty || 0));
                });
            });
            
            let topSellers = Object.values(productSales).sort((a,b) => b.qty - a.qty).slice(0, 5);
            renderTopSellers(topSellers);

            // 4. Store Live Status Metrics
            const storesList = ['de40', 'de12', 'dw41'];
            const todayRev = { de40: 0, de12: 0, dw41: 0 };
            const activeOrders = { de40: 0, de12: 0, dw41: 0 };
            const itemsSold = { de40: 0, de12: 0, dw41: 0 };
            
            orders.forEach(o => {
                const sid = (o.store_id || '').toLowerCase();
                if (storesList.includes(sid)) {
                    todayRev[sid] += parseFloat(o.total_price || 0);
                    
                    let items = [];
                    try { items = Array.isArray(o.items) ? o.items : JSON.parse(o.items_json || '[]'); } catch(e) {}
                    items.forEach(item => {
                        itemsSold[sid] += parseInt(item.qty || 0);
                    });
                    
                    const status = (o.status || '').toLowerCase();
                    if (status === 'pending' || status === 'ready') {
                        activeOrders[sid]++;
                    }
                }
            });
            
            storesList.forEach(sid => {
                const revEl = document.getElementById(sid + '-revenue');
                const actEl = document.getElementById(sid + '-active-orders');
                const itemsEl = document.getElementById(sid + '-items-sold');
                if(revEl) revEl.innerText = '฿' + todayRev[sid].toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
                if(actEl) actEl.innerText = activeOrders[sid];
                if(itemsEl) itemsEl.innerText = itemsSold[sid];
            });
        }
        
        if (products) {
            // 2. Low Stock Alerts
            let lowStockAlerts = [];
            products.forEach(p => {
                let q1 = parseInt(p.Qty_Branch1) || 0;
                let q2 = parseInt(p.Qty_Branch2) || 0;
                let q3 = parseInt(p.Qty_Branch3) || 0;
                
                let branches = [];
                if(q1 <= 5) branches.push('DE40');
                if(q2 <= 5) branches.push('DE12');
                if(q3 <= 5) branches.push('DW41');
                
                let totalStock = q1 + q2 + q3;
                
                if (branches.length > 0 || totalStock <= 10) {
                    lowStockAlerts.push({
                        code: p.Code,
                        name: p.Description,
                        branches: branches,
                        total: totalStock
                    });
                }
            });
            lowStockAlerts.sort((a,b) => a.total - b.total);
            renderLowStockAlerts(lowStockAlerts);
        }
        
    } catch(err) {
        console.error('Failed to load dashboard stats:', err);
    }
}

function renderSalesChart(data) {
    const ctx = document.getElementById('salesComparisonChart');
    if(!ctx) return;
    
    if(salesChartInstance) {
        salesChartInstance.destroy();
    }
    
    if(typeof Chart === 'undefined') {
        setTimeout(() => renderSalesChart(data), 500); 
        return;
    }

    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.stores,
            datasets: [
                {
                    label: 'Sales Revenue (฿)',
                    data: data.sales,
                    backgroundColor: '#735C00', // Gold brand color
                    borderColor: '#735C00', 
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Order Volume',
                    data: data.orders,
                    type: 'line', // Dual-Axis Line chart for order volume
                    backgroundColor: '#1E293B', // Charcoal/Navy brand color
                    borderColor: '#1E293B', 
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: {display: true, text: 'Revenue (฿)'} },
                y1: { type: 'linear', display: true, position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: 'Orders'} }
            }
        }
    });
}

function renderLowStockAlerts(alerts) {
    const container = document.getElementById('dashboardLowStockList');
    if(!container) return;
    
    if(!alerts || alerts.length === 0) {
        container.innerHTML = '<p class="text-body-sm text-outline">All stocks are optimal.</p>';
        return;
    }
    
    let html = '';
    alerts.forEach(a => {
        let badgeHtml = '';
        if (a.branches.length > 0) {
            badgeHtml = `<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded uppercase tracking-wider">${a.branches.join(', ')} (${a.total})</span>`;
        } else {
            badgeHtml = `<span class="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold rounded uppercase tracking-wider">TOTAL <= 10 (${a.total})</span>`;
        }
        
        html += `
            <div class="flex items-center justify-between p-sm bg-surface rounded hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div class="flex flex-col min-w-0 pr-2 flex-1">
                    <span class="font-label-md text-primary truncate">${a.code}</span>
                    <span class="text-[10px] text-on-surface-variant truncate" title="${a.name}">${a.name}</span>
                </div>
                <div class="flex items-center">
                    ${badgeHtml}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderTopSellers(sellers) {
    const container = document.getElementById('dashboardTopSellersList');
    if(!container) return;
    
    if(!sellers || sellers.length === 0) {
        container.innerHTML = '<p class="text-body-sm text-outline">No sales data yet.</p>';
        return;
    }
    
    let html = '';
    sellers.forEach((s, idx) => {
        html += `
            <div class="flex items-center gap-sm p-sm bg-surface rounded hover:bg-surface-container transition-colors border border-outline-variant/30">
                <div class="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs shrink-0">${idx+1}</div>
                <div class="flex-1 flex flex-col min-w-0">
                    <span class="font-label-md text-primary truncate">${s.code} - ${s.name}</span>
                </div>
                <div class="flex flex-col items-end shrink-0">
                    <span class="font-bold text-secondary text-label-md">${s.qty} units</span>
                    <span class="text-[10px] text-outline">฿${s.revenue.toLocaleString()}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Override switchTab to load dashboard stats
const originalSwitchTab = switchTab;
switchTab = function(viewId) {
    originalSwitchTab(viewId);
    if(viewId === 'view-dashboard') {
        loadDashboardStats();
    }
};

// Also load when document is ready if dashboard is active
document.addEventListener('DOMContentLoaded', () => {
    if(!document.getElementById('view-dashboard').classList.contains('hidden')) {
        loadDashboardStats();
    }
});

// CSV Export for Stock Logs
function exportStockLogsCSV() {
    if(!allLogs || allLogs.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Use filtered logs if we want to respect filters, but requirement says Export CSV
    // We will export the currently filtered logs
    const search = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value.toLowerCase() : 'all';
    const branchFilter = document.getElementById('branchFilter') ? document.getElementById('branchFilter').value.toLowerCase() : 'all';
    
    let filtered = allLogs.filter(log => {
        if (typeFilter !== 'all' && !(log.transaction_type && log.transaction_type.toLowerCase().includes(typeFilter))) {
            return false;
        }
        if (branchFilter !== 'all' && !(log.performed_by && log.performed_by.toLowerCase().includes(branchFilter))) {
            // Note: In a real system branch might be tracked differently, but let's assume it's in ref_no or performed_by or product location. 
            // The prompt says Add Branch Selector (All Branches, DE40, DE12, DW41).
            // For now, if no branch field exists directly in logs, we loosely filter by string.
            // If branch is in ref_no (e.g. DE40-TRF-1234) we can check that.
            const logStr = JSON.stringify(log).toLowerCase();
            if(!logStr.includes(branchFilter)) return false;
        }
        if (!search) return true;
        return (
            (log.product_code && log.product_code.toLowerCase().includes(search)) ||
            (log.product_name && log.product_name.toLowerCase().includes(search)) ||
            (log.log_id && log.log_id.toLowerCase().includes(search))
        );
    });

    if(filtered.length === 0) {
        alert('No data matches the current filters');
        return;
    }

    const headers = ['log_id','timestamp','performed_by','transaction_type','ref_no','product_code','product_name','qty'];
    let csvContent = headers.join(',') + "\n";
    
    filtered.forEach(log => {
        let row = headers.map(header => {
            let val = log[header] || '';
            // Escape quotes
            val = val.toString().replace(/"/g, '""');
            return `"${val}"`;
        });
        csvContent += row.join(',') + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_logs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

