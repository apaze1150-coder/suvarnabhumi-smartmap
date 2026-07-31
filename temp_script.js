</script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-container": "#0f1c30",
                        "on-primary": "#ffffff",
                        "on-background": "#191c1e",
                        "surface-container": "#edeef0",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f4f6",
                        "tertiary-container": "#1c1b1b",
                        "on-secondary-fixed-variant": "#574500",
                        "on-primary-container": "#78849d",
                        "inverse-primary": "#bac7e2",
                        "surface-container-high": "#e7e8ea",
                        "tertiary-fixed-dim": "#c8c6c5",
                        "surface-bright": "#f8f9fb",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-fixed-variant": "#474746",
                        "on-primary-fixed-variant": "#3b475d",
                        "secondary-container": "#ffe088",
                        "charcoal-surface": "#1A1A1A",
                        "on-primary-fixed": "#0f1c30",
                        "primary": "#000000",
                        "tertiary": "#000000",
                        "on-tertiary-container": "#858383",
                        "outline-variant": "#c5c6cd",
                        "on-surface": "#191c1e",
                        "surface-tint": "#525f76",
                        "surface": "#f8f9fb",
                        "primary-fixed-dim": "#bac7e2",
                        "on-secondary-container": "#786216",
                        "surface-dim": "#d9dadc",
                        "on-error-container": "#93000a",
                        "secondary-fixed-dim": "#e1c46f",
                        "on-tertiary-fixed": "#1c1b1b",
                        "error": "#ba1a1a",
                        "status-gold": "#735C00",
                        "inverse-on-surface": "#f0f1f3",
                        "surface-variant": "#e1e2e4",
                        "secondary-fixed": "#ffe088",
                        "inverse-surface": "#2e3132",
                        "secondary": "#725c10",
                        "primary-fixed": "#d6e3ff",
                        "outline": "#75777d",
                        "background": "#f8f9fb",
                        "surface-container-highest": "#e1e2e4",
                        "on-secondary-fixed": "#241a00",
                        "error-container": "#ffdad6",
                        "on-tertiary": "#ffffff",
                        "tertiary-fixed": "#e5e2e1",
                        "on-surface-variant": "#44474d",
                        "on-secondary": "#ffffff"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "margin-mobile": "16px",
                        "xl": "32px",
                        "margin-desktop": "32px",
                        "lg": "24px",
                        "gutter": "16px",
                        "sm": "8px",
                        "baseline": "4px",
                        "md": "16px",
                        "xs": "4px"
                    },
                    "fontFamily": {
                        "body-lg": ["Inter"],
                        "headline-md": ["Manrope"],
                        "headline-xl-mobile": ["Manrope"],
                        "headline-lg": ["Manrope"],
                        "label-md": ["Manrope"],
                        "headline-xl": ["Manrope"],
                        "body-md": ["Inter"],
                        "body-sm": ["Inter"],
                        "label-sm": ["Manrope"]
                    },
                    "fontSize": {
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "700"}],
                        "headline-xl-mobile": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "headline-lg": ["28px", {"lineHeight": "34px", "fontWeight": "700"}],
                        "label-md": ["14px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "headline-xl": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
<style>
        .ripple-gold:active {
            background-color: rgba(255, 224, 136, 0.4);
            transition: background-color 0s;
        }
        .staggered-item {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
            to { opacity: 1; transform: translateY(0); }
        }
        .excel-cell:focus {
            outline: 2px solid #725c10;
            background: white;
            z-index: 10;
        }
        .thumb-zone-safe {
            padding-bottom: env(safe-area-inset-bottom);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 16px; height: 16px; background-color: #f5f5f5; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #f5f5f5; border-radius: 8px; box-shadow: inset 0 0 6px rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #b0b0b0; border-radius: 8px; border: 3px solid #f5f5f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #909090; }
        .col-hidden { display: none !important; }
    </style>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed flex h-screen overflow-hidden">
    <aside class="hidden lg:flex flex-col h-full py-lg px-md gap-sm bg-surface-container-lowest border-r border-outline-variant w-72 shrink-0">
<div class="mb-lg px-md">
<h1 class="font-headline-md text-headline-md text-primary tracking-widest uppercase">PAÑPURI</h1>
<p class="text-label-sm text-outline uppercase tracking-wider mt-1">Admin Portal</p>
</div>
<nav class="flex-1 space-y-2">
<a href="#" onclick="switchTab('view-dashboard')" class="w-full flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-full px-4 py-3 font-label-md transition-all duration-200 active:scale-[0.98]" id="nav-dashboard" >
<span class="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</a>
<a href="#" onclick="switchTab('view-orders')" class="w-full flex items-center gap-3 text-on-surface-variant hover:bg-surface-container rounded-full px-4 py-3 font-label-md transition-all duration-200 active:scale-[0.98]" id="nav-orders" >
<span class="material-symbols-outlined">shopping_cart</span>
<span>Orders</span>
</a>
<a href="#" onclick="switchTab('view-products')" class="w-full flex items-center gap-3 text-on-surface-variant hover:bg-surface-container rounded-full px-4 py-3 font-label-md transition-all duration-200 active:scale-[0.98]" id="nav-database" >
<span class="material-symbols-outlined">inventory_2</span>
<span>Product Database</span>
</a>
<a href="#" onclick="switchTab('view-stocklogs')" class="w-full flex items-center gap-3 text-on-surface-variant hover:bg-surface-container rounded-full px-4 py-3 font-label-md transition-all duration-200 active:scale-[0.98]" id="nav-stocklogs" >
<span class="material-symbols-outlined">history</span>
<span>Stock Logs</span>
</a>
<a href="#" class="w-full flex items-center gap-3 text-on-surface-variant hover:bg-surface-container rounded-full px-4 py-3 font-label-md transition-all duration-200 active:scale-[0.98]" id="nav-settings" >
<span class="material-symbols-outlined">settings</span>
<span>Store Settings</span>
</a>
</nav>
<div class="mt-auto border-t border-outline-variant pt-lg flex items-center gap-4 px-md">
<div class="w-10 h-10 rounded-full bg-primary-container overflow-hidden border border-outline-variant">
<img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr1gd0zEqIciJp0BbCzP4ml8ohe-LKMeQuePPvQ1dKmO6P6JE08ZGL784bJgZVmeknPaXBe-YYCZ0Jkf6V7Be7jdVzUaXGIXusXVRKYPlYbEIpqkMHilh09QLUSLGLO_xPpzUSdATer6wq0QUSTI9ejARR6oNOvaBag8oUizBSmDGSFeyqBtvsoRDpGjwbRQ6NgmzWQUGdeLoSx9gNziNkdLHZVlCYbubFB5FDNoLuXSKyiw0ydjsiQg5w7EX4LOwHHjXdBtExCd4"/>
</div>
<div>
<p class="font-label-md text-on-surface">Alex Mercer</p>
<p class="text-label-sm text-outline">Global Admin</p>
</div>
<button class="ml-auto material-symbols-outlined text-outline hover:text-error transition-colors">logout</button>
</div>
</aside>    <main class="flex-1 h-screen flex flex-col overflow-hidden w-full pb-20 lg:pb-0">
        <header class="h-auto min-h-20 py-4 lg:py-0 lg:h-20 bg-surface flex flex-col lg:flex-row items-center justify-between px-margin-mobile md:px-margin-desktop border-b border-outline-variant z-10 shrink-0 gap-4">
  <div class="flex items-center justify-between w-full lg:w-auto gap-4">
  <h2 class="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-on-surface truncate" id="page-title">Global Dashboard</h2>
  <span class="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-sm rounded-full shrink-0" id="live-indicator">LIVE</span>
  </div>
  <div class="flex items-center justify-between w-full lg:w-auto gap-2 md:gap-4 lg:gap-margin-desktop">
  <div class="relative flex items-center flex-1 lg:flex-none">
  <span class="absolute left-3 material-symbols-outlined text-outline">search</span>
  <input id="searchInput" class="pl-10 pr-4 py-2 bg-surface-container border-none rounded-full w-full lg:w-64 focus:ring-2 focus:ring-secondary text-body-sm" placeholder="Search orders, products..." type="text"/>
  </div>
  <div class="flex items-center gap-2 md:gap-4 shrink-0">
  <button class="material-symbols-outlined text-on-surface p-2 hover:bg-surface-container rounded-full">notifications</button>
  <button class="material-symbols-outlined text-on-surface p-2 hover:bg-surface-container rounded-full">help</button>
  </div>
  </div>
  </header>
        
        <div id="view-dashboard" class="spa-view block">
            <!-- Top Bar -->

<!-- View: Dashboard -->
<div class="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-lg custom-scrollbar">
<!-- Global Stats Bento Grid -->
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
<div class="staggered-item bg-primary-container text-on-primary p-lg rounded-xl shadow-sm border border-outline-variant" style="animation-delay: 50ms;">
<p class="text-label-sm text-on-primary-container uppercase tracking-widest mb-2">Total Orders (24h)</p>
<div class="flex items-end justify-between">
<span class="font-headline-xl text-headline-xl">1,284</span>
<span class="text-secondary font-bold flex items-center gap-1 text-label-md">
<span class="material-symbols-outlined text-[16px]">trending_up</span> +12%
                        </span>
</div>
</div>
<div class="staggered-item bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant" style="animation-delay: 100ms;">
<p class="text-label-sm text-outline uppercase tracking-widest mb-2">Pending</p>
<div class="flex items-end justify-between">
<span class="font-headline-xl text-headline-xl text-on-surface">42</span>
<span class="material-symbols-outlined text-status-gold" style="font-variation-settings: 'FILL' 1;">pending</span>
</div>
</div>
<div class="staggered-item bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant" style="animation-delay: 150ms;">
<p class="text-label-sm text-outline uppercase tracking-widest mb-2">Preparing</p>
<div class="flex items-end justify-between">
<span class="font-headline-xl text-headline-xl text-on-surface">158</span>
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">stockpot</span>
</div>
</div>
<div class="staggered-item bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant" style="animation-delay: 200ms;">
<p class="text-label-sm text-outline uppercase tracking-widest mb-2">Ready for Pickup</p>
<div class="flex items-end justify-between">
<span class="font-headline-xl text-headline-xl text-on-surface">312</span>
<span class="material-symbols-outlined text-green-600" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
</div>
</section>

                <!-- NEW: Charts & Alerts -->
                <section class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                    <!-- Chart Widget 1: Store Sales & Order Comparison -->
                    <div class="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                        <div class="flex justify-between items-center mb-md">
                            <h3 class="font-headline-md text-headline-md text-primary">Store Sales & Order Comparison</h3>
                            <button class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
                        </div>
                        <div class="flex-1 min-h-[300px] relative">
                            <canvas id="salesComparisonChart"></canvas>
                        </div>
                    </div>
                    
                    <!-- Widget 2: Side-by-Side -->
                    <div class="flex flex-col gap-lg">
                        <!-- Cross-Store Low Stock Alerts -->
                        <div class="flex-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                            <div class="flex justify-between items-center mb-sm">
                                <h3 class="font-headline-md text-on-surface">Low Stock Alerts</h3>
                                <span class="material-symbols-outlined text-error">warning</span>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[150px] space-y-2" id="dashboardLowStockList">
                                <p class="text-body-sm text-outline">Loading...</p>
                            </div>
                        </div>

                        <!-- Top 5 Overall Best Sellers -->
                        <div class="flex-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col">
                            <div class="flex justify-between items-center mb-sm">
                                <h3 class="font-headline-md text-on-surface">Top 5 Best Sellers</h3>
                                <span class="material-symbols-outlined text-status-gold" style="font-variation-settings: 'FILL' 1;">star</span>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[150px] space-y-2" id="dashboardTopSellersList">
                                <p class="text-body-sm text-outline">Loading...</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Store Status Cards -->
<section class="space-y-md">
    <div class="flex items-center justify-between">
        <h3 class="font-headline-md text-headline-md">Store Live Status</h3>
        <button class="text-secondary font-label-md hover:underline">View All Stores</button>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-gutter" id="storeLiveStatusGrid">
        <!-- DE40 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group" style="animation-delay: 250ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DE40 Store</h4>
                    <p class="text-label-sm text-outline">Flagship Boutique - Gate 1-4</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input checked class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="de40-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="de40-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="de40-items-sold">0</p>
                </div>
            </div>
        </div>
        <!-- DE12 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group" style="animation-delay: 300ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DE12 Store</h4>
                    <p class="text-label-sm text-outline">Luxury Transit Hub</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input checked class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="de12-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="de12-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="de12-items-sold">0</p>
                </div>
            </div>
        </div>
        <!-- DW41 Card -->
        <div class="staggered-item bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-secondary transition-colors group opacity-75" style="animation-delay: 350ms;">
            <div class="flex justify-between items-start mb-lg">
                <div>
                    <h4 class="font-headline-md text-on-surface">DW41 Store</h4>
                    <p class="text-label-sm text-outline">International Terminal</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input class="sr-only peer" type="checkbox"/>
                    <div class="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
            </div>
            <div class="grid grid-cols-3 gap-sm">
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Today Revenue</p>
                    <p class="font-headline-sm text-primary mt-1" id="dw41-revenue">฿0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Active Orders</p>
                    <p class="font-headline-sm text-secondary mt-1" id="dw41-active-orders">0</p>
                </div>
                <div class="bg-surface-container-lowest p-md rounded-lg flex flex-col justify-center items-center text-center">
                    <p class="text-[9px] uppercase text-outline font-bold tracking-wide">Items Sold</p>
                    <p class="font-headline-sm text-on-surface mt-1" id="dw41-items-sold">0</p>
                </div>
            </div>
        </div>
    </div></section>
</div>

        </div>
        <div id="view-orders" class="spa-view hidden">
            <!-- Top Navigation Bar -->

<!-- Scrollable Content Canvas -->
<div class="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-lg custom-scrollbar">
<!-- Hero Summary Section -->
<section class="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div class="md:col-span-2 relative h-48 rounded-xl overflow-hidden bg-primary-container p-xl flex flex-col justify-between shadow-lg">
<div class="absolute inset-0 opacity-20">
<img alt="Luxury retail environment background" class="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDyuVuFs_HgpaxFBStohxatqhyIiw6WdKLjttGTFRJn8OT3jLuqQeg84vDVwmlpH1WbFzu9Y2otNmO2V634B8tQN_EaUBopNJlsWtsh30UMOuCfm4m9r083dmYSkrvKK-2ZpjYsakPqU_Eke4MP43IPUYYudx3f7Vo4waO4tCqGwVQ3bVqfwXKCyGTGM7xPjo_lC5WaE_9xJJgdfaWVZWNRxKJCNn4rjsJwp9ZQj5DYhQ0g9ussSLuxTC_ESxNbQWYMOlG9vaaXcM"/>
</div>
<div class="relative z-10">
<h2 class="font-headline-lg text-headline-lg text-secondary-fixed mb-xs">Orders Management</h2>
<p class="text-on-primary-container font-body-sm max-w-xs">Oversee your royal inventory and order fulfillments with precision.</p>
</div>
<div class="relative z-10 flex gap-md">
<div class="px-md py-sm bg-on-primary-fixed-variant/30 backdrop-blur-md rounded border border-on-primary-fixed-variant/50">
<p class="font-label-sm text-label-sm text-secondary-fixed/70 uppercase">Total Volume</p>
<p id="totalVolume" class="font-headline-md text-headline-md text-white">0</p>
</div>
</div>
</div>
<!-- Quick Stats Cards -->
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
<div class="flex justify-between items-start">
<div class="w-10 h-10 bg-secondary-container/20 text-status-gold rounded flex items-center justify-center">
<span class="material-symbols-outlined">pending_actions</span>
</div>
</div>
<div>
<p id="pendingCount" class="font-headline-lg text-headline-lg text-primary">0</p>
<p class="font-label-md text-label-md text-on-surface-variant">Pending Orders</p>
</div>
</div>
<div class="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
<div class="flex justify-between items-start">
<div class="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
<span class="material-symbols-outlined">conveyor_belt</span>
</div>
<span class="font-label-sm text-label-sm text-blue-600 bg-blue-50 px-sm py-xs rounded">Live</span>
</div>
<div>
<p id="readyCount" class="font-headline-lg text-headline-lg text-primary">0</p>
<p class="font-label-md text-label-md text-on-surface-variant">Ready for Pickup</p>
</div>
</div>
</section>
<!-- Filter & Table Section -->
<section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
<!-- Filter Bar -->
<div class="flex flex-col md:flex-row justify-between items-center p-md border-b border-outline-variant bg-surface-container-low/30 gap-md">
<div class="flex bg-surface-container rounded-lg p-1" id="statusFilter">
<button data-status="all" class="px-lg py-2 font-label-md text-label-md rounded-md bg-white shadow-sm text-primary font-bold">All</button>
<button data-status="pending" class="px-lg py-2 font-label-md text-label-md rounded-md text-on-surface-variant hover:text-primary transition-colors">Pending</button>
<button data-status="preparing" class="px-lg py-2 font-label-md text-label-md rounded-md text-on-surface-variant hover:text-primary transition-colors">Preparing</button>
<button data-status="ready" class="px-lg py-2 font-label-md text-label-md rounded-md text-on-surface-variant hover:text-primary transition-colors">Ready</button>
<button data-status="completed" class="px-lg py-2 font-label-md text-label-md rounded-md text-on-surface-variant hover:text-primary transition-colors">Completed</button>
<button data-status="cancelled" class="px-lg py-2 font-label-md text-label-md rounded-md text-on-surface-variant hover:text-primary transition-colors">Cancelled</button>
</div>
<div class="flex items-center gap-sm bg-white border border-outline-variant rounded-lg px-md py-2">
<span class="material-symbols-outlined text-on-surface-variant text-sm">calendar_today</span>
<span class="font-label-md text-label-md text-on-surface-variant">Latest Orders</span>
</div>
</div>
<!-- High-Density Orders Table -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
                    <thead class="bg-surface-container-low text-label-sm text-on-surface-variant border-b border-outline-variant">
                        <tr>
                            <th class="px-md py-3 font-medium">Code</th>
                            <th class="px-md py-3 font-medium">Description</th>
                            <th class="px-md py-3 font-medium">Reference</th>
                            <th class="px-md py-3 font-medium">Category</th>
                            <th class="px-md py-3 font-medium text-right">Price</th>
                            <th class="px-md py-3 font-medium text-center">Qty_Branch1</th>
                            <th class="px-md py-3 font-medium text-center">Qty_Branch2</th>
                            <th class="px-md py-3 font-medium text-center">Qty_Branch3</th>
                        </tr>
                    </thead>
<tbody class="divide-y divide-outline-variant" id="ordersTableBody">
<!-- Rows will be populated by JS -->
</tbody>
</table>
</div>
<!-- Pagination Footer -->
<div class="p-md flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant">
<p class="font-label-sm text-label-sm text-on-surface-variant" id="paginationInfoOrders">Showing 0 entries</p>
</div>
</section>
</div>
        </div>
        <div id="view-products" class="spa-view hidden">
            <div class="p-margin-mobile md:p-margin-desktop space-y-lg flex-1 flex flex-col min-h-0 overflow-hidden">
<div class="flex justify-between items-end">
<div>
<h2 class="font-headline-xl text-headline-xl text-primary tracking-tight">Product Database</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Manage your premium fragrance and skincare inventory.</p>
</div>
<div class="flex gap-3 items-center">
    <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
        <input type="text" id="admin-code-search" placeholder="ค้นหารหัสสินค้า (CODE)..." class="pl-10 pr-4 py-2 bg-white border border-outline-variant/40 rounded-full w-full sm:w-64 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" onkeydown="if(event.key==='Enter') searchProductCode()">
    </div>
    
                        <!-- Column Visibility Dropdown -->
                        <div class="relative inline-block">
                            <button id="columnToggleBtn" onclick="toggleColumnDropdown(event)" class="flex items-center gap-2 bg-surface-container-high text-on-surface px-lg py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all">
                                <span class="material-symbols-outlined text-[20px]">view_column</span>
                                Columns
                            </button>
                            <div id="columnDropdown" class="hidden absolute right-0 mt-2 w-64 bg-white border border-outline-variant shadow-lg rounded-xl z-50 p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                <p class="text-xs font-bold text-on-surface-variant uppercase mb-3 tracking-wider">Toggle Columns</p>
                                <div id="columnToggles" class="flex flex-col gap-2">
                                    <!-- Dynamic Checkboxes -->
                                </div>
                            </div>
                        </div>
        <button onclick="openAddProductModal()" class="flex items-center gap-2 bg-primary-container text-on-primary px-lg py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all ripple-gold">
        <span class="material-symbols-outlined text-[20px]">add</span> Add Product
    </button>
    <button onclick="openBulkImportModal()" class="flex items-center gap-2 bg-surface-container-high text-on-surface px-lg py-2.5 rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all">
        <span class="material-symbols-outlined text-[20px]">upload_file</span> Bulk Import
    </button>
    <button class="hidden" id="saveBtnProducts" style="display: none !important;">
    </button>
</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
<div class="bg-surface-container-lowest p-lg rounded-xl bento-shadow border border-outline-variant/30 flex flex-col justify-between">
<div class="flex justify-between items-start">
<div class="p-2 bg-primary-container text-secondary-fixed rounded-lg">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">inventory</span>
</div>
</div>
<div class="mt-xl">
<p class="text-on-surface-variant font-label-md uppercase tracking-wider">Total SKUs</p>
<h3 id="totalSKUs" class="text-[32px] font-bold text-primary mt-xs">0</h3>
</div>
</div>
<div class="bg-surface-container-lowest p-lg rounded-xl bento-shadow border border-outline-variant/30 flex flex-col justify-between">
<div class="flex justify-between items-start">
<div class="p-2 bg-error-container text-error rounded-lg">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">warning</span>
</div>
<span class="text-error font-bold text-label-sm">Requires Action</span>
</div>
<div class="mt-xl">
<p class="text-on-surface-variant font-label-md uppercase tracking-wider">Low Stock items</p>
<h3 id="lowStockCount" class="text-[32px] font-bold text-primary mt-xs">0</h3>
</div>
</div>
<div class="bg-primary-container p-lg rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
<div class="absolute -right-4 -bottom-4 opacity-10">
<span class="material-symbols-outlined text-[120px] text-on-primary">air</span>
</div>
<div class="flex justify-between items-start relative z-10">
<div class="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">scuba_diving</span>
</div>
</div>
<div class="mt-xl relative z-10">
<p class="text-on-primary-container font-label-md uppercase tracking-wider">Active Scents</p>
<h3 id="activeScentsCount" class="text-[32px] font-bold text-secondary-fixed mt-xs">0</h3>
</div>
</div>
</div>

<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden bento-shadow flex-1 flex flex-col min-h-0">

<div id="visual-debugger" class="bg-black text-green-400 font-mono text-xs p-4 rounded-lg mt-4 mb-4 whitespace-pre-wrap max-h-64 overflow-y-auto">
[DEBUG CONSOLE]
</div>

<div class="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar" id="productsTableContainer">
<table class="w-full text-left border-collapse min-w-[1600px]">
<thead class="bg-surface-container-low sticky top-0 z-10">
<tr>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low" data-col="no">No.</th>
<th class="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low" data-col="code">Code</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="desc">Description</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="ref">Reference</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="cat">Category</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="subcat">Sub Category</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="scent">Scent</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="size">Size</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-right sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="price">Price</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="img">Image</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="qty1">Qty_Branch1</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="qty2">Qty_Branch2</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="qty3">Qty_Branch3</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="desc_cust">Description For Customer</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="scent_notes">SCENT NOTES</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="how_to_use">How To Use</th>
<th class="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-center sticky top-0 z-10 bg-surface-container-low whitespace-nowrap" data-col="actions">Actions</th>
</tr>
</thead>
<tbody id="productsTableBody" class="divide-y divide-outline-variant/20">
<!-- Dynamic Rows -->
</tbody>
</table>
</div>
<div class="px-lg py-md bg-surface-container-low flex justify-between items-center">
<p id="paginationInfoProducts" class="font-body-sm text-body-sm text-on-surface-variant">Showing 0 entries</p>
</div>
</div>
</div>
        </div>
        <div id="view-stocklogs" class="spa-view hidden">
            <div class="flex-1 p-margin-mobile md:p-margin-desktop space-y-lg overflow-y-auto max-h-[calc(100vh-64px)] custom-scrollbar">
<div class="flex justify-between items-end">
<div>
<nav class="flex items-center gap-xs text-xs text-on-surface-variant mb-2 font-label-sm">
<span>INVENTORY</span>
<span class="material-symbols-outlined text-xs">chevron_right</span>
<span class="text-primary font-bold">STOCK LOGS</span>
</nav>
<h2 class="font-headline-xl text-headline-xl text-primary tracking-tight">Global Stock Logs</h2>
<p class="text-on-surface-variant mt-1">Audit transaction history across all royal branches and logistics centers.</p>
</div>
</div>


<div class="grid grid-cols-12 gap-lg">
    <div class="col-span-12 xl:col-span-8 glass-panel p-lg rounded-xl flex flex-wrap items-end gap-lg">
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">DATE RANGE</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">calendar_today</span>
                <select class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option>Last 30 Days</option>
                    <option>All Time</option>
                </select>
            </div>
        </div>
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">BRANCH</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">store</span>
                <select id="branchFilter" class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option value="all">All Branches</option>
                    <option value="de40">DE40</option>
                    <option value="de12">DE12</option>
                    <option value="dw41">DW41</option>
                </select>
            </div>
        </div>
        <div class="flex-1 min-w-[150px] space-y-sm">
            <label class="text-label-sm text-on-surface-variant block">TRANSACTION TYPE</label>
            <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-status-gold">category</span>
                <select id="typeFilter" class="w-full pl-10 pr-4 py-3 bg-white border-2 border-outline-variant rounded-lg text-body-sm focus:border-secondary transition-all appearance-none">
                    <option value="all">All Types</option>
                    <option value="transfer">Transfer</option>
                    <option value="receipt">Receipt</option>
                    <option value="adjustment">Adjustment</option>
                </select>
            </div>
        </div>
        <div>
            <button onclick="exportStockLogsCSV()" class="h-[48px] px-lg bg-surface-container border-2 border-outline-variant rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors text-body-sm font-bold">
                <span class="material-symbols-outlined">download</span> Export CSV
            </button>
        </div>
    </div>
    
    <div class="col-span-12 xl:col-span-4 flex gap-lg">
        <div class="flex-1 glass-panel p-lg rounded-xl flex items-center justify-between">
            <div>
                <p class="text-label-sm text-on-surface-variant">TOTAL TRANSACTIONS</p>
                <h3 id="totalLogs" class="text-headline-lg font-bold text-primary">0</h3>
            </div>
            <div class="h-12 w-12 bg-secondary-container/30 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-secondary text-2xl">insights</span>
            </div>
        </div>
        <div class="flex-1 glass-panel p-lg rounded-xl flex items-center justify-between">
            <div>
                <p class="text-label-sm text-on-surface-variant">RECENT RECEIPTS</p>
                <h3 id="recentReceipts" class="text-headline-lg font-bold text-green-700">0</h3>
            </div>
            <div class="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 text-2xl">inventory</span>
            </div>
        </div>
    </div></div>
</div>

<div class="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
<div class="overflow-x-auto custom-scrollbar">
<table class="w-full text-left border-collapse">
<thead class="bg-surface-container-low border-b border-outline-variant">
<tr>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Log ID</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Timestamp</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Performed By</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Type</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Ref No.</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Product Code</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider">Product Name</th>
<th class="px-md py-lg text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Qty</th>
</tr>
</thead>
<tbody id="logsTableBody" class="divide-y divide-outline-variant">
<!-- Rows populated by JS -->
</tbody>
</table>
</div>
<div class="p-lg bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
<p id="stockPaginationInfo" class="text-body-sm text-on-surface-variant">Showing 0 logs</p>
</div>
</div>

</div>
        </div>
    <!-- Floating Mobile Nav Placeholder -->
<div class="lg:hidden fixed bottom-0 left-0 w-full bg-primary-container text-on-primary flex justify-around py-md thumb-zone-safe shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
<a href="panpuri_admin.html" class="flex flex-col items-center gap-1" >
<span class="material-symbols-outlined text-secondary">dashboard</span>
<span class="text-label-sm">Home</span>
</a>
<a href="panpuri_admin_products.html" class="flex flex-col items-center gap-1 text-on-primary-container" >
<span class="material-symbols-outlined">inventory_2</span>
<span class="text-label-sm">Inventory</span>
</a>
<a href="panpuri_admin_stock.html" class="flex flex-col items-center gap-1 text-on-primary-container" >
<span class="material-symbols-outlined">history</span>
<span class="text-label-sm">Logs</span>
</a>
<button class="flex flex-col items-center gap-1 text-on-primary-container">
<span class="material-symbols-outlined">person</span>
<span class="text-label-sm">Profile</span>
</button>
</div>
    </main>
<script>