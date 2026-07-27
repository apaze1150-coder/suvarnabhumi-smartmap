// ==================== APP LOGIC ====================
const STORES = {
    'DE40': { name: 'D East (Gate 1-4)', pw: '6570' },
    'DE12': { name: 'D East (Gate 1-2)', pw: '6515' },
    'DW41': { name: 'D West (Gate 5-8)', pw: '6555' }
};

let currentStore = "";
let storeAccepting = true;
let activeTab = 'orders';
let activeFilter = 'all';

let allOrders = [];
let filteredOrds = [];
let prevOrderIds = new Set();
let allProducts = [];

let orderPendingId = null;

const STATUS_LABEL = {
    pending: 'Waiting',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    cancelled: 'Cancelled',
    out_of_stock: 'Out of Stock'
};

const audioBeep = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // dummy short base64 for beep
function playBeep() { audioBeep.play().catch(e=>{}); }
function speakOrder(num) {
    if(!window.speechSynthesis) return;
    const ut = new SpeechSynthesisUtterance("มีออเดอร์ใหม่ " + num.split('').join(' '));
    ut.lang = 'th-TH'; ut.rate = 0.9;
    window.speechSynthesis.speak(ut);
}
function esc(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

let toastTimer;
function showToast(msg, type='success'){
    const t = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    document.getElementById('toast-icon').textContent = type==='error'?'error_outline':'check_circle';
    document.getElementById('toast-icon').className = 'material-symbols-outlined ' + (type==='error'?'text-red-300':'text-secondary-fixed');
    t.style.display = 'flex';
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.style.display='none',3500);
}

// ── Authentication ──────────────────────────────────────────────────────
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const store = document.getElementById('login-store').value;
    const pass = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');
    if (!store) { err.textContent = 'Please select a store.'; err.style.display='block'; return; }
    if (STORES[store] && STORES[store].pw === pass) {
        currentStore = store;
        err.style.display = 'none';
        
        document.getElementById('header-store-id').textContent = store;
        document.getElementById('header-store-name').textContent = STORES[store].name;
        document.getElementById('rcp-store').textContent = STORES[store].name;
        
        document.getElementById('view-login').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('view-login').style.display = 'none';
            document.getElementById('view-dashboard').classList.remove('hidden');
            loadStoreSettings();
            loadOrders();
            loadProducts();
            setInterval(loadOrders, 5000); // Live poll
        }, 500);
    } else {
        err.textContent = 'Invalid credentials. Access Denied.';
        err.style.display = 'block';
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    location.reload();
});

