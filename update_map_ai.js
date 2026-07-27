const fs = require('fs');

const path = 'd:\\apaze\\Smartindoormap\\smartmap.html';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `<div class="absolute top-20 left-0 w-full px-6 pt-4 z-40 pointer-events-none">
                <div class="max-w-xl mx-auto pointer-events-auto flex flex-col gap-2">
                    <div
                        class="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-1.5 flex items-center gap-3 border border-outline-variant/30">
                        <div class="pl-4 text-primary/40"><span class="material-symbols-outlined">search</span></div>
                        <input id="map-search-input"
                            class="w-full border-none focus:ring-0 text-on-surface bg-transparent font-bold placeholder:text-on-surface-variant/50 py-2.5"
                            placeholder="Search brands (e.g. Nike, Panpuri...)" type="text"
                            onkeypress="handleMapSearchEnter(event)" />
                        <!-- Cancel Button (Hidden by default, shown when input has value) -->
                        <button id="clear-search-btn" onclick="clearSearch()" class="hidden text-on-surface-variant hover:text-primary active:scale-95 transition-all p-2 rounded-full">
                            <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                        <button onclick="searchMapLive()"
                            class="bg-[#000a1e] text-white p-2.5 rounded-xl mr-1 shadow-md">
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>`;

const replacement = `<div class="absolute top-20 left-0 w-full px-6 pt-4 z-40 pointer-events-none">
                <div class="max-w-xl mx-auto pointer-events-auto flex flex-col gap-2">
                    <div
                        class="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-1.5 flex items-center gap-3 border border-outline-variant/30">
                        <div class="pl-4 text-primary/40"><span class="material-symbols-outlined">search</span></div>
                        <input id="map-search-input"
                            class="w-full border-none focus:ring-0 text-on-surface bg-transparent font-bold placeholder:text-on-surface-variant/50 py-2.5"
                            placeholder="Ask AI or search brands..." type="text"
                            onkeypress="handleMapSearchEnter(event); if(event.key === 'Enter') triggerMapAISearch(this.value);" />
                        <!-- Cancel Button (Hidden by default, shown when input has value) -->
                        <button id="clear-search-btn" onclick="clearSearch(); document.getElementById('map-ai-summary-box')?.classList.add('hidden');" class="hidden text-on-surface-variant hover:text-primary active:scale-95 transition-all p-2 rounded-full">
                            <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                        <button onclick="searchMapLive(); triggerMapAISearch(document.getElementById('map-search-input').value);"
                            class="bg-[#000a1e] text-white p-2.5 rounded-xl mr-1 shadow-md flex items-center justify-center gap-1">
                            <span class="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-sm" style="background-image: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">auto_awesome</span>
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    
                    <!-- AI Suggestion Chips for Map -->
                    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
                        <button onclick="document.getElementById('map-search-input').value='Best Thai Souvenirs'; triggerMapAISearch('Best Thai Souvenirs'); searchMapLive();" 
                            class="shrink-0 whitespace-nowrap bg-white/90 backdrop-blur-md text-blue-700 border border-blue-200/50 shadow-sm px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-blue-50 transition-colors">
                            ✨ Best Thai Souvenirs
                        </button>
                        <button onclick="document.getElementById('map-search-input').value='Skincare near me'; triggerMapAISearch('Skincare near me'); searchMapLive();" 
                            class="shrink-0 whitespace-nowrap bg-white/90 backdrop-blur-md text-purple-700 border border-purple-200/50 shadow-sm px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-purple-50 transition-colors">
                            🧴 Skincare near me
                        </button>
                        <button onclick="document.getElementById('map-search-input').value='Duty Free Sales'; triggerMapAISearch('Duty Free Sales'); searchMapLive();" 
                            class="shrink-0 whitespace-nowrap bg-white/90 backdrop-blur-md text-green-700 border border-green-200/50 shadow-sm px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-green-50 transition-colors">
                            🏷️ Duty Free Sales
                        </button>
                    </div>

                    <!-- AI Summary Box (Hidden by default) -->
                    <div id="map-ai-summary-box" class="hidden bg-white/95 backdrop-blur-xl shadow-lg rounded-2xl p-4 border border-[#B59115]/30 animate-[slideDown_0.3s_ease-out]">
                        <p id="map-ai-summary-content" class="text-xs text-on-surface-variant leading-relaxed"></p>
                    </div>
                </div>
            </div>`;

// Simple replacement
let pos = content.indexOf('<div class="absolute top-20 left-0 w-full px-6 pt-4 z-40 pointer-events-none">');
if (pos !== -1) {
    let endPos = content.indexOf('<!-- Left-Side Floating Toggleable Category Panel -->');
    if (endPos !== -1) {
        content = content.slice(0, pos) + replacement + '\n\n            ' + content.slice(endPos);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Success");
    }
} else {
    console.log("Failed");
}
