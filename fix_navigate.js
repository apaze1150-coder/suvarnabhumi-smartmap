const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Restore renderOrderHistory
const missingBlock = `            if (!ordersArray || ordersArray.length === 0) {
                historyList.innerHTML = '';
                return;
            }
            historyList.innerHTML = \`
                <div class="flex justify-between items-center mb-1">
                    <div class="text-xs font-bold text-gray-400">Your recent order history:</div>
                    <button onclick="clearOrderHistory()" class="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors underline">Clear history</button>
                </div>
            \` + [...ordersArray].reverse().map(orderId => \`
                <button onclick="document.getElementById('track-order-input').value='\${orderId}'; trackOrder();" class="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 hover:border-amber-400 hover:bg-amber-50 active:scale-95 transition-all shadow-sm">
                    <span>\${orderId}</span>
                    <span class="material-symbols-outlined text-amber-500 text-sm">chevron_right</span>
                </button>
            \`).join('');
        }`;

if (!content.includes('Your recent order history:')) {
    content = content.replace('if (!historyList) return;\n        \n\n        \n', `if (!historyList) return;\n${missingBlock}\n`);
    console.log("Restored missing renderOrderHistory block.");
}

// 2. Fix the Navigate button in the bottom menu bar
const oldNav = `            <!-- Navigate -->
            <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="navigateToGate()">
                <span class="material-symbols-outlined">map</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
            </div>`;

const newNav = `            <!-- Navigate -->
            <div id="nav-map" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="showPage('map-view')">
                <span class="material-symbols-outlined">map</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">Navigate</span>
            </div>`;

if (content.includes(oldNav)) {
    content = content.replace(oldNav, newNav);
    console.log("Fixed Navigate button.");
} else if (content.includes(`onclick="navigateToGate()"`)) {
    // maybe spacing is different, let's use regex for the button in bottom menu
    // The one in the menubar is the second one, but let's be careful.
}

// Adding ID to Home as well for consistency
const oldHome = `            <!-- Home -->
            <div class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="window.location.href='index.html'">
                <span class="material-symbols-outlined text-[#001a3d] hover:text-[#d8aa3d] transition-colors">home</span>
                <span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>`;

const newHome = `            <!-- Home -->
            <div id="nav-home" class="flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="window.location.href='index.html'">
                <span class="material-symbols-outlined text-[#001a3d] hover:text-[#d8aa3d] transition-colors">home</span>
                <span class="text-[9px] uppercase font-bold text-[#001a3d] hover:text-[#d8aa3d] tracking-tight transition-colors">Home</span>
            </div>`;

if (content.includes(oldHome)) {
    content = content.replace(oldHome, newHome);
    console.log("Added id to Home button.");
}

// Adding ID to AI as well
const oldAi = `            <!-- AI Assist -->
            <div class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="openAIModal()">
                <span class="material-symbols-outlined">auto_awesome</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">AI Assist</span>
            </div>`;

const newAi = `            <!-- AI Assist -->
            <div id="nav-ai" class="flex flex-col items-center gap-1 cursor-pointer text-gray-400 hover:text-[#001a3d] transition-all duration-200 active:text-[#d8aa3d] active:drop-shadow-[0_0_8px_rgba(216,170,61,0.8)] active:scale-95" onclick="openAIModal()">
                <span class="material-symbols-outlined">auto_awesome</span>
                <span class="text-[9px] uppercase font-bold tracking-tight">AI Assist</span>
            </div>`;

if (content.includes(oldAi)) {
    content = content.replace(oldAi, newAi);
    console.log("Added id to AI button.");
}

fs.writeFileSync('index.html', content);