// ── Live Clock ─────────────────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('live-clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// ── UI Navigation ──────────────────────────────────────────────────────
function switchTab(tab) {
    activeTab = tab;
    document.getElementById('tab-content-orders').style.display = tab === 'orders' ? 'grid' : 'none';
    document.getElementById('orders-filters').style.display = tab === 'orders' ? 'flex' : 'none';
    document.getElementById('tab-content-products').style.display = tab === 'products' ? 'block' : 'none';
    document.getElementById('products-filters').style.display = tab === 'products' ? 'flex' : 'none';
    
    const analyticsContent = document.getElementById('tab-content-analytics');
    if (analyticsContent) {
        analyticsContent.style.display = tab === 'analytics' ? 'flex' : 'none';
        if (tab === 'analytics' && !window.analyticsChartInitialized) {
            initAnalyticsChart();
            window.analyticsChartInitialized = true;
        }
    }
    
    // Update Sidebar Navigation
    const sideOrders = document.getElementById('side-tab-orders');
    if (sideOrders) {
        sideOrders.className = tab === 'orders' 
            ? 'flex items-center gap-4 px-4 py-3 bg-secondary-container/50 text-on-surface rounded-xl transition-all border-l-4 border-secondary-fixed shadow-sm'
            : 'flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all border-l-4 border-transparent';
        sideOrders.querySelector('.material-symbols-outlined').className = tab === 'orders' ? 'material-symbols-outlined text-secondary' : 'material-symbols-outlined';
    }
    
    const sideProducts = document.getElementById('side-tab-products');
    if (sideProducts) {
        sideProducts.className = tab === 'products' 
            ? 'flex items-center gap-4 px-4 py-3 bg-secondary-container/50 text-on-surface rounded-xl transition-all border-l-4 border-secondary-fixed shadow-sm'
            : 'flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all border-l-4 border-transparent';
        sideProducts.querySelector('.material-symbols-outlined').className = tab === 'products' ? 'material-symbols-outlined text-secondary' : 'material-symbols-outlined';
    }
    
    const sideAnalytics = document.getElementById('side-tab-analytics');
    if (sideAnalytics) {
        sideAnalytics.className = tab === 'analytics' 
            ? 'flex items-center gap-4 px-4 py-3 bg-secondary-container/50 text-on-surface rounded-xl transition-all border-l-4 border-secondary-fixed shadow-sm'
            : 'flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all border-l-4 border-transparent';
        sideAnalytics.querySelector('.material-symbols-outlined').className = tab === 'analytics' ? 'material-symbols-outlined text-secondary' : 'material-symbols-outlined';
    }

    // Update Bottom Navigation
    const botOrders = document.getElementById('bottom-tab-orders');
    if (botOrders) {
        botOrders.className = tab === 'orders' 
            ? 'flex flex-col items-center justify-center h-full text-secondary transition-colors gap-1'
            : 'flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors gap-1';
    }
    
    const botProducts = document.getElementById('bottom-tab-products');
    if (botProducts) {
        botProducts.className = tab === 'products' 
            ? 'flex flex-col items-center justify-center h-full text-secondary transition-colors gap-1'
            : 'flex flex-col items-center justify-center h-full text-on-surface-variant hover:text-primary transition-colors gap-1';
    }

    // Update Top Navigation
    const topOrders = document.getElementById('top-nav-tab-orders');
    if (topOrders) {
        topOrders.className = tab === 'orders'
            ? 'text-primary border-b-2 border-primary font-bold pb-1 h-full flex items-center pt-1 transition-colors'
            : 'text-on-surface-variant hover:text-primary transition-colors h-full flex items-center border-b-2 border-transparent';
    }
    const topProducts = document.getElementById('top-nav-tab-products');
    if (topProducts) {
        topProducts.className = tab === 'products'
            ? 'text-primary border-b-2 border-primary font-bold pb-1 h-full flex items-center pt-1 transition-colors'
            : 'text-on-surface-variant hover:text-primary transition-colors h-full flex items-center border-b-2 border-transparent';
    }
    const topAnalytics = document.getElementById('top-nav-tab-analytics');
    if (topAnalytics) {
        topAnalytics.className = tab === 'analytics'
            ? 'text-primary border-b-2 border-primary font-bold pb-1 h-full flex items-center pt-1 transition-colors'
            : 'text-on-surface-variant hover:text-primary transition-colors h-full flex items-center border-b-2 border-transparent';
    }
}

function initAnalyticsChart() {
    const ctx = document.getElementById('peakHoursChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['08:00', '12:00', '16:00', '20:00', '22:00'],
            datasets: [{
                label: 'Order Volume',
                data: [15, 45, 30, 60, 20],
                backgroundColor: [
                    '#1C1C1E', // Black
                    '#D4AF37', // Gold
                    '#1C1C1E',
                    '#D4AF37',
                    '#1C1C1E'
                ],
                borderRadius: 4,
                barThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1C1C1E',
                    titleFont: { family: 'Manrope', size: 13 },
                    bodyFont: { family: 'Manrope', size: 14, weight: 'bold' },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: 'Manrope', size: 12 },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: 'Manrope', size: 12, weight: 'bold' },
                        color: '#1e293b'
                    }
                }
            }
        }
    });
}


