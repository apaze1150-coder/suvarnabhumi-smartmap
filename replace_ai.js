const fs = require('fs');

let content = fs.readFileSync('smartmap.html', 'utf8');

// 1. Replace the ai-modal HTML block
const htmlRegex = /<!-- AI GAS MODAL Popup -->[\s\S]*?<\/iframe>\s*<\/div>\s*<\/div>/;

const newHtml = `<!-- AIRPORT AI OVERVIEW MODAL Popup -->
        <div id="ai-modal" class="fixed inset-0 z-[100] bg-black/60 hidden flex-col justify-end backdrop-blur-sm">
            <div class="bg-surface w-full h-[90vh] rounded-t-3xl overflow-hidden flex flex-col relative animate-[slideUp_0.3s_ease-out]">
                <!-- Header -->
                <div class="bg-[#001b3d] p-4 flex justify-between items-center text-white shadow-md z-20">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#ffe088]">travel_explore</span>
                        <h3 class="font-bold text-sm">Airport AI Assistant</h3>
                    </div>
                    <button onclick="closeAIModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <!-- Search Input Area inside modal -->
                <div class="bg-white border-b border-outline-variant/30 p-4 shadow-sm z-20 flex-shrink-0">
                    <div class="relative flex items-center bg-[#f8fafc] border border-outline-variant/30 rounded-2xl px-4 py-2 shadow-inner">
                        <span class="material-symbols-outlined text-blue-600 text-lg mr-2">auto_awesome</span>
                        <input id="ai-modal-input" type="text" 
                            class="w-full bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-0 px-0" 
                            placeholder="Ask about stores, products, or airport services..." 
                            onkeypress="if(event.key === 'Enter') processAiSearch(this.value)">
                        <button onclick="processAiSearch(document.getElementById('ai-modal-input').value)"
                            class="ml-2 bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <span class="material-symbols-outlined text-sm">search</span>
                        </button>
                    </div>
                </div>

                <!-- Scrollable Content Area -->
                <div class="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4" id="ai-results-container">
                    <!-- Initial Welcome State (overwritten upon search) -->
                    <div id="ai-welcome-state" class="text-center py-10 flex flex-col items-center">
                        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-3xl">smart_toy</span>
                        </div>
                        <h4 class="font-bold text-lg text-slate-800 mb-2">How can I help you today?</h4>
                        <p class="text-sm text-slate-500 max-w-xs mb-6">Ask me anything about Suvarnabhumi Airport, duty-free shopping, or specific products.</p>
                        
                        <div class="flex flex-wrap gap-2 justify-center max-w-sm">
                            <button onclick="processAiSearch('VAT Refund Location')" class="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs hover:bg-slate-50">VAT Refund Location</button>
                            <button onclick="processAiSearch('Best Thai Souvenirs')" class="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs hover:bg-slate-50">Best Thai Souvenirs</button>
                            <button onclick="processAiSearch('Currency Exchange')" class="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs hover:bg-slate-50">Currency Exchange</button>
                        </div>
                    </div>
                    
                    <!-- Search Results Area (Hidden initially) -->
                    <div id="ai-search-results" class="hidden space-y-4 pb-10">
                        <!-- AI Answer Card -->
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="material-symbols-outlined text-blue-600">auto_awesome</span>
                                <h4 class="font-bold text-sm text-slate-800">AI Overview</h4>
                            </div>
                            <div id="ai-overview-text" class="text-sm text-slate-600 leading-relaxed">
                                <!-- Generated text goes here -->
                            </div>
                        </div>

                        <!-- General Knowledge Info Card (Dynamic) -->
                        <div id="ai-knowledge-card" class="hidden bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                                <div>
                                    <h4 id="ai-knowledge-title" class="font-bold text-sm text-blue-900 mb-1">Information</h4>
                                    <p id="ai-knowledge-text" class="text-xs text-blue-800 leading-relaxed"></p>
                                </div>
                            </div>
                        </div>

                        <!-- Recommendations Section -->
                        <div id="ai-recommendations-section" class="hidden">
                            <h4 class="font-bold text-sm text-slate-800 mb-3 ml-1">Recommended Matches</h4>
                            <div id="ai-recommendations-list" class="space-y-3">
                                <!-- Cards injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

content = content.replace(htmlRegex, newHtml);

// 2. Replace JS logic
const jsRegex = /function triggerHomeAISearch\(query\) \{[\s\S]*?<\/script>/;

const newJs = `function triggerHomeAISearch(query) {
            if (!query || query.trim() === '') return;
            openAIModal();
            document.getElementById('ai-modal-input').value = query;
            processAiSearch(query);
        }

        function openAIModal() { 
            document.getElementById('ai-modal').classList.remove('hidden');
            document.getElementById('ai-modal').classList.add('flex');
            document.getElementById('ai-welcome-state').classList.remove('hidden');
            document.getElementById('ai-search-results').classList.add('hidden');
        }
        function closeAIModal() { 
            document.getElementById('ai-modal').classList.add('hidden'); 
            document.getElementById('ai-modal').classList.remove('flex');
        }

        async function processAiSearch(query) {
            if (!query || query.trim() === '') return;
            
            document.getElementById('ai-modal-input').value = query;
            document.getElementById('ai-welcome-state').classList.add('hidden');
            document.getElementById('ai-search-results').classList.remove('hidden');
            
            const overviewText = document.getElementById('ai-overview-text');
            const knowledgeCard = document.getElementById('ai-knowledge-card');
            const recommendationsSection = document.getElementById('ai-recommendations-section');
            const recommendationsList = document.getElementById('ai-recommendations-list');
            
            // Loading state
            overviewText.innerHTML = '<div class="flex items-center gap-2"><div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> Generating insights...</div>';
            knowledgeCard.classList.add('hidden');
            recommendationsSection.classList.add('hidden');
            
            // Simple keyword matching for airport knowledge
            const qLower = query.toLowerCase();
            let knowledgeFound = false;
            if (qLower.includes('vat') || qLower.includes('refund') || qLower.includes('tax')) {
                document.getElementById('ai-knowledge-title').innerText = 'VAT Refund for Tourists';
                document.getElementById('ai-knowledge-text').innerText = 'VAT Refund Counters are located at Level 4 (Departures) before Passport Control (Gate U) and after Passport Control (Concourses D).';
                knowledgeFound = true;
            } else if (qLower.includes('duty free') || qLower.includes('pick up') || qLower.includes('pickup')) {
                document.getElementById('ai-knowledge-title').innerText = 'Duty Free Pick-up';
                document.getElementById('ai-knowledge-text').innerText = 'King Power Pick-up Counters are located at both East and West wings of Level 4 after passport control.';
                knowledgeFound = true;
            } else if (qLower.includes('currency') || qLower.includes('exchange') || qLower.includes('money')) {
                document.getElementById('ai-knowledge-title').innerText = 'Currency Exchange';
                document.getElementById('ai-knowledge-text').innerText = 'Currency exchange booths (Superrich, Kasikorn, SCB) are available throughout the terminal, with best rates typically found at the Basement (B) level near the Airport Rail Link.';
                knowledgeFound = true;
            } else if (qLower.includes('gate') || qLower.includes('boarding') || qLower.match(/gate\s*[a-z]/i)) {
                document.getElementById('ai-knowledge-title').innerText = 'Boarding Gates';
                document.getElementById('ai-knowledge-text').innerText = 'Gates A-G are on Level 4. Please allow 15-20 minutes walking time to reach gates at the far end of the concourses.';
                knowledgeFound = true;
            }
            
            if (knowledgeFound) {
                knowledgeCard.classList.remove('hidden');
            }

            try {
                // We use the existing endpoint to find products/stores
                const response = await fetch(\`/api/search-store?q=\${encodeURIComponent(query)}\`);
                const stores = await response.json();
                
                let allProducts = [];
                let matchedStores = [];
                stores.forEach(s => {
                    matchedStores.push(s.Shop_Name || s.Title || s.Shop_Number);
                    if (s.products && s.products.length > 0) {
                        allProducts = allProducts.concat(s.products.map(p => ({...p, store: s})));
                    }
                });

                // Generate conversational answer
                if (stores.length > 0 || knowledgeFound) {
                    let summary = \`Based on your query "\${query}", \`;
                    if (matchedStores.length > 0) {
                        const uniqueStores = [...new Set(matchedStores)];
                        summary += \`I found relevant items at \${uniqueStores.join(', ')}.\`;
                        if (allProducts.length > 0) {
                            summary += \` Take a look at the recommended products below.\`;
                        } else {
                            summary += \` Take a look at the recommended stores below.\`;
                        }
                    } else if (knowledgeFound) {
                        summary += \`I've provided the airport information you requested below. If you're also looking to shop, try searching for a brand or category!\`;
                    }
                    overviewText.innerText = summary;
                } else {
                    overviewText.innerText = \`I couldn't find specific products or stores matching "\${query}". Try asking for "Best Thai Souvenirs" or a specific brand.\`;
                }

                // Render product cards
                if (allProducts.length > 0) {
                    recommendationsSection.classList.remove('hidden');
                    recommendationsList.innerHTML = allProducts.slice(0, 10).map(p => {
                        let pImgUrl = (p.PRODUCT_IMAGE_FILENAME && (p.PRODUCT_IMAGE_FILENAME.startsWith('http') || p.PRODUCT_IMAGE_FILENAME.startsWith('/uploads/'))) 
                            ? p.PRODUCT_IMAGE_FILENAME 
                            : \`/uploads/\${p.PRODUCT_IMAGE_FILENAME || 'default_product.jpg'}\`;
                        
                        return \`
                            <div class="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-center gap-3">
                                <div class="w-16 h-16 bg-slate-50 rounded-lg shrink-0 overflow-hidden border border-slate-100">
                                    <img src="\${pImgUrl}" class="w-full h-full object-cover" onerror="this.src='/uploads/default_product.jpg'" />
                                </div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="font-bold text-xs text-slate-800 line-clamp-2">\${p.PRODUCT_NAME || 'Product'}</h5>
                                    <p class="text-[10px] text-slate-500 mb-1 flex items-center gap-1 mt-1">
                                        <span class="material-symbols-outlined text-[12px]">storefront</span> 
                                        \${p.store.Shop_Name || 'Store'} \${p.store.Unit_ID || p.store.Shop_Number ? '(Unit ' + (p.store.Unit_ID || p.store.Shop_Number) + ')' : ''}
                                    </p>
                                </div>
                                <button onclick="closeAIModal(); showPage('home-view'); document.getElementById('map-search-input').value = '\${p.STORE_ID}'; setTimeout(()=>performSearch(),100);" class="shrink-0 bg-blue-50 text-blue-600 px-2 py-1.5 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                                    <span class="material-symbols-outlined text-sm">navigation</span>
                                    <span class="text-[8px] font-bold mt-0.5">MAP</span>
                                </button>
                            </div>
                        \`;
                    }).join('');
                } else if (stores.length > 0) {
                    // Render store cards if no products
                    recommendationsSection.classList.remove('hidden');
                    recommendationsList.innerHTML = stores.slice(0, 10).map(s => {
                        let imgUrl = (s.Image_URL && (s.Image_URL.startsWith('http') || s.Image_URL.startsWith('/uploads/')))
                            ? s.Image_URL : \`/uploads/\${s.Image_URL || 'default_store.jpg'}\`;
                        return \`
                            <div class="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-center gap-3">
                                <div class="w-16 h-16 bg-slate-50 rounded-lg shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                                    \${imgUrl.includes('default_store') ? '<span class="material-symbols-outlined text-slate-300 text-3xl">store</span>' : \`<img src="\${imgUrl}" class="w-full h-full object-cover" onerror="this.src='/uploads/default_store.jpg'" />\`}
                                </div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="font-bold text-xs text-slate-800 truncate">\${s.Shop_Name || s.Title || 'Store'}</h5>
                                    <p class="text-[10px] text-slate-500 mb-1 flex items-center gap-1 mt-1">
                                        <span class="material-symbols-outlined text-[12px]">storefront</span> 
                                        Unit \${s.Unit_ID || s.Shop_Number || 'N/A'}
                                    </p>
                                </div>
                                <button onclick="closeAIModal(); showPage('home-view'); document.getElementById('map-search-input').value = '\${s.Shop_Number || s.Unit_ID}'; setTimeout(()=>performSearch(),100);" class="shrink-0 bg-blue-50 text-blue-600 px-2 py-1.5 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors shadow-sm active:scale-95">
                                    <span class="material-symbols-outlined text-sm">navigation</span>
                                    <span class="text-[8px] font-bold mt-0.5">MAP</span>
                                </button>
                            </div>
                        \`;
                    }).join('');
                }
            } catch (err) {
                console.error('AI search error:', err);
                overviewText.innerText = 'Sorry, there was an error processing your request. Please try again.';
                knowledgeCard.classList.add('hidden');
                recommendationsSection.classList.add('hidden');
            }
        }
</script>`;

content = content.replace(jsRegex, newJs);

fs.writeFileSync('smartmap.html', content);
console.log('Replaced successfully');
