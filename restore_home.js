const fs = require('fs');

const path = 'd:\\apaze\\Smartindoormap\\smartmap.html';
let content = fs.readFileSync(path, 'utf8');

const headerEnd = content.indexOf('</header>') + 9;
const trackFlight = content.indexOf('<section class="mb-6">', headerEnd);

const toInsert = `

    <!-- MAIN CONTENT AREA -->
    <main class="flex-grow relative w-full h-full overflow-hidden">

        <!-- 1. HOME VIEW -->
        <div id="home-view" class="page-section active absolute inset-0 pt-20 pb-28 px-6 overflow-y-auto">
            <div class="max-w-2xl mx-auto">
                <section class="mt-8 mb-6">
                    <div class="space-y-1">
                        <p class="text-[#B59115] font-bold tracking-widest text-[10px] uppercase">Your Private Concierge
                        </p>
                        <h2 class="text-3xl font-extrabold tracking-tight text-primary leading-tight">
                            Welcome to<br />KING POWER SUVARNABHUMI AIRPORT
                        </h2>
                    </div>

                    <div class="mt-6 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full bg-[#001b3d] flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-tertiary-fixed text-xl">smart_toy</span>
                            </div>
                            <div class="space-y-2">
                                <p id="ai-greeting-text"
                                    class="text-sm font-medium text-on-surface-variant leading-relaxed">
                                    Sawasdee Krub! I'm here to assist your journey through Suvarnabhumi today. How may I
                                    help you?
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- NEW AI SEARCH COMPONENT -->
                <section class="mb-6">
                    <div class="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                        <div class="flex items-center gap-2 mb-4">
                            <span class="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" style="background-image: linear-gradient(to right, #2563eb, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">auto_awesome</span>
                            <h3 class="font-bold text-sm uppercase tracking-tight text-primary">Ask AI Assistant</h3>
                        </div>
                        <p class="text-xs text-on-surface-variant mb-4">Find stores, products, or navigate the airport using natural language.</p>
                        
                        <!-- AI Search Input -->
                        <div class="relative flex items-center bg-[#f8fafc] border border-outline-variant/30 rounded-2xl px-4 py-2 mb-3 shadow-inner">
                            <span class="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
                            <input id="home-ai-input" type="text" 
                                class="w-full bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-0 px-0" 
                                placeholder="e.g., Find Thai luxury gifts near Gate D4..." 
                                onkeypress="if(event.key === 'Enter') triggerHomeAISearch(this.value)">
                            <button onclick="triggerHomeAISearch(document.getElementById('home-ai-input').value)"
                                class="ml-2 bg-[#000a1e] text-white p-2 rounded-xl flex items-center justify-center hover:bg-primary transition-colors">
                                <span class="material-symbols-outlined text-sm text-[#ffe088]">arrow_forward</span>
                            </button>
                        </div>
                        
                        <!-- AI Suggestion Chips -->
                        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            <button onclick="triggerHomeAISearch('Best Thai Souvenirs')" 
                                class="shrink-0 whitespace-nowrap bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-blue-100 transition-colors">
                                ✨ Best Thai Souvenirs
                            </button>
                            <button onclick="triggerHomeAISearch('Fragrance & Skincare')" 
                                class="shrink-0 whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-purple-100 transition-colors">
                                🧴 Fragrance & Skincare
                            </button>
                            <button onclick="triggerHomeAISearch('Quick Shop < 5 mins')" 
                                class="shrink-0 whitespace-nowrap bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-green-100 transition-colors">
                                ⏱️ Quick Shop &lt; 5 mins
                            </button>
                        </div>
                    </div>
                </section>

                <!-- PANPURI Pre-Order Card -->
                <section class="mb-6">
                    <div class="bg-[#000a1e] p-6 rounded-3xl shadow-xl relative overflow-hidden border border-[#ffe088]/20">
                        <div class="absolute -right-6 -top-6 w-32 h-32 bg-[#ffe088]/10 rounded-full blur-2xl"></div>
                        <div class="flex items-center gap-3 mb-4">
                            <img src="https://panpuri.com/wp-content/themes/panpuri/assets/img/logo.svg" alt="PANPURI Logo" class="h-5" style="filter: brightness(0) invert(1);" />
                            <span class="text-[#ffe088] font-black text-xs uppercase tracking-widest border-l border-white/20 pl-3">Pre-Order</span>
                        </div>
                        <p class="text-white/70 text-xs mb-4 leading-relaxed font-medium">สั่งจองสินค้าล่วงหน้า รับสินค้าได้ที่ร้านก่อนขึ้นเครื่อง</p>
                        <button onclick="showPage('page-preorder'); initPreorder()" class="w-full bg-[#ffe088] text-[#000a1e] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm">
                            <span class="material-symbols-outlined">shopping_bag</span> สั่งจองสินค้า PANPURI
                        </button>
                    </div>
                </section>
                
`;

content = content.slice(0, headerEnd) + toInsert + content.slice(trackFlight);
fs.writeFileSync(path, content, 'utf8');