function setFilter(f, btn) {
    activeFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = 'filter-btn px-6 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-sm uppercase tracking-wider hover:bg-surface-container-high haptic-press';
    });
    btn.className = 'filter-btn px-6 py-2 rounded-full bg-primary text-white font-label-sm uppercase tracking-wider haptic-press active';
    renderOrders();
}

// ── Store Settings ─────────────────────────────────────────────────────
async function loadStoreSettings() {
    try {
        const res = await fetch('/api/store/settings');
        const data = await res.json();
        const s = data.settings?.[currentStore];
        storeAccepting = s?.accepting_orders !== false;
        updateToggleUI();
    } catch(e) {}
}
function updateToggleUI() {
    const t = document.getElementById('toggle-track');
    const th = document.getElementById('toggle-thumb');
    const lbl = document.getElementById('toggle-label');
    t.style.background = storeAccepting ? '#22c55e' : '#d1d5db';
    th.style.transform = storeAccepting ? 'translateX(20px)' : 'translateX(0)';
    lbl.textContent = storeAccepting ? 'Accepting' : 'Closed';
}
async function toggleAcceptOrders() {
    const newVal = !storeAccepting;
    try {
        const res = await fetch('/api/store/settings', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({store_id:currentStore, password:STORES[currentStore].pw, accepting_orders:newVal})
        });
        const data = await res.json();
        if (data.success) { storeAccepting = newVal; updateToggleUI(); showToast(newVal ? 'Accepting orders' : 'Not accepting orders'); }
        else showToast(data.error||'Error', 'error');
    } catch(e) { showToast('Connection error', 'error'); }
}

// ── Orders ─────────────────────────────────────────────────────────────
async function loadOrders() {
    try {
        const res = await fetch(`/api/orders?store_id=${currentStore}&password=${STORES[currentStore].pw}`);
        const data = await res.json();
        if (!Array.isArray(data.orders)) return;
        const orders = data.orders;
        
        const newIds = new Set(orders.map(o => o.order_id));
        const brand = new Set([...newIds].filter(id => !prevOrderIds.has(id)));
        if (prevOrderIds.size > 0 && brand.size > 0) {
            playBeep();
            const newOrders = orders.filter(o => brand.has(o.order_id));
            newOrders.forEach(o => speakOrder(o.order_number));
        }
        prevOrderIds = newIds;
        allOrders = orders;
        updateStats();
        renderOrders();
    } catch(e) {}
}

function updateStats() {
    document.getElementById('st-pending').textContent   = allOrders.filter(o=>o.status==='pending').length;
    document.getElementById('st-preparing').textContent = allOrders.filter(o=>o.status==='preparing'||o.status==='confirmed').length;
    document.getElementById('st-ready').textContent     = allOrders.filter(o=>o.status==='ready').length;
}

function renderOrders() {
    filteredOrds = activeFilter === 'all' ? allOrders : allOrders.filter(o => o.status === activeFilter);
    const wrap = document.getElementById('tab-content-orders');
    
    if (filteredOrds.length === 0) {
        wrap.innerHTML = `<div class="text-center py-20 text-on-surface-variant font-headline-md">No orders found.</div>`;
        return;
    }
    
    wrap.innerHTML = filteredOrds.map((o, index) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const dt = new Date(o.created_at);
        const timeStr = dt.toLocaleString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) + ' · ' + dt.toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'});
        
        let statusBadge = '';
        let opacityClass = 'opacity-100';
        
        if (o.status === 'pending') {
            statusBadge = `<span class="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span> Waiting</span>`;
        } else if (o.status === 'confirmed' || o.status === 'preparing') {
            statusBadge = `<span class="bg-primary-container text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">local_mall</span> Preparing</span>`;
        } else if (o.status === 'ready') {
            statusBadge = `<span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check_circle</span> Ready to Collect</span>`;
        } else if (o.status === 'cancelled') {
            statusBadge = `<span class="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Cancelled</span>`;
            opacityClass = 'opacity-60 hover:opacity-100';
        }
        
        let nextStatus = '';
        if (o.status === 'pending') nextStatus = 'confirmed';
        else if (o.status === 'confirmed') nextStatus = 'preparing';
        else if (o.status === 'preparing') nextStatus = 'ready';
        
        const updateBtn = nextStatus ? `
            <button onclick="updateOrderStatus('${o.order_id}', '${nextStatus}')" class="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-label-md haptic-press hover:bg-primary-container transition-all shadow-lg shadow-primary/10">
                <span class="material-symbols-outlined">sync_alt</span> Next: ${STATUS_LABEL[nextStatus]}
            </button>` : '';
            
        const printBtn = o.status === 'ready' ? `
            <button onclick="printOrder('${o.order_id}')" class="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-outline-variant text-on-surface-variant font-label-md haptic-press hover:bg-surface-container transition-all">
                <span class="material-symbols-outlined">print</span> Print
            </button>` : '';

        return `
        <div class="order-card-animate group bg-white border border-outline-variant hover:border-secondary transition-all duration-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md ${opacityClass}" style="animation-delay: ${index * 50}ms;">
            <div class="p-lg">
                <div class="flex flex-wrap justify-between items-start gap-md mb-lg">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <h3 class="font-headline-md text-primary">${esc(o.order_number)}</h3>
                            ${statusBadge}
                        </div>
                        <p class="text-body-sm text-on-surface-variant">${timeStr}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-headline-md text-primary">฿${parseFloat(o.total_price||0).toLocaleString()}</p>
                        <p class="text-label-sm text-on-surface-variant uppercase">${items.length} Items</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-4 mb-lg">
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30">
                        <span class="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
                        <span class="font-label-md text-on-surface">${esc(o.customer_name)}</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-primary-container text-white rounded-lg">
                        <span class="material-symbols-outlined text-[18px]">flight</span>
                        <span class="font-label-md tracking-wider">${esc(o.flight_number)}</span>
                    </div>
                </div>
                
                <div class="bg-surface-container-lowest rounded-lg p-md border border-outline-variant/20 mb-lg">
                    <ul class="space-y-2">
                        ${items.map(i => `
                        <li class="flex justify-between items-center text-body-md">
                            <span class="text-on-surface">${esc(i.name)}</span>
                            <span class="font-bold text-secondary">× ${i.qty}</span>
                        </li>`).join('')}
                        ${o.staff_note ? `
                        <li class="mt-4 pt-2 border-t border-outline-variant/20 text-orange-600 font-bold text-sm">
                            <span class="material-symbols-outlined text-[14px]">edit_note</span> Note: ${esc(o.staff_note)}
                        </li>` : ''}
                    </ul>
                </div>
                
                <div class="flex flex-wrap gap-md justify-end border-t border-outline-variant/20 pt-lg">
                    ${printBtn}
                    <button onclick="openOrderModal('${o.order_id}')" class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant text-on-surface-variant font-label-md haptic-press hover:bg-surface-container transition-all">
                        <span class="material-symbols-outlined">edit</span> Details
                    </button>
                    ${updateBtn}
                </div>
            </div>
        </div>`;
    }).join('');
}

async function updateOrderStatus(orderId, newStatus, note) {
    try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({store_id:currentStore, password:STORES[currentStore].pw, status:newStatus, staff_note:note||''})
        });
        const data = await res.json();
        if (data.success) { loadOrders(); showToast('Status updated'); }
        else showToast(data.error||'Error', 'error');
    } catch(e) { showToast('Error', 'error'); }
}

function openOrderModal(orderId) {
    const o = allOrders.find(x => x.order_id === orderId);
    if (!o) return;
    orderPendingId = orderId;
    document.getElementById('om-title').textContent = o.order_number;
    
    document.getElementById('om-body').innerHTML = `
        <div class="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant mb-4">
            <p class="font-bold text-sm">Customer: ${esc(o.customer_name)}</p>
            <p class="font-bold text-sm text-secondary-fixed-variant">Flight: ${esc(o.flight_number)}</p>
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</label>
            <select id="om-status" class="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary">
                ${['pending','confirmed','preparing','ready','cancelled','out_of_stock'].map(s => 
                    `<option value="${s}" ${s === o.status ? 'selected' : ''}>${STATUS_LABEL[s]}</option>`
                ).join('')}
            </select>
        </div>
        <div class="flex flex-col gap-2">
            <label class="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Staff Note</label>
            <input type="text" id="om-note" class="w-full bg-white border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary" value="${esc(o.staff_note||'')}" placeholder="Add an optional note..."/>
        </div>
    `;
    document.getElementById('order-modal').classList.add('open');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('open');
    orderPendingId = null;
}

function submitOrderUpdate() {
    if (!orderPendingId) return;
    const status = document.getElementById('om-status').value;
    const note = document.getElementById('om-note').value.trim();
    updateOrderStatus(orderPendingId, status, note);
    closeOrderModal();
}

function printOrder(orderId) {
    const o = allOrders.find(x => x.order_id === orderId);
    if (!o) return;
    const items = Array.isArray(o.items) ? o.items : [];
    const dt = new Date(o.created_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
    
    document.getElementById('rcp-ordernum').textContent = o.order_number;
    document.getElementById('rcp-customer').textContent = o.customer_name;
    document.getElementById('rcp-flight').textContent = o.flight_number;
    document.getElementById('rcp-time').textContent = dt;
    
    document.getElementById('rcp-items').innerHTML = items.map(i => `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <div style="flex:1;">${esc(i.name)}</div>
            <div style="margin:0 10px;">x${i.qty}</div>
            <div>${(i.price*i.qty).toLocaleString()}</div>
        </div>
    `).join('');
    
    document.getElementById('rcp-total').textContent = `฿${parseFloat(o.total_price||0).toLocaleString()}`;
    window.print();
}

// ── Products / Inventory ───────────────────────────────────────────────
async function loadProducts() {
    try {
        const res = await fetch(`/api/admin/products?password=${STORES[currentStore].pw}`);
        const data = await res.json();
        allProducts = Array.isArray(data) ? data : [];
        renderProducts();
    } catch(e) {}
}

let filteredProducts = [];
function filterStoreProducts() {
    const term = document.getElementById('search-products').value.toLowerCase();
    filteredProducts = allProducts.filter(p => 
        (p.product_name||'').toLowerCase().includes(term) ||
        (p.product_code||'').toLowerCase().includes(term) ||
        (p.category||'').toLowerCase().includes(term)
    );
    renderProducts();
}


let currentStoreCategory = 'all';

function filterStoreProducts(cat, btnElem) {
    currentStoreCategory = cat;
    document.querySelectorAll('.store-cat-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('border', 'border-outline-variant', 'text-on-surface');
    });
    btnElem.classList.remove('border', 'border-outline-variant', 'text-on-surface');
    btnElem.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('store-product-grid');
    if(!grid) return;
    
    // Filter
    let displayList = currentStoreCategory === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === currentStoreCategory || p.category.startsWith(currentStoreCategory));
        
    const searchTerm = document.getElementById('search-products') ? document.getElementById('search-products').value.toLowerCase().trim() : '';
    if(searchTerm) {
        displayList = displayList.filter(p => p.product_name.toLowerCase().includes(searchTerm) || p.product_code.toLowerCase().includes(searchTerm));
    }

    if (displayList.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-on-surface-variant py-12 font-body-lg">No products found.</div>';
        return;
    }

    grid.innerHTML = displayList.map(p => {
        const qtyKey = `qty_${currentStore.toLowerCase()}`;
        const qty = parseInt(p[qtyKey]) || 0;
        const lowStock = qty > 0 && qty < 5;
        const outOfStock = qty <= 0;
        const imgUrl = p.image && p.image.startsWith('http') ? p.image : (p.image ? '/uploads/' + p.image : 'https://placehold.co/400x400/ffffff/1e293b?text=Image+Not+Found');
        
        return `
        <div class="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden cursor-pointer haptic-active shadow-sm hover:shadow-md transition-all" onclick="openDrawer('${p.product_id}')">
            <div class="relative aspect-square bg-surface-container-low flex items-center justify-center">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${imgUrl}"/>
                ${p.is_bestseller ? '<div class="absolute top-4 left-4 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container text-label-sm font-bold">BESTSELLER</div>' : ''}
                ${outOfStock ? '<div class="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center"><span class="bg-error text-on-error px-4 py-2 rounded-full font-label-md">OUT OF STOCK</span></div>' : (lowStock ? '<div class="absolute top-4 right-4 bg-orange-100 px-3 py-1 rounded-full text-orange-600 text-label-sm font-bold border border-orange-200">LOW STOCK</div>' : '')}
            </div>
            <div class="p-md flex flex-col h-[180px]">
                <p class="text-label-sm text-secondary uppercase tracking-widest mb-1 truncate">${p.category || 'Product'}</p>
                <h3 class="font-headline-md text-headline-md text-primary mb-2 line-clamp-2 leading-tight">${p.product_name}</h3>
                <p class="text-body-sm text-on-surface-variant line-clamp-2 mb-md">${p.description || p.how_to_use || 'No description available.'}</p>
                <div class="flex items-center justify-between mt-auto pt-2">
                    <span class="font-headline-md text-headline-md text-primary">฿${p.price}</span>
                    <button class="bg-secondary text-secondary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                        <span class="material-symbols-outlined">${outOfStock ? 'visibility' : 'add'}</span>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

let activeProduct = null;
let currentDrawerQty = 1;

function openDrawer(productId) {
    const p = allProducts.find(x => x.product_id === productId);
    if(!p) return;
    activeProduct = p;
    currentDrawerQty = 1;
    
    document.getElementById('drawerTitle').innerText = p.product_name;
    document.getElementById('drawerCategory').innerText = p.category || 'Product';
    document.getElementById('drawerPrice').innerText = '฿' + p.price;
    const qtyKey = `qty_${currentStore.toLowerCase()}`;
    document.getElementById('drawerStock').innerText = parseInt(p[qtyKey]) || 0;
    document.getElementById('drawerQty').innerText = currentDrawerQty;
    document.getElementById('drawerDesc').innerText = p.description || p.how_to_use || 'No description available.';
    
    const imgUrl = p.image && p.image.startsWith('http') ? p.image : (p.image ? '/uploads/' + p.image : 'https://placehold.co/400x400/ffffff/1e293b?text=Image+Not+Found');
    document.getElementById('drawerImage').src = imgUrl;

    const drawer = document.getElementById('productDrawer');
    const panel = document.getElementById('drawerPanel');
    const backdrop = document.getElementById('drawerBackdrop');
    
    drawer.classList.remove('invisible');
    setTimeout(() => {
        panel.classList.remove('translate-x-full');
        backdrop.classList.add('opacity-100');
    }, 10);
}

function closeDrawer() {
    const panel = document.getElementById('drawerPanel');
    const backdrop = document.getElementById('drawerBackdrop');
    const drawer = document.getElementById('productDrawer');
    panel.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    setTimeout(() => {
        drawer.classList.add('invisible');
        activeProduct = null;
    }, 400);
}

function updateDrawerQty(delta) {
    let newQty = currentDrawerQty + delta;
    if(newQty < 1) newQty = 1;
    const qtyKey = `qty_${currentStore.toLowerCase()}`;
    const stock = parseInt(activeProduct[qtyKey]) || 0;
    if(newQty > stock) newQty = stock; // Limit to stock
    currentDrawerQty = newQty;
    document.getElementById('drawerQty').innerText = currentDrawerQty;
}

function addToOrder() {
    // Add logic for POS cart here
    alert('Added ' + currentDrawerQty + 'x ' + activeProduct.product_name + ' to POS Order');
    closeDrawer();
}

const CATEGORY_MAP = {
    "FINE FRAGRANCES": ["EXTRACT Perfume Oil", "Care Eau de Parfum", "Accessories"],
    "BATH & BODY": ["Bath & Body Oil", "Body & Hand Lotion", "Body Polish", "Hand Care", "Hair Care", "Bath & Body Accesories"],
    "FACE": ["Natural Face Oil & Serum", "Face & Eye Cream", "Gentle Cleanser & Toner", "Lip Care"],
    "HOME": ["Candies", "Reed Diffusers & Refills", "Room Spays & Pillow Mists", "Essential Oils", "Electric Diffusers", "Home Accessories"],
    "GIFT": ["Gift of Fine Fragrances", "Gift for Face", "Gifts for Bath & Body", "Gifts for Home"]
};

function editCategory(el, id) {
    if (el.querySelector('select')) return;
    const currentCat = el.textContent.replace('edit', '').trim();
    const opts = Object.keys(CATEGORY_MAP).map(c => `<option value="${c}" ${c===currentCat?'selected':''}>${c}</option>`).join('');
    el.innerHTML = `<select onchange="updateCategoryField('${id}', 'category', this.value)" onblur="cancelEdit(this, '${currentCat}')">${opts}</select>`;
    el.querySelector('select').focus();
}

function editSubCategory(el, id, category) {
    if (el.querySelector('select')) return;
    const currentSub = el.textContent.replace('edit', '').trim();
    const subs = CATEGORY_MAP[category] || [];
    if (subs.length === 0) {
        showToast('Please set a valid Main Category first');
        return;
    }
    const opts = subs.map(c => `<option value="${c}" ${c===currentSub?'selected':''}>${c}</option>`).join('');
    el.innerHTML = `<select onchange="updateCategoryField('${id}', 'sub_category', this.value)" onblur="cancelEdit(this, '${currentSub}')">${opts}</select>`;
    el.querySelector('select').focus();
}

function cancelEdit(selectEl, origText) {
    selectEl.parentElement.innerHTML = esc(origText) + '<span class="material-symbols-outlined edit-hint">edit</span>';
}

async function updateCategoryField(id, field, value) {
    if(!value) return;
    try {
        const payload = { password: STORES[currentStore].pw };
        payload[field] = value;
        const res = await fetch('/api/admin/products/' + id, {
            method: 'PUT', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            showToast('Updated');
            const p = allProducts.find(x => x.product_id === id);
            if (p) p[field] = value;
            renderProducts();
        } else {
            showToast('Failed to update', 'error');
            renderProducts();
        }
    } catch(e) {
        showToast('Connection error', 'error');
        renderProducts();
    }
}

// Inline Edit Logic
function editCell(el, field, id) {
    if (el.isContentEditable) return;
    el.contentEditable = "true";
    el.focus();
    
    const originalText = el.childNodes[0].nodeValue || "";
    
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    
    el.onblur = async () => {
        el.contentEditable = "false";
        let newText = el.textContent.replace('edit', '').trim();
        if (newText === originalText.trim()) return;
        
        el.innerHTML = esc(newText) + '<span class="material-symbols-outlined edit-hint">edit</span>';
        
        try {
            const body = { password: STORES[currentStore].pw };
            body[field] = newText;
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT', headers: {'Content-Type':'application/json'},
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast('Updated successfully');
                const p = allProducts.find(x => x.product_id === id);
                if (p) p[field] = newText;
            } else {
                showToast(data.error || 'Update failed', 'error');
                el.innerHTML = esc(originalText) + '<span class="material-symbols-outlined edit-hint">edit</span>';
            }
        } catch(e) {
            showToast('Connection error', 'error');
            el.innerHTML = esc(originalText) + '<span class="material-symbols-outlined edit-hint">edit</span>';
        }
    };
    
    el.onkeydown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
        if (e.key === 'Escape') { el.textContent = originalText; el.blur(); }
    };
}

async function toggleActive(id, isActive) {
    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'PUT', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ password: STORES[currentStore].pw, is_active: isActive.toString() })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Status updated');
            const p = allProducts.find(x => x.product_id === id);
            if (p) p.is_active = isActive.toString();
        } else {
            showToast('Failed to update status', 'error');
            renderProducts(); 
        }
    } catch(e) {
        showToast('Connection error', 'error');
        renderProducts();
    }
}

async function addNewProductRow() {
    const newProduct = {
        password: STORES[currentStore].pw,
        product_code: 'NEW-' + Math.floor(Math.random()*10000),
        product_name: 'New Product',
        category: 'BATH & BODY',
        sub_category: 'Bath & Body Oil',
        scent: '',
        price: '0',
        qty_de40: '0',
        qty_de12: '0',
        qty_dw41: '0',
        is_active: 'true'
    };
    
    try {
        const res = await fetch('/api/admin/products', {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newProduct)
        });
        const data = await res.json();
        if (data.success) {
            allProducts.unshift(data.product);
            filterStoreProducts();
            showToast('New product added. Click fields to edit.');
        } else {
            showToast('Failed to add product', 'error');
        }
    } catch(e) {
        showToast('Connection error', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const res = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ password: STORES[currentStore].pw })
        });
        const data = await res.json();
        if (data.success) {
            allProducts = allProducts.filter(x => x.product_id !== id);
            filterStoreProducts();
            showToast('Product deleted');
        } else {
            showToast(data.error || 'Failed to delete', 'error');
        }
    } catch(e) {
        showToast('Connection error', 'error');
    }
}

let currentUploadProductId = null;

function uploadImage(id) {
    currentUploadProductId = id;
    const modal = document.getElementById('image-upload-modal');
    const content = document.getElementById('image-upload-modal-content');
    
    document.getElementById('image-modal-selection').classList.remove('hidden');
    document.getElementById('image-modal-selection').classList.add('flex');
    document.getElementById('image-modal-url-input').classList.add('hidden');
    document.getElementById('image-modal-url-input').classList.remove('flex');
    document.getElementById('image-url-input').value = '';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
}

function closeImageModal() {
    const modal = document.getElementById('image-upload-modal');
    const content = document.getElementById('image-upload-modal-content');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        currentUploadProductId = null;
    }, 300);
}

function showUrlInput() {
    document.getElementById('image-modal-selection').classList.add('hidden');
    document.getElementById('image-modal-selection').classList.remove('flex');
    document.getElementById('image-modal-url-input').classList.remove('hidden');
    document.getElementById('image-modal-url-input').classList.add('flex');
    setTimeout(() => document.getElementById('image-url-input').focus(), 100);
}

function showSelectionMode() {
    document.getElementById('image-modal-url-input').classList.add('hidden');
    document.getElementById('image-modal-url-input').classList.remove('flex');
    document.getElementById('image-modal-selection').classList.remove('hidden');
    document.getElementById('image-modal-selection').classList.add('flex');
}

function triggerFileInput() {
    document.getElementById('hidden-image-upload').click();
}

function confirmImageUrl() {
    const url = document.getElementById('image-url-input').value.trim();
    if (!url) return;
    if (currentUploadProductId) {
        updateCategoryField(currentUploadProductId, 'image', url);
    }
    closeImageModal();
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file || !currentUploadProductId) return;
    
    closeImageModal();
    
    const fd = new FormData();
    fd.append('password', STORES[currentStore].pw);
    fd.append('product_id', currentUploadProductId);
    fd.append('image', file);
    
    try {
        showToast('Uploading...');
        const res = await fetch('/api/admin/products/upload-image', {
            method: 'POST',
            body: fd
        });
        const data = await res.json();
        if (data.success) {
            showToast('Image uploaded');
            const p = allProducts.find(x => x.product_id === currentUploadProductId);
            const filename = data.url ? data.url.split('/').pop() : data.imageUrl.split('/').pop();
            updateCategoryField(currentUploadProductId, 'image', filename);
        } else {
            showToast(data.error || 'Upload failed', 'error');
        }
    } catch(err) {
        showToast('Connection error', 'error');
    }
    e.target.value = '';
}
